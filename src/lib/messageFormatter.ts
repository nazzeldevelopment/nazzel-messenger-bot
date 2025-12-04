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
    accent: '◈',
    bullet: '◉',
    arrow: '➤',
    divider: '┄',
    header: '【',
    headerEnd: '】',
    emojis: ['📋', '📝', '📌', '💫', '✨']
  },
  fun: {
    primary: '═',
    accent: '★',
    bullet: '●',
    arrow: '→',
    divider: '~',
    header: '『',
    headerEnd: '』',
    emojis: ['🎮', '🎲', '🎯', '🌈', '🎪', '🎨', '🎭', '🎉', '✨', '💫']
  },
  utility: {
    primary: '─',
    accent: '◆',
    bullet: '▸',
    arrow: '»',
    divider: '·',
    header: '〔',
    headerEnd: '〕',
    emojis: ['🔧', '⚙️', '🛠️', '📊', '🔍', '💡']
  },
  admin: {
    primary: '▬',
    accent: '◈',
    bullet: '▪',
    arrow: '⊳',
    divider: '―',
    header: '⟦',
    headerEnd: '⟧',
    emojis: ['⚡', '🔐', '👑', '🛡️', '⚔️', '🔱']
  },
  level: {
    primary: '═',
    accent: '◆',
    bullet: '◇',
    arrow: '↗',
    divider: '·',
    header: '〖',
    headerEnd: '〗',
    emojis: ['📊', '🏆', '⭐', '🎖️', '🥇', '📈', '💎']
  },
  success: {
    primary: '━',
    accent: '✓',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    emojis: ['✅', '🎉', '💚', '🌟']
  },
  error: {
    primary: '━',
    accent: '✗',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    emojis: ['❌', '🚫', '⛔', '💔']
  },
  warning: {
    primary: '━',
    accent: '⚠',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    emojis: ['⚠️', '⏰', '💡', '📢']
  },
  info: {
    primary: '━',
    accent: 'ℹ',
    bullet: '◉',
    arrow: '➜',
    divider: '·',
    header: '【',
    headerEnd: '】',
    emojis: ['ℹ️', '📖', '💭', '🔔']
  }
};

export function getRandomEmoji(style: keyof typeof themes): string {
  const theme = themes[style] || themes.general;
  return theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
}

export function formatHeader(title: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  const emoji = getRandomEmoji(style);
  const line = theme.primary.repeat(20);
  return `${emoji} ${theme.header} ${title.toUpperCase()} ${theme.headerEnd}\n${line}`;
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

export function formatDivider(style: keyof typeof themes = 'general', length: number = 25): string {
  const theme = themes[style];
  return theme.divider.repeat(length);
}

export function formatFooter(text: string, style: keyof typeof themes = 'general'): string {
  const theme = themes[style];
  const line = theme.primary.repeat(20);
  return `${line}\n${theme.accent} ${text}`;
}

export function formatTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatMessage(options: FormatOptions): string {
  const style = options.style || 'general';
  const theme = themes[style];
  const emoji = getRandomEmoji(style);
  
  let msg = '';
  
  if (options.title) {
    msg += `${emoji} ${theme.header} ${options.title.toUpperCase()} ${theme.headerEnd}\n`;
    msg += `${theme.primary.repeat(22)}\n`;
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
    msg += `\n${theme.divider.repeat(22)}\n`;
    msg += `${theme.accent} ${formatTimestamp()}`;
  }
  
  if (options.footer) {
    msg += `\n${theme.primary.repeat(22)}\n`;
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

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
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
  music: '🎵'
};

export default {
  formatMessage,
  formatHeader,
  formatSubHeader,
  formatField,
  formatList,
  formatDivider,
  formatFooter,
  formatTimestamp,
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
  formatNumber,
  getRandomEmoji,
  themes,
  colors,
  decorations
};
