import type { ResearchArea } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { AdaptiveVisual, EstimationVisual, MPCVisual, OptimalVisual, TrackingVisual } from './visuals';

const VISUALS: Record<ResearchArea['visual'], () => JSX.Element> = {
  mpc: MPCVisual,
  adaptive: AdaptiveVisual,
  tracking: TrackingVisual,
  optimal: OptimalVisual,
  estimation: EstimationVisual,
};

export function ResearchCard({ area, delay }: { area: ResearchArea; delay: number }) {
  const Visual = VISUALS[area.visual];
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group/card flex h-full flex-col rounded-card border border-line bg-surface-raised p-5 pt-4 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-precise hover:-translate-y-1 hover:border-accent-line hover:shadow-card-hover">
        <div className="min-h-[64px]">
          <header className="flex items-baseline gap-2.5">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-accent">{area.index}</span>
            <h3 className="text-[15px] font-semibold leading-[1.45] tracking-[0.01em] text-ink">{area.title}</h3>
          </header>
          <p className="mt-1 font-serif text-[11.5px] italic tracking-wide text-ink-tertiary">{area.titleEn}</p>
        </div>
        <p className="mb-3.5 mt-2.5 min-h-[3.4em] text-[12.5px] leading-[1.75] text-ink-secondary">{area.description}</p>

        {/* 科研图形：hover 时内部动画启动；mt-auto 锚定底部，保证多卡图形水平对齐 */}
        <div className="plot-ticks relative mt-auto rounded-tile border border-line bg-surface p-2.5">
          <Visual />
          {/* hover 彩蛋：参数标注 */}
          <div className="pointer-events-none absolute bottom-1.5 right-2 flex gap-2 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
            {area.annotations.map((a) => (
              <span key={a.label} className="rounded-tile border border-accent-line bg-surface-raised px-1.5 py-0.5 font-mono text-[8.5px] text-accent">
                {a.label}: {a.value}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
