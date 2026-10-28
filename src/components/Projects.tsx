import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { ProjectFigure } from './figures/ProjectFigures';

/** 05 项目实践 —— 深色仿真图作为视觉主体 */
export function Projects() {
  return (
    <section id="projects" className="bg-bg py-20 lg:py-24">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="项目实践" en="Projects" />
          <p className="hidden pb-1 font-mono text-[11px] tracking-[0.14em] text-ink-tertiary md:block">
            {projects.length} PROJECTS · CONTROL IN PRODUCTION
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.06 * (i % 2)}>
              <Link
                to={`/projects/${project.id}`}
                className="group block overflow-hidden rounded-card border border-line bg-surface-raised shadow-card transition-[transform,box-shadow] duration-300 ease-precise hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* 技术图形（hover 轻微放大） */}
                <div className="relative overflow-hidden border-b border-line">
                  <div className="transition-transform duration-500 ease-precise group-hover:scale-[1.025]">
                    <ProjectFigure type={project.figure.type} />
                  </div>
                  <span className="absolute left-4 top-3.5 rounded-tile border border-hero-line bg-hero-bg/70 px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-hero-text-2 backdrop-blur-sm">
                    {project.index}
                  </span>
                </div>

                <div className="p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[16.5px] font-semibold tracking-[0.01em] text-ink transition-colors duration-300 group-hover:text-accent">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 font-serif text-[12px] italic text-ink-tertiary">{project.titleEn}</p>
                    </div>
                    <span className="mt-1 shrink-0 text-ink-tertiary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                      <Icon name="arrow-up-right" size={17} className="text-accent" />
                    </span>
                  </div>
                  <p className="mt-2.5 min-h-[3.2em] text-[13px] leading-[1.75] text-ink-secondary">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-tile border border-line px-2 py-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-secondary transition-colors duration-300 group-hover:border-accent-line group-hover:text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
