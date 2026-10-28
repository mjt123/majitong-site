import { tools } from '@/data/tools';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

/** 08 资源分享 / Tools —— 极简工具矩阵（导航「资源分享」入口） */
export function Tools() {
  return (
    <section id="tools" className="bg-bg py-20 lg:py-24">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="资源分享" en="Tools & Resources" />
          <p className="hidden pb-1 font-mono text-[11px] tracking-[0.14em] text-ink-tertiary md:block">
            DAILY TOOLCHAIN
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {tools.map((tool, i) => (
            <Reveal key={tool.name} delay={0.03 * i} amount={0.3}>
              <div
                className="group flex flex-col items-center rounded-tile border border-line bg-surface-raised px-2 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-line hover:shadow-card-hover"
                title={`${tool.name} · ${tool.category}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-tile border border-line bg-surface font-mono text-[13px] font-medium tracking-tight text-ink-secondary transition-all duration-300 group-hover:border-accent-line group-hover:text-accent group-hover:shadow-[0_0_14px_var(--color-accent-soft)]">
                  {tool.monogram}
                </span>
                <span className="mt-2.5 text-[12px] font-medium leading-tight text-ink">{tool.name}</span>
                <span className="mt-1 text-[10px] text-ink-tertiary">{tool.category}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
