import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import { EASE } from '@/theme/animation';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { Tex } from '@/components/ui/Tex';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectFigure } from '@/components/figures/ProjectFigures';
import { ArchitectureDiagram } from '@/components/figures/ArchitectureDiagram';
import { usePageTitle } from '@/hooks/usePageTitle';

function enter(reduce: boolean, delay = 0) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: EASE.precise },
      };
}

/** 详情章节标题：mono 编号 + 标题 + 细线 */
function DetailSection({
  index,
  title,
  en,
  children,
  className,
}: {
  index: string;
  title: string;
  en: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn('scroll-mt-24', className)}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent">{index}</span>
        <h2 className="text-lg font-semibold tracking-[0.01em] text-ink sm:text-xl">{title}</h2>
        <span className="font-serif text-[12px] italic text-ink-tertiary">/ {en}</span>
        <span aria-hidden className="ml-2 hidden h-px flex-1 bg-line sm:block" />
      </div>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

/** 公式块：KaTeX 排版 + 编号 */
function EquationBlock({ tex, label, note }: { tex: string; label?: string; note?: string }) {
  return (
    <div className="rounded-tile border border-line bg-surface px-5 py-4">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        <Tex tex={tex} display className="min-w-0 shrink-[2] text-[15px] text-ink" />
        {label && <span className="shrink-0 font-mono text-[11px] text-ink-tertiary">{label}</span>}
      </div>
      {note && <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-relaxed text-ink-tertiary">{note}</p>}
    </div>
  );
}

/** 06 项目详情 —— Problem · Model · Controller · Experiment · Result */
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const reduce = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  usePageTitle(project?.title, project?.summary);

  if (!project) return <Navigate to="/" replace />;

  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  const d = project.detail;

  return (
    <main className="bg-bg">
      {/* —— 头部：深色条带，呼应 Hero —— */}
      <section className="relative overflow-hidden bg-hero-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(720px 320px at 80% -10%, var(--color-hero-glow), transparent 62%)' }}
        />
        <div className="container-site relative pb-14 pt-24 lg:pt-28">
          <motion.div {...enter(reduce)}>
            <button
              type="button"
              onClick={() => navigate('/', { state: { scrollTo: 'projects' } })}
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="arrow-left" size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              BACK / 项目实践
            </button>
          </motion.div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.08fr]">
            <div>
              <motion.p {...enter(reduce, 0.05)} className="kicker flex items-center gap-2.5 text-hero-text-2">
                <span aria-hidden className="inline-block h-[7px] w-[7px] border border-accent-strong" />
                Project / {project.index}
              </motion.p>
              <motion.h1
                {...enter(reduce, 0.12)}
                className="mt-4 text-[1.8rem] font-bold leading-[1.2] text-hero-text sm:text-[2.2rem]"
              >
                {project.title}
              </motion.h1>
              <motion.p {...enter(reduce, 0.18)} className="mt-1 font-serif text-[14px] italic text-accent-strong">
                {project.titleEn}
              </motion.p>
              <motion.p {...enter(reduce, 0.24)} className="mt-5 max-w-xl text-[14px] leading-[1.85] text-hero-text-2">
                {project.summary}
              </motion.p>
              <motion.div {...enter(reduce, 0.3)} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 text-[12px] text-hero-text-2">
                  <Icon name="target" size={13} className="text-accent-strong" />
                  {project.role}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[12px] text-hero-text-2">
                  <Icon name="calendar" size={13} className="text-accent-strong" />
                  {project.period}
                </span>
              </motion.div>
              <motion.div {...enter(reduce, 0.36)} className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="rounded-tile border border-hero-line px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] text-hero-text-2">
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div {...enter(reduce, 0.25)} className="overflow-hidden rounded-card border border-hero-line shadow-overlay">
              <ProjectFigure type={project.figure.type} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* —— 正文 —— */}
      <div className="container-site max-w-[52rem] space-y-14 py-14 lg:space-y-16 lg:py-18">
        <DetailSection index="01" title="项目背景" en="Background">
          <p className="text-[14.5px] leading-[1.9] text-ink-secondary">{d.background}</p>
        </DetailSection>

        <DetailSection index="02" title="问题定义" en="Problem">
          <p className="text-[14.5px] leading-[1.9] text-ink-secondary">{d.problem}</p>
        </DetailSection>

        <DetailSection index="03" title="控制目标" en="Control Objectives">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {d.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2.5 rounded-tile border border-line bg-surface px-4 py-3">
                <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-[13px] leading-relaxed text-ink-secondary">{o}</span>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection index="04" title="算法设计" en="Controller Design">
          <div className="grid gap-4 sm:grid-cols-2">
            {d.approach.map((a, i) => (
              <div key={a.title} className="rounded-card border border-line bg-surface-raised p-5 shadow-card">
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-[10.5px] text-accent">0{i + 1}</span>
                  <span className="text-[14px] font-semibold text-ink">{a.title}</span>
                </p>
                <p className="mt-2 text-[13px] leading-[1.8] text-ink-secondary">{a.body}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection index="05" title="系统架构" en="System Architecture">
          <div className="overflow-x-auto rounded-card border border-line bg-surface-raised p-5 shadow-card">
            <ArchitectureDiagram architecture={d.architecture} />
          </div>
        </DetailSection>

        <DetailSection index="06" title="控制模型" en="Control Formulation">
          <div className="space-y-7">
            {d.models.map((m) => (
              <div key={m.title}>
                <p className="mb-3 flex items-center gap-2.5">
                  <span className="h-[14px] w-[2px] bg-accent" aria-hidden />
                  <span className="text-[13.5px] font-semibold text-ink">{m.title}</span>
                </p>
                <div className="space-y-2.5">
                  {m.equations.map((eq) => (
                    <EquationBlock key={eq.tex} tex={eq.tex} label={eq.label} note={eq.note} />
                  ))}
                </div>
                {m.params && (
                  <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-tile border border-line bg-line sm:grid-cols-4">
                    {m.params.map((p) => (
                      <div key={p.name} className="bg-surface-raised px-4 py-3">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-tertiary">{p.name}</dt>
                        <dd className="mt-1 font-mono text-[13px] font-medium text-ink">{p.value}</dd>
                        {p.note && <dd className="mt-0.5 text-[10.5px] text-ink-tertiary">{p.note}</dd>}
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection index="07" title="算法流程" en="Pipeline">
          <ol className="relative space-y-0 border-l border-line pl-0">
            {d.pipeline.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-6 pl-6 last:pb-0">
                <span className="absolute -left-[7px] top-[3px] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent-line bg-bg">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">
                    <span className="mr-2 font-mono text-[11px] text-accent">STEP {i + 1}</span>
                    {s.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.8] text-ink-secondary">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </DetailSection>

        <DetailSection index="08" title="实验结果" en="Experiments & Results">
          <p className="max-w-3xl text-[14.5px] leading-[1.9] text-ink-secondary">{d.results.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
            {d.results.metrics.map((m) => (
              <div key={m.label} className="bg-surface-raised px-5 py-4">
                <p className="font-mono text-[19px] font-semibold tracking-tight text-accent">{m.value}</p>
                <p className="mt-1 text-[12px] font-medium text-ink">{m.label}</p>
                {m.note && <p className="mt-0.5 text-[10.5px] text-ink-tertiary">{m.note}</p>}
              </div>
            ))}
          </div>
          <div className={cn('mt-5 grid gap-5', d.results.figures.length > 1 && 'lg:grid-cols-2')}>
            {d.results.figures.map((f, i) => (
              <figure key={f.caption} className="overflow-hidden rounded-card border border-line shadow-card">
                <ProjectFigure type={f.type} />
                <figcaption className="border-t border-line bg-surface-raised px-4 py-2.5 text-[11.5px] text-ink-secondary">
                  <span className="mr-2 font-mono text-[10px] text-ink-tertiary">Fig.{i + 1}</span>
                  {f.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <ul className="mt-5 space-y-2">
            {d.results.figureNotes.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-secondary">
                <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 bg-accent" />
                {n}
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection index="09" title="工程挑战" en="Engineering Challenges">
          <div className="space-y-3">
            {d.challenges.map((c) => (
              <div key={c.title} className="rounded-card border border-line bg-surface-raised p-5 shadow-card">
                <p className="text-[14px] font-semibold text-ink">{c.title}</p>
                <p className="mt-1.5 text-[13px] leading-[1.8] text-ink-secondary">{c.body}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection index="10" title="最终效果" en="Outcome">
          <ul className="space-y-2.5">
            {d.outcome.map((o) => (
              <li key={o} className="flex items-start gap-2.5">
                <Icon name="check" size={14} className="mt-1 shrink-0 text-accent" />
                <span className="text-[14px] leading-[1.8] text-ink-secondary">{o}</span>
              </li>
            ))}
          </ul>
        </DetailSection>

        {/* 下一个项目 */}
        <Reveal>
          <Link
            to={`/projects/${nextProject.id}`}
            className="group flex items-center justify-between rounded-card border border-line bg-surface-raised px-6 py-5 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent-line hover:shadow-card-hover"
          >
            <div>
              <p className="font-mono text-[10.5px] tracking-[0.16em] text-ink-tertiary">NEXT PROJECT</p>
              <p className="mt-1 text-[15px] font-semibold text-ink transition-colors group-hover:text-accent">
                {nextProject.index} · {nextProject.title}
              </p>
            </div>
            <Icon name="arrow-right" size={17} className="text-ink-tertiary transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
