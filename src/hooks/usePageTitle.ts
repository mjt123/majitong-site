import { useEffect } from 'react';

const BASE = '马冀桐 | 自动驾驶规控算法工程师';

/**
 * 页面级 <title>（可选副标题如博客文章标题）与 meta description。
 * 卸载时恢复基准值，避免上一页标题残留。
 */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | 马冀桐` : BASE;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
    return () => {
      document.title = BASE;
    };
  }, [title, description]);
}
