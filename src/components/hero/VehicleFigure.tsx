import { motion } from 'framer-motion';

/** 车轮辐条（局部坐标） */
function spokes(cx: number, cy: number, r: number): string[] {
  return [0, 72, 144, 216, 288].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return `M ${cx + 3 * Math.cos(rad)} ${cy + 3 * Math.sin(rad)} L ${cx + r * Math.cos(rad)} ${cy + r * Math.sin(rad)}`;
  });
}

function Wheel({ cx, cy, spin, reduce }: { cx: number; cy: number; spin: boolean; reduce: boolean }) {
  const spokePaths = spokes(cx, cy, 13.5).join(' ');
  return (
    <g>
      {/* 轮胎 */}
      <circle cx={cx} cy={cy} r={24} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.65} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={20.5} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.22} strokeWidth={0.8} />
      {/* 旋转的轮辐 */}
      <g className={spin && !reduce ? 'svg-spin-slow' : undefined}>
        <circle cx={cx} cy={cy} r={14} fill="none" stroke="var(--color-accent-strong)" strokeOpacity={0.85} strokeWidth={1.1} />
        <path d={spokePaths} stroke="var(--color-accent-strong)" strokeOpacity={0.7} strokeWidth={1} fill="none" />
      </g>
      <circle cx={cx} cy={cy} r={3.2} fill="var(--color-accent-strong)" />
    </g>
  );
}

/**
 * Hero 主体：线框车辆侧视图（334 × 130 局部坐标）。
 * 常显标注：v（车速）、δ（前轮转角）、金色质心标记；
 * hover 彩蛋：r / β / a_y 车辆状态变量显形。
 */
export function VehicleFigure({ reduce, delay }: { reduce: boolean; delay: number }) {
  const enter = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 64 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

  const labelProps = {
    className: 'font-serif italic',
    fill: 'var(--color-hero-text)',
    fontSize: 12.5,
    opacity: 0.85,
  } as const;

  const monoProps = {
    className: 'font-mono',
    fill: 'var(--color-hero-text-secondary)',
    fontSize: 9.5,
  } as const;

  return (
    <motion.g {...enter} className="group/car">
      <defs>
        <linearGradient id="zmy-underglow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent-strong)" stopOpacity={0} />
          <stop offset="0.5" stopColor="var(--color-accent-strong)" stopOpacity={0.75} />
          <stop offset="1" stopColor="var(--color-accent-strong)" stopOpacity={0} />
        </linearGradient>
        <filter id="zmy-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* 地面阴影与底盘微光 */}
      <ellipse cx={168} cy={124} rx={148} ry={7} fill="var(--color-hero-background)" opacity={0.6} filter="url(#zmy-soft)" />
      <rect x={34} y={112} width={266} height={1.6} fill="url(#zmy-underglow)" filter="url(#zmy-soft)" />

      {/* 车身主轮廓 —— 单一连续剪影 */}
      <path
        d="M 8 86 C 3 78, 6 68, 16 64 C 38 58, 62 55, 86 53 C 102 52, 112 49, 124 41 C 142 29, 162 24, 190 24 L 218 25 C 246 27, 264 34, 284 47 C 298 56, 312 61, 322 63 C 330 65, 333 73, 331 80 C 330 86, 323 90, 314 90 L 288 90 A 31 31 0 0 0 232 90 L 96 90 A 31 31 0 0 0 40 90 L 16 90 C 10 90, 8 88, 8 86 Z"
        fill="var(--color-accent-soft)"
        fillOpacity={0.35}
        stroke="var(--color-accent-strong)"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />

      {/* 侧窗 DLO + B 柱 */}
      <path
        d="M 132 43 C 148 32, 166 27.5, 191 27.5 L 213 28.5 C 235 30.5, 251 36.5, 264 47 L 244 50 C 214 48.5, 162 48.5, 147 50.5 Z"
        fill="var(--color-accent-soft)"
        stroke="var(--color-hero-text)"
        strokeOpacity={0.55}
        strokeWidth={1.1}
      />
      <path d="M 193 28 L 197 49.5" stroke="var(--color-hero-text)" strokeOpacity={0.5} strokeWidth={1} />

      {/* 腰线 / 门缝 / 把手 / 后视镜 */}
      <path d="M 28 58 C 92 54.5, 210 51, 302 62" fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.35} strokeWidth={0.9} />
      <path d="M 150 52 C 149 64, 149 76, 151 88" fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.3} strokeWidth={0.9} />
      <path d="M 224 51 C 223 64, 223 76, 225 88" fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.3} strokeWidth={0.9} />
      <path d="M 200 60.5 h 13" stroke="var(--color-hero-text)" strokeOpacity={0.5} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M 128 41 l -8.5 -3 l 5.5 -2.2 Z" fill="var(--color-accent-strong)" fillOpacity={0.8} />

      {/* 灯组 */}
      <path d="M 11 64 L 30 60.5" stroke="var(--color-hero-text)" strokeOpacity={0.95} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={14.5} cy={62.8} r={2.4} fill="var(--color-accent-strong)" filter="url(#zmy-soft)" />
      <path d="M 331 68 L 323 66" stroke="var(--color-gold)" strokeOpacity={0.9} strokeWidth={2.2} strokeLinecap="round" />

      {/* 侧裙 */}
      <path d="M 106 94.5 H 222" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={0.9} />

      {/* 车轮 */}
      <Wheel cx={68} cy={100} spin reduce={reduce} />
      <Wheel cx={260} cy={100} spin reduce={reduce} />

      {/* —— 常显标注 —— */}
      {/* 车速 v */}
      <path d="M -34 64 H -10" stroke="var(--color-hero-text-secondary)" strokeWidth={1.1} opacity={0.9} />
      <path d="M -12 60 L -5 64 L -12 68" fill="none" stroke="var(--color-hero-text-secondary)" strokeWidth={1.1} opacity={0.9} />
      <text x={-44} y={68.5} {...labelProps}>v</text>
      {/* 前轮转角 δ */}
      <path d="M 44 76 A 28 28 0 0 1 56 66" fill="none" stroke="var(--color-hero-text-secondary)" strokeWidth={1} strokeDasharray="2.5 2.5" opacity={0.85} />
      <text x={34} y={72} {...labelProps}>δ</text>
      {/* 质心（金色） */}
      <path d="M 160 74 h 16 M 168 66 v 16" stroke="var(--color-gold)" strokeWidth={1} opacity={0.9} />
      <circle cx={168} cy={74} r={2.8} fill="var(--color-gold)" />

      {/* —— hover 彩蛋：车辆状态变量 —— */}
      <g className="egg-label">
        {/* 横摆角速度 r */}
        <path d="M 182 64 A 15 15 0 0 1 196 80" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.1} />
        <path d="M 193 76 L 197 82 L 189.5 82.5" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.1} />
        <text x={200} y={74} {...labelProps}>r</text>
        <text x={200} y={86} {...monoProps} opacity={0.8}>yaw rate</text>
      </g>
      <g className="egg-label" style={{ transitionDelay: '80ms' }}>
        {/* 质心侧偏角 β */}
        <path d="M 142 60 A 30 30 0 0 1 158 54" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.1} />
        <text x={134} y={56} {...labelProps}>β</text>
        <text x={124} y={44} {...monoProps} opacity={0.8}>slip angle</text>
      </g>
      <g className="egg-label" style={{ transitionDelay: '160ms' }}>
        {/* 侧向加速度 a_y */}
        <path d="M 172 18 V 5" stroke="var(--color-accent-strong)" strokeWidth={1.1} />
        <path d="M 168 8 L 172 2.5 L 176 8" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.1} />
        <text x={180} y={12} {...labelProps}>a_y</text>
      </g>
    </motion.g>
  );
}
