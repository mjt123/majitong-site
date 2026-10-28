import { researchAreas } from '@/data/research';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Tex } from '@/components/ui/Tex';
import { ResearchCard } from './research/ResearchCard';

/** 04 研究方向 —— 站点核心：五个方向的科研图形与 hover 深度交互 */
export function Research() {
  return (
    <section id="research" className="border-y border-line bg-surface py-20 lg:py-24">
      <div className="container-site">
        <SectionHeading title="研究方向" en="Control Theory & Algorithms" align="center" />
        <Reveal delay={0.1} className="mt-3 flex justify-center">
          <p className="max-w-xl text-center text-[13px] leading-relaxed text-ink-tertiary">
            以控制理论为方法主线，覆盖从建模、滤波到闭环优化的完整链路
            <span className="mx-2 font-serif italic">( </span>
            <Tex tex={'\\dot{x} = A x + B u'} className="align-middle text-[12px] text-ink-tertiary" />
            <span className="mx-2 font-serif italic"> )</span>
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-5">
          {researchAreas.map((area, i) => (
            <ResearchCard key={area.id} area={area} delay={0.08 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
