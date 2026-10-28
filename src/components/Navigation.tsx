import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { siteConfig } from '@/data/site';
import { profile } from '@/data/profile';
import { useScrollSpy, useScrolled, scrollToSection } from '@/hooks/useScrollSpy';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/Logo';

/** 未来主题占位：架构已就绪，切换只需在 theme/THEMES 注册 */
const FUTURE_THEMES = ['Cyberpunk', 'Swiss'] as const;

function ThemeMenu() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const themeLabel = theme.name === 'academic' ? 'Academic' : theme.name;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="主题 / 外观设置"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-tile border border-hero-line px-2.5 py-1.5 text-[11px] font-mono tracking-[0.14em] text-hero-text-2 transition-colors hover:border-accent-strong hover:text-hero-text"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-accent-strong" />
        {themeLabel.toUpperCase()}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-50 mt-2 w-52 rounded-card border border-line bg-surface-raised p-1.5 shadow-overlay"
            >
              <p className="kicker px-3 pb-1.5 pt-2 text-[9px] text-ink-tertiary">Appearance</p>
              <div className="flex items-center justify-between rounded-tile px-3 py-2 text-[13px] text-ink">
                <span>Academic Engineering</span>
                <Icon name="check" size={14} className="text-accent" />
              </div>
              {FUTURE_THEMES.map((t) => (
                <div key={t} className="flex items-center justify-between rounded-tile px-3 py-2 text-[13px] text-ink-tertiary">
                  <span>{t}</span>
                  <span className="font-mono text-[10px]">即将上线</span>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 01 Navigation —— 透明起手，滚动后毛玻璃 + 细边框，当前章节以细线指示 */
export function Navigation() {
  const scrolled = useScrolled(30);
  const activeSection = useScrollSpy(siteConfig.nav.filter((n) => !n.path).map((n) => n.id));
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const go = (id: string) => {
    setMenuOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500',
        scrolled ? 'nav-scrolled' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        {/* 品牌 */}
        <Link to="/" className="group flex shrink-0 items-center gap-3 text-hero-text" onClick={() => setMenuOpen(false)}>
          <Logo size={30} />
          <span className="leading-tight">
            <span className="block text-[17px] font-semibold tracking-[0.06em]">{profile.name}</span>
            <span className="mt-0.5 block text-[11.5px] tracking-[0.08em] text-hero-text-2">{profile.title}</span>
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center xl:flex" aria-label="主导航">
          {siteConfig.nav.map((item) => {
            const active = item.path
              ? location.pathname === item.path
              : isHome && activeSection === item.id;
            const itemClass = cn(
              'relative px-3.5 py-2 text-[13px] tracking-[0.02em] transition-colors duration-300',
              active ? 'text-hero-text' : 'text-hero-text-2 hover:text-hero-text',
            );
            const content = (
              <>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-line"
                    className="absolute inset-x-3.5 -bottom-[1px] h-[2px] bg-accent-strong"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </>
            );
            return item.path ? (
              <Link key={item.id} to={item.path} className={itemClass} aria-current={active ? 'page' : undefined}>
                {content}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={itemClass}
                aria-current={active ? 'true' : undefined}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 md:flex">
            <a
              href={`tel:${profile.phone}`}
              aria-label="电话"
              className="p-1.5 text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="phone" size={15} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="p-1.5 text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="mail" size={17} />
            </a>
            <span aria-hidden className="mx-1 h-4 w-px bg-hero-line" />
          </div>
          <ThemeMenu />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            className="p-1.5 text-hero-text-2 transition-colors hover:text-hero-text xl:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="nav-scrolled overflow-hidden border-t border-hero-line xl:hidden"
            aria-label="移动端导航"
          >
            <div className="container-site grid grid-cols-2 gap-x-6 gap-y-0.5 py-4">
              {siteConfig.nav.map((item) => {
                const active = item.path
                  ? location.pathname === item.path
                  : isHome && activeSection === item.id;
                const itemClass = cn(
                  'py-2.5 text-left text-[14px] tracking-[0.02em] transition-colors',
                  active ? 'text-accent-strong' : 'text-hero-text-2',
                );
                return item.path ? (
                  <Link key={item.id} to={item.path} onClick={() => setMenuOpen(false)} className={itemClass}>
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.id} type="button" onClick={() => go(item.id)} className={itemClass}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
