import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';

/**
 * 章节标题 —— 学术排版语言：
 * left  : 竖向 accent 短线 + 中文标题 + Serif 英文
 * center: 两侧细线 + 中文标题 + Serif 英文
 */
export function SectionHeading({
  title,
  en,
  align = 'left',
  dark = false,
  className,
}: {
  title: string;
  en: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}) {
  if (align === 'center') {
    return (
      <Reveal className={cn('flex items-center justify-center gap-5', className)}>
        <span aria-hidden className="hidden h-px w-14 bg-line-strong sm:block" />
        <h2
          className={cn(
            'flex flex-wrap items-baseline gap-x-3 gap-y-1 text-center text-xl font-semibold tracking-[0.02em] sm:text-2xl',
            dark ? 'text-hero-text' : 'text-ink',
          )}
        >
          {title}
          <span className={cn('font-serif text-sm font-normal italic tracking-wide sm:text-[15px]', dark ? 'text-hero-text-2' : 'text-ink-tertiary')}>
            / {en}
          </span>
        </h2>
        <span aria-hidden className="hidden h-px w-14 bg-line-strong sm:block" />
      </Reveal>
    );
  }

  return (
    <Reveal className={cn('flex items-center gap-3', className)}>
      <span aria-hidden className="h-[20px] w-[3px] shrink-0 bg-accent" />
      <h2
        className={cn(
          'flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl font-semibold tracking-[0.02em] sm:text-2xl',
          dark ? 'text-hero-text' : 'text-ink',
        )}
      >
        {title}
        <span className={cn('font-serif text-sm font-normal italic tracking-wide', dark ? 'text-hero-text-2' : 'text-ink-tertiary')}>
          / {en}
        </span>
      </h2>
    </Reveal>
  );
}
