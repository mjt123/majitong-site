import type { Skill } from '@/types';

/** level 为 0–100，进度线动画按数据驱动 */
export const skills: Skill[] = [
  { name: '横向控制', level: 95, note: 'LQR / PID / NMPC·acados' },
  { name: 'C++ / Python', level: 90, note: '工程化与算法原型' },
  { name: '轨迹规划', level: 88, note: 'EM / Lattice / Piecewise-Jerk' },
  { name: '曲线建模', level: 86, note: '多项式 / 贝塞尔凸包 QP' },
  { name: '车辆动力学与建模', level: 85, note: '建模 / 辨识 / 补偿' },
  { name: '决策系统设计', level: 85, note: 'FSM / HFSM / 风险建模' },
  { name: 'MATLAB / Simulink', level: 80, note: '建模 / 仿真 / MIL' },
  { name: 'Git / Docker', level: 78, note: '协作 / 部署' },
];
