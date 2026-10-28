/** 01 MPC —— 预测时域内的参考轨迹与预测轨迹（hover：预测序列滚动生成） */
export function MPCVisual() {
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full select-none" aria-hidden="true">
      {/* 坐标轴 */}
      <g stroke="var(--color-border-strong)" strokeWidth={0.8} fill="none">
        <path d="M 20 12 V 92 H 205" />
        <path d="M 20 92 l 3 -5 M 20 92 l 5 3" />
      </g>
      {/* 预测时域 */}
      <rect x={62} y={18} width={92} height={74} fill="var(--color-accent-soft)" className="rv-anim rv-pulse" />
      <path d="M 154 18 V 92" stroke="var(--color-accent)" strokeOpacity={0.5} strokeWidth={0.8} strokeDasharray="3 3" />
      <text x={66} y={26} className="font-mono" fontSize={7.5} fill="var(--color-accent)">Np</text>
      {/* 参考轨迹 */}
      <path d="M 26 74 C 70 66, 120 50, 200 34" fill="none" stroke="var(--color-text-tertiary)" strokeWidth={1} strokeDasharray="4 3" />
      <text x={196} y={28} textAnchor="end" className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">ref</text>
      {/* 预测轨迹（hover 时流动） */}
      <path
        d="M 64 70 C 92 63, 122 55, 152 47"
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth={1.6}
        strokeLinecap="round"
        className="rv-anim rv-flow"
      />
      <g fill="var(--color-accent-strong)">
        <circle cx={86} cy={64} r={1.8} opacity={0.9} />
        <circle cx={112} cy={57.5} r={1.6} opacity={0.65} />
        <circle cx={136} cy={51} r={1.4} opacity={0.4} />
      </g>
      <text x={120} y={44} textAnchor="middle" className="font-mono" fontSize={7} fill="var(--color-accent-strong)">pred</text>
      {/* 优化目标 */}
      <circle cx={152} cy={47} r={2.2} fill="var(--color-gold)" />
      <text x={158} y={60} className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">min J</text>
      {/* 时刻刻度 */}
      <g className="font-mono" fontSize={6.5} fill="var(--color-text-tertiary)">
        <text x={22} y={102}>t</text>
        <text x={64} y={102}>t_k</text>
        <text x={148} y={102}>t_k+Np</text>
      </g>
    </svg>
  );
}

/** 02 自适应与鲁棒控制 —— 反馈回路 + 参数自适应（hover：信号流动，θ̂ 曲线生长） */
export function AdaptiveVisual() {
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full select-none" aria-hidden="true">
      {/* 主回路 */}
      <g fill="none" strokeWidth={1} stroke="var(--color-text-tertiary)" className="rv-anim rv-flow">
        <path d="M 14 52 H 40" strokeDasharray="4 3" />
        <path d="M 76 52 H 118" strokeDasharray="4 3" />
        <path d="M 164 52 H 204" strokeDasharray="4 3" />
        <path d="M 204 52 V 84 H 30 V 62" strokeDasharray="4 3" />
      </g>
      {/* 求和点 */}
      <circle cx={30} cy={52} r={9} fill="var(--color-surface-elevated)" stroke="var(--color-text-tertiary)" strokeWidth={1} />
      <path d="M 26 52 h 8 M 30 48 v 8" stroke="var(--color-text-secondary)" strokeWidth={0.9} />
      {/* 控制器 / 被控对象 */}
      <g>
        <rect x={40} y={38} width={36} height={28} rx={1.5} fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeOpacity={0.55} strokeWidth={1} />
        <text x={58} y={55} textAnchor="middle" className="font-serif italic" fontSize={9.5} fill="var(--color-text-primary)">K(θ̂)</text>
        <rect x={118} y={38} width={46} height={28} rx={1.5} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={1} />
        <text x={141} y={55} textAnchor="middle" className="font-serif italic" fontSize={9.5} fill="var(--color-text-primary)">Plant</text>
      </g>
      {/* 自适应机构 */}
      <rect x={96} y={78} width={54} height={20} rx={1.5} fill="none" stroke="var(--color-border-strong)" strokeWidth={0.9} strokeDasharray="3 2" />
      <text x={123} y={90.5} textAnchor="middle" className="font-serif italic" fontSize={9} fill="var(--color-text-secondary)">θ̂ adapt</text>
      <path d="M 58 78 V 66" stroke="var(--color-border-strong)" strokeWidth={0.9} strokeDasharray="2.5 2.5" />
      <path d="M 58 67 l -2.5 4.5 h 5 Z" fill="var(--color-text-tertiary)" />
      <path d="M 150 78 V 70 H 96 V 78" fill="none" stroke="var(--color-border-strong)" strokeWidth={0.8} strokeDasharray="2.5 2.5" opacity={0.7} />
      {/* 参数收敛曲线（hover 生长） */}
      <path
        d="M 100 94 C 112 93, 122 87, 146 82.5"
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth={1.3}
        className="rv-anim rv-draw"
        style={{ ['--rv-len' as string]: 60 }}
      />
      {/* 标注 */}
      <text x={12} y={44} className="font-serif italic" fontSize={8.5} fill="var(--color-text-tertiary)">r</text>
      <text x={206} y={46} className="font-serif italic" fontSize={8.5} fill="var(--color-text-tertiary)">y</text>
      <text x={112} y={30} className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">θ̂ → θ*</text>
    </svg>
  );
}

/** 03 轨迹跟踪 —— Reference / Actual 偏差与误差带（hover：双曲线绘制，误差标注脉冲） */
export function TrackingVisual() {
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full select-none" aria-hidden="true">
      <g stroke="var(--color-border-strong)" strokeWidth={0.8} fill="none">
        <path d="M 18 14 V 90 H 206" />
      </g>
      {/* 误差带 */}
      <path
        d="M 26 66 C 60 44, 96 40, 126 46 C 156 52, 182 42, 204 32 L 204 40 C 182 50, 156 60, 126 54 C 96 48, 62 52, 26 74 Z"
        fill="var(--color-accent-soft)"
        className="rv-anim rv-pulse"
      />
      {/* 参考轨迹 */}
      <path
        d="M 26 70 C 60 48, 96 44, 126 50 C 156 56, 182 46, 204 36"
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth={1.1}
        strokeDasharray="4 3"
        className="rv-anim rv-draw"
        style={{ ['--rv-len' as string]: 230 }}
      />
      {/* 实际轨迹 */}
      <path
        d="M 26 70 C 60 50, 96 46, 126 50 C 156 54, 182 48, 204 44"
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth={1.7}
        strokeLinecap="round"
        className="rv-anim rv-draw"
        style={{ ['--rv-len' as string]: 230, animationDelay: '0.5s' }}
      />
      {/* 误差刻度 */}
      <g stroke="var(--color-accent)" strokeWidth={1}>
        <path d="M 96 45.5 v 5" className="rv-anim rv-pulse" />
        <path d="M 150 55 v 5.5" className="rv-anim rv-pulse" style={{ animationDelay: '0.6s' }} />
        <path d="M 196 39.5 v 8" className="rv-anim rv-pulse" style={{ animationDelay: '1.1s' }} />
      </g>
      <text x={158} y={72} className="font-serif italic" fontSize={9} fill="var(--color-accent)">e_y</text>
      <text x={30} y={30} className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">ref – –</text>
      <text x={30} y={88} className="font-mono" fontSize={7} fill="var(--color-accent-strong)">actual ——</text>
    </svg>
  );
}

/** 04 最优控制 —— 代价等高线与梯度下降（hover：下降轨迹流动至 x*） */
export function OptimalVisual() {
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full select-none" aria-hidden="true">
      {/* 等高线族 */}
      <g fill="none" stroke="var(--color-border-strong)" strokeWidth={0.9}>
        <ellipse cx={148} cy={55} rx={13} ry={8} transform="rotate(-16 148 55)" />
        <ellipse cx={148} cy={55} rx={27} ry={17} transform="rotate(-16 148 55)" className="rv-anim rv-pulse" style={{ animationDelay: '0.4s' }} />
        <ellipse cx={148} cy={55} rx={41} ry={26} transform="rotate(-16 148 55)" opacity={0.7} />
        <ellipse cx={148} cy={55} rx={55} ry={35} transform="rotate(-16 148 55)" opacity={0.45} />
      </g>
      {/* 梯度下降轨迹 */}
      <path
        d="M 26 96 C 44 84, 52 92, 66 78 C 80 66, 88 74, 102 64 C 118 52, 126 58, 142 56"
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth={1.4}
        strokeDasharray="5 4"
        strokeLinecap="round"
        className="rv-anim rv-flow"
      />
      <path d="M 142 56 l -6 -1.5 m 6 1.5 l -5.5 3" stroke="var(--color-accent-strong)" strokeWidth={1.2} fill="none" />
      {/* 最优解 */}
      <circle cx={148} cy={55} r={2.4} fill="var(--color-gold)" />
      <text x={156} y={50} className="font-serif italic" fontSize={9.5} fill="var(--color-text-primary)">x*</text>
      <text x={26} y={26} className="font-mono" fontSize={7.5} fill="var(--color-text-tertiary)">J(x₁,x₂) contours</text>
      <text x={26} y={108} className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">u* = argmin J · ∇J → 0</text>
      {/* 坐标轴标签 */}
      <text x={196} y={102} className="font-serif italic" fontSize={8} fill="var(--color-text-tertiary)">x₂</text>
      <text x={26} y={20} className="font-serif italic" fontSize={8} fill="var(--color-text-tertiary)">x₁</text>
    </svg>
  );
}

/** 05 状态估计 —— 协方差椭圆收缩与多传感器融合（hover：椭圆呼吸，融合链路脉冲） */
export function EstimationVisual() {
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full select-none" aria-hidden="true">
      {/* 量测散点 */}
      <g fill="var(--color-accent)" opacity={0.55}>
        {[
          [138, 42], [148, 36], [158, 44], [144, 52], [156, 54], [150, 46], [140, 34], [164, 38], [134, 46], [162, 50],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.5} />
        ))}
      </g>
      {/* 协方差椭圆 */}
      <g fill="none" stroke="var(--color-text-tertiary)" strokeWidth={0.9} strokeDasharray="3 2.5">
        <ellipse cx={150} cy={45} rx={19} ry={10.5} transform="rotate(-18 150 45)" className="rv-anim rv-breathe-s" />
        <ellipse cx={150} cy={45} rx={32} ry={17} transform="rotate(-18 150 45)" opacity={0.6} className="rv-anim rv-breathe-s" style={{ animationDelay: '0.7s' }} />
      </g>
      {/* 融合估计 */}
      <g stroke="var(--color-accent-strong)" strokeWidth={1.2}>
        <path d="M 150 39.5 v 11 M 144.5 45 h 11" />
      </g>
      <circle cx={150} cy={45} r={3.4} fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.2} />
      {/* 传感器链路 */}
      <g className="font-mono" fontSize={7}>
        <rect x={22} y={26} width={30} height={14} rx={1.5} fill="none" stroke="var(--color-border-strong)" strokeWidth={0.9} />
        <text x={37} y={35.5} textAnchor="middle" fill="var(--color-text-secondary)">IMU</text>
        <rect x={22} y={64} width={30} height={14} rx={1.5} fill="none" stroke="var(--color-border-strong)" strokeWidth={0.9} />
        <text x={37} y={73.5} textAnchor="middle" fill="var(--color-text-secondary)">GPS</text>
      </g>
      <g stroke="var(--color-text-tertiary)" strokeWidth={0.8} strokeDasharray="3 2.5" fill="none" className="rv-anim rv-pulse">
        <path d="M 52 33 C 84 33, 108 38, 132 42" />
        <path d="M 52 71 C 84 71, 108 60, 132 50" style={{ animationDelay: '0.6s' }} />
      </g>
      <text x={150} y={82} textAnchor="middle" className="font-mono" fontSize={7} fill="var(--color-text-tertiary)">x̂, P (covariance)</text>
      <text x={26} y={16} className="font-mono" fontSize={7.5} fill="var(--color-text-tertiary)">EKF fusion</text>
    </svg>
  );
}
