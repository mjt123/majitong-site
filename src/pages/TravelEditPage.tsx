import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { travelIntro, travelStops } from '@/data/travel';
import type { TravelStop } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/theme/animation';import { usePageTitle } from '@/hooks/usePageTitle';


/** /travel-edit 图钉校准后台 —— 拖拽定坐标，导出 JSON 写回 travel.ts（工具页，不在导航中） */

const DRAFT_KEY = 'travel-pin-draft';
const clamp = (v: number) => Math.round(Math.max(0, Math.min(100, v)) * 10) / 10;
type XY = { x: number; y: number };

function loadDraft(): Record<string, XY> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Record<string, XY>) : {};
  } catch {
    return {};
  }
}

function enter(reduce: boolean, delay = 0) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: DURATION.base, delay, ease: EASE.precise },
      };
}

export function TravelEditPage() {
  usePageTitle('图钉校准后台');
  const reduce = useReducedMotion() ?? false;
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingId = useRef<string | null>(null);

  const [pos, setPos] = useState<Record<string, XY>>(() => loadDraft());
  const [selected, setSelected] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [copied, setCopied] = useState(false);

  const valueOf = (stop: TravelStop): XY =>
    pos[stop.id] ?? { x: stop.canvasPos?.x ?? 50, y: stop.canvasPos?.y ?? 50 };
  const moved = (stop: TravelStop) => {
    const v = valueOf(stop);
    return Math.abs(v.x - (stop.canvasPos?.x ?? 0)) > 0.05 || Math.abs(v.y - (stop.canvasPos?.y ?? 0)) > 0.05;
  };

  const setPin = (id: string, p: XY) => {
    const next = { ...pos, [id]: { x: clamp(p.x), y: clamp(p.y) } };
    setPos(next);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      /* 隐私模式忽略 */
    }
  };

  const toPct = (clientX: number, clientY: number): XY => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const onPointerDown = (stop: TravelStop) => (e: React.PointerEvent) => {
    draggingId.current = stop.id;
    setSelected(stop.id);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingId.current) return;
    setPin(draggingId.current, toPct(e.clientX, e.clientY));
  };
  const onPointerUp = () => {
    draggingId.current = null;
  };

  const resetAll = () => {
    setPos({});
    setSelected(null);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  const exportText = useMemo(() => {
    const lines = travelStops.map((s) => {
      const v = valueOf(s);
      return `  ${s.id}: { x: ${v.x.toFixed(1)}, y: ${v.y.toFixed(1)} }, // ${s.name}`;
    });
    return ['{', ...lines, '}'].join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 剪贴板失败时用户可手动全选文本框 */
    }
  };

  const selectedStop = travelStops.find((s) => s.id === selected);

  return (
    <main className="bg-paper text-paper-ink">
      {/* —— 头部 —— */}
      <section className="relative overflow-hidden bg-hero-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(680px 300px at 78% -12%, var(--color-hero-glow), transparent 62%)' }}
        />
        <div className="container-site relative pb-12 pt-24 lg:pt-28">
          <motion.div {...enter(reduce)}>
            <Link
              to="/travel"
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="arrow-left" size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              BACK / 足迹地图
            </Link>
          </motion.div>
          <motion.p {...enter(reduce, 0.05)} className="kicker mt-8 flex items-center gap-2.5 text-hero-text-2">
            <span aria-hidden className="inline-block h-[7px] w-[7px] border border-accent-strong" />
            CALIBRATOR / 图钉校准
          </motion.p>
          <motion.h1 {...enter(reduce, 0.12)} className="mt-3 text-[1.7rem] font-bold text-hero-text sm:text-[2.1rem]">
            图钉编辑器
          </motion.h1>
          <motion.p {...enter(reduce, 0.18)} className="mt-4 max-w-2xl text-[13.5px] leading-[1.9] text-hero-text-2">
            直接拖拽地图上的图钉到理想位置（坐标实时显示，自动保存在本浏览器）。调好后点「复制坐标」，
            把内容发给 AI 或粘贴进 <code className="font-mono text-accent-strong">src/data/travel.ts</code> 的对应 canvasPos 即可生效。
          </motion.p>
        </div>
      </section>

      {/* —— 编辑器 —— */}
      <section className="container-site py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* —— 地图画布 —— */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] tracking-[0.08em] text-paper-ink-2">
              <button
                type="button"
                onClick={() => setShowGrid((v) => !v)}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-strong"
              >
                <span aria-hidden className={'inline-block h-1.5 w-1.5 rounded-full ' + (showGrid ? 'bg-accent-strong' : 'border border-accent-strong')} />
                网格 {showGrid ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-strong"
              >
                <Icon name="close" size={11} />
                恢复原始位置
              </button>
              <span className="ml-auto">
                {selectedStop ? `选中 ${selectedStop.name} · x ${valueOf(selectedStop).x.toFixed(1)} · y ${valueOf(selectedStop).y.toFixed(1)}` : '点击/拖拽图钉 · 双击图钉恢复其原始位置'}
              </span>
            </div>

            <div className="overflow-hidden rounded-card border border-paper-line shadow-card">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 667"
                className="block h-auto w-full touch-none select-none"
                role="application"
                aria-label="图钉校准画布：拖拽图钉调整位置"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {/* 底图 */}
                <image
                  href={travelIntro.mapIllustration}
                  x={0}
                  y={0}
                  width={1000}
                  height={667}
                  className="pointer-events-none select-none"
                />
                {/* 网格（每 5%，10% 加粗标注） */}
                {showGrid && (
                  <g stroke="var(--color-paper-line)" strokeWidth={1} opacity={0.85}>
                    {Array.from({ length: 19 }, (_, i) => (i + 1) * 5).map((gx) => (
                      <line key={'v' + gx} x1={gx * 10} y1={0} x2={gx * 10} y2={667} strokeWidth={gx % 10 === 0 ? 1.6 : 0.6} />
                    ))}
                    {Array.from({ length: 13 }, (_, i) => (i + 1) * 5).map((gy) => (
                      <line key={'h' + gy} x1={0} y1={gy * 6.67} x2={1000} y2={gy * 6.67} strokeWidth={gy % 10 === 0 ? 1.6 : 0.6} />
                    ))}
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((gx) => (
                      <text key={'t' + gx} x={gx * 10 + 4} y={16} fontSize={13} className="font-mono" fill="var(--color-paper-ink-2)">
                        {gx}
                      </text>
                    ))}
                    {Array.from({ length: 6 }, (_, i) => (i + 1) * 10).map((gy) => (
                      <text key={'ty' + gy} x={4} y={gy * 6.67 - 5} fontSize={13} className="font-mono" fill="var(--color-paper-ink-2)">
                        {gy}
                      </text>
                    ))}
                  </g>
                )}
                {/* 原始位置参照（空心小圈） */}
                {travelStops.map((s) => {
                  if (!moved(s) || !s.canvasPos) return null;
                  return (
                    <circle
                      key={'o' + s.id}
                      cx={(s.canvasPos.x / 100) * 1000}
                      cy={(s.canvasPos.y / 100) * 667}
                      r={5}
                      fill="none"
                      stroke="var(--color-paper-ink-2)"
                      strokeDasharray="2 2"
                      strokeWidth={1.2}
                    />
                  );
                })}
                {/* 可拖拽图钉 */}
                {travelStops.map((s, i) => {
                  const v = valueOf(s);
                  const x = (v.x / 100) * 1000;
                  const y = (v.y / 100) * 667;
                  const active = selected === s.id;
                  const flip = s.labelAnchor ? s.labelAnchor === 'w' : x > 720;
                  return (
                    <g
                      key={s.id}
                      transform={`translate(${x} ${y})`}
                      style={{ cursor: 'grab', touchAction: 'none' }}
                      onPointerDown={onPointerDown(s)}
                      onDoubleClick={() => setPin(s.id, { x: s.canvasPos?.x ?? 50, y: s.canvasPos?.y ?? 50 })}
                      opacity={active ? 1 : 0.92}
                    >
                      <circle r={22} fill="transparent" />
                      {moved(s) && <circle r={9} fill="none" stroke="var(--color-gold)" strokeDasharray="3 2.4" strokeWidth={1.2} />}
                      <circle
                        r={active ? 11 : 8}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeOpacity={active ? 0.7 : 0.3}
                        strokeWidth={1.2}
                      />
                      <circle r={5.4} fill="var(--color-paper-elevated)" stroke="var(--color-accent-strong)" strokeWidth={1.4} />
                      <circle r={2.3} fill="var(--color-accent-strong)" />
                      <text
                        x={flip ? -13 : 13}
                        y={4}
                        textAnchor={flip ? 'end' : 'start'}
                        fontSize={17}
                        fontWeight={700}
                        className="font-mono"
                        fill="var(--color-paper-ink)"
                        stroke="var(--color-paper)"
                        strokeWidth={4}
                        paintOrder="stroke"
                      >
                        {s.name}
                        {moved(s) ? ' *' : ''}
                      </text>
                      <text
                        x={flip ? -13 : 13}
                        y={20}
                        textAnchor={flip ? 'end' : 'start'}
                        fontSize={13}
                        className="font-mono"
                        fill="var(--color-paper-ink-2)"
                        stroke="var(--color-paper)"
                        strokeWidth={3.4}
                        paintOrder="stroke"
                      >
                        {`x ${v.x.toFixed(1)} · y ${v.y.toFixed(1)}`}
                      </text>
                      <title>{`${s.name}（№${s.index}）拖拽移动；双击恢复原始位置`}</title>
                      <desc>{String(i)}</desc>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="mt-3 font-mono text-[10.5px] leading-relaxed tracking-[0.08em] text-paper-ink-2">
              坐标为相对画布百分比（与 canvasPos 同一坐标系）· * 号表示已从原始位置移动 · 虚线小圈为原始位置参照
            </p>
          </div>

          {/* —— 侧栏：导出 / 列表 —— */}
          <aside className="space-y-4">
            <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card">
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">EXPORT / 导出</p>
              <p className="mt-2 text-[12px] leading-relaxed text-paper-ink-2">
                调好后点复制，把 JSON 发给 AI（「把这些坐标写进 travel.ts」）即可；也可以自己替换 travel.ts 里对应 canvasPos。
              </p>
              <button
                type="button"
                onClick={copy}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-tile border border-accent-line bg-surface px-4 py-2.5 font-mono text-[11.5px] tracking-[0.1em] text-paper-ink transition-colors hover:border-accent hover:text-accent-strong"
              >
                <Icon name={copied ? 'check' : 'file-text'} size={13} />
                {copied ? '已复制到剪贴板' : '复制坐标 JSON'}
              </button>
              <pre className="mt-3 max-h-56 overflow-auto rounded-tile border border-paper-line bg-paper p-3 font-mono text-[10.5px] leading-relaxed text-paper-ink-2">
                {exportText}
              </pre>
            </div>

            <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card">
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">STOPS / 图钉列表</p>
              <ol className="mt-3 space-y-1.5">
                {travelStops.map((s) => {
                  const v = valueOf(s);
                  const active = selected === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(s.id)}
                        className={
                          'flex w-full items-baseline justify-between gap-2 rounded-tile px-2 py-1.5 text-left transition-colors ' +
                          (active ? 'bg-paper text-accent-strong' : 'hover:bg-paper')
                        }
                      >
                        <span className="font-mono text-[10px] text-gold">№{s.index}</span>
                        <span className={'text-[12.5px] font-semibold ' + (active ? 'text-accent-strong' : 'text-paper-ink')}>{s.name}</span>
                        <span className="font-mono text-[10px] text-paper-ink-2">
                          {v.x.toFixed(1)} · {v.y.toFixed(1)}
                          {moved(s) ? ' *' : ''}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
