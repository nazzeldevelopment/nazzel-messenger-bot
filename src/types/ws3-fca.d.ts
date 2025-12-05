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
    online?: boolean;
    autoReconnect?: boolean;
    emitReady?: boolean;
  }

  interface MessageInfo {
    messageID: string;
    timestamp: number;
    threadID: string;
    senderID: string;
  }

  interface Attachment {
    type: 'photo' | 'video' | 'audio' | 'file' | 'sticker' | 'animated_image' | 'share' | 'location';
    ID?: string;
    filename?: string;
    url?: string;
    previewUrl?: string;
    previewWidth?: number;
    previewHeight?: number;
    width?: number;
    height?: number;
    duration?: number;
    title?: string;
    description?: string;
    source?: string;
    latitude?: number;
    longitude?: number;
    image?: string;
    packID?: string;
    spriteUrl?: string;
    frameCount?: number;
    frameRate?: number;
    framesPerRow?: number;
    framesPerCol?: number;
  }

  interface MessageEvent {
    type: 'message' | 'message_reply' | 'event' | 'message_reaction' | 'typ' | 'read_receipt' | 'message_unsend' | 'presence';
    threadID: string;
    messageID: string;
    senderID: string;
    body: string;
    attachments: Attachment[];
    mentions: Record<string, string>;
    timestamp: number;
    isGroup: boolean;
    participantIDs?: string[];
    messageReply?: {
      senderID: string;
      messageID: string;
      body: string;
      attachments?: Attachment[];
    };
    logMessageType?: string;
    logMessageData?: any;
    userID?: string;
    reaction?: string;
    isUnread?: boolean;
    isSponsored?: boolean;
  }

  interface UserInfo {
    name: string;
    firstName: string;
    vanity: string;
    thumbSrc: string;
    profileUrl: string;
    gender: number;
    type: string;
    isFriend: boolean;
    isBirthday: boolean;
    searchTokens?: string[];
    alternateName?: string;
  }

  interface ThreadInfo {
    threadID: string;
    threadName: string;
    participantIDs: string[];
    userInfo: UserInfo[];
    unreadCount: number;
    messageCount: number;
    imageSrc: string;
    timestamp: number;
    muteUntil: number | null;
    isGroup: boolean;
    isSubscribed: boolean;
    folder: string;
    isArchived: boolean;
    cannotReplyReason: string | null;
    eventReminders: any[];
    emoji: string | null;
    color: string | null;
    nicknames: Record<string, string>;
    adminIDs: string[];
    approvalMode: boolean;
    approvalQueue: any[];
  }

  interface MessageOptions {
    body?: string;
    attachment?: NodeJS.ReadableStream | NodeJS.ReadableStream[];
    sticker?: string;
    url?: string;
    mentions?: Array<{ tag: string; id: string; fromIndex?: number }>;
    location?: { latitude: number; longitude: number; current?: boolean };
  }

  interface Api {
    setOptions(options: ApiOptions): void;
    getAppState(): any[];
    listenMqtt(callback: (err: Error | null, event: MessageEvent) => void): () => void;
    listen(callback: (err: Error | null, event: MessageEvent) => void): () => void;
    sendMessage(
      message: string | MessageOptions,
      threadID: string,
      callback?: (err: Error | null, messageInfo?: MessageInfo) => void,
      messageID?: string
    ): Promise<MessageInfo>;
    getUserInfo(
      userIDs: string | string[]
    ): Promise<Record<string, UserInfo>>;
    getThreadInfo(
      threadID: string
    ): Promise<ThreadInfo>;
    getThreadList(
      limit: number,
      timestamp: number | null,
      tags: string[]
    ): Promise<ThreadInfo[]>;
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
    markAsDelivered(
      threadID: string
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
    deleteMessage(
      messageID: string | string[],
      callback?: (err: Error | null) => void
    ): Promise<void>;
    forwardMessage(
      messageID: string,
      threadID: string | string[],
      callback?: (err: Error | null) => void
    ): Promise<void>;
    getThreadPictures(
      threadID: string,
      offset: number,
      limit: number,
      callback?: (err: Error | null, pictures: any[]) => void
    ): Promise<any[]>;
    muteThread(
      threadID: string,
      muteSeconds: number,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    resolvePhotoUrl(
      photoID: string,
      callback?: (err: Error | null, url: string) => void
    ): Promise<string>;
    searchForThread(
      name: string,
      callback?: (err: Error | null, threads: any[]) => void
    ): Promise<any[]>;
    sendDirectMessage(
      message: string | MessageOptions,
      userID: string,
      callback?: (err: Error | null, messageInfo?: MessageInfo) => void
    ): Promise<MessageInfo>;
    createPoll(
      title: string,
      threadID: string,
      options: Record<string, boolean>,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    getEmojiUrl(
      c: string,
      size: number,
      pixelRatio: number
    ): string;
    handleMessageRequest(
      threadID: string,
      accept: boolean,
      callback?: (err: Error | null) => void
    ): Promise<void>;
    httpGet(
      url: string,
      form: any,
      callback?: (err: Error | null, data: any) => void
    ): Promise<any>;
    httpPost(
      url: string,
      form: any,
      callback?: (err: Error | null, data: any) => void
    ): Promise<any>;
  }

  function login(
    credentials: LoginCredentials,
    options?: ApiOptions | ((err: any, api: Api) => void),
    callback?: (err: any, api: Api) => void
  ): void;

  export default login;
  export { login, Api, ApiOptions, LoginCredentials, MessageEvent, MessageInfo, UserInfo, ThreadInfo, Attachment, MessageOptions };
}
