import type { ThemeTokens } from './types';

/**
 * Academic Engineering —— 站点第一版唯一主题。
 * 深海军蓝 Hero + 白色学术内容区 + 蓝紫 Accent + 极少量金色点缀。
 */
export const academicTheme: ThemeTokens = {
  name: 'academic',
  label: 'Academic Engineering',
  colors: {
    background: '#ffffff',
    surface: '#f7f8fa',
    surfaceElevated: '#ffffff',
    surfaceSubtle: '#fafbfd',
    textPrimary: '#0b1220',
    textSecondary: '#49546a',
    textTertiary: '#8b95a9',
    textInverse: '#e8ecf6',
    border: '#e6e9f0',
    borderStrong: '#ccd3e0',
    accent: '#4a57e8',
    accentStrong: '#5b6cff',
    accentSecondary: '#2e6be6',
    accentSoft: 'rgba(74, 87, 232, 0.08)',
    accentLine: 'rgba(74, 87, 232, 0.38)',
    gold: '#c9a25e',
    paper: '#f3eee1',
    paperElevated: '#faf7ec',
    paperInk: '#2c2620',
    paperInkSecondary: '#857c6b',
    paperLine: '#ddd3bd',
    heroBackground: '#070b16',
    heroBackground2: '#0c1226',
    heroText: '#e9edf7',
    heroTextSecondary: '#8b94ab',
    heroLine: 'rgba(139, 148, 171, 0.18)',
    heroGlow: 'rgba(79, 92, 232, 0.20)',
  },
  fonts: {
    heading:
      "'Noto Sans SC Variable', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif",
    body: "'Noto Sans SC Variable', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif",
    serif: "'Source Serif 4 Variable', 'Source Serif Pro', Georgia, 'Times New Roman', 'Noto Sans SC Variable', 'PingFang SC', 'Microsoft YaHei', serif",
    mono: "'JetBrains Mono Variable', ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, 'Noto Sans SC Variable', 'PingFang SC', 'Microsoft YaHei', monospace",
  },
  radius: {
    card: '8px',
    tile: '6px',
  },
  shadows: {
    card: '0 1px 2px rgba(11, 18, 32, 0.03), 0 8px 24px -16px rgba(11, 18, 32, 0.10)',
    cardHover: '0 2px 4px rgba(11, 18, 32, 0.04), 0 16px 40px -20px rgba(74, 87, 232, 0.18)',
    overlay: '0 24px 64px -24px rgba(7, 11, 22, 0.45)',
  },
  layout: {
    maxWidth: '76rem',
  },
};
