import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { TravelStop } from '@/types';
import { DURATION, EASE } from '@/theme/animation';
import { Icon } from '@/components/ui/Icon';

/** 旅行照片灯箱：全屏遮罩 + 图纸风信息栏，ESC / 点击遮罩 / 关闭按钮退出 */
export function TravelLightbox({ stop, onClose }: { stop: TravelStop | null; onClose: () => void }) {
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (!stop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [stop, onClose]);

  return (
    <AnimatePresence>
      {stop && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : DURATION.fast, ease: EASE.precise }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`旅行照片：${stop.name}`}
        >
          <div aria-hidden className="absolute inset-0" style={{ background: 'var(--color-hero-background)', opacity: 0.88 }} />

          <motion.figure
            className="relative z-10 flex max-h-full flex-col overflow-hidden rounded-card border border-paper-line bg-paper-raised shadow-overlay lg:flex-row"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : DURATION.base, ease: EASE.precise }}
          >
            <img
              src={stop.image}
              alt={stop.alt}
              width={1024}
              height={1536}
              decoding="async"
              className="max-h-[58vh] w-auto self-center object-contain lg:max-h-[82vh]"
            />
            <figcaption className="w-full border-t border-paper-line p-6 sm:p-7 lg:w-72 lg:border-l lg:border-t-0">
              <p className="kicker text-paper-ink-2">
                № {stop.index} · {stop.region}
              </p>
              <h3 className="mt-2.5 text-xl font-bold text-paper-ink">{stop.name}</h3>
              <p className="mt-1 font-serif text-[13px] italic text-accent-strong">{stop.nameEn}</p>
              <dl className="mt-5 space-y-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-paper-ink-2">
                {stop.date && (
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0">Date</dt>
                    <dd className="text-paper-ink">{stop.date}</dd>
                  </div>
                )}
                <div className="flex gap-3">
                  <dt className="w-12 shrink-0">Scene</dt>
                  <dd className="normal-case text-paper-ink">{stop.scene}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-12 shrink-0">Geo</dt>
                  <dd className="text-paper-ink">
                    {stop.lat.toFixed(2)}°N, {stop.lng.toFixed(2)}°E
                  </dd>
                </div>
              </dl>
              <span aria-hidden className="mt-5 block h-px w-10 bg-gold" />
              <p className="mt-4 text-[13px] leading-[1.9] text-paper-ink-2">{stop.note}</p>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭照片"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-hero-line text-hero-text-2 transition-colors hover:text-hero-text"
          >
            <Icon name="close" size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
