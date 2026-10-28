/**
 * 生成中国地图 SVG 路径数据 → src/data/chinaGeo.ts
 *
 * 数据源：DataV.GeoAtlas 官方边界（https://geo.datav.aliyun.com/areas_v3/bound/）
 *   100000.json       国界（含全部岛屿）
 *   100000_full.json  省界 + 十段线（adchar: JD）
 * 下载：
 *   curl -o 100000.json      https://geo.datav.aliyun.com/areas_v3/bound/100000.json
 *   curl -o 100000_full.json https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 *   （默认放 <系统临时目录>/china-geo/，或用 $CHINA_GEO_DIR / 第一个参数指定）
 *
 * 用法：node scripts/gen-china-map.mjs [geojson目录] [输出文件]
 *
 * 投影：兰勃特等角圆锥（双标准纬线 25°N / 47°N，中央经线 105°E）—— 中国地图标准投影。
 * 输出文件带同源投影函数 projectLngLat，地点 pin 的经纬度在组件内用它投影，
 * 与底图常数严格一致，保证对齐。生成文件请勿手工编辑。
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const dir = process.argv[2] || process.env.CHINA_GEO_DIR || path.join(os.tmpdir(), 'china-geo');
const OUT = path.resolve(process.argv[3] || 'src/data/chinaGeo.ts');

const D2R = Math.PI / 180;
const PHI1 = 25 * D2R;
const PHI2 = 47 * D2R;
const LAMBDA0 = 105;

const n = Math.log(Math.cos(PHI1) / Math.cos(PHI2)) /
  Math.log(Math.tan(Math.PI / 4 + PHI2 / 2) / Math.tan(Math.PI / 4 + PHI1 / 2));
const F = (Math.cos(PHI1) * Math.tan(Math.PI / 4 + PHI1 / 2) ** n) / n;
const PHI0 = 35 * D2R;
const RHO0 = F / Math.tan(Math.PI / 4 + PHI0 / 2) ** n;

function lambert(lng, lat) {
  const rho = F / Math.tan(Math.PI / 4 + (lat * D2R) / 2) ** n;
  const theta = n * ((lng - LAMBDA0) * D2R);
  return [rho * Math.sin(theta), RHO0 - rho * Math.cos(theta)]; // y 北正
}

/** Douglas-Peucker 抽稀（投影后平面坐标，递归栈实现） */
function simplify(pts, tol) {
  if (pts.length <= 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = -1, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let t = ((px - ax) * dx + (py - ay) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const ex = ax + t * dx - px, ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol * tol) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const bbox = (pts) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x; if (y < y0) y0 = y;
    if (x > x1) x1 = x; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, diag: Math.hypot(x1 - x0, y1 - y0) };
};

const centroid = (pts) => {
  let x = 0, y = 0;
  for (const [px, py] of pts) { x += px; y += py; }
  return [x / pts.length, y / pts.length];
};

const fmt = (v) => v.toFixed(1);
const toPath = (rings, closed) =>
  rings
    .map((r) => 'M' + r.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join('L') + (closed ? 'Z' : ''))
    .join('');

// ---------- 读取 ----------
const national = JSON.parse(fs.readFileSync(path.join(dir, '100000.json'), 'utf8'));
const full = JSON.parse(fs.readFileSync(path.join(dir, '100000_full.json'), 'utf8'));

const jdFeature = full.features.find((f) => f.properties.adchar === 'JD');
if (!jdFeature) throw new Error('未找到十段线要素 (adchar=JD)');

// ---------- 国界环分类 ----------
// 尺寸参考：1 投影单位 ≈ 3000km/1.7 ≈ 视窗千分之一宽。海南本岛 diag ≈ 0.1+，
// 沿海小岛多 < 0.01。
const LAND_MIN_DIAG = 0.0045;  // 小于此尺寸的环 → 装饰圆点（工程图纸式的群岛纹理）
const SOUTH_MAX_LAT = 21.5;    // 整体在此纬度以南的环 → 南海诸岛插图（海南本岛除外）
const INSET_MAX_DIAG = 0.04;   // 南方环中小于此尺寸 → 插图，否则是海南本岛 → 主图

const mainRings = [];   // 主图：海岸线路径
const mainDots = [];    // 主图：小岛圆点 [x, y, r]
const insetRings = [];  // 插图：南海诸岛

for (const poly of national.features[0].geometry.coordinates) {
  const orig = poly[0];
  const proj = orig.map(([lng, lat]) => lambert(lng, lat));
  const bb = bbox(proj);
  const maxLat = Math.max(...orig.map((p) => p[1]));
  const isSouth = maxLat < SOUTH_MAX_LAT;
  if (isSouth && bb.diag < INSET_MAX_DIAG) { insetRings.push(proj); continue; }
  if (bb.diag < LAND_MIN_DIAG) {
    const [cx, cy] = centroid(proj);
    mainDots.push([cx, cy, Math.min(1.6, 0.9 + bb.diag * 120)]);
  } else {
    mainRings.push(proj);
  }
}

// ---------- 仿射拟合（X = x*s+tx, Y = -y*s+ty） ----------
function fitTo(rings, targetW, margin) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const ring of rings)
    for (const [x, y] of ring) {
      if (x < x0) x0 = x; if (y < y0) y0 = y;
      if (x > x1) x1 = x; if (y > y1) y1 = y;
    }
  const s = (targetW - margin * 2) / (x1 - x0);
  const w = targetW;
  const h = Math.round((y1 - y0) * s + margin * 2);
  return { s, tx: margin - x0 * s, ty: h - margin + y0 * s, w, h };
}
const main = fitTo(mainRings, 1000, 14);
const inset = fitTo([...insetRings, ...jdFeature.geometry.coordinates.map((p) => p[0].map(([lng, lat]) => lambert(lng, lat)))], 140, 8);
const toView = (r, f) => r.map(([x, y]) => [x * f.s + f.tx, -y * f.s + f.ty]);

// ---------- 抽稀出路径 ----------
const TOL_LAND = 0.55, TOL_PROVINCE = 1.5, TOL_INSET = 0.25;

const landPath = toPath(mainRings.map((r) => simplify(toView(r, main), TOL_LAND)), true);
const isleDots = mainDots
  .map(([x, y, r]) => toView([[x, y]], main)[0].concat(r))
  .map(([x, y, r]) => [+x.toFixed(1), +y.toFixed(1), +r.toFixed(2)]);

// 省界：只保留每省较大的环（本体/大岛），作内部细线
const provinceRings = [];
for (const f of full.features) {
  if (f.properties.adchar === 'JD') continue;
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  for (const poly of polys) {
    const proj = poly[0].map(([lng, lat]) => lambert(lng, lat));
    if (bbox(proj).diag >= 0.02) provinceRings.push(proj);
  }
}
const provincePath = toPath(
  provinceRings.map((r) => simplify(toView(r, main), TOL_PROVINCE)).filter((r) => r.length >= 3),
  false,
);

const insetIslandsPath = toPath(
  insetRings.map((r) => simplify(toView(r, inset), TOL_INSET)).filter((r) => r.length >= 3),
  true,
);
const jdPath = toPath(
  jdFeature.geometry.coordinates
    .map((p) => simplify(toView(p[0].map(([lng, lat]) => lambert(lng, lat)), inset), TOL_INSET))
    .filter((r) => r.length >= 2),
  false,
);

// ---------- 经纬网（10° 间隔折线，圆锥投影下经线为弧） ----------
function graticule() {
  const segs = [];
  const lngs = [], lats = [];
  for (let lng = 70; lng <= 140; lng += 10) {
    const pts = [];
    for (let lat = 15; lat <= 60; lat += 1.5) pts.push(toView([lambert(lng, lat)], main)[0]);
    const d = pts
      .filter(([x, y]) => x >= 0 && x <= main.w && y >= 0 && y <= main.h)
      .map(([x, y]) => `${fmt(x)},${fmt(y)}`);
    if (d.length >= 2) segs.push('M' + d.join('L'));
    lngs.push(lng);
  }
  for (let lat = 20; lat <= 50; lat += 10) {
    const pts = [];
    for (let lng = 72; lng <= 138; lng += 1.5) pts.push(toView([lambert(lng, lat)], main)[0]);
    const d = pts
      .filter(([x, y]) => x >= 0 && x <= main.w && y >= 0 && y <= main.h)
      .map(([x, y]) => `${fmt(x)},${fmt(y)}`);
    if (d.length >= 2) segs.push('M' + d.join('L'));
    lats.push(lat);
  }
  return { path: segs.join(''), lngs, lats };
}
const grat = graticule();

// ---------- 校验样点 ----------
const checks = [
  ['北京', 116.407, 39.904],
  ['上海', 121.473, 31.231],
  ['三亚', 109.508, 18.248],
  ['喀纳斯', 87.0, 48.7],
  ['拉萨', 91.14, 29.65],
  ['漠河', 122.54, 52.97],
].map(([name, lng, lat]) => {
  const [x, y] = toView([lambert(lng, lat)], main)[0];
  return { name, x: +x.toFixed(1), y: +y.toFixed(1), in: x >= 0 && x <= main.w && y >= 0 && y <= main.h };
});

// ---------- 写出 TS ----------
const ts = `// 由 scripts/gen-china-map.mjs 生成 —— 请勿手工编辑
// 数据源：DataV.GeoAtlas 官方边界（国界 / 省界 / 十段线），兰勃特等角圆锥投影（25°N/47°N，中央经线 105°E）
// 重新生成：node scripts/gen-china-map.mjs

/** 经纬度 → SVG 坐标的仿射参数（主地图 / 南海诸岛插图） */
export interface MapFit {
  s: number;
  tx: number;
  ty: number;
}

export const MAP_W = ${main.w};
export const MAP_H = ${main.h};

export const INSET_W = ${inset.w};
export const INSET_H = ${inset.h};

const MAIN_FIT: MapFit = { s: ${main.s}, tx: ${main.tx}, ty: ${main.ty} };
const INSET_FIT: MapFit = { s: ${inset.s}, tx: ${inset.tx}, ty: ${inset.ty} };

// 兰勃特投影常数
const N = ${n};
const FF = ${F};
const RHO0 = ${RHO0};

function applyFit(x: number, y: number, fit: MapFit): [number, number] {
  return [x * fit.s + fit.tx, -(y * fit.s) + fit.ty];
}

/** 经纬度 → 主地图 SVG 坐标（与底图同源，地点 pin 用它定位） */
export function projectLngLat(lng: number, lat: number): [number, number] {
  const rho = FF / Math.tan(Math.PI / 4 + (lat * Math.PI) / 360) ** N;
  const theta = (N * (lng - ${LAMBDA0}) * Math.PI) / 180;
  return applyFit(rho * Math.sin(theta), RHO0 - rho * Math.cos(theta), MAIN_FIT);
}

/** 经纬度 → 南海诸岛插图 SVG 坐标 */
export function projectLngLatInset(lng: number, lat: number): [number, number] {
  const rho = FF / Math.tan(Math.PI / 4 + (lat * Math.PI) / 360) ** N;
  const theta = (N * (lng - ${LAMBDA0}) * Math.PI) / 180;
  return applyFit(rho * Math.sin(theta), RHO0 - rho * Math.cos(theta), INSET_FIT);
}

/** 国界 + 大岛海岸线（闭合路径，填充用） */
export const chinaLandPath =
  '${landPath}';

/** 小岛装饰圆点 [x, y, r]（工程图纸式的群岛纹理） */
export const chinaIsleDots: ReadonlyArray<readonly [number, number, number]> = ${JSON.stringify(isleDots)};

/** 省界（开放路径，细线描边用） */
export const chinaProvincePath =
  '${provincePath}';

/** 经纬网（10° 间隔） */
export const graticulePath =
  '${grat.path}';
export const graticuleLngs = ${JSON.stringify(grat.lngs)};
export const graticuleLats = ${JSON.stringify(grat.lats)};

/** 南海诸岛插图：岛屿（闭合路径） */
export const insetIslandsPath =
  '${insetIslandsPath}';
/** 南海诸岛插图：十段线（虚线描边用） */
export const insetDashPath =
  '${jdPath}';
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, ts);

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + 'KB';
console.log('写出', OUT);
console.log('主图 viewBox:', `${main.w}x${main.h}`, '| 插图:', `${inset.w}x${inset.h}`);
console.log('land:', kb(landPath), '| isleDots:', mainDots.length, '| province:', kb(provincePath), '| graticule:', kb(grat.path), '| insetIslands:', kb(insetIslandsPath), '| jd:', kb(jdPath));
console.log('主图海岸环:', mainRings.length, '| 插图环:', insetRings.length);
console.log('样点校验:');
for (const c of checks) console.log(`  ${c.name}: (${c.x}, ${c.y}) ${c.in ? '在视窗内' : '⚠️ 越界'}`);
