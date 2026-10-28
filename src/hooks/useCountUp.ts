import { useEffect, useState } from 'react';

/**
 * 数字计数动画：进入视口后从 0 缓动至目标值。
 * 尊重 prefers-reduced-motion：直接返回目标值。
 */
export function useCountUp(target: number, active: boolean, duration = 1500, reduce = false): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);

  return value;
}
