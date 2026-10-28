/** 站点全部内容数据类型 —— 数据层（src/data）与组件层的契约 */

export type IconName =
  | 'briefcase'
  | 'document'
  | 'code'
  | 'award'
  | 'function'
  | 'nodes'
  | 'chip'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'download'
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'map-pin'
  | 'menu'
  | 'close'
  | 'file-text'
  | 'calendar'
  | 'clock'
  | 'check'
  | 'target'
  | 'layers'
  | 'phone';

export interface NavItem {
  /** 页面 section 锚点 id */
  id: string;
  label: string;
  /** 独立路由路径 —— 有 path 的导航项渲染为路由链接而非锚点滚动 */
  path?: string;
}

export interface ArtPiece {
  id: string;
  /** 序号编号，如 '01' */
  index: string;
  title: string;
  titleEn: string;
  year: string;
  medium: string;
  /** 创作短注 */
  note: string;
  /** 海报画面上的点睛文字（中英双语） */
  posterText: { zh: string; en: string };
  /** 海报图片路径（public/ 下绝对路径） */
  image: string;
  alt: string;
}

export interface TravelStop {
  id: string;
  /** 序号编号，如 '01' */
  index: string;
  name: string;
  nameEn: string;
  /** WGS84 经纬度 —— 地理模式下由兰勃特投影定位 */
  lng: number;
  lat: number;
  /** 插画模式下图钉在画布上的手工校准位置（0-100 百分比，相对插画图幅） */
  canvasPos?: { x: number; y: number };
  /** 地图标签朝向（e=图钉东侧，w=西侧），缺省按位置自动判断 —— 用于画布上避让拥挤 */
  labelAnchor?: 'e' | 'w';
  date: string;
  region: string;
  scene: string;
  /** 旅行短注 */
  note: string;
  /** 照片路径（public/ 下绝对路径） */
  image: string;
  alt: string;
}

export interface Education {
  period: string;
  school: string;
  degree: string;
  major: string;
}

export interface Profile {
  name: string;
  nameEn: string;
  title: string;
  /** Hero 副标题（两行） */
  tagline: string[];
  /** Hero 关键词（配极简图标） */
  keywords: { label: string; icon: IconName }[];
  /** 关于我正文段落 */
  intro: string[];
  /** 关于我引述 */
  quote: string;
  education: Education[];
  location: string;
  email: string;
  phone: string;
  resume: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  icon: IconName;
}

export type ResearchVisual = 'mpc' | 'adaptive' | 'tracking' | 'optimal' | 'estimation';

export interface ResearchArea {
  id: string;
  index: string;
  title: string;
  titleEn: string;
  description: string;
  visual: ResearchVisual;
  /** hover 时显形的细节标注（工程彩蛋） */
  annotations: { label: string; value: string }[];
}

export type FigureType = 'highway' | 'urban' | 'parking' | 'dynamics' | 'error' | 'steering' | 'platoon';

export interface FigureSpec {
  type: FigureType;
  caption: string;
}

export interface EquationItem {
  /** 公式编号，如 "(1)"，可为空 */
  label?: string;
  /** KaTeX 字符串 */
  tex: string;
  note?: string;
}

export interface ModelBlock {
  title: string;
  equations: EquationItem[];
  params?: { name: string; value: string; note?: string }[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  titleEn: string;
  summary: string;
  tags: string[];
  role: string;
  period: string;
  /** 项目卡片主图（技术图形） */
  figure: FigureSpec;
  detail: {
    background: string;
    problem: string;
    objectives: string[];
    approach: { title: string; body: string }[];
    /** 系统架构：串级 block + 反馈 */
    architecture: { blocks: { label: string; sub?: string }[]; feedbackLabel: string };
    models: ModelBlock[];
    pipeline: { title: string; body: string }[];
    results: {
      summary: string;
      metrics: { label: string; value: string; note?: string }[];
      figures: FigureSpec[];
      figureNotes: string[];
    };
    challenges: { title: string; body: string }[];
    outcome: string[];
  };
}

/** 技术成果（替代论文列表，数据来自真实项目里程碑） */
export interface Achievement {
  index: string;
  title: string;
  detail: string;
  year: string;
  tag: string;
}

export interface Skill {
  name: string;
  level: number;
  note?: string;
}

export interface Tool {
  name: string;
  monogram: string;
  category: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  /** 有完整正文（blogArticles.ts 中有对应条目）—— 博客列表据此渲染为可点击项 */
  hasArticle?: boolean;
}

/** 文章正文块 —— blogArticles.ts 与 BlogPostPage 的契约 */
export type ArticleBlock =
  /** 正文段落；支持 **加粗** 与 $行内公式$ 标记 */
  | { type: 'para'; text: string }
  | { type: 'heading'; text: string; en: string }
  | { type: 'equation'; tex: string; label?: string; note?: string }
  | { type: 'figure'; src: string; caption: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption: string }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'references'; items: string[] };

/** 有正文的博客文章（slug 对应 blogPosts 中的一项） */
export interface ArticleDoc {
  blocks: ArticleBlock[];
}
