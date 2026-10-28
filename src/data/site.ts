import type { NavItem } from '@/types';

export const siteConfig = {
  nav: [
    { id: 'home', label: '首页' },
    { id: 'about', label: '关于我' },
    { id: 'research', label: '研究方向' },
    { id: 'projects', label: '项目实践' },
    { id: 'achievements', label: '技术成果' },
    { id: 'blog', label: '技术博客' },
    { id: 'tools', label: '资源分享' },
    { id: 'contact', label: '联系我' },
    { id: 'art', label: '艺术', path: '/art' },
    { id: 'travel', label: '足迹', path: '/travel' },
  ] as NavItem[],

  hero: {
    titleLine1: '决策 · 规划 · 控制',
    titleLine2: '让自动驾驶安全平顺地落地',
  },

  footer: {
    signature: ['算法为骨，理论为魂', '控制为笔，安全为尺'],
    watermark: 'J = \\int_0^{\\infty} \\left( x^{\\mathsf T} Q x + u^{\\mathsf T} R u \\right) dt',
    copyright: `© ${new Date().getFullYear()} 马冀桐 · Ma Jitong`,
    note: 'Built with control theory & engineering rigor',
  },
};
