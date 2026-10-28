import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { TravelStop } from '@/types';
import { travelIntro, travelStops } from '@/data/travel';
import { DURATION, EASE } from '@/theme/animation';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { ChinaMap } from '@/components/travel/ChinaMap';
import { TravelLightbox } from '@/components/travel/TravelLightbox';
import { usePageTitle } from '@/hooks/usePageTitle';

function enter(reduce: boolean, delay = 0) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: DURATION.base, delay, ease: EASE.precise },
      };
}

/** /travel 足迹页 —— 中国地图旅行插画：墨色头部条带（保证导航可读）+ 纸面地图 */
export function TravelPage() {
  usePageTitle('足迹 · 旅行地图');
  const reduce = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const [selected, setSelected] = useState<TravelStop | null>(null);

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
            {travelIntro.kicker} / 旅行地图
          </motion.p>
          <motion.h1
            {...enter(reduce, 0.12)}
            className="mt-4 text-[2rem] font-bold leading-[1.2] tracking-[0.02em] text-hero-text sm:text-[2.6rem]"
          >
            {travelIntro.title}
          </motion.h1>
          <motion.p {...enter(reduce, 0.18)} className="mt-2 font-serif text-[15px] italic text-accent-strong">
            {travelIntro.titleEn}
          </motion.p>
          <motion.p {...enter(reduce, 0.24)} className="mt-6 max-w-2xl text-[14.5px] leading-[1.95] text-hero-text-2">
            {travelIntro.lede}
          </motion.p>
        </div>
      </section>

      {/* —— 地图主体 —— */}
      <section className="container-site py-14 lg:py-20">
        <Reveal amount={0.1}>
          <ChinaMap stops={travelStops} onSelect={setSelected} illustration={travelIntro.mapIllustration} />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-paper-line pt-4 font-mono text-[10.5px] tracking-[0.1em] text-paper-ink-2">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full border border-accent-strong bg-transparent" />
              {travelIntro.legendHover}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="map-pin" size={12} />
              {travelIntro.legendClick}
            </span>
            <span className="ml-auto hidden sm:inline">{travelIntro.mapMeta}</span>
            <Link
              to="/travel-edit"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-strong"
              title="图钉校准后台"
            >
              <Icon name="target" size={12} />
              PIN CALIBRATOR
            </Link>
          </div>
        </Reveal>
      </section>

      {/* —— 足迹索引 —— */}
      <section className="border-t border-paper-line">
        <div className="container-site py-16 lg:py-20">
          <Reveal>
            <p className="kicker text-paper-ink-2">Stop Index / 足迹索引</p>
            <h2 className="mt-4 text-xl font-bold text-paper-ink sm:text-2xl">
              {travelStops.length} 个落点，连成此刻的足迹
            </h2>
          </Reveal>
          <ol className="mt-10 border-t border-paper-line">
            {travelStops.map((stop, i) => (
              <li key={stop.id}>
                <Reveal delay={0.05 + i * 0.04} y={16}>
                  <button
                    type="button"
                    onClick={() => setSelected(stop)}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-paper-line py-5 text-left transition-colors hover:bg-paper-raised sm:gap-x-8"
                    aria-label={`查看 ${stop.name} 的旅行照片`}
                  >
                    <span className="font-mono text-[11px] tracking-[0.12em] text-gold">№ {stop.index}</span>
                    <span>
                      <span className="text-[15.5px] font-semibold text-paper-ink">{stop.name}</span>
                      <span className="ml-3 hidden font-mono text-[11px] text-paper-ink-2 sm:inline">{stop.region}</span>
                      <span className="mt-1 block text-[13px] leading-[1.8] text-paper-ink-2">{stop.scene} — {stop.note}</span>
                    </span>
                    <span className="inline-flex items-center gap-3 font-mono text-[11px] text-paper-ink-2">
                      {stop.date}
                      <Icon
                        name="arrow-up-right"
                        size={14}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong"
                      />
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* —— 尾声 —— */}
      <section className="border-t border-paper-line">
        <div className="container-site max-w-2xl py-16 text-center lg:py-24">
          <Reveal>
            <p className="kicker text-paper-ink-2">{travelIntro.outroKicker}</p>
            <h2 className="mt-4 text-xl font-bold text-paper-ink sm:text-2xl">{travelIntro.outroTitle}</h2>
            <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-gold" />
            <p className="mt-6 text-[14px] leading-[1.95] text-paper-ink-2">{travelIntro.outro}</p>
          </Reveal>
        </div>
      </section>

      <TravelLightbox stop={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
