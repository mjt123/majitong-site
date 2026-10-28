import type { Config } from 'tailwindcss';

/**
 * Tailwind 只做「语义 Token → CSS Variable」的映射。
 * 任何组件都不得出现具体色值 —— 颜色 / 字体 / 圆角 / 阴影
 * 全部由 theme 层（src/theme/*.ts）注入的 CSS 变量提供。
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-elevated)',
          subtle: 'var(--color-surface-subtle)',
        },
        ink: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        line: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          strong: 'var(--color-accent-strong)',
          secondary: 'var(--color-accent-secondary)',
          soft: 'var(--color-accent-soft)',
          line: 'var(--color-accent-line)',
        },
        gold: 'var(--color-gold)',
        paper: {
          DEFAULT: 'var(--color-paper)',
          raised: 'var(--color-paper-elevated)',
          ink: 'var(--color-paper-ink)',
          'ink-2': 'var(--color-paper-ink-secondary)',
          line: 'var(--color-paper-line)',
        },
        hero: {
          bg: 'var(--color-hero-background)',
          'bg-2': 'var(--color-hero-background-2)',
          text: 'var(--color-hero-text)',
          'text-2': 'var(--color-hero-text-secondary)',
          line: 'var(--color-hero-line)',
          glow: 'var(--color-hero-glow)',
        },
      },
      fontFamily: {
        sans: 'var(--font-body)',
        heading: 'var(--font-heading)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        tile: 'var(--radius-tile)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        overlay: 'var(--shadow-overlay)',
      },
      maxWidth: {
        site: 'var(--layout-max-width)',
      },
      transitionTimingFunction: {
        precise: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease both',
      },
    },
  },
  plugins: [],
} satisfies Config;
