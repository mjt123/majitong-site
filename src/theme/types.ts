/**
 * 主题 Token 类型定义。
 * 组件层只允许消费 CSS 变量（--color-* / --font-* / --radius-* / --shadow-*），
 * 任何具体色值只允许出现在 themes/ 目录下的主题文件中。
 */
export interface ThemeTokens {
  name: string;
  label: string;
  /** 语义色板：key 将被转换为 --color-<kebab-case> */
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceSubtle: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    border: string;
    borderStrong: string;
    accent: string;
    accentStrong: string;
    accentSecondary: string;
    accentSoft: string;
    accentLine: string;
    gold: string;
    /** 艺术页纸质画廊色板（暖纸底 / 纸面卡片 / 棕黑墨字 / 暖灰次级 / 纸色细线） */
    paper: string;
    paperElevated: string;
    paperInk: string;
    paperInkSecondary: string;
    paperLine: string;
    heroBackground: string;
    heroBackground2: string;
    heroText: string;
    heroTextSecondary: string;
    heroLine: string;
    heroGlow: string;
  };
  fonts: {
    heading: string;
    body: string;
    serif: string;
    mono: string;
  };
  radius: {
    card: string;
    tile: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    overlay: string;
  };
  layout: {
    maxWidth: string;
  };
}
