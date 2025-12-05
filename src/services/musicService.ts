import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';
import type { VideoSearchResult } from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { database } from '../database/index.js';
import { redis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';
import { getUncachableSpotifyClient, isSpotifyConnected } from '../lib/spotify.js';

const ffmpegPath = '/nix/store/3zc5jbvqzrn8zmva4fx5p0nh4yy03wk4-ffmpeg-6.1.1-bin/bin/ffmpeg';

export interface TrackInfo {
  title: string;
  url: string;
  duration: number;
  thumbnail?: string;
  author?: string;
  source: 'youtube' | 'spotify';
  audioUrl?: string;
  spotifyId?: string;
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
  bassBoost: number;
  pitch: number;
  speed: number;
}

export interface MusicHistory {
  track: TrackInfo;
  playedAt: Date;
  requestedBy: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  external_urls: { spotify: string };
}

export interface AudioProcessingOptions {
  bassBoost?: number;
  pitch?: number;
  speed?: number;
  volume?: number;
  startTime?: number;
  endTime?: number;
}

class MusicService {
  private threadStates: Map<string, QueueState> = new Map();
  private history: Map<string, MusicHistory[]> = new Map();
  private tempDir: string = '/tmp/music';
  private maxDuration: number = 600;
  private maxQueueSize: number = 50;

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

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
        bassBoost: 0,
        pitch: 1.0,
        speed: 1.0,
      });
    }
    return this.threadStates.get(threadId)!;
  }

  async saveStateToRedis(threadId: string): Promise<void> {
    try {
      const state = this.getState(threadId);
      await redis.set(`music:state:${threadId}`, JSON.stringify(state), 86400);
    } catch (error) {
      logger.debug('Failed to save music state to Redis', { threadId, error });
    }
  }

  async loadStateFromRedis(threadId: string): Promise<void> {
    try {
      const data = await redis.get(`music:state:${threadId}`);
      if (data) {
        const state = JSON.parse(data);
        this.threadStates.set(threadId, state);
      }
    } catch (error) {
      logger.debug('Failed to load music state from Redis', { threadId, error });
    }
  }

  async searchYouTube(query: string, limit: number = 5): Promise<TrackInfo[]> {
    try {
      const results = await yts(query);
      const videos = results.videos.slice(0, limit);
      
      return videos.map((video: VideoSearchResult) => ({
        title: video.title,
        url: video.url,
        duration: video.seconds || 0,
        thumbnail: video.thumbnail,
        author: video.author?.name,
        source: 'youtube' as const,
      }));
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

  async downloadAudio(url: string, options: AudioProcessingOptions = {}): Promise<string | null> {
    try {
      const trackInfo = await this.getYouTubeInfo(url);
      if (!trackInfo) return null;

      if (trackInfo.duration > this.maxDuration) {
        logger.warn('Track exceeds max duration', { duration: trackInfo.duration, maxDuration: this.maxDuration });
        return null;
      }

      const fileName = `audio_${Date.now()}.mp3`;
      const outputPath = path.join(this.tempDir, fileName);

      return new Promise((resolve, reject) => {
        const stream = ytdl(trackInfo.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
        });

        const ffmpegArgs: string[] = [
          '-i', 'pipe:0',
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-ar', '44100',
        ];

        const filters: string[] = [];

        if (options.bassBoost && options.bassBoost > 0) {
          filters.push(`bass=g=${options.bassBoost}`);
        }

        if (options.pitch && options.pitch !== 1.0) {
          filters.push(`asetrate=44100*${options.pitch},aresample=44100`);
        }

        if (options.speed && options.speed !== 1.0) {
          filters.push(`atempo=${options.speed}`);
        }

        if (options.volume && options.volume !== 100) {
          const volumeLevel = options.volume / 100;
          filters.push(`volume=${volumeLevel}`);
        }

        if (filters.length > 0) {
          ffmpegArgs.push('-af', filters.join(','));
        }

        if (options.startTime !== undefined) {
          ffmpegArgs.push('-ss', options.startTime.toString());
        }

        if (options.endTime !== undefined) {
          ffmpegArgs.push('-t', (options.endTime - (options.startTime || 0)).toString());
        }

        ffmpegArgs.push('-y', outputPath);

        const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

        stream.pipe(ffmpeg.stdin);

        ffmpeg.stderr.on('data', (data) => {
          logger.debug('FFmpeg output', { data: data.toString() });
        });

        ffmpeg.on('error', (error) => {
          logger.error('FFmpeg process error', { error });
          reject(error);
        });

        ffmpeg.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        stream.on('error', (error) => {
          logger.error('Stream error', { error });
          ffmpeg.kill();
          reject(error);
        });
      });
    } catch (error) {
      logger.error('Failed to download audio', { url, error });
      return null;
    }
  }

  async downloadVideo(url: string): Promise<string | null> {
    try {
      const trackInfo = await this.getYouTubeInfo(url);
      if (!trackInfo) return null;

      if (trackInfo.duration > this.maxDuration) {
        logger.warn('Video exceeds max duration', { duration: trackInfo.duration, maxDuration: this.maxDuration });
        return null;
      }

      const fileName = `video_${Date.now()}.mp4`;
      const outputPath = path.join(this.tempDir, fileName);

      return new Promise((resolve, reject) => {
        const stream = ytdl(trackInfo.url, {
          quality: 'highest',
          filter: 'videoandaudio',
        });

        const writeStream = fs.createWriteStream(outputPath);
        stream.pipe(writeStream);

        writeStream.on('finish', () => {
          resolve(outputPath);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      logger.error('Failed to download video', { url, error });
      return null;
    }
  }

  async trimAudio(inputPath: string, startTime: number, endTime: number): Promise<string | null> {
    try {
      const fileName = `trimmed_${Date.now()}.mp3`;
      const outputPath = path.join(this.tempDir, fileName);
      const duration = endTime - startTime;

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', inputPath,
          '-ss', startTime.toString(),
          '-t', duration.toString(),
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-y', outputPath,
        ]);

        ffmpeg.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to trim audio', { inputPath, startTime, endTime, error });
      return null;
    }
  }

  async mergeAudio(inputPaths: string[]): Promise<string | null> {
    try {
      const listFile = path.join(this.tempDir, `list_${Date.now()}.txt`);
      const outputPath = path.join(this.tempDir, `merged_${Date.now()}.mp3`);

      const listContent = inputPaths.map(p => `file '${p}'`).join('\n');
      fs.writeFileSync(listFile, listContent);

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-f', 'concat',
          '-safe', '0',
          '-i', listFile,
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-y', outputPath,
        ]);

        ffmpeg.on('close', (code) => {
          fs.unlinkSync(listFile);
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to merge audio', { inputPaths, error });
      return null;
    }
  }

  async convertToMp3(inputPath: string): Promise<string | null> {
    try {
      const fileName = `converted_${Date.now()}.mp3`;
      const outputPath = path.join(this.tempDir, fileName);

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', inputPath,
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-ar', '44100',
          '-y', outputPath,
        ]);

        ffmpeg.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to convert to mp3', { inputPath, error });
      return null;
    }
  }

  async extractAudioFromVideo(inputPath: string): Promise<string | null> {
    try {
      const fileName = `extracted_${Date.now()}.mp3`;
      const outputPath = path.join(this.tempDir, fileName);

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', inputPath,
          '-vn',
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-ar', '44100',
          '-y', outputPath,
        ]);

        ffmpeg.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to extract audio from video', { inputPath, error });
      return null;
    }
  }

  async applyEffects(inputPath: string, options: AudioProcessingOptions): Promise<string | null> {
    try {
      const fileName = `effects_${Date.now()}.mp3`;
      const outputPath = path.join(this.tempDir, fileName);

      const filters: string[] = [];

      if (options.bassBoost && options.bassBoost > 0) {
        filters.push(`bass=g=${options.bassBoost}`);
      }

      if (options.pitch && options.pitch !== 1.0) {
        filters.push(`asetrate=44100*${options.pitch},aresample=44100`);
      }

      if (options.speed && options.speed !== 1.0) {
        filters.push(`atempo=${options.speed}`);
      }

      if (options.volume && options.volume !== 100) {
        const volumeLevel = options.volume / 100;
        filters.push(`volume=${volumeLevel}`);
      }

      if (filters.length === 0) {
        return inputPath;
      }

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', inputPath,
          '-af', filters.join(','),
          '-acodec', 'libmp3lame',
          '-ab', '128k',
          '-y', outputPath,
        ]);

        ffmpeg.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve(outputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to apply effects', { inputPath, options, error });
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
    
    if (state.queue.length >= this.maxQueueSize) {
      return -1;
    }

    if (track.duration > this.maxDuration) {
      return -2;
    }
    
    if (position !== undefined && position >= 0 && position < state.queue.length) {
      state.queue.splice(position, 0, track);
    } else {
      state.queue.push(track);
    }

    await database.addToMusicQueue(threadId, track.url, track.title, track.duration, requestedBy);
    await this.saveStateToRedis(threadId);
    
    return state.queue.length;
  }

  async play(threadId: string, track: TrackInfo, requestedBy: string): Promise<{ success: boolean; message: string; filePath?: string }> {
    const state = this.getState(threadId);

    try {
      const options: AudioProcessingOptions = {
        bassBoost: state.bassBoost,
        pitch: state.pitch,
        speed: state.speed,
        volume: state.volume,
      };

      const filePath = await this.downloadAudio(track.url, options);
      if (!filePath) {
        return { success: false, message: 'Failed to download audio' };
      }

      state.currentTrack = track;
      state.isPlaying = true;
      state.isPaused = false;
      state.position = 0;

      this.addToHistory(threadId, track, requestedBy);
      await this.saveStateToRedis(threadId);

      return { success: true, message: 'Now playing', filePath };
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
    
    this.saveStateToRedis(threadId);
    return next;
  }

  removeFromQueue(threadId: string, index: number): TrackInfo | null {
    const state = this.getState(threadId);
    if (index < 0 || index >= state.queue.length) return null;
    const [removed] = state.queue.splice(index, 1);
    this.saveStateToRedis(threadId);
    return removed;
  }

  clearQueue(threadId: string): number {
    const state = this.getState(threadId);
    const count = state.queue.length;
    state.queue = [];
    database.clearMusicQueue(threadId);
    this.saveStateToRedis(threadId);
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
    this.saveStateToRedis(threadId);
  }

  pause(threadId: string): boolean {
    const state = this.getState(threadId);
    if (!state.isPlaying) return false;
    state.isPaused = true;
    this.saveStateToRedis(threadId);
    return true;
  }

  resume(threadId: string): boolean {
    const state = this.getState(threadId);
    if (!state.isPaused) return false;
    state.isPaused = false;
    this.saveStateToRedis(threadId);
    return true;
  }

  setVolume(threadId: string, volume: number): number {
    const state = this.getState(threadId);
    state.volume = Math.max(0, Math.min(200, volume));
    this.saveStateToRedis(threadId);
    return state.volume;
  }

  setBassBoost(threadId: string, level: number): number {
    const state = this.getState(threadId);
    state.bassBoost = Math.max(0, Math.min(20, level));
    this.saveStateToRedis(threadId);
    return state.bassBoost;
  }

  setPitch(threadId: string, pitch: number): number {
    const state = this.getState(threadId);
    state.pitch = Math.max(0.5, Math.min(2.0, pitch));
    this.saveStateToRedis(threadId);
    return state.pitch;
  }

  setSpeed(threadId: string, speed: number): number {
    const state = this.getState(threadId);
    state.speed = Math.max(0.5, Math.min(2.0, speed));
    this.saveStateToRedis(threadId);
    return state.speed;
  }

  toggleLoop(threadId: string): boolean {
    const state = this.getState(threadId);
    state.loop = !state.loop;
    if (state.loop) state.loopQueue = false;
    this.saveStateToRedis(threadId);
    return state.loop;
  }

  toggleLoopQueue(threadId: string): boolean {
    const state = this.getState(threadId);
    state.loopQueue = !state.loopQueue;
    if (state.loopQueue) state.loop = false;
    this.saveStateToRedis(threadId);
    return state.loopQueue;
  }

  toggleAutoplay(threadId: string): boolean {
    const state = this.getState(threadId);
    state.autoplay = !state.autoplay;
    this.saveStateToRedis(threadId);
    return state.autoplay;
  }

  shuffle(threadId: string): void {
    const state = this.getState(threadId);
    for (let i = state.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
    }
    this.saveStateToRedis(threadId);
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
      const searchResponse = await fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`);
      const searchData = await searchResponse.json() as { data?: Array<{ artist: { name: string }; title: string }> };
      
      if (searchData.data?.[0]) {
        const { artist, title } = searchData.data[0];
        const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist.name)}/${encodeURIComponent(title)}`);
        const lyricsData = await lyricsResponse.json() as { lyrics?: string };
        return lyricsData.lyrics || null;
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to get lyrics', { query, error });
      return null;
    }
  }

  async searchSpotify(query: string, limit: number = 5): Promise<TrackInfo[]> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) {
        logger.warn('Spotify not connected, falling back to YouTube search');
        const results = await this.searchYouTube(`${query} audio`, limit);
        return results.map(r => ({ ...r, source: 'spotify' as const }));
      }

      const spotify = await getUncachableSpotifyClient();
      const limitValue = Math.min(limit, 50) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 50;
      const searchResult = await spotify.search(query, ['track'], undefined, limitValue);
      
      const tracks: TrackInfo[] = [];
      
      for (const track of searchResult.tracks.items) {
        const artistName = track.artists.map(a => a.name).join(', ');
        const searchQuery = `${track.name} ${artistName}`;
        
        const ytResults = await this.searchYouTube(searchQuery, 1);
        if (ytResults.length > 0) {
          tracks.push({
            title: track.name,
            url: ytResults[0].url,
            duration: Math.floor(track.duration_ms / 1000),
            thumbnail: track.album.images[0]?.url,
            author: artistName,
            source: 'spotify',
            spotifyId: track.id,
          });
        }
      }
      
      return tracks;
    } catch (error) {
      logger.error('Spotify search failed', { query, error });
      const results = await this.searchYouTube(`${query} audio`, limit);
      return results.map(r => ({ ...r, source: 'spotify' as const }));
    }
  }

  async getSpotifyTrack(trackId: string): Promise<TrackInfo | null> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) return null;

      const spotify = await getUncachableSpotifyClient();
      const track = await spotify.tracks.get(trackId);
      
      const artistName = track.artists.map(a => a.name).join(', ');
      const searchQuery = `${track.name} ${artistName}`;
      
      const ytResults = await this.searchYouTube(searchQuery, 1);
      if (ytResults.length === 0) return null;
      
      return {
        title: track.name,
        url: ytResults[0].url,
        duration: Math.floor(track.duration_ms / 1000),
        thumbnail: track.album.images[0]?.url,
        author: artistName,
        source: 'spotify',
        spotifyId: track.id,
      };
    } catch (error) {
      logger.error('Failed to get Spotify track', { trackId, error });
      return null;
    }
  }

  async getSpotifyPlaylist(playlistId: string): Promise<TrackInfo[]> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) return [];

      const spotify = await getUncachableSpotifyClient();
      const playlist = await spotify.playlists.getPlaylist(playlistId);
      
      const tracks: TrackInfo[] = [];
      
      for (const item of playlist.tracks.items.slice(0, 25)) {
        if (!item.track || item.track.type !== 'track') continue;
        
        const track = item.track;
        const artistName = track.artists.map(a => a.name).join(', ');
        const searchQuery = `${track.name} ${artistName}`;
        
        const ytResults = await this.searchYouTube(searchQuery, 1);
        if (ytResults.length > 0) {
          tracks.push({
            title: track.name,
            url: ytResults[0].url,
            duration: Math.floor(track.duration_ms / 1000),
            thumbnail: track.album.images[0]?.url,
            author: artistName,
            source: 'spotify',
            spotifyId: track.id,
          });
        }
      }
      
      return tracks;
    } catch (error) {
      logger.error('Failed to get Spotify playlist', { playlistId, error });
      return [];
    }
  }

  async getUserPlaylists(): Promise<{ id: string; name: string; trackCount: number }[]> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) return [];

      const spotify = await getUncachableSpotifyClient();
      const playlists = await spotify.currentUser.playlists.playlists();
      
      return playlists.items.map(p => ({
        id: p.id,
        name: p.name,
        trackCount: p.tracks?.total ?? 0,
      }));
    } catch (error) {
      logger.error('Failed to get user playlists', { error });
      return [];
    }
  }

  async getRecentlyPlayed(): Promise<TrackInfo[]> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) return [];

      const spotify = await getUncachableSpotifyClient();
      const recent = await spotify.player.getRecentlyPlayedTracks(10);
      
      const tracks: TrackInfo[] = [];
      
      for (const item of recent.items) {
        const track = item.track;
        const artistName = track.artists.map(a => a.name).join(', ');
        
        tracks.push({
          title: track.name,
          url: track.external_urls.spotify,
          duration: Math.floor(track.duration_ms / 1000),
          thumbnail: track.album.images[0]?.url,
          author: artistName,
          source: 'spotify',
          spotifyId: track.id,
        });
      }
      
      return tracks;
    } catch (error) {
      logger.error('Failed to get recently played', { error });
      return [];
    }
  }

  async getTopTracks(): Promise<TrackInfo[]> {
    try {
      const connected = await isSpotifyConnected();
      if (!connected) return [];

      const spotify = await getUncachableSpotifyClient();
      const top = await spotify.currentUser.topItems('tracks', undefined, 10);
      
      const tracks: TrackInfo[] = [];
      
      for (const track of top.items) {
        const artistName = track.artists.map(a => a.name).join(', ');
        
        tracks.push({
          title: track.name,
          url: track.external_urls.spotify,
          duration: Math.floor(track.duration_ms / 1000),
          thumbnail: track.album.images[0]?.url,
          author: artistName,
          source: 'spotify',
          spotifyId: track.id,
        });
      }
      
      return tracks;
    } catch (error) {
      logger.error('Failed to get top tracks', { error });
      return [];
    }
  }

  isSpotifyUrl(url: string): boolean {
    return url.includes('spotify.com') || url.includes('open.spotify');
  }

  extractSpotifyId(url: string): { type: 'track' | 'playlist' | 'album'; id: string } | null {
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) return { type: 'track', id: trackMatch[1] };
    
    const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) return { type: 'playlist', id: playlistMatch[1] };
    
    const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/);
    if (albumMatch) return { type: 'album', id: albumMatch[1] };
    
    return null;
  }

  cleanupTempFiles(): void {
    try {
      const files = fs.readdirSync(this.tempDir);
      const now = Date.now();
      const maxAge = 30 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      logger.error('Failed to cleanup temp files', { error });
    }
  }
}

export const musicService = new MusicService();

setInterval(() => {
  musicService.cleanupTempFiles();
}, 15 * 60 * 1000);
