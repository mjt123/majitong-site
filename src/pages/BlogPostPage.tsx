import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { blogPosts } from '@/data/blog';
import { blogArticles } from '@/data/blogArticles';
import { EASE } from '@/theme/animation';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { ArticleBody } from '@/components/article/ArticleBody';
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

/** 10 博客文章页 —— 学术笔记排版：深色头部条带 + 单栏正文 */
export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduce = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);
  const article = post ? blogArticles[post.slug] : undefined;
  usePageTitle(post?.title, post?.excerpt);

  if (!post || !article) return <Navigate to="/" replace />;

  const readable = blogPosts.filter((p) => blogArticles[p.slug]);
  const idx = readable.findIndex((p) => p.slug === post.slug);
  const prev = readable[(idx - 1 + readable.length) % readable.length];
  const next = readable[(idx + 1) % readable.length];

  return (
    <main className="bg-bg">
      {/* —— 头部：深色条带，呼应全站 —— */}
      <section className="relative overflow-hidden bg-hero-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(720px 320px at 80% -10%, var(--color-hero-glow), transparent 62%)' }}
        />
        <div className="container-site relative pb-14 pt-24 lg:pt-28">
          <motion.div {...enter(reduce)} className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/', { state: { scrollTo: 'blog' } })}
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="arrow-left" size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              BACK / 技术博客
            </button>
            <Link
              to="/blog-import"
              className="group inline-flex items-center gap-2 border border-hero-text-2/30 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:border-accent-strong hover:text-hero-text"
            >
              IMPORT / 导入 MD
              <Icon name="arrow-up-right" size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div className="mt-8 max-w-3xl">
            <motion.p {...enter(reduce, 0.05)} className="kicker flex items-center gap-2.5 text-hero-text-2">
              <span aria-hidden className="inline-block h-[7px] w-[7px] border border-accent-strong" />
              BLOG / NOTE {String(idx + 1).padStart(2, '0')}
            </motion.p>
            <motion.h1
              {...enter(reduce, 0.12)}
              className="mt-4 text-[1.7rem] font-bold leading-[1.3] text-hero-text sm:text-[2.1rem]"
            >
              {post.title}
            </motion.h1>
            <motion.div {...enter(reduce, 0.2)} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11.5px] tracking-[0.06em] text-hero-text-2">
              <span className="flex items-center gap-1.5">
                <Icon name="calendar" size={12} className="text-accent-strong" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="clock" size={12} className="text-accent-strong" />
                {post.readTime.toUpperCase()}
              </span>
              <span className="text-accent-strong">{post.tags.join(' · ')}</span>
            </motion.div>
            <motion.p {...enter(reduce, 0.26)} className="mt-6 max-w-2xl border-l-2 border-accent/60 pl-4 text-[13.5px] leading-[1.9] text-hero-text-2">
              {post.excerpt}
            </motion.p>
          </div>
        </div>
      </section>

      {/* —— 正文 —— */}
      <section className="py-16 lg:py-20">
        <div className="container-site">
          <article className="mx-auto max-w-[760px]">
            <ArticleBody blocks={article.blocks} />
          </article>

          {/* —— 上一篇 / 下一篇 —— */}
          <nav className="mx-auto mt-20 grid max-w-[760px] gap-4 sm:grid-cols-2">
            {[
              { label: 'PREV / 上一篇', post: prev },
              { label: 'NEXT / 下一篇', post: next, alignRight: true },
            ].map(({ label, post: p, alignRight }) => (
              <Reveal key={label}>
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  className={
                    'group flex h-full w-full flex-col rounded-card border border-line bg-surface p-5 text-left shadow-card transition-colors duration-300 hover:border-accent-line ' +
                    (alignRight ? 'sm:items-end sm:text-right' : '')
                  }
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-ink-tertiary">{label}</span>
                  <span className="mt-2 text-[13.5px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </span>
                </button>
              </Reveal>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
