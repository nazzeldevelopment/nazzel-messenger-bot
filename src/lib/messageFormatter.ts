export interface FormatOptions {
  title?: string;
  subtitle?: string;
  content?: string;
  fields?: Array<{ label: string; value: string }>;
  footer?: string;
  timestamp?: boolean;
  style?: 'success' | 'error' | 'warning' | 'info' | 'fun' | 'admin' | 'level' | 'utility' | 'general';
}

export const themes = {
  general: {
    primary: '━',
    accent: '✨',
    bullet: '◉',
    arrow: '➤',
    divider: '─',
    header: '『',
    headerEnd: '』',
    color: 'blue',
    emojis: ['💫', '✨', '🔵', '💙', '🌟', '⭐', '🔷', '💎']
  },
  fun: {
    primary: '═',
    accent: '💖',
    bullet: '♡',
    arrow: '→',
    divider: '~',
    header: '『',
    headerEnd: '』',
    color: 'pink',
    emojis: ['💖', '💜', '🎀', '💗', '🌸', '✨', '🦋', '🎭', '🎪', '🎨', '💫', '🌈']
  },
  utility: {
    primary: '─',
    accent: '⚙️',
    bullet: '▸',
    arrow: '»',
    divider: '·',
    header: '〔',
    headerEnd: '〕',
    color: 'teal',
    emojis: ['⚙️', '🔧', '🛠️', '📊', '🔍', '💡', '🔩', '⚡', '🖥️']
  },
  admin: {
    primary: '▬',
    accent: '🔥',
    bullet: '▪',
    arrow: '⊳',
    divider: '―',
    header: '⟦',
    headerEnd: '⟧',
    color: 'red',
    emojis: ['🔥', '⚠️', '🛡️', '⚔️', '🔱', '👑', '🔴', '⛔', '🚨']
  },
  level: {
    primary: '═',
    accent: '🏆',
    bullet: '◆',
    arrow: '↗',
    divider: '·',
    header: '〖',
    headerEnd: '〗',
    color: 'gold',
    emojis: ['🏆', '⭐', '🥇', '🎖️', '💎', '👑', '🌟', '📈', '🔱']
  },
  success: {
    primary: '━',
    accent: '✅',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    color: 'green',
    emojis: ['✅', '🎉', '💚', '🌟', '✔️', '🟢']
  },
  error: {
    primary: '━',
    accent: '❌',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    color: 'red',
    emojis: ['❌', '🚫', '⛔', '💔', '🔴', '❗']
  },
  warning: {
    primary: '━',
    accent: '⚠️',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    color: 'yellow',
    emojis: ['⚠️', '⏰', '💡', '📢', '🟡', '🔔']
  },
  info: {
    primary: '━',
    accent: 'ℹ️',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    color: 'blue',
    emojis: ['ℹ️', '📖', '💭', '🔔', '🔵', '📘']
  }
};

function getPhilippineTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const philippineOffset = 8 * 60 * 60000;
  return new Date(utc + philippineOffset);
}

export function getRandomEmoji(style: keyof typeof themes): string {
  const theme = themes[style] || themes.general;
  return theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
}

export function formatHeader(title: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  const emoji = getRandomEmoji(style);
  const line = theme.primary.repeat(30);
  return `${emoji} ${theme.header} ${title.toUpperCase()} ${theme.headerEnd} ${emoji}\n${line}`;
}

export function formatSubHeader(text: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  return `\n${theme.accent} ${text}`;
}

export function formatField(label: string, value: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  return `${theme.bullet} ${label}: ${value}`;
}

export function formatList(items: string[], style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  return items.map(item => `   ${theme.arrow} ${item}`).join('\n');
}

export function formatDivider(style: keyof typeof themes = 'general', length: number = 30): string {
  const theme = themes[style];
  return theme.primary.repeat(length);
}

export function formatFooter(text: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  const line = theme.primary.repeat(30);
  return `${line}\n${theme.accent} ${text}`;
}

export function formatTimestamp(): string {
  const d = getPhilippineTime();
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
}

export function formatFullTimestamp(): string {
  const d = getPhilippineTime();
  return d.toLocaleString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
}

export function formatShortTime(): string {
  const d = getPhilippineTime();
  return d.toLocaleString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
}

export function formatMessage(options: FormatOptions): string {
  const style = options.style || 'general';
  const theme = themes[style];
  const emoji = getRandomEmoji(style);
  
  let msg = '';
  
  if (options.title) {
    msg += `${emoji} ${theme.header} ${options.title.toUpperCase()} ${theme.headerEnd} ${emoji}\n`;
    msg += `${theme.primary.repeat(30)}\n`;
  }
  
  if (options.subtitle) {
    msg += `\n${theme.accent} ${options.subtitle}\n`;
  }
  
  if (options.content) {
    msg += `\n${options.content}\n`;
  }
  
  if (options.fields && options.fields.length > 0) {
    msg += '\n';
    for (const field of options.fields) {
      msg += `${theme.bullet} ${field.label}: ${field.value}\n`;
    }
  }
  
  if (options.timestamp) {
    msg += `\n${theme.primary.repeat(30)}\n`;
    msg += `${theme.accent} ${formatTimestamp()}`;
  }
  
  if (options.footer) {
    msg += `\n${theme.primary.repeat(30)}\n`;
    msg += `${theme.accent} ${options.footer}`;
  }
  
  return msg;
}

export function success(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'success',
    timestamp: true
  });
}

export function error(title: string, content?: string): string {
  return formatMessage({
    title,
    content,
    style: 'error'
  });
}

export function warning(title: string, content?: string): string {
  return formatMessage({
    title,
    content,
    style: 'warning'
  });
}

export function info(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'info'
  });
}

export function funMessage(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'fun',
    timestamp: true
  });
}

export function adminMessage(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'admin',
    timestamp: true
  });
}

export function levelMessage(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'level',
    timestamp: true
  });
}

export function utilityMessage(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'utility',
    timestamp: true
  });
}

export function generalMessage(title: string, content?: string, fields?: Array<{ label: string; value: string }>): string {
  return formatMessage({
    title,
    content,
    fields,
    style: 'general',
    timestamp: true
  });
}

export function createProgressBar(current: number, max: number, length: number = 15): string {
  const progress = Math.min(current / max, 1);
  const filled = Math.round(progress * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(progress * 100)}%`;
}

export function createFancyProgressBar(current: number, max: number, length: number = 15): string {
  const progress = Math.min(current / max, 1);
  const filled = Math.round(progress * length);
  const empty = length - filled;
  const percentage = Math.round(progress * 100);
  
  let color = '🔴';
  if (percentage >= 75) color = '🟢';
  else if (percentage >= 50) color = '🟡';
  else if (percentage >= 25) color = '🟠';
  
  return `${color} [${'▰'.repeat(filled)}${'▱'.repeat(empty)}] ${percentage}%`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export const colors = {
  red: '🔴',
  orange: '🟠',
  yellow: '🟡',
  green: '🟢',
  blue: '🔵',
  purple: '🟣',
  white: '⚪',
  black: '⚫',
  brown: '🟤',
  pink: '💗',
  gold: '🏆',
  silver: '🥈',
  bronze: '🥉'
};

export const decorations = {
  sparkle: '✨',
  star: '⭐',
  heart: '❤️',
  fire: '🔥',
  lightning: '⚡',
  crown: '👑',
  diamond: '💎',
  rocket: '🚀',
  trophy: '🏆',
  medal: '🎖️',
  gem: '💠',
  ribbon: '🎀',
  flower: '🌸',
  leaf: '🍃',
  rainbow: '🌈',
  sun: '☀️',
  moon: '🌙',
  comet: '☄️',
  globe: '🌍',
  music: '🎵',
  gift: '🎁',
  balloon: '🎈',
  confetti: '🎊',
  party: '🎉',
  cake: '🎂',
  crystal: '🔮',
  shield: '🛡️',
  sword: '⚔️',
  key: '🔑',
  lock: '🔐',
  bell: '🔔',
  megaphone: '📢',
  chart: '📊',
  target: '🎯',
  dice: '🎲',
  controller: '🎮',
  paintbrush: '🎨',
  microphone: '🎤',
  headphones: '🎧',
  camera: '📷',
  movie: '🎬',
  ticket: '🎫',
  hourglass: '⏳',
  stopwatch: '⏱️',
  alarm: '⏰',
  calendar: '📅',
  bookmark: '🔖',
  pin: '📌',
  link: '🔗',
  gear: '⚙️',
  wrench: '🔧',
  hammer: '🔨',
  magnify: '🔍',
  bulb: '💡',
  battery: '🔋',
  plug: '🔌',
  computer: '💻',
  phone: '📱',
  email: '📧',
  inbox: '📥',
  outbox: '📤',
  folder: '📁',
  clipboard: '📋',
  pencil: '✏️',
  pen: '🖊️',
  book: '📖',
  newspaper: '📰',
  scroll: '📜',
  money: '💰',
  coins: '🪙',
  credit: '💳',
  shopping: '🛒',
  package: '📦',
  truck: '🚚',
  airplane: '✈️',
  ship: '🚢',
  car: '🚗',
  bike: '🚲',
  house: '🏠',
  building: '🏢',
  hospital: '🏥',
  school: '🏫',
  stadium: '🏟️',
  tent: '⛺',
  mountain: '⛰️',
  beach: '🏖️',
  island: '🏝️',
  tree: '🌳',
  cactus: '🌵',
  palmtree: '🌴',
  cherry: '🌸',
  rose: '🌹',
  tulip: '🌷',
  sunflower: '🌻',
  four_leaf: '🍀',
  maple: '🍁',
  fallen_leaf: '🍂'
};

export const categoryIndicators = {
  general: { emoji: '💫', color: 'blue', symbol: '✨', border: '━' },
  fun: { emoji: '💖', color: 'pink', symbol: '♡', border: '═' },
  level: { emoji: '🏆', color: 'gold', symbol: '⭐', border: '═' },
  utility: { emoji: '⚙️', color: 'teal', symbol: '▸', border: '─' },
  admin: { emoji: '🔥', color: 'red', symbol: '▪', border: '▬' }
};

export function getCategoryStyle(category: string) {
  return categoryIndicators[category as keyof typeof categoryIndicators] || categoryIndicators.general;
}

export function createCategoryHeader(title: string, category: string): string {
  const style = getCategoryStyle(category);
  const themeKey = category as keyof typeof themes;
  const theme = themes[themeKey] || themes.general;
  
  return `${style.emoji} ${theme.header} ${title.toUpperCase()} ${theme.headerEnd} ${style.emoji}\n${style.border.repeat(30)}`;
}

export default {
  formatMessage,
  formatHeader,
  formatSubHeader,
  formatField,
  formatList,
  formatDivider,
  formatFooter,
  formatTimestamp,
  formatFullTimestamp,
  formatShortTime,
  success,
  error,
  warning,
  info,
  funMessage,
  adminMessage,
  levelMessage,
  utilityMessage,
  generalMessage,
  createProgressBar,
  createFancyProgressBar,
  formatNumber,
  formatDuration,
  getRandomEmoji,
  getCategoryStyle,
  createCategoryHeader,
  themes,
  colors,
  decorations,
  categoryIndicators
};
