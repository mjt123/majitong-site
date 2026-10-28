import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blog';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';

/** 09 技术博客 —— 克制的研究笔记列表，非媒体站；有正文的文章可点入详情页 */
export function Blog() {
  return (
    <section id="blog" className="border-y border-line bg-surface py-20 lg:py-24">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="技术博客" en="Technical Blog" />
          <p className="hidden pb-1 font-mono text-[11px] tracking-[0.14em] text-ink-tertiary md:block">
            NOTES ON CONTROL & DRIVING
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-card border border-line bg-surface-raised shadow-card">
          {blogPosts.map((post, i) => {
            const readable = Boolean(post.hasArticle);
            const className =
              'group block border-l-2 border-transparent px-5 py-5 transition-colors duration-300 hover:border-l-accent hover:bg-surface lg:px-7 ' +
              (i > 0 ? 'border-t border-line' : '');

            const body = (
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <h3
                    className={
                      'text-[15px] font-semibold leading-snug transition-colors duration-300 lg:text-[16px] ' +
                      (readable ? 'text-ink group-hover:text-accent' : 'text-ink')
                    }
                  >
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 max-w-3xl text-[12.5px] leading-relaxed text-ink-secondary">
                    {post.excerpt}
                  </p>
                  <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.06em] text-ink-tertiary">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" size={11} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="clock" size={11} />
                      {post.readTime}
                    </span>
                    <span className="text-accent">{post.tags.join(' · ')}</span>
                  </p>
                </div>
                <span
                  className={
                    'mt-1 shrink-0 text-ink-tertiary transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent ' +
                    (readable ? 'opacity-0 group-hover:opacity-100' : 'hidden')
                  }
                >
                  <Icon name="arrow-up-right" size={16} />
                </span>
              </div>
            );

            return (
              <Reveal key={post.slug} delay={0.05 * i}>
                {readable ? (
                  <Link to={`/blog/${post.slug}`} className={className} aria-label={`阅读文章：${post.title}`}>
                    {body}
                  </Link>
                ) : (
                  <article className={className + ' cursor-default'}>{body}</article>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
