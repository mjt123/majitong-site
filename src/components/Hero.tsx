import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/data/site';
import { profile } from '@/data/profile';
import { EASE, heroSequence } from '@/theme/animation';
import { scrollToSection } from '@/hooks/useScrollSpy';
import { Icon } from '@/components/ui/Icon';
import { HeroVisual } from './hero/HeroVisual';

function enter(delay: number, reduce: boolean) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.85, delay, ease: EASE.precise },
      };
}

/** 02 Hero —— 深色数字实验室：左文右图，公式 · 框图 · 轨迹 · 车辆按序进入 */
export function Hero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="home" className="relative overflow-hidden bg-hero-bg">
      {/* 顶部环境光 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1000px 520px at 18% -6%, var(--color-hero-glow), transparent 62%), radial-gradient(820px 480px at 88% 12%, rgba(46,107,230,0.10), transparent 60%)',
        }}
      />
      {/* 底部向内容区的过渡细线 */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-hero-line" />

      <div className="container-site relative grid min-h-[660px] items-center gap-10 pb-16 pt-28 lg:min-h-[700px] lg:grid-cols-[46fr_54fr] lg:gap-6 lg:pb-20 lg:pt-24">
        {/* 左：定位与行动 */}
        <div className="relative z-10 max-w-xl">
          <motion.p
            {...enter(heroSequence.kicker, reduce)}
            className="kicker flex items-center gap-2.5 text-hero-text-2"
          >
            <span aria-hidden className="inline-block h-[7px] w-[7px] border border-accent-strong" />
            Autonomous Driving · Planning & Control
          </motion.p>

          {/* 姓名 —— 首屏身份标识 */}
          <motion.div
            {...enter(heroSequence.kicker + 0.08, reduce)}
            className="mt-5 flex flex-wrap items-baseline gap-x-3.5 gap-y-1"
          >
            <span className="text-[1.5rem] font-semibold tracking-[0.1em] text-hero-text sm:text-[1.7rem]">
              {profile.name}
            </span>
            <span className="font-mono text-[11.5px] tracking-[0.24em] text-hero-text-2">
              {profile.nameEn.toUpperCase()}
            </span>
            <span className="rounded-tile border border-hero-line px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-hero-text-2">
              {profile.title}
            </span>
          </motion.div>

          <motion.h1
            {...enter(heroSequence.titleL1, reduce)}
            className="mt-5 text-[2.1rem] font-bold leading-[1.18] tracking-[0.01em] text-hero-text sm:text-[2.7rem] lg:text-[3.05rem]"
          >
            {siteConfig.hero.titleLine1}
          </motion.h1>
          <motion.h2
            {...enter(heroSequence.titleL2, reduce)}
            className="mt-1.5 bg-gradient-to-r from-accent-strong to-accent-secondary bg-clip-text text-[1.7rem] font-bold leading-[1.25] tracking-[0.01em] text-transparent sm:text-[2.15rem] lg:text-[2.4rem]"
          >
            {siteConfig.hero.titleLine2}
          </motion.h2>

          <motion.div {...enter(heroSequence.body, reduce)} className="mt-6 space-y-1.5">
            {profile.tagline.map((line) => (
              <p key={line} className="text-[15px] leading-relaxed text-hero-text-2">
                {line}
              </p>
            ))}
          </motion.div>

          <motion.ul {...enter(heroSequence.keywords, reduce)} className="mt-8 flex items-center">
            {profile.keywords.map((k, i) => (
              <li key={k.label} className={i > 0 ? 'flex items-center border-l border-hero-line pl-5 ml-5' : ''}>
                <span className="flex items-center gap-2 text-[13px] font-medium text-hero-text">
                  <Icon name={k.icon} size={15} className="text-accent-strong" />
                  {k.label}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...enter(heroSequence.cta, reduce)} className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('research')}
              className="group inline-flex items-center gap-2 rounded-tile bg-accent px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors duration-300 hover:bg-accent-strong"
            >
              查看我的研究
              <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <a
              href={profile.resume}
              download="马冀桐-自动驾驶规控算法工程师-简历.pdf"
              className="inline-flex items-center gap-2 rounded-tile border border-hero-line px-5 py-2.5 text-[13.5px] font-medium text-hero-text transition-colors duration-300 hover:border-accent-strong hover:text-accent-strong"
            >
              <Icon name="download" size={14} />
              下载个人简历
            </a>
          </motion.div>
        </div>

        {/* 右：控制系统数字视觉 */}
        <motion.div {...enter(0.1, reduce)} className="relative z-0">
          <HeroVisual />
        </motion.div>
      </div>

      {/* 滚动指示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0.6 : 1 }}
        transition={{ delay: heroSequence.ambient + 0.4, duration: 1 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden
      >
        <span className="kicker text-[9px] text-hero-text-2">Scroll</span>
        <span className="block h-7 w-px bg-hero-line" />
        {!reduce && (
          <motion.span
            className="absolute bottom-1 block h-1.5 w-1.5 rounded-full bg-accent-strong"
            animate={{ y: [0, 18, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </section>
  );
}
