# AGENTS.md

个人技术网站（中文内容）， persona 为自动驾驶控制算法工程师。技术栈：React 18 + TypeScript + Vite 5 + Tailwind 3 + Framer Motion 11 + KaTeX + React Router 6。设计语言：「Academic Engineering」—— 工程图纸线条、mono 标注、慢而精确的动效。完整架构图见 `README.md`。

## 常用命令

```bash
npm run dev        # Vite 开发服务器，http://localhost:5173
npm run build      # tsc --noEmit + vite build  ← 这就是类型检查；本项目无独立 lint / test
npm run preview    # 本地预览 dist/，http://localhost:4173
node scripts/screenshot.mjs [baseURL]   # 视觉验证：分区截图输出到 shots/（默认 baseURL 为预览地址）
node scripts/gen-resume.mjs             # 重新生成占位简历 public/resume.pdf
node scripts/gen-china-map.mjs [geo目录] # 重新生成中国地图 SVG 数据 src/data/chinaGeo.ts（DataV 官方 GeoJSON → 兰勃特投影）
node scripts/to-webp.mjs <文件...>       # 位图重编码为 WebP q0.82（playwright-core 驱动本机 Edge）
```

本项目没有测试框架和 linter；`npm run build` 通过即为质量门槛。`shots/` 是被 gitignore 的截图输出目录。

## 架构规则（约定强制，请勿破坏）

- **主题层是视觉值的唯一归宿。** 颜色 / 字体 / 圆角 / 阴影只存在于 `src/theme/*.ts`，由 `ThemeProvider` 以 CSS 变量注入 `:root`。Tailwind 类名只做「语义 Token → var()」映射（`bg-surface`、`text-ink-secondary`、`border-accent-line`…）。禁止在组件中出现任何具体色值 —— grep 验证过：hex 只出现在 `src/theme/academic.ts`。
- **动效参数一律取自 `src/theme/animation.ts`**（`EASE`、`DURATION`、`STAGGER`、`revealVariants`）。组件内不允许散落魔法数形式的时长 / 缓动。所有动效必须尊重 `prefers-reduced-motion`（退化为静态终态）。
- **内容全部放在 `src/data/*.ts`。** 修改文案、数字、论文、项目、博客，只编辑数据文件 —— 组件是数据驱动渲染的（计数动画、进度线、架构图均由数据驱动）。禁止把内容硬编码进组件。
- **新增主题**：在 `src/theme/` 下新增 Token 文件，注册到 `ThemeProvider.tsx` 的 `THEMES`，通过 `setThemeByName` 切换。组件不得根据主题名做条件分支。
- **路径别名**：`@/*` → `src/*`（tsconfig 与 vite 均已配置）。

## 路由与构建的坑

- `BrowserRouter`，路由为 `/`（HomePage）、`/projects/:id`（ProjectDetailPage）、`/art`（ArtPage，纸质画廊艺术页）、`/travel`（TravelPage，足迹页：数据驱动的中国旅行地图）和 `/travel-edit`（TravelEditPage，图钉校准后台：拖拽定 canvasPos，草稿存 localStorage，导出 JSON 写回 travel.ts，流程见 README「旅行地图 · 图钉校准」）；`*` 重定向回 `/`。`vite.config.ts` 使用 `base: '/'`，资源必须保持绝对路径；静态部署需配置 SPA fallback（所有路径回退 `index.html`）。
- **导航含路由项**：`NavItem` 有可选 `path` 字段，有 `path` 的项（如「艺术」→ `/art`）渲染为 `<Link>` 而非锚点滚动按钮；`useScrollSpy` 需过滤掉路由项。
- **纸色 token**：`/art` 使用暖纸色系（`bg-paper`、`text-paper-ink`、`border-paper-line` 等），色值同样只存在于 `theme/academic.ts`。艺术页顶部必须保持深色条带（`bg-hero-bg`）—— 全站导航是浅色文字，浅色背景上不可读。
- **站点图片**：位图放 `public/images/art/`（艺术海报）与 `public/images/travel/`（旅行照片，命名 `NN-slug.webp`），用绝对路径引用（如 `/images/art/01-transit.webp`）；其余视觉均为内联 SVG。**位图一律用 WebP**（质量 ~0.82，整页图片体积控制在 0.5MB 量级 —— 经 Cloudflare 隧道传输，大图会让页面加载极慢）。本机没有 cwebp / ImageMagick / ffmpeg，格式转换用 `scripts/to-webp.mjs`（playwright-core 驱动本机 Edge 的 canvas `toBlob('image/webp')`）。
- 构建手动分包：`vendor-react`、`vendor-motion`、`vendor-katex`。
- TS 为 strict 模式且开启 `noUnusedLocals` / `noUnusedParameters` —— 未使用的导入会直接导致构建失败。
- `scripts/screenshot.mjs` 硬编码了机器特定的 Chromium 路径（`/home/admin/.cache/ms-playwright/...`），基于 `playwright-core`，在没有该二进制的机器上无法运行；且其分区列表仅覆盖首页锚点，验证独立路由页（如 `/art`）需另写临时脚本。
- **对外访问走 Cloudflare 隧道**：机器上有常驻 `cf tunnel --url http://localhost:4173` 进程（日志 `/tmp/cf.log`，内含 `*.trycloudflare.com` 公网网址）。内网 IP（172.25.x.x）外部浏览器打不开；给用户发地址用隧道网址。
- `public/resume.pdf` 是脚本生成的占位文件 —— 正式简历直接替换该文件即可。
