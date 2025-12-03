declare module '@dongdev/fca-unofficial' {
  interface LoginCredentials {
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
    logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'silly' | 'http';
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
    messageReply?: {
      senderID: string;
      messageID: string;
      body: string;
    };
    logMessageType?: string;
    logMessageData?: any;
    userID?: string;
    reaction?: string;
  }

  interface Api {
    setOptions(options: ApiOptions): void;
    getAppState(): any[];
    listenMqtt(callback: (err: Error | null, event: MessageEvent) => void): () => void;
    listen(callback: (err: Error | null, event: MessageEvent) => void): () => void;
    sendMessage(
      message: string | { body?: string; attachment?: any; sticker?: string; url?: string },
      threadID: string,
      callback?: (err: Error | null, messageInfo?: MessageInfo) => void,
      messageID?: string
    ): Promise<MessageInfo>;
    getUserInfo(
      userIDs: string | string[]
    ): Promise<Record<string, any>>;
    getThreadInfo(
      threadID: string
    ): Promise<any>;
    getThreadList(
      limit: number,
      timestamp: number | null,
      tags: string[]
    ): Promise<any[]>;
    addUserToGroup(
      userID: string | string[],
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    removeUserFromGroup(
      userID: string,
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    changeThreadColor(
      color: string,
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    changeNickname(
      nickname: string,
      threadID: string,
      participantID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    changeGroupImage(
      image: NodeJS.ReadableStream,
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    setTitle(
      newTitle: string,
      threadID: string,
      callback?: (err: Error | null, obj: any) => void
    ): Promise<any>;
    sendTypingIndicator(
      threadID: string,
      callback?: (err: Error | null) => void
    ): () => void;
    markAsRead(
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    getCurrentUserID(): string;
    getFriendsList(): Promise<any[]>;
    logout(callback?: (err: Error | null) => void): Promise<void>;
    changeThreadEmoji(
      emoji: string,
      threadID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    setMessageReaction(
      reaction: string,
      messageID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    unsendMessage(
      messageID: string,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    getThreadHistory(
      threadID: string,
      amount: number,
      timestamp?: number,
      callback?: (err: Error | null, history: any[]) => void
    ): Promise<any[]>;
  }

  function login(
    credentials: LoginCredentials,
    options?: ApiOptions,
    callback?: (err: any, api: Api) => void
  ): void;

  export = login;
}
