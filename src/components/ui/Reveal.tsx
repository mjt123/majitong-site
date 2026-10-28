import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, DURATION } from '@/theme/animation';

/** 滚动显现容器：进入视口时淡入上移，仅播放一次 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduce ? { duration: 0 } : { duration: DURATION.base, delay, ease: EASE.precise }}
    >
      {children}
    </motion.div>
  );
}
