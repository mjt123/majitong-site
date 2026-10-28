import { motion, useReducedMotion } from 'framer-motion';
import { skills } from '@/data/skills';
import { EASE } from '@/theme/animation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Tex } from '@/components/ui/Tex';

/** 07 技术能力 —— 极细细进度线，滚动进入视口时从 0 生长 */
export function Skills() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="skills" className="border-y border-line bg-surface py-20 lg:py-24">
      <div className="container-site grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading title="技术能力" en="Skills" />
          <div className="mt-9 space-y-[18px]">
            {skills.map((skill, i) => (
              <Reveal key={skill.name} delay={0.04 * i} amount={0.4}>
                <div className="group">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[13.5px] font-medium text-ink">
                      {skill.name}
                      {skill.note && (
                        <span className="ml-2.5 hidden font-mono text-[10px] tracking-[0.06em] text-ink-tertiary sm:inline">
                          {skill.note}
                        </span>
                      )}
                    </p>
                    <span className="shrink-0 font-mono text-[11.5px] text-ink-secondary transition-colors duration-300 group-hover:text-accent">
                      {skill.level}%
                    </span>
                  </div>
                  {/* 1.5px 视觉高度的细进度线 */}
                  <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-secondary to-accent-strong"
                      initial={reduce ? { scaleX: skill.level / 100 } : { scaleX: 0 }}
                      whileInView={{ scaleX: skill.level / 100 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.08 * i + 0.15, ease: EASE.precise }}
                      style={{ transformOrigin: 'left center' }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 能力的注脚：一条公式 + 一句工程观 */}
        <Reveal delay={0.15}>
          <div className="rounded-card border border-line bg-surface-raised p-8 shadow-card">
            <p className="kicker text-ink-tertiary">Prerequisite</p>
            <div className="mt-5 overflow-x-auto text-[17px] text-ink">
              <Tex
                tex={'u^*(t) = -\\,R^{-1}B^{\\mathsf T} P\\, x^*(t), \\quad x^*(t_0) = x_0'}
                display
              />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-ink-tertiary">
              LQR OPTIMAL FEEDBACK — CLOSED-FORM, ALWAYS IN RANGE
            </p>
            <p className="mt-6 border-t border-line pt-5 text-[13.5px] leading-[1.9] text-ink-secondary">
              能力的价值在于闭环：理论给出结构，工程给出约束，实验给出真值。
              三者缺一，控制算法就只是仿真里的曲线。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
