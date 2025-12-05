import ytdl from '@distube/ytdl-core';
import ytSearch from 'yt-search';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { database } from '../database/index.js';
import { redis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail: string;
  source: 'youtube' | 'spotify';
  requestedBy: string;
  requestedAt: Date;
}

export interface MusicSession {
  threadId: string;
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  loopMode: 'off' | 'song' | 'queue';
  startTime: number;
  pausedAt: number;
  filter: string | null;
}

const sessions: Map<string, MusicSession> = new Map();

let spotifyApi: SpotifyApi | null = null;

export function initSpotify(): void {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (clientId && clientSecret) {
    try {
      spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret);
      logger.info('Spotify API initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Spotify API', { error });
    }
  } else {
    logger.warn('Spotify credentials not found. Spotify features will be disabled.');
  }
}

export function getSession(threadId: string): MusicSession {
  if (!sessions.has(threadId)) {
    sessions.set(threadId, {
      threadId,
      currentTrack: null,
      queue: [],
      isPlaying: false,
      isPaused: false,
      volume: 100,
      loopMode: 'off',
      startTime: 0,
      pausedAt: 0,
      filter: null
    });
  }
  return sessions.get(threadId)!;
}

export function clearSession(threadId: string): void {
  sessions.delete(threadId);
}

export async function searchYouTube(query: string, limit: number = 5): Promise<MusicTrack[]> {
  try {
    const result = await ytSearch(query);
    const videos = result.videos.slice(0, limit);
    
    return videos.map((video, index) => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      duration: video.seconds,
      url: video.url,
      thumbnail: video.thumbnail,
      source: 'youtube' as const,
      requestedBy: '',
      requestedAt: new Date()
    }));
  } catch (error) {
    logger.error('YouTube search failed', { query, error });
    return [];
  }
}

export async function getYouTubeInfo(url: string): Promise<MusicTrack | null> {
  try {
    if (!ytdl.validateURL(url)) {
      return null;
    }
    
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    
    return {
      id: videoDetails.videoId,
      title: videoDetails.title,
      artist: videoDetails.author.name,
      duration: parseInt(videoDetails.lengthSeconds),
      url: url,
      thumbnail: videoDetails.thumbnails[0]?.url || '',
      source: 'youtube',
      requestedBy: '',
      requestedAt: new Date()
    };
  } catch (error) {
    logger.error('Failed to get YouTube info', { url, error });
    return null;
  }
}

export async function searchSpotify(query: string, limit: number = 5): Promise<MusicTrack[]> {
  if (!spotifyApi) {
    return [];
  }
  
  try {
    const result = await spotifyApi.search(query, ['track'], undefined, limit as 1 | 2 | 3 | 4 | 5 | 10 | 20 | 50);
    const tracks = result.tracks.items;
    
    return tracks.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls.spotify,
      thumbnail: track.album.images[0]?.url || '',
      source: 'spotify' as const,
      requestedBy: '',
      requestedAt: new Date()
    }));
  } catch (error) {
    logger.error('Spotify search failed', { query, error });
    return [];
  }
}

export async function getSpotifyTrack(url: string): Promise<MusicTrack | null> {
  if (!spotifyApi) {
    return null;
  }
  
  try {
    const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (!trackIdMatch) return null;
    
    const trackId = trackIdMatch[1];
    const track = await spotifyApi.tracks.get(trackId);
    
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls.spotify,
      thumbnail: track.album.images[0]?.url || '',
      source: 'spotify',
      requestedBy: '',
      requestedAt: new Date()
    };
  } catch (error) {
    logger.error('Failed to get Spotify track', { url, error });
    return null;
  }
}

export async function getSpotifyPlaylist(url: string): Promise<MusicTrack[]> {
  if (!spotifyApi) {
    return [];
  }
  
  try {
    const playlistIdMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!playlistIdMatch) return [];
    
    const playlistId = playlistIdMatch[1];
    const playlist = await spotifyApi.playlists.getPlaylist(playlistId);
    
    return playlist.tracks.items
      .filter(item => item.track && item.track.type === 'track')
      .map(item => {
        const track = item.track as any;
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map((a: any) => a.name).join(', '),
          duration: Math.floor(track.duration_ms / 1000),
          url: track.external_urls.spotify,
          thumbnail: track.album?.images?.[0]?.url || '',
          source: 'spotify' as const,
          requestedBy: '',
          requestedAt: new Date()
        };
      });
  } catch (error) {
    logger.error('Failed to get Spotify playlist', { url, error });
    return [];
  }
}

export async function getYouTubePlaylist(url: string): Promise<MusicTrack[]> {
  try {
    const playlistIdMatch = url.match(/[?&]list=([^&]+)/);
    if (!playlistIdMatch) return [];
    
    const playlistId = playlistIdMatch[1];
    const result = await ytSearch(`playlist ${playlistId}`);
    
    if (!result.playlists || result.playlists.length === 0) {
      return [];
    }
    
    const playlist = result.playlists[0];
    const videos = playlist.videos || [];
    
    return videos.map((video: any) => ({
      id: video.videoId || '',
      title: video.title || 'Unknown',
      artist: video.author?.name || 'Unknown',
      duration: video.seconds || 0,
      url: video.url || `https://youtube.com/watch?v=${video.videoId}`,
      thumbnail: video.thumbnail || '',
      source: 'youtube' as const,
      requestedBy: '',
      requestedAt: new Date()
    }));
  } catch (error) {
    logger.error('Failed to get YouTube playlist', { url, error });
    return [];
  }
}

export function addToQueue(threadId: string, track: MusicTrack): number {
  const session = getSession(threadId);
  session.queue.push(track);
  return session.queue.length;
}

export function removeFromQueue(threadId: string, position: number): MusicTrack | null {
  const session = getSession(threadId);
  if (position < 1 || position > session.queue.length) {
    return null;
  }
  const removed = session.queue.splice(position - 1, 1);
  return removed[0] || null;
}

export function clearQueue(threadId: string): number {
  const session = getSession(threadId);
  const count = session.queue.length;
  session.queue = [];
  return count;
}

export function shuffleQueue(threadId: string): void {
  const session = getSession(threadId);
  for (let i = session.queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [session.queue[i], session.queue[j]] = [session.queue[j], session.queue[i]];
  }
}

export function moveInQueue(threadId: string, from: number, to: number): boolean {
  const session = getSession(threadId);
  if (from < 1 || from > session.queue.length || to < 1 || to > session.queue.length) {
    return false;
  }
  const [item] = session.queue.splice(from - 1, 1);
  session.queue.splice(to - 1, 0, item);
  return true;
}

export function setLoopMode(threadId: string, mode: 'off' | 'song' | 'queue'): void {
  const session = getSession(threadId);
  session.loopMode = mode;
}

export function setVolume(threadId: string, volume: number): void {
  const session = getSession(threadId);
  session.volume = Math.max(0, Math.min(100, volume));
}

export function setFilter(threadId: string, filter: string | null): void {
  const session = getSession(threadId);
  session.filter = filter;
}

export function playTrack(threadId: string, track: MusicTrack): void {
  const session = getSession(threadId);
  session.currentTrack = track;
  session.isPlaying = true;
  session.isPaused = false;
  session.startTime = Date.now();
  session.pausedAt = 0;
}

export function pauseTrack(threadId: string): boolean {
  const session = getSession(threadId);
  if (!session.isPlaying || session.isPaused) {
    return false;
  }
  session.isPaused = true;
  session.pausedAt = Date.now();
  return true;
}

export function resumeTrack(threadId: string): boolean {
  const session = getSession(threadId);
  if (!session.isPaused) {
    return false;
  }
  session.isPaused = false;
  const pauseDuration = Date.now() - session.pausedAt;
  session.startTime += pauseDuration;
  session.pausedAt = 0;
  return true;
}

export function skipTrack(threadId: string): MusicTrack | null {
  const session = getSession(threadId);
  
  if (session.loopMode === 'song' && session.currentTrack) {
    session.startTime = Date.now();
    session.pausedAt = 0;
    return session.currentTrack;
  }
  
  if (session.loopMode === 'queue' && session.currentTrack) {
    session.queue.push(session.currentTrack);
  }
  
  if (session.queue.length === 0) {
    session.currentTrack = null;
    session.isPlaying = false;
    session.isPaused = false;
    return null;
  }
  
  const nextTrack = session.queue.shift()!;
  playTrack(threadId, nextTrack);
  return nextTrack;
}

export function stopPlayback(threadId: string): void {
  const session = getSession(threadId);
  session.currentTrack = null;
  session.queue = [];
  session.isPlaying = false;
  session.isPaused = false;
  session.startTime = 0;
  session.pausedAt = 0;
}

export function getCurrentPosition(threadId: string): number {
  const session = getSession(threadId);
  if (!session.isPlaying || !session.currentTrack) {
    return 0;
  }
  
  if (session.isPaused) {
    return Math.floor((session.pausedAt - session.startTime) / 1000);
  }
  
  return Math.floor((Date.now() - session.startTime) / 1000);
}

export function seekTo(threadId: string, seconds: number): boolean {
  const session = getSession(threadId);
  if (!session.currentTrack) {
    return false;
  }
  
  const maxDuration = session.currentTrack.duration;
  if (seconds < 0 || seconds > maxDuration) {
    return false;
  }
  
  session.startTime = Date.now() - (seconds * 1000);
  if (session.isPaused) {
    session.pausedAt = Date.now();
  }
  return true;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function createProgressBar(current: number, total: number, length: number = 20): string {
  const progress = Math.min(current / total, 1);
  const filled = Math.round(progress * length);
  const empty = length - filled;
  return '▓'.repeat(filled) + '░'.repeat(empty);
}

export async function downloadAudio(url: string, threadId: string): Promise<string | null> {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filename = `${threadId}_${Date.now()}.mp3`;
    const filepath = path.join(tempDir, filename);
    
    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });
    
    const writeStream = fs.createWriteStream(filepath);
    stream.pipe(writeStream);
    
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(filepath));
      writeStream.on('error', reject);
      stream.on('error', reject);
    });
  } catch (error) {
    logger.error('Failed to download audio', { url, error });
    return null;
  }
}

export async function fetchLyrics(title: string, artist: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json() as { lyrics?: string };
    return data.lyrics || null;
  } catch (error) {
    logger.error('Failed to fetch lyrics', { title, artist, error });
    return null;
  }
}

export function isYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

export function isSpotifyUrl(url: string): boolean {
  return /^(https?:\/\/)?(open\.)?spotify\.com\/.+/.test(url);
}

export function isPlaylistUrl(url: string): boolean {
  return url.includes('list=') || url.includes('/playlist/');
}

export default {
  initSpotify,
  getSession,
  clearSession,
  searchYouTube,
  getYouTubeInfo,
  searchSpotify,
  getSpotifyTrack,
  getSpotifyPlaylist,
  getYouTubePlaylist,
  addToQueue,
  removeFromQueue,
  clearQueue,
  shuffleQueue,
  moveInQueue,
  setLoopMode,
  setVolume,
  setFilter,
  playTrack,
  pauseTrack,
  resumeTrack,
  skipTrack,
  stopPlayback,
  getCurrentPosition,
  seekTo,
  formatDuration,
  createProgressBar,
  downloadAudio,
  fetchLyrics,
  isYouTubeUrl,
  isSpotifyUrl,
  isPlaylistUrl
};
