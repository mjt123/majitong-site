/**
 * 全站动画参数中心 —— 「慢、稳、精确」。
 * 所有 Framer Motion 过渡 / 序列延迟均从此处取值，禁止在组件内散落魔法数。
 */
export const EASE = {
  /** 主缓动：快出缓收，克制而精确 */
  precise: [0.22, 1, 0.36, 1] as const,
  /** 匀速：用于信号流动等连续运动 */
  linear: [0, 0, 1, 1] as const,
};

export const DURATION = {
  micro: 0.25,
  fast: 0.4,
  base: 0.7,
  slow: 1.2,
  /** Hero 入场序列单步 */
  heroStep: 0.9,
} as const;

export const STAGGER = 0.09;

/** 滚动显现通用变体 */
export const revealVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.precise },
  },
};

/** Hero 入场序列（秒）—— Logo/导航之后，视觉元素按「公式 → 框图 → 轨迹 → 车辆」依次进入 */
export const heroSequence = {
  kicker: 0.15,
  titleL1: 0.28,
  titleL2: 0.42,
  body: 0.58,
  keywords: 0.72,
  cta: 0.86,
  equations: 1.0,
  diagram: 1.15,
  trajectory: 1.5,
  vehicle: 1.9,
  ambient: 2.4,
} as const;
