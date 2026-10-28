import { motion } from 'framer-motion';
import { EASE } from '@/theme/animation';

const Y = 100;

/** 信号传递路径（按顺序：r → Σ → C(s) → P(s) → y） */
const WIRE_MAIN = [
  'M 150 100 H 206',
  'M 236 100 H 290',
  'M 352 100 H 402',
  'M 470 100 H 556',
] as const;
const WIRE_FEEDBACK = 'M 520 100 V 150 H 222 V 119';

/**
 * 经典负反馈控制框图（第三视觉层）：
 * 载入时按信号流方向绘制，随后控制量以恒速沿回路流动。
 */
export function ControlDiagram({ reduce, delay }: { reduce: boolean; delay: number }) {
  const wireAnim = (i: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.7, delay: delay + i * 0.09, ease: EASE.precise },
        };

  const fade = (d: number) =>
    reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: d } };

  return (
    <g>
      {/* 主通路 */}
      {WIRE_MAIN.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="var(--color-hero-text)"
          strokeOpacity={0.55}
          strokeWidth={1.1}
          {...wireAnim(i)}
        />
      ))}
      {/* 反馈回路 */}
      <motion.path
        d={WIRE_FEEDBACK}
        fill="none"
        stroke="var(--color-hero-text-secondary)"
        strokeOpacity={0.5}
        strokeWidth={1}
        strokeDasharray="3 3"
        {...wireAnim(WIRE_MAIN.length)}
      />

      {/* 求和点 Σ */}
      <motion.g {...fade(delay + 0.1)}>
        <circle cx={222} cy={Y} r={14} fill="var(--color-hero-background)" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={1.1} />
        <path d="M 215.5 100 h 13 M 222 93.5 v 13" stroke="var(--color-hero-text)" strokeOpacity={0.75} strokeWidth={1} />
        <text x={228} y={90} className="font-mono" fontSize={9} fill="var(--color-hero-text-secondary)">+</text>
        <text x={229} y={127} className="font-mono" fontSize={10} fill="var(--color-hero-text-secondary)">−</text>
      </motion.g>

      {/* 控制器 / 被控对象 */}
      {[
        { x: 292, w: 60, label: 'C(s)', sub: 'CONTROLLER' },
        { x: 402, w: 68, label: 'P(s)', sub: 'VEHICLE' },
      ].map((b, i) => (
        <motion.g key={b.label} {...fade(delay + 0.3 + i * 0.12)}>
          <rect x={b.x} y={76} width={b.w} height={48} rx={2} fill="var(--color-accent-soft)" fillOpacity={0.45} stroke="var(--color-hero-text)" strokeOpacity={0.55} strokeWidth={1.1} />
          <text x={b.x + b.w / 2} y={104} textAnchor="middle" className="font-serif italic" fontSize={14.5} fill="var(--color-hero-text)">{b.label}</text>
          <text x={b.x + b.w / 2} y={70} textAnchor="middle" className="font-mono" fontSize={7.5} letterSpacing={2} fill="var(--color-hero-text-secondary)">{b.sub}</text>
        </motion.g>
      ))}

      {/* 信号标注 */}
      <motion.g {...fade(delay + 0.55)}>
        <text x={142} y={94} textAnchor="end" className="font-serif italic" fontSize={12.5} fill="var(--color-hero-text-secondary)">r</text>
        <text x={263} y={92} textAnchor="middle" className="font-serif italic" fontSize={11.5} fill="var(--color-hero-text-secondary)">e</text>
        <text x={377} y={92} textAnchor="middle" className="font-serif italic" fontSize={11.5} fill="var(--color-hero-text-secondary)">u</text>
        <text x={566} y={104} className="font-serif italic" fontSize={12.5} fill="var(--color-hero-text-secondary)">y</text>
        <path d="M 552 100 l -6 -3.2 v 6.4 Z" fill="var(--color-hero-text)" fillOpacity={0.6} />
        <path d="M 222 119 l -4 7 h 8 Z" fill="var(--color-hero-text-secondary)" fillOpacity={0.7} />
        <circle cx={520} cy={100} r={2.2} fill="var(--color-hero-text)" fillOpacity={0.7} />
        <text x={371} y={164} textAnchor="middle" className="font-mono" fontSize={8.5} letterSpacing={1.5} fill="var(--color-hero-text-secondary)" opacity={0.75}>
          closed-loop · 50 Hz
        </text>
      </motion.g>

      {/* 流动的控制信号（环境动画） */}
      {!reduce && (
        <>
          <motion.circle
            r={2.3}
            fill="var(--color-accent-strong)"
            animate={{ cx: [150, 292, 404, 556], cy: [Y, Y, Y, Y] }}
            transition={{ duration: 5.2, times: [0, 0.38, 0.68, 1], ease: 'linear', repeat: Infinity, delay: delay + 1.1 }}
            opacity={0.95}
          />
          <motion.circle
            r={1.8}
            fill="var(--color-hero-text-secondary)"
            animate={{ cx: [520, 520, 222, 222], cy: [Y, 150, 150, 119] }}
            transition={{ duration: 4.2, times: [0, 0.32, 0.72, 1], ease: 'linear', repeat: Infinity, delay: delay + 2.4 }}
            opacity={0.8}
          />
        </>
      )}
    </g>
  );
}
