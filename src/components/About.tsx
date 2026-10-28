import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { profile, stats } from '@/data/profile';
import { useCountUp } from '@/hooks/useCountUp';
import { scrollToSection } from '@/hooks/useScrollSpy';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

function StatCard({ stat, active, index }: { stat: (typeof stats)[number]; active: boolean; index: number }) {
  const reduce = useReducedMotion() ?? false;
  const value = useCountUp(stat.value, active, 1400 + index * 150, reduce);
  return (
    <div className="group flex flex-col items-center rounded-card border border-line bg-surface-raised px-4 py-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-line hover:shadow-card-hover">
      <Icon name={stat.icon} size={21} className="text-accent" strokeWidth={1.4} />
      <p className="mt-4 font-heading text-[2rem] font-semibold leading-none tracking-tight text-ink">
        {value}
        <span className="text-accent">{stat.suffix}</span>
      </p>
      <p className="mt-2.5 text-[13px] font-medium text-ink">{stat.label}</p>
      <p className="mt-1 text-[11.5px] text-ink-tertiary">{stat.sub}</p>
    </div>
  );
}

/** 03 关于我 —— 明亮学术区：左文右数 */
export function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  return (
    <section id="about" className="bg-bg py-20 lg:py-24">
      <div className="container-site grid gap-12 lg:grid-cols-[1.02fr_1fr] lg:items-start lg:gap-16">
        <div>
          <SectionHeading title="关于我" en="About Me" />
          <Reveal delay={0.08} className="mt-7 space-y-4">
            {profile.intro.map((p) => (
              <p key={p.slice(0, 12)} className="text-[14.5px] leading-[1.85] text-ink-secondary">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.16}>
            <blockquote className="mt-7 border-l-2 border-accent pl-4 text-[14px] leading-[1.9] text-ink">
              {profile.quote}
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <p className="kicker text-ink-tertiary">Education / 教育背景</p>
              <ul className="mt-3 space-y-2.5">
                {profile.education.map((e) => (
                  <li key={e.school} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-line pb-2.5">
                    <span className="font-mono text-[11px] tracking-[0.04em] text-ink-tertiary">{e.period}</span>
                    <span className="text-[14px] font-medium text-ink">{e.school}</span>
                    <span className="text-[12.5px] text-ink-secondary">
                      {e.degree} · {e.major}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <button
              type="button"
              onClick={() => scrollToSection('research')}
              className="group mt-8 inline-flex items-center gap-2 rounded-tile border border-line-strong px-4 py-2 text-[13px] text-ink-secondary transition-colors duration-300 hover:border-accent-line hover:text-accent"
            >
              了解更多
              <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={statsRef} className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((s, i) => (
              <StatCard key={s.label} stat={s} active={statsInView} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
