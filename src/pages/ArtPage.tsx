import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { artIntro, artPieces } from '@/data/art';
import { DURATION, EASE } from '@/theme/animation';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';import { usePageTitle } from '@/hooks/usePageTitle';


function enter(reduce: boolean, delay = 0) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: DURATION.base, delay, ease: EASE.precise },
      };
}

/** /art 艺术页 —— 纸质画廊：墨色头部条带（保证导航可读）+ 纸面正文 */
export function ArtPage() {
  usePageTitle('艺术 · 纸上造物');
  const reduce = useReducedMotion() ?? false;
  const navigate = useNavigate();

  return (
    <main className="bg-paper text-paper-ink">
      {/* —— 头部：墨色条带 —— */}
      <section className="relative overflow-hidden bg-hero-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(680px 300px at 78% -12%, var(--color-hero-glow), transparent 62%)' }}
        />
        <div className="container-site relative pb-16 pt-24 lg:pb-20 lg:pt-28">
          <motion.div {...enter(reduce)}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="arrow-left" size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              BACK / 返回首页
            </button>
          </motion.div>

          <motion.p {...enter(reduce, 0.05)} className="kicker mt-10 flex items-center gap-2.5 text-hero-text-2">
            <span aria-hidden className="inline-block h-[7px] w-[7px] bg-gold" />
            {artIntro.kicker} / 实景拼贴
          </motion.p>
          <motion.h1
            {...enter(reduce, 0.12)}
            className="mt-4 text-[2rem] font-bold leading-[1.2] tracking-[0.02em] text-hero-text sm:text-[2.6rem]"
          >
            {artIntro.title}
          </motion.h1>
          <motion.p {...enter(reduce, 0.18)} className="mt-2 font-serif text-[15px] italic text-accent-strong">
            {artIntro.titleEn}
          </motion.p>
          <motion.p {...enter(reduce, 0.24)} className="mt-6 max-w-2xl text-[14.5px] leading-[1.95] text-hero-text-2">
            {artIntro.lede}
          </motion.p>
        </div>
      </section>

      {/* —— 作品：纸面画廊，桌面端图文左右交替 —— */}
      <div className="container-site space-y-24 py-16 lg:space-y-32 lg:py-24">
        {artPieces.map((piece, i) => (
          <article key={piece.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className={cn('lg:col-span-5', i % 2 === 1 && 'lg:order-last')}>
              <figure className="mx-auto w-full max-w-[26rem]">
                <img
                  src={piece.image}
                  alt={piece.alt}
                  width={1024}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full shadow-card"
                />
              </figure>
            </Reveal>

            <div className={cn('lg:col-span-7', i % 2 === 1 && 'lg:order-first')}>
              <Reveal delay={0.08}>
                <p className="kicker flex items-center gap-3 text-paper-ink-2">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 bg-gold" />
                  № {piece.index} · {piece.year}
                </p>
                <h2 className="mt-4 text-[1.6rem] font-bold tracking-[0.01em] text-paper-ink sm:text-[1.9rem]">
                  {piece.title}
                </h2>
                <p className="mt-1.5 font-serif text-[14px] italic text-paper-ink-2">{piece.titleEn}</p>
                <p className="mt-6 max-w-xl text-[14.5px] leading-[1.95] text-paper-ink-2">{piece.note}</p>
                <dl className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-tile border border-paper-line bg-paper-line sm:grid-cols-2">
                  <div className="bg-paper-raised px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper-ink-2">Medium / 媒介</dt>
                    <dd className="mt-1 text-[13px] font-medium text-paper-ink">{piece.medium}</dd>
                  </div>
                  <div className="bg-paper-raised px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper-ink-2">Text / 画面文字</dt>
                    <dd className="mt-1 text-[13px] font-medium text-paper-ink">
                      「{piece.posterText.zh}」
                      <span className="ml-1.5 font-mono text-[11px] text-paper-ink-2">{piece.posterText.en}</span>
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </article>
        ))}
      </div>

      {/* —— 尾声 —— */}
      <section className="border-t border-paper-line">
        <div className="container-site max-w-2xl py-16 text-center lg:py-24">
          <Reveal>
            <p className="kicker text-paper-ink-2">{artIntro.outroKicker}</p>
            <h2 className="mt-4 text-xl font-bold text-paper-ink sm:text-2xl">{artIntro.outroTitle}</h2>
            <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-gold" />
            <p className="mt-6 text-[14px] leading-[1.95] text-paper-ink-2">{artIntro.outro}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
