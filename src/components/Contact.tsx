import { profile } from '@/data/profile';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/types';

const CHANNELS: { icon: IconName; label: string; value: string; href?: string; note?: string }[] = [
  { icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}`, note: '合作与交流' },
  { icon: 'phone', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}`, note: '工作日 9:00 – 20:00' },
  { icon: 'map-pin', label: 'Location', value: profile.location, note: '工作所在地' },
  { icon: 'target', label: 'Focus', value: '量产规控 · 技术交流', note: '欢迎联系' },
];

/** 10 联系我 —— 学术主页式的克制收尾，不做大表单 */
export function Contact() {
  return (
    <section id="contact" className="bg-bg py-20 lg:py-24">
      <div className="container-site">
        <SectionHeading title="联系我" en="Contact" align="center" />
        <Reveal delay={0.08}>
          <p className="mt-4 text-center text-[13.5px] leading-relaxed text-ink-tertiary">
            如果你也在做自动驾驶控制相关的工作，欢迎交流 ——
            <span className="mx-1 font-serif italic">from modeling to real vehicles.</span>
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mx-auto mt-10 grid max-w-3xl gap-px overflow-hidden rounded-card border border-line bg-line shadow-card sm:grid-cols-2">
            {CHANNELS.map((c) => {
              const inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-tile border border-line bg-surface text-ink-secondary transition-colors duration-300 group-hover:border-accent-line group-hover:text-accent">
                    <Icon name={c.icon} size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-tertiary">{c.label}</span>
                    <span className="mt-0.5 block truncate text-[13.5px] font-medium text-ink transition-colors duration-300 group-hover:text-accent">
                      {c.value}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-tertiary">{c.note}</span>
                  </span>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 bg-surface-raised px-6 py-5 transition-colors duration-300 hover:bg-surface"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="group flex items-center gap-4 bg-surface-raised px-6 py-5">
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
