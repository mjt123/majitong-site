import { siteConfig } from '@/data/site';
import { profile } from '@/data/profile';
import { scrollToSection } from '@/hooks/useScrollSpy';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/ui/Icon';

/** 收尾轨迹线：一条从左至右收敛的参考轨迹 */
function FooterTrajectory() {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full opacity-[0.5]"
      aria-hidden
    >
      <path d="M -20 130 C 240 126, 420 100, 620 74 C 820 48, 1020 40, 1220 42" fill="none" stroke="var(--color-hero-line)" strokeWidth={1} strokeDasharray="5 7" className="flow-dash-slow" />
      <path d="M -20 142 C 240 138, 430 116, 630 88 C 830 62, 1030 54, 1220 56" fill="none" stroke="var(--color-accent)" strokeOpacity={0.16} strokeWidth={1.2} />
      <circle cx={620} cy={74} r={2} fill="var(--color-gold)" opacity={0.7} />
    </svg>
  );
}

/** 11 Footer —— 深色收尾：视觉签名 + 极淡轨迹与公式水印 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-hero-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(640px 260px at 50% 120%, var(--color-hero-glow), transparent 65%)' }}
      />
      <FooterTrajectory />

      <div className="container-site relative">
        <div className="grid gap-10 py-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* 品牌 */}
          <div className="flex items-center gap-3 text-hero-text">
            <Logo size={30} />
            <span className="leading-tight">
              <span className="block text-[17px] font-semibold tracking-[0.06em]">{profile.name}</span>
              <span className="mt-0.5 block font-serif text-[11.5px] italic text-hero-text-2">{profile.nameEn}</span>
            </span>
          </div>

          {/* 视觉签名 */}
          <div className="text-center">
            <p className="font-heading text-[15px] font-medium leading-[2.1] tracking-[0.28em] text-hero-text lg:text-[16px]">
              {siteConfig.footer.signature[0]}，{siteConfig.footer.signature[1]}。
            </p>
            <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.3em] text-hero-text-2">
              Control · Decision · Execution
            </p>
          </div>

          {/* 快速导航 + 社交 */}
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="页脚导航">
              {['research', 'projects', 'achievements', 'blog', 'contact'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="text-[12.5px] text-hero-text-2 transition-colors hover:text-hero-text"
                >
                  {siteConfig.nav.find((n) => n.id === id)?.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a href={`tel:${profile.phone}`} aria-label="电话" className="p-1 text-hero-text-2 transition-colors hover:text-hero-text">
                <Icon name="phone" size={14} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email" className="p-1 text-hero-text-2 transition-colors hover:text-hero-text">
                <Icon name="mail" size={16} />
              </a>
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                aria-label="回到顶部"
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-tile border border-hero-line text-hero-text-2 transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <Icon name="arrow-up" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 底栏 */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-hero-line py-5 sm:flex-row">
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-hero-text-2">{siteConfig.footer.copyright}</p>
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-hero-text-2">
            {siteConfig.footer.note}
            <span className="mx-2 text-hero-line">|</span>
            <span className="opacity-80">
              <TeXInline />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** 极淡的公式水印 */
function TeXInline() {
  return <span className="font-serif italic">u* = argmin J</span>;
}
