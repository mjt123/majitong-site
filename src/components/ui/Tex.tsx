import { useMemo } from 'react';
import katex from 'katex';
import { cn } from '@/utils/cn';

/** 真正的数学排版 —— KaTeX 渲染，杜绝把公式当普通文字 */
export function Tex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
        strict: false,
      }),
    [tex, display],
  );
  return <span className={cn(display && 'block', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
