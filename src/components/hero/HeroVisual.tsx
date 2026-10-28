import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { EASE, heroSequence } from '@/theme/animation';
import { Tex } from '@/components/ui/Tex';
import { gridLines, lidarPoints, ROAD, SCENE, surfaceMesh, TRAJECTORY } from '@/utils/scene';
import { ControlDiagram } from './ControlDiagram';
import { VehicleFigure } from './VehicleFigure';

const LIDAR = lidarPoints();
const MESH = surfaceMesh(565, 240, 26, 13, 30);

/** 极淡的公式层（第三视觉层）—— 逐行显现 + 缓慢呼吸 */
const FORMULAS = [
  { tex: '\\dot{x} = A x + B u', breathe: 0 },
  { tex: 'y = C x + D u', breathe: 1.4 },
  { tex: 'J = \\int_0^{\\infty} \\left( x^{\\mathsf{T}} Q x + u^{\\mathsf{T}} R u \\right) dt', breathe: 2.8 },
];

function FormulaOverlay({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-[1%] left-0 hidden select-none sm:block">
      {FORMULAS.map((f, i) => (
        <motion.div
          key={f.tex}
          className="eq-breathe text-[13px] text-hero-text"
          style={reduce ? { opacity: 0.42 } : { animationDelay: `${f.breathe}s` }}
          {...(reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 0.42, y: 0 }, transition: { duration: 1.2, delay: heroSequence.equations + i * 0.2, ease: EASE.precise } })}
        >
          <Tex tex={f.tex} />
        </motion.div>
      ))}
      <motion.div
        className="mt-2 text-[14.5px] text-accent-strong"
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 0.92 }, transition: { duration: 1.4, delay: heroSequence.equations + 0.75 } })}
        style={reduce ? { opacity: 0.92 } : undefined}
      >
        <Tex tex={'u^{*} = \\arg\\min J'} />
      </motion.div>
    </div>
  );
}

/** Hero 右侧：自动驾驶控制系统的数字艺术化表达（四层视觉层级） */
export function HeroVisual() {
  const reduce = useReducedMotion() ?? false;
  const grid = gridLines();

  const fadeGroup = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.6, delay, ease: 'easeOut' as const } };

  type StrokeStyle = Pick<
    React.SVGAttributes<SVGPathElement>,
    'stroke' | 'strokeOpacity' | 'strokeWidth' | 'strokeDasharray' | 'strokeLinecap' | 'className' | 'fill'
  >;
  const drawPath = (d: string, delay: number, extra: StrokeStyle) =>
    reduce ? (
      <path d={d} {...extra} />
    ) : (
      <motion.path d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, delay, ease: EASE.precise }} {...extra} />
    );

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="控制框图、参考轨迹与车辆动力学的系统示意"
      >
        <defs>
          <radialGradient id="zmy-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-hero-glow)" />
            <stop offset="100%" stopColor="var(--color-hero-glow)" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="zmy-horizon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* 第四层：工程网格 / 光晕 / 雷达环 / LiDAR 点云 / 代价曲面 */}
        <g stroke="var(--color-hero-line)" strokeOpacity={0.4} strokeWidth={0.6}>
          {grid.v.map((d) => <path key={`v${d}`} d={d} />)}
          {grid.h.map((d) => <path key={`h${d}`} d={d} />)}
        </g>
        <ellipse cx={200} cy={180} rx={280} ry={200} fill="url(#zmy-glow)" opacity={0.55} />
        <ellipse cx={600} cy={430} rx={300} ry={200} fill="url(#zmy-glow)" opacity={0.4} />

        <motion.g {...fadeGroup(heroSequence.ambient)}>
          {/* 雷达环 */}
          <ellipse cx={540} cy={330} rx={235} ry={80} fill="none" stroke="var(--color-hero-line)" strokeWidth={0.9} strokeDasharray="2 6" opacity={0.8} />
          <ellipse cx={540} cy={330} rx={152} ry={52} fill="none" stroke="var(--color-hero-line)" strokeWidth={0.8} strokeDasharray="2 6" opacity={0.6} />
          {/* LiDAR 点云（缓慢漂移） */}
          <g className={reduce ? undefined : 'ambient-drift'}>
            {LIDAR.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i % 4 === 0 ? 'var(--color-accent-strong)' : 'var(--color-hero-text)'} opacity={p.o} />
            ))}
          </g>
          {/* 最优控制代价曲面 J(x₁, x₂) */}
          <g fill="none" stroke="var(--color-accent)" strokeOpacity={0.28} strokeWidth={0.6}>
            {MESH.map((d, i) => <path key={i} d={d} />)}
          </g>
          <circle cx={565} cy={253} r={1.8} fill="var(--color-gold)" opacity={0.9} />
          <text x={590} y={218} className="font-mono" fontSize={8.5} fill="var(--color-hero-text-secondary)" opacity={0.65}>J(x₁, x₂)</text>
        </motion.g>

        {/* 道路（第二层背景） */}
        <motion.g {...fadeGroup(heroSequence.trajectory - 0.2)} fill="none">
          <path d={ROAD.railTop} stroke="var(--color-hero-text)" strokeOpacity={0.2} strokeWidth={1} />
          <path d={ROAD.railBottom} stroke="var(--color-hero-text)" strokeOpacity={0.2} strokeWidth={1} />
          <path
            d={ROAD.center}
            stroke="var(--color-hero-text-secondary)"
            strokeOpacity={0.42}
            strokeWidth={1.1}
            strokeDasharray="1.5 13"
            className={reduce ? undefined : 'flow-dash-slow'}
          />
        </motion.g>

        {/* 第二层：预测时域 + 参考轨迹 / 实际轨迹 + 误差标注 */}
        <motion.g {...fadeGroup(heroSequence.trajectory - 0.1)}>
          <rect x={TRAJECTORY.horizon.x} y={TRAJECTORY.horizon.y1} width={172} height={TRAJECTORY.horizon.y2 - TRAJECTORY.horizon.y1} fill="url(#zmy-horizon)" />
          <path d={`M ${TRAJECTORY.horizon.x} ${TRAJECTORY.horizon.y1} V ${TRAJECTORY.horizon.y2}`} stroke="var(--color-accent-strong)" strokeOpacity={0.4} strokeWidth={0.9} strokeDasharray="4 4" />
          <text x={TRAJECTORY.horizon.x + 6} y={TRAJECTORY.horizon.y1 + 12} className="font-mono" fontSize={8.5} letterSpacing={1} fill="var(--color-hero-text-secondary)" opacity={0.75}>
            prediction horizon · Np
          </text>
        </motion.g>
        <g fill="none">
          {drawPath(TRAJECTORY.ref, heroSequence.trajectory, {
            stroke: 'var(--color-hero-text)',
            strokeOpacity: 0.55,
            strokeWidth: 1.2,
            strokeDasharray: '6 5',
            className: reduce ? undefined : 'flow-dash',
          })}
          {drawPath(TRAJECTORY.actual, heroSequence.trajectory + 0.15, {
            stroke: 'var(--color-accent-strong)',
            strokeWidth: 1.9,
            strokeLinecap: 'round',
          })}
        </g>
        <motion.g {...fadeGroup(heroSequence.trajectory + 0.5)}>
          {TRAJECTORY.ticks.map((t, i) => (
            <g key={t.x}>
              <path d={`M ${t.x} ${t.y1} V ${t.y2}`} stroke="var(--color-accent-strong)" strokeWidth={1} opacity={0.75} />
              <circle cx={t.x} cy={t.y1} r={1.4} fill="var(--color-hero-text)" opacity={0.7} />
              <circle cx={t.x} cy={t.y2} r={1.4} fill="var(--color-accent-strong)" />
              {i === 1 && (
                <text x={t.x - 7} y={t.y1 - 6} textAnchor="end" className="font-serif italic" fontSize={11} fill="var(--color-accent-strong)">e_y</text>
              )}
            </g>
          ))}
          <text x={34} y={478} className="font-mono" fontSize={8.5} letterSpacing={1.2} fill="var(--color-hero-text-secondary)" opacity={0.7}>
            <tspan fill="var(--color-hero-text)">– –</tspan> x_ref
            <tspan dx={14} fill="var(--color-accent-strong)">——</tspan> x
          </text>
        </motion.g>

        {/* 第三层：控制框图 */}
        <ControlDiagram reduce={reduce} delay={heroSequence.diagram} />

        {/* 第一层：车辆 */}
        <g transform={`translate(${SCENE.car.tx} ${SCENE.car.ty}) scale(${SCENE.car.s})`}>
          <VehicleFigure reduce={reduce} delay={heroSequence.vehicle} />
        </g>
      </svg>

      {/* 数学公式层（HTML / KaTeX） */}
      <FormulaOverlay reduce={reduce} />
    </div>
  );
}
