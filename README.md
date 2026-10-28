# 张明远 · 自动驾驶控制算法工程师 — 数字控制实验室

> 控制 · 决策 · 执行 —— 用控制理论驱动自动驾驶。
> 一个以「学术性 × 工程性 × 艺术性」为气质的个人技术网站。

## 技术栈

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · KaTeX · React Router 6

## 快速开始

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc --noEmit + vite build + 复制 index.html → dist/404.html（SPA fallback）
npm run preview   # 本地预览构建产物（http://localhost:4173）
```

> 部署到静态服务器时请为 SPA 配置 fallback（所有路径回退到 index.html；`dist/404.html` 已兜底 GitHub Pages / Cloudflare Pages 这类只能配 404 文档的场景）。
> Vercel / Netlify 默认支持；Nginx 用 `try_files $uri $uri/ /index.html;`。
> 分享卡片在 `public/og-card.jpg`（1200×630，由首页 Hero 截图而来，`index.html` 的 og:image 为站内绝对路径）—— 绑定正式域名后建议把 og:image / og:url 换成绝对 URL，并补一份带域名的 `sitemap.xml`。

## 架构

```
src/
├── theme/                  # 主题层（唯一允许出现色值的地方）
│   ├── types.ts            #   Token 类型契约
│   ├── academic.ts         #   Academic Engineering 主题
│   ├── ThemeProvider.ts    #   Token → CSS Variables 注入 + 主题切换
│   └── animation.ts        #   全站动画参数中心（缓动 / 时长 / 序列）
├── data/                   # 内容数据层（改内容不改组件）
│   ├── site.ts             #   导航 / Hero 文案 / 页脚签名
│   ├── profile.ts          #   个人信息 + 数据统计
│   ├── research.ts         #   研究方向（含 hover 彩蛋标注）
│   ├── projects.ts         #   项目 + 详情（模型公式 / 架构 / 结果）
│   ├── publications.ts     #   论文（IEEE 风格文献数据）
│   ├── skills.ts / tools.ts / blog.ts
├── components/
│   ├── ui/                 # Icon / Tex(KaTeX) / Reveal / SectionHeading
│   ├── hero/               # HeroVisual + ControlDiagram + VehicleFigure
│   ├── research/           # ResearchCard + 5 个 SVG 科研图形
│   ├── travel/             # ChinaMap + TravelLightbox（足迹页地图 / 灯箱）
│   └── figures/            # 项目技术图形 + 系统架构图
├── hooks/                  # useCountUp / useScrollSpy / useScrolled
├── utils/                  # cn / 平滑曲线 / Hero 场景几何
└── pages/                  # HomePage / ProjectDetailPage / BlogPostPage / ArtPage / TravelPage / TravelEditPage
```

### 主题解耦

- 所有颜色 / 字体 / 圆角 / 阴影只存在于 `theme/*.ts`，以 CSS Variables 注入 `:root`；
- Tailwind 仅做「语义 Token → var()」映射（`bg-surface`、`text-ink-secondary`、`border-accent-line`…）；
- 组件不依赖主题名。新增主题：在 `theme/` 增加 Token 文件并注册到 `THEMES`，调用 `setThemeByName` 即可，页面零改动。

### 内容解耦

增加论文、项目、博客、修改统计数字：只编辑 `src/data/*.ts`，组件自动渲染（计数动画、进度线、架构图均由数据驱动）。

**博客文章**：`/blog/:slug` 由 `src/data/blogArticles.ts`（正文 blocks：para / heading / equation / figure / table / code / list / callout / references，段落支持 `**加粗**`、`` `行内代码` `` 与 `$行内公式$`）+ `src/data/blog.ts`（列表元数据）数据驱动。配图放 `public/images/blog/*.webp`，纪律：**只保留相关图表区域** —— 截图需裁掉页眉标题带与右下角水印（原始未裁件备份在 `.fig-backups-blog/`，重裁可用 `.tmp-tools/recrop*.mjs` 的流程：playwright-core 驱动 Edge canvas 按比例坐标裁剪 + WebP q0.82 重编码）。

**MD 导入工具**：`/blog-import`（文章页右上角「IMPORT / 导入 MD」可进入）。拖入 / 粘贴 Markdown → 自动解析为 blocks 并实时预览 → 生成 `blog.ts` 条目与 `blogArticles.ts` 片段，复制贴回数据文件后 `npm run build` 生效。支持 `#` 标题、段落行内标记、`$$` 数学块（整段单行式自动转为独立公式）、``` 代码块、GFM 表格、有序/无序列表、`>` 引用（→ callout）、独立行图片（→ figure）。解析器在 `src/utils/mdToBlocks.ts`；正文渲染器为共享组件 `src/components/article/ArticleBody.tsx`。

**性能与 SEO 约定**：路由级代码分割（`App.tsx` 中除首页外均为 `React.lazy`，各页面含其专属数据独立分包，首屏不下载博客语料 / 地理数据 / 工具页）；博客列表「可点入」标记来自 `blog.ts` 的 `hasArticle: true` 字段（导入工具会自动带上）—— 新增文章勿删此字段，否则列表项不可点击；`src/hooks/usePageTitle.ts` 按页设置 `<title>` 与 meta description；`public/robots.txt` 屏蔽两个工具页。

## 设计语言

- **Academic Engineering**：深海军蓝 Hero + 白色学术内容区 + 蓝紫 Accent + 极少量金色点缀；
- **工程图纸语言**：1px 细线、坐标轴、网格、mono 标注、编号、数据点；
- **数学排版**：全部公式经 KaTeX 渲染（Hero 公式层 / 项目控制模型 / 能力注脚）；
- **动效原则**：慢、稳、精确 —— 信号沿框图流动、轨迹 dash 流动、LiDAR 点云漂移、滚动计数与进度线生长；
- **无障碍**：全站尊重 `prefers-reduced-motion`（环境动画全部关闭，动效退化为静态终态）。

## 工程彩蛋（控制工程师才会注意到的细节）

- Hero 车辆 hover：显形 `r`（横摆角速度）、`β`（质心侧偏角）、`a_y`（侧向加速度）标注；
- 研究方向卡片 hover：MPC 预测序列流动、自适应 θ̂ 曲线生长、跟踪误差带脉冲、协方差椭圆呼吸；
- 导航「外观」菜单：主题架构已就绪，Cyberpunk / Swiss 为预留入口。

## 旅行地图 · 图钉校准（/travel-edit）

足迹页 `/travel` 是「手绘插画 + 图钉」结构：图钉坐标 `canvasPos` 为**相对画布的百分比**，
数据在 `src/data/travel.ts`；底图插画为 `public/images/travel/map-illustrated-v2.webp`
（AI 生成后已擦除误入的航线元素；地区装饰元素位置随意，不对应真实地理）。

**校准 / 新增城市的标准流程：**

1. **照片**：放 `public/images/travel/NN-slug.webp`（WebP ~0.82，用 `node scripts/to-webp.mjs <文件>` 转换）；
2. **加条目**：在 `src/data/travel.ts` 的 `travelStops` 追加一条 —— `id` 唯一、`index` 序号递增、
   填 `name / region / scene / note / alt`，`lng / lat` 填真实经纬度，`canvasPos` 先占位 `{ x: 50, y: 50 }`；
3. **拖拽校准**：打开 **`/travel-edit`**（或 /travel 页脚的 PIN CALIBRATOR），把新图钉拖到理想位置；
   坐标实时显示并自动存浏览器 localStorage（仅草稿，不影响正式页）；双击图钉恢复该点原始位置；
4. **导出生效**：点「复制坐标 JSON」→ 把结果替换对应 `canvasPos`（或直接发给 AI 处理），
   `npm run build` 后 /travel 即为新布局。

提示：图钉标签默认在点位右侧，画面右缘（x > 72%）自动翻到左侧；也可用 `labelAnchor: 'w' | 'e'` 强制左右。

## 替换占位内容

- 简历：替换 `public/resume.pdf`（当前为脚本生成的占位文件）；
- 联系方式 / 论文 DOI / 社交链接：`src/data/profile.ts`、`src/data/publications.ts`。
