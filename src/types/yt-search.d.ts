declare module 'yt-search' {
  interface VideoSearchResult {
    title: string;
    url: string;
    seconds: number;
    thumbnail: string;
    author: {
      name: string;
      url?: string;
    };
    views: number;
    description: string;
    videoId: string;
    ago?: string;
    timestamp?: string;
  }

  interface SearchResult {
    videos: VideoSearchResult[];
    playlists: any[];
    channels: any[];
  }

  function yts(query: string): Promise<SearchResult>;
  function yts(options: { videoId: string }): Promise<VideoSearchResult>;

  export = yts;
  export { VideoSearchResult, SearchResult };
}
