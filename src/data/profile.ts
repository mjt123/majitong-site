import type { Profile, Stat } from '@/types';

export const profile: Profile = {
  name: '马冀桐',
  nameEn: 'Ma Jitong',
  title: '自动驾驶规控算法工程师',
  tagline: [
    '专注于自动驾驶决策规划与控制算法研究',
    '致力于让每一次决策更安全、更平稳、更可量产',
  ],
  keywords: [
    { label: '理论驱动', icon: 'function' },
    { label: '工程落地', icon: 'chip' },
    { label: '量产验证', icon: 'target' },
  ],
  intro: [
    '硕士，7 年自动驾驶规控算法研发经验，现任吉利量产车型 ICC/NOA 规控模块负责人，带领 6 人小组负责决策、规划、控制与地图处理的技术攻关与迭代。',
    '擅长横向控制（LQR + 前馈 PID 双环）、纵向规划（贝塞尔凸包 QP）、换道决策与环境认知建模；熟悉 EM-Planner、Lattice、Piecewise-Jerk 等规划算法与 MPC / LQR / PID 控制。',
    '从高速公路预研到港口无人集卡、商用车队列驾驶，坚持把算法做成「可量产、可验证、可迭代」的工程系统，并将高速场景横向偏差控制在 ±0.2 m。',
    '近期研究：基于 acados 的非线性横向控制算法开发，以及使用松弛因子解决纵向 NMPC 中的求解失败问题。',
  ],
  quote:
    '具备较强的问题分析与解决能力，自我激励、愿意承担挑战——把每一个工程难题拆解为可建模、可验证、可落地的规控问题。',
  education: [
    { period: '2016.09 — 2019.06', school: '重庆理工大学', degree: '硕士', major: '机械设计及理论' },
    { period: '2011.09 — 2015.06', school: '辽宁石油化工大学', degree: '本科', major: '机械设计制造及其自动化' },
  ],
  location: '中国 · 天津',
  email: 'mjt0419@163.com',
  phone: '17774915304',
  resume: '/resume.pdf',
};

/** 数据统计 —— 均来自真实履历，修改数字即可，组件自动做计数动画 */
export const stats: Stat[] = [
  { value: 7, suffix: '+', label: '年工作经验', sub: '决策规划与控制', icon: 'briefcase' },
  { value: 4, suffix: '+', label: '项目经验', sub: '量产 · 预研 · 港口 · 队列', icon: 'layers' },
  { value: 6, suffix: ' 人', label: '团队规模', sub: '规控小组负责人', icon: 'nodes' },
  { value: 1, suffix: ' 个', label: '车型定点', sub: '吉利睿蓝 ICC/NOA', icon: 'award' },
];
