import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ThemeTokens } from './types';
import { academicTheme } from './academic';

const toKebab = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** 将主题 Token 写入 :root CSS 变量 */
export function applyTheme(theme: ThemeTokens): void {
  const root = document.documentElement;
  (Object.entries(theme.colors) as [string, string][]).forEach(([k, v]) => {
    root.style.setProperty(`--color-${toKebab(k)}`, v);
  });
  (Object.entries(theme.fonts) as [string, string][]).forEach(([k, v]) => {
    root.style.setProperty(`--font-${k}`, v);
  });
  (Object.entries(theme.radius) as [string, string][]).forEach(([k, v]) => {
    root.style.setProperty(`--radius-${k}`, v);
  });
  (Object.entries(theme.shadows) as [string, string][]).forEach(([k, v]) => {
    root.style.setProperty(`--shadow-${toKebab(k)}`, v);
  });
  (Object.entries(theme.layout) as [string, string][]).forEach(([k, v]) => {
    root.style.setProperty(`--layout-${toKebab(k)}`, v);
  });
  root.dataset.theme = theme.name;
}

/**
 * 未来新增主题：在 themes/ 下新增 Token 文件并注册到 THEMES。
 * 页面组件不依赖任何主题名，只消费 Token。
 */
const THEMES: Record<string, ThemeTokens> = {
  academic: academicTheme,
};

interface ThemeContextValue {
  theme: ThemeTokens;
  setThemeByName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: academicTheme,
  setThemeByName: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeTokens>(THEMES.academic);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setThemeByName: (name) => THEMES[name] && setTheme(THEMES[name]) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// 首帧之前同步应用默认主题，避免无样式闪烁
applyTheme(THEMES.academic);

export const useTheme = () => useContext(ThemeContext);
