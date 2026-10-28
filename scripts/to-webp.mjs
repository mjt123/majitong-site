/**
 * 图片 → WebP 重编码（质量 0.82），用于站点图片体积纪律（整页 ~0.5MB 量级）。
 * 本机无 cwebp / ImageMagick / ffmpeg，用 playwright-core 驱动本机 Edge（Chromium 内核）
 * 的 canvas.toBlob('image/webp') 实现。
 *
 * 用法：node scripts/to-webp.mjs <文件...>   # 原地重编码（.webp/.png/.jpg → .webp）
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const QUALITY = 0.82;
const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('用法: node scripts/to-webp.mjs <文件...>');
  process.exit(1);
}

let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
} catch (e) {
  console.error('无法启动 Edge:', e.message.slice(0, 200));
  process.exit(1);
}

const page = await browser.newPage();

for (const file of files) {
  const input = path.resolve(file);
  const ext = path.extname(input).toLowerCase();
  const out = ext === '.webp' ? input : input.slice(0, -ext.length) + '.webp';
  const before = fs.statSync(input).size;

  const b64 = fs.readFileSync(input).toString('base64');
  const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/webp';
  const result = await page.evaluate(
    async ({ dataUrl, quality }) => {
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = () => rej(new Error('图片解码失败'));
        img.src = dataUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality));
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = '';
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      return { b64: btoa(bin), w: canvas.width, h: canvas.height };
    },
    { dataUrl: `data:${mime};base64,${b64}`, quality: QUALITY },
  );

  fs.writeFileSync(out, Buffer.from(result.b64, 'base64'));
  const after = fs.statSync(out).size;
  console.log(
    `${path.basename(input)} ${result.w}x${result.h}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (${path.basename(out)})`,
  );
  if (out !== input && ext !== '.webp') fs.rmSync(input);
}

await browser.close();
