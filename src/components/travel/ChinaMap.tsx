import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { TravelStop } from '@/types';
import {
  MAP_W,
  MAP_H,
  INSET_W,
  INSET_H,
  projectLngLat,
  chinaLandPath,
  chinaProvincePath,
  chinaIsleDots,
  graticulePath,
  insetIslandsPath,
  insetDashPath,
} from '@/data/chinaGeo';
import { DURATION, EASE, STAGGER } from '@/theme/animation';

type XY = readonly [number, number];

/** Catmull-Rom → 三次贝塞尔：把足迹点连成柔和的行进线（工程图纸上的航线） */
function journeyPath(points: XY[]): string {
  if (points.length < 2) return '';
  const f = (v: number) => v.toFixed(1);
  const d = [`M${f(points[0][0])},${f(points[0][1])}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`);
  }
  return d.join('');
}

/** 地图：geo 模式渲染手绘化的真实地理 SVG；illustration 模式以 AI 手绘画为主图，
 * 图钉按数据里手工校准的画布坐标（百分比）定位，航线 / 悬停剪影 / 灯箱交互两种模式一致。 */
export function ChinaMap({
  stops,
  onSelect,
  illustration,
}: {
  stops: TravelStop[];
  onSelect: (stop: TravelStop) => void;
  /** 插画模式：手绘地图图片（public/ 绝对路径）。提供时忽略地理底图层。 */
  illustration?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isIllustration = !!illustration;

  /** 两种模式都是 1000 单位宽；插画模式高宽比与画一致（1536x1024 → 667），无裁切 */
  const VIEW_W = 1000;
  const VIEW_H = isIllustration ? 667 : MAP_H;

  const pins = useMemo(
    () =>
      stops.map((stop) => ({
        stop,
        xy: (isIllustration && stop.canvasPos
          ? [(stop.canvasPos.x / 100) * VIEW_W, (stop.canvasPos.y / 100) * VIEW_H]
          : projectLngLat(stop.lng, stop.lat)) as XY,
      })),
    [stops, isIllustration, VIEW_H],
  );
  const route = useMemo(() => journeyPath(pins.map((p) => p.xy)), [pins]);
  /** 比例尺（仅地理模式）：在 36°N 附近标定 —— 5° 经度弧长 ≈ 450 km，比例尺杆即取该跨度 */
  const scale = useMemo(() => {
    if (isIllustration) return { len: 0, km: 450 };
    const [xa] = projectLngLat(100, 36);
    const [xb] = projectLngLat(105, 36);
    return { len: Math.abs(xb - xa), km: 450 };
  }, [isIllustration]);
  const hovered = hoveredId ? pins.find((p) => p.stop.id === hoveredId) : undefined;

  return (
    <div className="relative">
      {/* —— 插画模式：手绘地图为主图 —— */}
      {isIllustration && illustration && (
        <img
          src={illustration}
          alt=""
          aria-hidden
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
      )}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative h-auto w-full select-none"
        role="group"
        aria-label="中国旅行地图：标注了去过的地方，悬停查看剪影，点击查看照片"
      >
        {/* —— 地理模式专属：滤镜与手绘化底图（插画模式下整段不渲染） —— */}
        {!isIllustration && (
          <>
        {/* —— 滤镜定义：手绘抖线 / 洇墨 / 纸纹颗粒 —— */}
        <defs>
          <clipPath id="travel-land-clip">
            <path d={chinaLandPath} />
          </clipPath>
          {/* 大形抖动：海岸线与轮廓的手描感 */}
          <filter id="travel-wobble" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* 细线轻颤：省界与经纬网 */}
          <filter id="travel-wobble-fine" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={11} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* 轮廓下的洇墨 */}
          <filter id="travel-bleed">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          {/* 陆地内纸纹肌理 */}
          <filter id="travel-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.9 0.9 0 0"
            />
          </filter>
        </defs>

        {/* —— 图纸层：经纬网（细线轻颤） —— */}
        <g filter="url(#travel-wobble-fine)">
          <path
            d={graticulePath}
            fill="none"
            stroke="var(--color-paper-line)"
            strokeWidth={0.7}
            strokeDasharray="1.5 5"
          />
        </g>

        {/* —— 底图层：手绘抖线的山河 —— */}
        <g filter="url(#travel-wobble)">
          {/* 洇墨：轮廓向纸里洇开的一层 */}
          <path
            d={chinaLandPath}
            fill="none"
            stroke="var(--color-paper-ink)"
            strokeOpacity={0.14}
            strokeWidth={3.4}
            filter="url(#travel-bleed)"
          />
          {/* 陆地基底（半透，让底层纸感透入） */}
          <path d={chinaLandPath} fill="var(--color-paper-elevated)" fillOpacity={0.72} stroke="none" />
          {/* 轮廓回声：错位的第二笔，手绘的呼吸 */}
          <path
            d={chinaLandPath}
            transform="translate(0.9 1.1)"
            fill="none"
            stroke="var(--color-paper-ink)"
            strokeOpacity={0.22}
            strokeWidth={0.9}
          />
          {/* 主轮廓 */}
          <path d={chinaLandPath} fill="none" stroke="var(--color-paper-ink)" strokeWidth={1.4} strokeLinejoin="round" />
          {/* 群岛圆点 */}
          <g fill="var(--color-paper-ink)" fillOpacity={0.42}>
            {chinaIsleDots.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        </g>
        {/* 纸纹肌理：只落在陆地内 */}
        <rect
          x={0}
          y={0}
          width={MAP_W}
          height={MAP_H}
          clipPath="url(#travel-land-clip)"
          filter="url(#travel-grain)"
          opacity={0.09}
        />
        {/* 省界：细线轻颤 */}
        <g filter="url(#travel-wobble-fine)">
          <path
            d={chinaProvincePath}
            fill="none"
            stroke="var(--color-paper-ink)"
            strokeOpacity={0.15}
            strokeWidth={0.55}
          />
        </g>
          </>
        )}

        {/* —— 航线：足迹按时间顺序相连（仅地理模式；插画模式只留图钉） —— */}
        {!isIllustration && (
          <motion.path
            d={route}
            fill="none"
            stroke="var(--color-accent)"
            strokeOpacity={0.62}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: DURATION.slow, delay: 0.4, ease: EASE.precise }}
          />
        )}

        {/* —— 地点图钉 —— */}
        {pins.map(({ stop, xy }, i) => {
          const [x, y] = xy;
          const active = hoveredId === stop.id;
          const flip = stop.labelAnchor ? stop.labelAnchor === 'w' : x > VIEW_W * 0.72;
          return (
            <g
              key={stop.id}
              role="button"
              tabIndex={0}
              aria-label={`№${stop.index} ${stop.name}，${stop.date}，查看旅行照片`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHoveredId(stop.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(stop.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => onSelect(stop)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(stop);
                }
              }}
            >
              {/* 命中区 */}
              <circle cx={x} cy={y} r={18} fill="transparent" stroke="none" />
              <motion.g
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 7 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: DURATION.fast, delay: reduce ? 0 : 0.5 + i * STAGGER, ease: EASE.precise }}
              >
                <motion.circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity={active ? 0.55 : 0.25}
                  strokeWidth={1}
                  animate={{ r: active ? 12 : 8 }}
                  transition={{ duration: DURATION.micro, ease: EASE.precise }}
                />
                <circle cx={x} cy={y} r={5.4} fill="var(--color-paper-elevated)" stroke="var(--color-accent-strong)" strokeWidth={1.3} />
                <circle cx={x} cy={y} r={2.3} fill="var(--color-accent-strong)" />
                <text
                  x={flip ? x - 13 : x + 13}
                  y={y + 3.5}
                  textAnchor={flip ? 'end' : 'start'}
                  fontSize={12}
                  fontWeight={600}
                  className="font-mono"
                  fill="var(--color-paper-ink)"
                  stroke="var(--color-paper)"
                  strokeWidth={3.5}
                  paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >
                  {stop.name}
                </text>
                <text
                  x={flip ? x - 13 : x + 13}
                  y={y + 15}
                  textAnchor={flip ? 'end' : 'start'}
                  fontSize={9}
                  className="font-mono"
                  fill="var(--color-paper-ink-secondary)"
                  stroke="var(--color-paper)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >
                  {[stop.date, stop.scene].filter(Boolean).join(' · ')}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* —— 图纸角注（仅地理模式）：指北针 / 比例尺 / 南海诸岛插图 —— */}
        {!isIllustration && (
          <>
        <g className="font-mono" fill="var(--color-paper-ink-secondary)">
          <g transform={`translate(${MAP_W - 40}, 58)`}>
            <text x={0} y={-18} textAnchor="middle" fontSize={10}>
              N
            </text>
            <line x1={0} y1={14} x2={0} y2={-12} stroke="var(--color-paper-ink-secondary)" strokeWidth={1} />
            <path d="M0,-14 L4,-5 L0,-8.5 L-4,-5 Z" fill="var(--color-accent)" stroke="none" />
          </g>
          <g transform={`translate(26, ${MAP_H - 30})`}>
            <line x1={0} y1={0} x2={scale.len} y2={0} stroke="var(--color-paper-ink-secondary)" strokeWidth={1} />
            <line x1={0} y1={-3.5} x2={0} y2={3.5} stroke="var(--color-paper-ink-secondary)" strokeWidth={1} />
            <line x1={scale.len} y1={-3.5} x2={scale.len} y2={3.5} stroke="var(--color-paper-ink-secondary)" strokeWidth={1} />
            <text x={scale.len / 2} y={-7} textAnchor="middle" fontSize={9}>
              {`${scale.km} km`}
            </text>
            <text x={0} y={12} fontSize={7.5}>
              LAMBERT · STD PARALLEL 36°N
            </text>
          </g>
        </g>
        <svg
          x={MAP_W - INSET_W - 30}
          y={MAP_H - INSET_H - 44}
          width={INSET_W}
          height={INSET_H}
          viewBox={`0 0 ${INSET_W} ${INSET_H}`}
          role="img"
          aria-label="南海诸岛插图"
        >
          <rect width={INSET_W} height={INSET_H} fill="var(--color-paper-elevated)" />
          <g filter="url(#travel-wobble-fine)">
            <path d={insetIslandsPath} fill="var(--color-paper-ink)" fillOpacity={0.55} stroke="none" />
            <path
              d={insetDashPath}
              fill="none"
              stroke="var(--color-paper-ink)"
              strokeOpacity={0.65}
              strokeWidth={1.1}
              strokeDasharray="5 3.5"
            />
          </g>
          <rect width={INSET_W} height={INSET_H} fill="none" stroke="var(--color-paper-ink)" strokeOpacity={0.35} strokeWidth={1} />
          <text x={7} y={15} fontSize={9} className="font-mono" fill="var(--color-paper-ink-secondary)">
            南海诸岛
          </text>
        </svg>
          </>
        )}
      </svg>

      {/* —— 悬停剪影预告（HTML 浮层，跟随图钉） —— */}
      <AnimatePresence>
        {hovered && (
          <div
            key={hovered.stop.id}
            className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-[calc(-100%-20px)]"
            style={{
              left: `${Math.min(86, Math.max(14, (hovered.xy[0] / VIEW_W) * 100))}%`,
              top: `${(hovered.xy[1] / VIEW_H) * 100}%`,
            }}
          >
            <motion.div
              className="w-32 rounded-tile border border-paper-line bg-paper-raised shadow-overlay sm:w-40"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: DURATION.micro, ease: EASE.precise }}
            >
              <img
                src={hovered.stop.image}
                alt=""
                aria-hidden
                width={1024}
                height={1536}
                loading="lazy"
                decoding="async"
                className="travel-silhouette aspect-[3/4] w-full object-cover"
              />
              <div className="border-t border-paper-line px-2.5 py-1.5">
                <p className="font-mono text-[9.5px] font-semibold tracking-[0.08em] text-paper-ink">
                  № {hovered.stop.index} · {hovered.stop.name}
                </p>
                <p className="mt-0.5 font-mono text-[8.5px] text-paper-ink-2">{hovered.stop.date} — 点击揭晓</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
