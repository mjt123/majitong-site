import { achievements } from '@/data/achievements';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

/** 07 技术成果 —— 真实项目里程碑，学术列表风格 */
export function Achievements() {
  return (
    <section id="achievements" className="border-y border-line bg-surface py-20 lg:py-24">
      <div className="container-site">
        <SectionHeading title="技术成果" en="Technical Achievements" />
        <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-ink-tertiary">
          MILESTONES FROM PRODUCTION & RESEARCH · {achievements.length} ENTRIES
        </p>

        <div className="mt-9 overflow-hidden rounded-card border border-line bg-surface-raised shadow-card">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={0.05 * i}>
              <article
                className={
                  'group relative border-l-2 border-transparent px-5 py-5 transition-colors duration-300 hover:border-l-accent hover:bg-surface lg:px-7 ' +
                  (i > 0 ? 'border-t border-line' : '')
                }
              >
                <div className="flex gap-4 lg:gap-6">
                  <span className="mt-0.5 shrink-0 font-mono text-[11.5px] text-ink-tertiary transition-colors duration-300 group-hover:text-accent">
                    {a.index}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold leading-snug text-ink lg:text-[16px]">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-ink-secondary">{a.detail}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10.5px] tracking-[0.08em] text-ink-tertiary">
                      <span className="rounded-tile border border-line px-1.5 py-px text-accent">{a.tag}</span>
                      <span>{a.year}</span>
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
