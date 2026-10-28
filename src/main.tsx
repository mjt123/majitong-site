import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 字体（可变字体，按 unicode-range 分包懒加载）
import '@fontsource-variable/noto-sans-sc';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/jetbrains-mono';
// 数学排版
import 'katex/dist/katex.min.css';

import './index.css';
// 模块加载即同步注入主题 CSS 变量，保证首帧无闪烁
import './theme/ThemeProvider';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
