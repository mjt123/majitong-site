import { seededRand, type Pt } from './path';

/** Hero 场景几何 —— 所有坐标集中在「图纸」语义下管理 */

export const SCENE = {
  w: 680,
  h: 560,
  /** 车辆安放位（局部坐标 → 全局） */
  car: { tx: 374, ty: 254, s: 0.92 },
  /** LiDAR 扇形原点（车头） */
  lidarOrigin: [380, 312] as [number, number],
};

/** 工程网格 */
export function gridLines(step = 40): { h: string[]; v: string[] } {
  const v: string[] = [];
  const h: string[] = [];
  for (let x = step; x < SCENE.w; x += step) v.push(`M ${x} 0 V ${SCENE.h}`);
  for (let y = step; y < SCENE.h; y += step) h.push(`M 0 ${y} H ${SCENE.w}`);
  return { v, h };
}

/** 道路双轨 + 中心虚线（自左下扫向车辆正下方并趋于平直） */
export const ROAD = {
  railTop: 'M -20 458 C 140 450, 262 428, 352 390 C 402 368, 432 362, 470 360 C 550 358, 610 360, 700 362',
  railBottom: 'M -20 482 C 140 474, 258 452, 348 412 C 398 390, 430 382, 470 380 C 550 378, 612 380, 700 382',
  center: 'M -20 470 C 140 462, 260 440, 350 400 C 400 378, 430 372, 470 370 C 550 368, 610 370, 700 372',
};

/** 参考轨迹 / 实际轨迹（实际略低，形成受控误差带） */
export const TRAJECTORY = {
  ref: 'M 28 456 C 150 446, 264 424, 350 392 C 396 376, 430 368, 470 364',
  actual: 'M 28 462 C 156 452, 270 430, 354 398 C 398 382, 432 374, 472 370',
  /** 误差标注竖线 */
  ticks: [
    { x: 140, y1: 448.5, y2: 453.5 },
    { x: 252, y1: 425, y2: 430.5 },
    { x: 348, y1: 392, y2: 398 },
  ],
  horizon: { x: 300, y1: 336, y2: 452 },
};

/** LiDAR 点云：自车头向前的确定性扇形散布 */
export function lidarPoints(count = 88): { x: number; y: number; r: number; o: number }[] {
  const [ox, oy] = SCENE.lidarOrigin;
  return Array.from({ length: count }, (_, i) => {
    const rad = 36 + Math.pow(seededRand(i + 3), 1.35) * 265;
    const ang = (seededRand(i + 11) - 0.5) * 1.5;
    return {
      x: ox - rad * Math.cos(ang),
      y: oy + rad * Math.sin(ang) * 0.82,
      r: 0.8 + seededRand(i + 23) * 1.1,
      o: Math.max(0.08, (0.1 + seededRand(i + 31) * 0.26) * (1 - rad / 360)),
    };
  });
}

/** 最优控制代价曲面 J(x₁,x₂)：等距投影抛物面网格 */
export function surfaceMesh(cx: number, cy: number, sx: number, sy: number, zs: number, n = 8): string[] {
  const proj = (u: number, v: number): Pt => {
    const z = (u * u + v * v) / 2;
    return [cx + (u - v) * sx, cy + (u + v) * sy - z * zs];
  };
  const toPath = (pts: Pt[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const lines: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = -1 + (2 * i) / n;
    const pts: Pt[] = [];
    for (let j = 0; j <= n; j++) pts.push(proj(t, -1 + (2 * j) / n));
    lines.push(toPath(pts));
  }
  for (let j = 0; j <= n; j++) {
    const s = -1 + (2 * j) / n;
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) pts.push(proj(-1 + (2 * i) / n, s));
    lines.push(toPath(pts));
  }
  return lines;
}
