import type { ResearchArea } from '@/types';

/** 研究方向 —— 「规划 + 控制」双主线，均对应真实项目实践 */
export const researchAreas: ResearchArea[] = [
  {
    id: 'mpc',
    index: '01',
    title: '非线性模型预测控制',
    titleEn: 'Nonlinear MPC · acados',
    description: '近期研究：基于 acados 的非线性横向控制算法开发（SQP / RTI 实时迭代），并以松弛因子解决纵向 NMPC 的求解失败问题。',
    visual: 'mpc',
    annotations: [
      { label: 'Solver', value: 'acados · SQP/RTI' },
      { label: 'Feasibility', value: 'slack 松弛因子' },
    ],
  },
  {
    id: 'tracking',
    index: '02',
    title: '横向控制与轨迹跟踪',
    titleEn: 'Lateral Control & Tracking',
    description: 'LQR 角度环 + 前馈 PID 扭矩环的双环方案，含方向盘转角估算，高速场景横向偏差 ±0.2 m。',
    visual: 'tracking',
    annotations: [
      { label: 'Lateral', value: '±0.2 m' },
      { label: 'Scheme', value: 'LQR + FF·PID' },
    ],
  },
  {
    id: 'planning',
    index: '03',
    title: '轨迹规划与数值优化',
    titleEn: 'Motion Planning & Optimization',
    description: '贝塞尔凸包性质建立 QP 模型、五次多项式 BVP；熟悉 EM-Planner / Lattice / Piecewise-Jerk。',
    visual: 'optimal',
    annotations: [
      { label: 'QP', value: '贝塞尔凸包' },
      { label: 'BVP', value: '五次多项式' },
    ],
  },
  {
    id: 'adaptive',
    index: '04',
    title: '参数辨识与自适应',
    titleEn: 'Parameter Identification & Adaptation',
    description: '最小二乘在线辨识侧偏角与 roll 补偿系数，参数摄动下保持控制精度。',
    visual: 'adaptive',
    annotations: [
      { label: 'Method', value: '最小二乘' },
      { label: 'Est', value: 'β / roll' },
    ],
  },
  {
    id: 'cognition',
    index: '05',
    title: '环境认知与风险建模',
    titleEn: 'Environment Cognition & Risk',
    description: '对周边障碍物进行结构化建模并建立风险系数，为决策与规划提供“理解后”的信息。',
    visual: 'estimation',
    annotations: [
      { label: 'Model', value: '结构化建模' },
      { label: 'Risk', value: '风险系数' },
    ],
  },
];
