declare module 'ws3-fca' {
  interface LoginOptions {
    email?: string;
    password?: string;
    appState?: any[];
  }

  interface ApiOptions {
    selfListen?: boolean;
    listenEvents?: boolean;
    autoMarkRead?: boolean;
    autoMarkDelivery?: boolean;
    updatePresence?: boolean;
    forceLogin?: boolean;
    logLevel?: string;
    pageID?: string;
  }

  interface MessageInfo {
    messageID: string;
    timestamp: number;
    threadID: string;
    senderID: string;
  }

  interface MessageEvent {
    type: string;
    threadID: string;
    messageID: string;
    senderID: string;
    body: string;
    attachments: any[];
    mentions: Record<string, string>;
    timestamp: number;
    isGroup: boolean;
    participantIDs?: string[];
  }

  interface Api {
    setOptions(options: ApiOptions): void;
    getAppState(): any[];
    listenMqtt(callback: (err: Error | null, event: MessageEvent) => void): void;
    sendMessage(
      message: string | { body?: string; attachment?: any; sticker?: string; url?: string },
      threadID: string,
      callback?: (err: Error | null, messageInfo?: MessageInfo) => void
    ): void;
    getUserInfo(
      userIDs: string | string[],
      callback: (err: Error | null, userInfo: Record<string, any>) => void
    ): void;
    getThreadInfo(
      threadID: string,
      callback: (err: Error | null, threadInfo: any) => void
    ): void;
    getThreadList(
      limit: number,
      timestamp: number | null,
      tags: string[],
      callback: (err: Error | null, threads: any[]) => void
    ): void;
    addUserToGroup(
      userID: string | string[],
      threadID: string,
      callback?: (err: Error | null) => void
    ): void;
    removeUserFromGroup(
      userID: string,
      threadID: string,
      callback?: (err: Error | null) => void
    ): void;
    changeThreadColor(
      color: string,
      threadID: string,
      callback?: (err: Error | null) => void
    ): void;
    changeNickname(
      nickname: string,
      threadID: string,
      participantID: string,
      callback?: (err: Error | null) => void
    ): void;
    changeGroupImage(
      image: NodeJS.ReadableStream,
      threadID: string,
      callback?: (err: Error | null) => void
    ): void;
    setTitle(
      newTitle: string,
      threadID: string,
      callback?: (err: Error | null, obj: any) => void
    ): void;
    sendTypingIndicator(
      threadID: string,
      callback?: (err: Error | null) => void
    ): () => void;
    markAsRead(
      threadID: string,
      callback?: (err: Error | null) => void
    ): void;
    getCurrentUserID(): string;
    getFriendsList(callback: (err: Error | null, friends: any[]) => void): void;
    logout(callback?: (err: Error | null) => void): void;
  }

  function login(
    credentials: LoginOptions,
    callback: (err: any, api: Api) => void
  ): void;

  export = login;
}
