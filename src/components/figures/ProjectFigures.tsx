import type { FigureType } from '@/types';
import { smoothPath, type Pt } from '@/utils/path';

/**
 * 项目技术图形 —— 以「仿真输出图」为视觉主体（深色面板 + 细网格 + 曲线），
 * 代替素材照片，呼应「控制算法 > 汽车图片」的内容原则。
 * 全部为确定性绘制，坐标手工标定。
 */

const mono = {
  className: 'font-mono',
  fill: 'var(--color-hero-text-secondary)',
  fontSize: 8.5,
} as const;

function Panel({ w = 400, h = 230, children }: { w?: number; h?: number; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full select-none" role="img" aria-hidden="true">
      <rect width={w} height={h} fill="var(--color-hero-background)" />
      <g stroke="var(--color-hero-line)" strokeWidth={0.5} opacity={0.55}>
        {Array.from({ length: Math.floor(w / 40) }, (_, i) => (
          <path key={`v${i}`} d={`M ${(i + 1) * 40} 0 V ${h}`} />
        ))}
        {Array.from({ length: Math.floor(h / 40) }, (_, i) => (
          <path key={`h${i}`} d={`M 0 ${(i + 1) * 40} H ${w}`} />
        ))}
      </g>
      {children}
    </svg>
  );
}

function Vehicle({ x, y, angle = 0, s = 1 }: { x: number; y: number; angle?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <rect x={-22} y={-10} width={44} height={20} rx={2} fill="var(--color-hero-background)" stroke="var(--color-hero-text)" strokeOpacity={0.8} strokeWidth={1.2} />
      <path d="M -22 0 H 22" stroke="var(--color-hero-text)" strokeOpacity={0.35} strokeWidth={0.7} />
      <circle cx={-13} cy={-10} r={3} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={0.9} />
      <circle cx={-13} cy={10} r={3} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={0.9} />
      <circle cx={13} cy={-10} r={3} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={0.9} />
      <circle cx={13} cy={10} r={3} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={0.9} />
    </g>
  );
}

/** 01 高速领航 —— 换道工况轨迹跟踪（俯视） */
function HighwayFigure() {
  const ref: Pt[] = [[20, 70], [90, 70], [120, 70], [160, 82], [200, 94], [210, 150], [250, 150], [380, 150]];
  const act: Pt[] = [[20, 72], [92, 72], [124, 73], [164, 86], [204, 98], [216, 152], [254, 151], [380, 150]];
  return (
    <Panel>
      {/* 车道线 */}
      <path d="M 0 30 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      <path d="M 0 192 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      <path d="M 0 111 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.2} strokeWidth={0.8} strokeDasharray="10 12" className="flow-dash-slow" />
      {/* 参考 / 实际轨迹 */}
      <path d={smoothPath(ref)} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.6} strokeWidth={1.2} strokeDasharray="6 5" />
      <path d={smoothPath(act)} fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.9} strokeLinecap="round" />
      {/* 误差标注 */}
      <g stroke="var(--color-accent)" strokeWidth={1}>
        <path d="M 186 90 v 4.5" />
        <path d="M 214 106 v 4.5" />
        <path d="M 238 140 v 4.5" />
      </g>
      <path d="M 214 122 L 248 118" stroke="var(--color-accent)" strokeWidth={0.7} strokeDasharray="2.5 2.5" />
      <text x={252} y={121} {...mono} fill="var(--color-accent-strong)">e_y,peak = 0.09 m</text>
      {/* 车辆 */}
      <Vehicle x={38} y={71} s={0.62} />
      <Vehicle x={330} y={150} s={0.62} />
      <circle cx={20} cy={70} r={2.2} fill="var(--color-hero-text)" opacity={0.8} />
      {/* 图例 */}
      <text x={16} y={214} {...mono}>
        <tspan fill="var(--color-hero-text)">– –  x_ref</tspan>
        <tspan dx={16} fill="var(--color-accent-strong)">——  x</tspan>
        <tspan dx={22} fill="var(--color-hero-text-secondary)">v = 100 km/h · lane change</tspan>
      </text>
    </Panel>
  );
}

/** 误差曲线 —— e_y / e_ψ 时间历程 */
function ErrorFigure() {
  const ey: Pt[] = [[40, 110], [100, 110], [122, 118], [142, 131], [172, 126], [202, 117], [242, 107], [282, 105], [322, 104.5], [380, 104]];
  const epsi: Pt[] = [[40, 110], [110, 110], [132, 101], [162, 99], [202, 106], [252, 110.5], [380, 110]];
  return (
    <Panel>
      {/* ±0.2 m 约束带 */}
      <rect x={40} y={70} width={340} height={80} fill="var(--color-accent-soft)" opacity={0.5} />
      <path d="M 40 70 H 380 M 40 150 H 380" stroke="var(--color-accent)" strokeOpacity={0.5} strokeWidth={0.8} strokeDasharray="4 4" />
      <text x={376} y={67} textAnchor="end" {...mono} fill="var(--color-accent)">+0.2 m</text>
      <text x={376} y={163} textAnchor="end" {...mono} fill="var(--color-accent)">−0.2 m</text>
      {/* 零线 */}
      <path d="M 40 110 H 380" stroke="var(--color-hero-text)" strokeOpacity={0.3} strokeWidth={0.8} />
      {/* 换道时刻 */}
      <path d="M 120 34 V 186" stroke="var(--color-hero-text)" strokeOpacity={0.25} strokeWidth={0.8} strokeDasharray="3 4" />
      <text x={124} y={42} {...mono}>lane change</text>
      {/* 曲线 */}
      <path d={smoothPath(epsi)} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.55} strokeWidth={1.1} strokeDasharray="4 3" />
      <path d={smoothPath(ey)} fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.8} strokeLinecap="round" />
      <text x={368} y={98} textAnchor="end" {...mono} fill="var(--color-accent-strong)">e_y</text>
      <text x={368} y={122} textAnchor="end" {...mono} fill="var(--color-hero-text)">e_ψ</text>
      {/* 坐标 */}
      <text x={40} y={204} {...mono}>0</text>
      <text x={370} y={204} {...mono}>20 s</text>
      <text x={12} y={113} {...mono} textAnchor="start">m / rad</text>
    </Panel>
  );
}

/** 转向输入 —— 指令与执行器响应 */
function SteeringFigure() {
  const cmd: Pt[] = [[40, 110], [110, 110], [135, 148], [155, 156], [185, 152], [205, 96], [225, 80], [260, 92], [300, 108], [330, 110], [380, 110]];
  const act: Pt[] = [[40, 110], [118, 110], [152, 140], [172, 153], [200, 150], [222, 112], [246, 86], [272, 84], [312, 102], [348, 110], [380, 110]];
  return (
    <Panel>
      <path d="M 40 30 H 380 M 40 190 H 380 M 40 30 V 190" stroke="var(--color-hero-line)" strokeWidth={0.7} />
      {/* 零线 */}
      <path d="M 40 110 H 380" stroke="var(--color-hero-text)" strokeOpacity={0.3} strokeWidth={0.8} />
      <text x={34} y={113} textAnchor="end" {...mono}>0°</text>
      <text x={34} y={83} textAnchor="end" {...mono}>25°</text>
      <text x={34} y={159} textAnchor="end" {...mono}>−38°</text>
      {/* 转角速率约束 */}
      <path d="M 132 96 h 26 M 132 92 v 8 M 158 92 v 8" stroke="var(--color-hero-text)" strokeOpacity={0.4} strokeWidth={0.7} />
      <text x={164} y={100} {...mono}>δ̇_max</text>
      {/* 曲线 */}
      <path d={smoothPath(act)} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="4 3" />
      <path d={smoothPath(cmd)} fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.8} strokeLinecap="round" />
      <text x={374} y={74} textAnchor="end" {...mono} fill="var(--color-accent-strong)">δ_cmd</text>
      <text x={374} y={132} textAnchor="end" {...mono}>δ (响应)</text>
      <text x={40} y={204} {...mono}>0</text>
      <text x={366} y={204} {...mono}>12 s</text>
    </Panel>
  );
}

/** 02 城市跟踪 —— 双移线工况（ISO 3888） */
function UrbanFigure() {
  const ref: Pt[] = [[20, 140], [80, 140], [110, 140], [132, 96], [160, 84], [190, 96], [212, 140], [244, 140], [266, 96], [294, 84], [322, 96], [344, 140], [382, 140]];
  const act: Pt[] = [[20, 141], [80, 141], [112, 141], [136, 100], [164, 86], [194, 100], [216, 141], [248, 141], [270, 102], [298, 87], [326, 100], [348, 141], [382, 141]];
  return (
    <Panel>
      <path d="M 0 52 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      <path d="M 0 178 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      {/* 锥桶（双移线通道边界） */}
      <g fill="var(--color-gold)" opacity={0.85}>
        {[100, 150, 200, 250, 300, 350].map((x) => (
          <path key={x} d={`M ${x} 62 l 3 5 h -6 Z`} />
        ))}
      </g>
      <path d={smoothPath(ref)} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="6 5" />
      <path d={smoothPath(act)} fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.8} strokeLinecap="round" />
      {/* 超调峰值标注 */}
      <circle cx={164} cy={86} r={2.4} fill="none" stroke="var(--color-accent)" strokeWidth={1.2} />
      <circle cx={298} cy={87} r={2.4} fill="none" stroke="var(--color-accent)" strokeWidth={1.2} />
      <path d="M 164 86 L 150 66" stroke="var(--color-accent)" strokeWidth={0.7} strokeDasharray="2.5 2.5" />
      <text x={104} y={62} {...mono} fill="var(--color-accent-strong)">peak 0.12 m</text>
      <Vehicle x={40} y={141} s={0.55} />
      <Vehicle x={370} y={140} s={0.55} />
      <text x={16} y={214} {...mono}>
        <tspan fill="var(--color-hero-text)">– –  ref</tspan>
        <tspan dx={14} fill="var(--color-accent-strong)">——  actual</tspan>
        <tspan dx={22} fill="var(--color-hero-text-secondary)">ISO 3888-1 · 40 km/h</tspan>
      </text>
    </Panel>
  );
}

/** 03 自动泊车 —— 泊入轨迹与最小转弯半径（俯视） */
function ParkingFigure() {
  return (
    <Panel>
      {/* 地面 */}
      <path d="M 0 204 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.25} strokeWidth={1} />
      {/* 相邻车辆 */}
      <g opacity={0.5}>
        <rect x={230} y={104} width={54} height={98} rx={2} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.5} strokeWidth={1} />
        <rect x={372} y={104} width={54} height={98} rx={2} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.5} strokeWidth={1} />
      </g>
      {/* 车位 */}
      <path d="M 296 96 V 202 M 360 96 V 202 M 296 96 H 360" fill="none" stroke="var(--color-accent)" strokeOpacity={0.75} strokeWidth={1.3} />
      <text x={328} y={88} textAnchor="middle" {...mono} fill="var(--color-accent)">车位 · 2.4 m</text>
      {/* 最小转弯半径 */}
      <circle cx={252} cy={132} r={46} fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.22} strokeWidth={0.9} strokeDasharray="3 4" />
      <text x={196} y={124} {...mono} fill="var(--color-hero-text-secondary)">R_min = 4.95 m</text>
      {/* 泊入轨迹（倒车） */}
      <path
        d="M 74 56 C 150 56, 214 60, 252 84 C 284 104, 282 136, 306 156 C 316 164, 322 168, 328 172"
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path d="M 96 50 l -7 6.5 9.5 1.5" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.2} />
      {/* 过程位姿 */}
      <Vehicle x={252} y={84} angle={28} s={0.6} />
      <Vehicle x={306} y={158} angle={64} s={0.6} />
      <Vehicle x={328} y={178} angle={90} s={0.62} />
      <Vehicle x={74} y={56} s={0.72} />
      {/* 标注 */}
      <text x={44} y={36} {...mono}>start</text>
      <text x={340} y={196} {...mono} fill="var(--color-accent-strong)">goal</text>
      <text x={16} y={222} {...mono}>
        <tspan fill="var(--color-hero-text-secondary)">perpendicular parking · 1-path (无揉库)</tspan>
      </text>
    </Panel>
  );
}

/** 04 车辆动力学 —— 轮胎特性 + 横摆响应对标 */
function DynamicsFigure() {
  return (
    <Panel w={400} h={230}>
      {/* 左：轮胎侧向力特性 */}
      <g>
        <path d="M 34 44 V 168 H 186" fill="none" stroke="var(--color-hero-line)" strokeWidth={0.9} />
        <text x={30} y={38} {...mono}>F_y</text>
        <text x={182} y={182} {...mono}>α</text>
        {/* 线性区延长线 */}
        <path d="M 44 164 L 130 84" stroke="var(--color-hero-text)" strokeOpacity={0.35} strokeWidth={0.9} strokeDasharray="4 3" />
        {/* 饱和曲线 */}
        <path
          d="M 44 164 C 66 138, 88 112, 106 100 C 124 90, 150 86, 180 86"
          fill="none"
          stroke="var(--color-accent-strong)"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path d="M 44 164 L 96 112" stroke="var(--color-accent-strong)" strokeWidth={2.6} strokeLinecap="round" />
        <text x={104} y={120} {...mono} fill="var(--color-accent-strong)">F_y = f(α)</text>
        <text x={52} y={146} {...mono}>linear</text>
        <text x={138} y={100} {...mono}>saturation</text>
        <text x={34} y={204} {...mono}>线性区 + 指数饱和</text>
      </g>
      {/* 右：横摆角速度阶跃响应 */}
      <g>
        <path d="M 226 44 V 168 H 382" fill="none" stroke="var(--color-hero-line)" strokeWidth={0.9} />
        <text x={222} y={38} {...mono}>r</text>
        <text x={378} y={182} {...mono}>t</text>
        <path d="M 226 80 H 382" stroke="var(--color-hero-text)" strokeOpacity={0.3} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={384} y={83} {...mono}>r_ss</text>
        {/* 试验 */}
        <path d="M 226 160 H 250 C 262 160, 264 122, 276 102 C 286 88, 296 82, 314 80.5 L 382 80" fill="none" stroke="var(--color-hero-text)" strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="4 3" />
        {/* 模型 */}
        <path d="M 226 160 H 254 C 266 160, 268 118, 280 98 C 290 84, 302 80.5, 322 80 L 382 80" fill="none" stroke="var(--color-accent-strong)" strokeWidth={1.8} strokeLinecap="round" />
        <text x={330} y={70} {...mono} fill="var(--color-accent-strong)">model</text>
        <text x={330} y={96} {...mono}>test</text>
        <text x={226} y={204} {...mono}>阶跃转向 · 误差 6.5%</text>
      </g>
    </Panel>
  );
}

/** 04 队列驾驶 —— 商用车队列跟驰（CACC/ACC 双模式） */
function PlatoonFigure() {
  return (
    <Panel>
      <path d="M 0 56 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      <path d="M 0 168 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.28} strokeWidth={1} />
      <path d="M 0 112 H 400" stroke="var(--color-hero-text)" strokeOpacity={0.2} strokeWidth={0.8} strokeDasharray="10 12" className="flow-dash-slow" />
      {/* 车队 */}
      <Vehicle x={56} y={112} s={0.62} />
      <Vehicle x={196} y={112} s={0.62} />
      <Vehicle x={336} y={112} s={0.62} />
      {/* V2V 通讯链路 */}
      <g fill="none" stroke="var(--color-accent-strong)" strokeWidth={1} strokeDasharray="3 3">
        <path d="M 82 92 C 110 78, 140 78, 168 90" />
        <path d="M 222 92 C 250 78, 280 78, 308 90" />
      </g>
      <circle cx={168} cy={90} r={1.8} fill="var(--color-accent-strong)" />
      <circle cx={308} cy={90} r={1.8} fill="var(--color-accent-strong)" />
      {/* 间距标注 */}
      <g stroke="var(--color-accent)" strokeWidth={0.9}>
        <path d="M 88 138 H 168" />
        <path d="M 88 138 l 5 -2.5 v 5 Z" fill="var(--color-accent)" stroke="none" />
        <path d="M 168 138 l -5 -2.5 v 5 Z" fill="var(--color-accent)" stroke="none" />
        <path d="M 228 138 H 308" />
        <path d="M 228 138 l 5 -2.5 v 5 Z" fill="var(--color-accent)" stroke="none" />
        <path d="M 308 138 l -5 -2.5 v 5 Z" fill="var(--color-accent)" stroke="none" />
      </g>
      <text x={128} y={132} textAnchor="middle" {...mono} fill="var(--color-accent-strong)">&lt; 5 m</text>
      <text x={268} y={132} textAnchor="middle" {...mono} fill="var(--color-accent-strong)">&lt; 5 m</text>
      {/* 模式标注 */}
      <text x={56} y={76} textAnchor="middle" {...mono} fill="var(--color-hero-text)">lead</text>
      <text x={196} y={76} textAnchor="middle" {...mono} fill="var(--color-accent-strong)">CACC</text>
      <text x={336} y={76} textAnchor="middle" {...mono}>CACC / ACC</text>
      <text x={16} y={196} {...mono}>
        <tspan fill="var(--color-hero-text-secondary)">V2V platooning · </tspan>
        <tspan fill="var(--color-accent-strong)">CACC / ACC</tspan>
        <tspan fill="var(--color-hero-text-secondary)"> dual-mode · 纵向误差 ≤ 1 m</tspan>
      </text>
    </Panel>
  );
}

const FIGURES: Record<FigureType, () => JSX.Element> = {
  highway: HighwayFigure,
  urban: UrbanFigure,
  parking: ParkingFigure,
  dynamics: DynamicsFigure,
  error: ErrorFigure,
  steering: SteeringFigure,
  platoon: PlatoonFigure,
};

export function ProjectFigure({ type }: { type: FigureType }) {
  const Fig = FIGURES[type];
  return <Fig />;
}
