import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { scrollToSection } from '@/hooks/useScrollSpy';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';

// 路由级代码分割：首页只载首屏需要的代码，其余页面按需拉取
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const BlogImportPage = lazy(() => import('@/pages/BlogImportPage').then((m) => ({ default: m.BlogImportPage })));
const ArtPage = lazy(() => import('@/pages/ArtPage').then((m) => ({ default: m.ArtPage })));
const TravelPage = lazy(() => import('@/pages/TravelPage').then((m) => ({ default: m.TravelPage })));
const TravelEditPage = lazy(() => import('@/pages/TravelEditPage').then((m) => ({ default: m.TravelEditPage })));

/** 路由切换：跨页锚点定位 / 回到顶部 */
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const timer = window.setTimeout(() => scrollToSection(state.scrollTo!), 60);
      window.history.replaceState({}, '');
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.state]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollManager />
        <Navigation />
        {/* fallback 留纸面空白：分包 chunk 为本地小文件，加载窗口极短，闪烁比转圈更廉价 */}
        <Suspense fallback={<div className="min-h-[70vh] bg-surface" aria-hidden />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/blog-import" element={<BlogImportPage />} />
            <Route path="/art" element={<ArtPage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/travel-edit" element={<TravelEditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}
