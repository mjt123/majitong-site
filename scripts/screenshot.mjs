/**
 * 站点视觉验证脚本：桌面 / 移动端分区视口截图。
 * 用法：node scripts/screenshot.mjs [baseURL]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const OUT = 'shots';
mkdirSync(OUT, { recursive: true });

const EXEC =
  '/home/admin/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell';

const browser = await chromium.launch({ executablePath: EXEC, headless: true, args: ['--disable-gpu'] });

async function settle(page, ms = 1400) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(ms);
}

async function captureDesktop() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await settle(page, 3400); // 等 Hero 入场序列完成

  // 分区截图
  const sections = ['home', 'about', 'research', 'projects', 'publications', 'skills', 'tools', 'blog', 'contact'];
  for (const id of sections) {
    await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView(), id);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${OUT}/d-${id}.png` });
  }

  // 项目详情页（分区）
  await page.goto(`${BASE}/projects/highway-pilot`, { waitUntil: 'domcontentloaded' });
  await settle(page, 2600);
  await page.screenshot({ path: `${OUT}/d-detail-top.png` });
  const H = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const stops = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86, 1];
  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * stops[i]));
    await page.waitForTimeout(950);
    await page.screenshot({ path: `${OUT}/d-detail-${i + 1}.png` });
  }
  await page.close();

  // 第二个项目详情（泊车，验证另一类图形）
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page2.goto(`${BASE}/projects/auto-parking`, { waitUntil: 'domcontentloaded' });
  await settle(page2, 2400);
  await page2.screenshot({ path: `${OUT}/d-detail-parking.png` });
  await page2.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.42));
  await page2.waitForTimeout(950);
  await page2.screenshot({ path: `${OUT}/d-detail-parking-model.png` });
  await page2.close();
}

async function captureMobile() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await settle(page, 3000);
  await page.screenshot({ path: `${OUT}/m-home.png` });
  await page.evaluate(() => document.getElementById('research')?.scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/m-research.png` });
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/m-projects.png` });
  // 移动端菜单
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: '打开菜单' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/m-menu.png` });
  await page.close();
}

await captureDesktop();
await captureMobile();
await browser.close();
console.log('screenshots saved to ./' + OUT);
