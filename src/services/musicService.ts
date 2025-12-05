import ytdl from 'ytdl-core';
import fetch from 'node-fetch';
import { database } from '../database/index.js';
import { redis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';

export interface TrackInfo {
  title: string;
  url: string;
  duration: number;
  thumbnail?: string;
  author?: string;
  source: 'youtube' | 'spotify';
  audioUrl?: string;
}

export interface QueueState {
  currentTrack: TrackInfo | null;
  queue: TrackInfo[];
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  loop: boolean;
  loopQueue: boolean;
  autoplay: boolean;
  position: number;
}

export interface MusicHistory {
  track: TrackInfo;
  playedAt: Date;
  requestedBy: string;
}

class MusicService {
  private threadStates: Map<string, QueueState> = new Map();
  private history: Map<string, MusicHistory[]> = new Map();

  getState(threadId: string): QueueState {
    if (!this.threadStates.has(threadId)) {
      this.threadStates.set(threadId, {
        currentTrack: null,
        queue: [],
        isPlaying: false,
        isPaused: false,
        volume: 100,
        loop: false,
        loopQueue: false,
        autoplay: false,
        position: 0,
      });
    }
    return this.threadStates.get(threadId)!;
  }

  async searchYouTube(query: string, limit: number = 5): Promise<TrackInfo[]> {
    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      const html = await response.text();

      const videoIds: string[] = [];
      const regex = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
      let match;
      while ((match = regex.exec(html)) !== null && videoIds.length < limit) {
        if (!videoIds.includes(match[1])) {
          videoIds.push(match[1]);
        }
      }

      const results: TrackInfo[] = [];
      for (const videoId of videoIds) {
        try {
          const info = await this.getYouTubeInfo(`https://www.youtube.com/watch?v=${videoId}`);
          if (info) results.push(info);
        } catch (e) {
          continue;
        }
      }
      return results;
    } catch (error) {
      logger.error('YouTube search failed', { query, error });
      return [];
    }
  }

  async getYouTubeInfo(url: string): Promise<TrackInfo | null> {
    try {
      if (!ytdl.validateURL(url)) {
        const searchResults = await this.searchYouTube(url, 1);
        if (searchResults.length > 0) return searchResults[0];
        return null;
      }

      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;

      return {
        title: videoDetails.title,
        url: url,
        duration: parseInt(videoDetails.lengthSeconds) || 0,
        thumbnail: videoDetails.thumbnails?.[0]?.url,
        author: videoDetails.author?.name,
        source: 'youtube',
      };
    } catch (error) {
      logger.error('Failed to get YouTube info', { url, error });
      return null;
    }
  }

  async getAudioStream(url: string): Promise<NodeJS.ReadableStream | null> {
    try {
      if (ytdl.validateURL(url)) {
        return ytdl(url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1 << 25,
        });
      }

      const info = await this.getYouTubeInfo(url);
      if (info) {
        return ytdl(info.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1 << 25,
        });
      }

      return null;
    } catch (error) {
      logger.error('Failed to get audio stream', { url, error });
      return null;
    }
  }

  async addToQueue(threadId: string, track: TrackInfo, requestedBy: string, position?: number): Promise<number> {
    const state = this.getState(threadId);
    
    if (position !== undefined && position >= 0 && position < state.queue.length) {
      state.queue.splice(position, 0, track);
    } else {
      state.queue.push(track);
    }

    await database.addToMusicQueue(threadId, track.url, track.title, track.duration, requestedBy);
    
    return state.queue.length;
  }

  async play(threadId: string, track: TrackInfo, requestedBy: string): Promise<{ success: boolean; message: string; stream?: NodeJS.ReadableStream }> {
    const state = this.getState(threadId);

    try {
      const stream = await this.getAudioStream(track.url);
      if (!stream) {
        return { success: false, message: 'Failed to get audio stream' };
      }

      state.currentTrack = track;
      state.isPlaying = true;
      state.isPaused = false;
      state.position = 0;

      this.addToHistory(threadId, track, requestedBy);

      return { success: true, message: 'Now playing', stream };
    } catch (error) {
      logger.error('Failed to play track', { threadId, track, error });
      return { success: false, message: 'Failed to play track' };
    }
  }

  addToHistory(threadId: string, track: TrackInfo, requestedBy: string): void {
    if (!this.history.has(threadId)) {
      this.history.set(threadId, []);
    }
    const threadHistory = this.history.get(threadId)!;
    threadHistory.unshift({ track, playedAt: new Date(), requestedBy });
    if (threadHistory.length > 50) {
      threadHistory.pop();
    }
  }

  getHistory(threadId: string, limit: number = 10): MusicHistory[] {
    return (this.history.get(threadId) || []).slice(0, limit);
  }

  getQueue(threadId: string): TrackInfo[] {
    return this.getState(threadId).queue;
  }

  getCurrentTrack(threadId: string): TrackInfo | null {
    return this.getState(threadId).currentTrack;
  }

  skip(threadId: string): TrackInfo | null {
    const state = this.getState(threadId);
    
    if (state.loop && state.currentTrack) {
      return state.currentTrack;
    }

    if (state.loopQueue && state.currentTrack) {
      state.queue.push(state.currentTrack);
    }

    const next = state.queue.shift() || null;
    state.currentTrack = next;
    state.isPlaying = !!next;
    state.position = 0;
    
    return next;
  }

  removeFromQueue(threadId: string, index: number): TrackInfo | null {
    const state = this.getState(threadId);
    if (index < 0 || index >= state.queue.length) return null;
    const [removed] = state.queue.splice(index, 1);
    return removed;
  }

  clearQueue(threadId: string): number {
    const state = this.getState(threadId);
    const count = state.queue.length;
    state.queue = [];
    database.clearMusicQueue(threadId);
    return count;
  }

  stop(threadId: string): void {
    const state = this.getState(threadId);
    state.currentTrack = null;
    state.queue = [];
    state.isPlaying = false;
    state.isPaused = false;
    state.position = 0;
    database.clearMusicQueue(threadId);
  }

  pause(threadId: string): boolean {
    const state = this.getState(threadId);
    if (!state.isPlaying) return false;
    state.isPaused = true;
    return true;
  }

  resume(threadId: string): boolean {
    const state = this.getState(threadId);
    if (!state.isPaused) return false;
    state.isPaused = false;
    return true;
  }

  setVolume(threadId: string, volume: number): number {
    const state = this.getState(threadId);
    state.volume = Math.max(0, Math.min(200, volume));
    return state.volume;
  }

  toggleLoop(threadId: string): boolean {
    const state = this.getState(threadId);
    state.loop = !state.loop;
    if (state.loop) state.loopQueue = false;
    return state.loop;
  }

  toggleLoopQueue(threadId: string): boolean {
    const state = this.getState(threadId);
    state.loopQueue = !state.loopQueue;
    if (state.loopQueue) state.loop = false;
    return state.loopQueue;
  }

  toggleAutoplay(threadId: string): boolean {
    const state = this.getState(threadId);
    state.autoplay = !state.autoplay;
    return state.autoplay;
  }

  shuffle(threadId: string): void {
    const state = this.getState(threadId);
    for (let i = state.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
    }
  }

  addPlayNext(threadId: string, track: TrackInfo, requestedBy: string): void {
    this.addToQueue(threadId, track, requestedBy, 0);
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async getLyrics(query: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(query.split('-')[0].trim())}/${encodeURIComponent(query.split('-')[1]?.trim() || query)}`);
      if (!response.ok) return null;
      const data = await response.json() as { lyrics?: string };
      return data.lyrics || null;
    } catch {
      try {
        const searchResponse = await fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`);
        const searchData = await searchResponse.json() as { data?: Array<{ artist: { name: string }; title: string }> };
        if (searchData.data?.[0]) {
          const { artist, title } = searchData.data[0];
          const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist.name)}/${encodeURIComponent(title)}`);
          const lyricsData = await lyricsResponse.json() as { lyrics?: string };
          return lyricsData.lyrics || null;
        }
      } catch {
        return null;
      }
      return null;
    }
  }

  async searchSpotify(query: string): Promise<TrackInfo[]> {
    const results = await this.searchYouTube(`${query} audio`, 5);
    return results.map(r => ({ ...r, source: 'spotify' as const }));
  }
}

export const musicService = new MusicService();
