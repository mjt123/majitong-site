/**
 * SPA fallback：构建后复制 dist/index.html → dist/404.html。
 * 静态托管（GitHub Pages / Cloudflare Pages / nginx try_files 缺省页）对未知路径
 * 返回 404.html，内容与 index.html 相同，React Router 接管后正常渲染深链接。
 */
import fs from 'node:fs';

fs.copyFileSync('dist/index.html', 'dist/404.html');
console.log('dist/404.html written (SPA fallback)');
