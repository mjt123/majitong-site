import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Research } from '@/components/Research';
import { Projects } from '@/components/Projects';
import { Achievements } from '@/components/Achievements';
import { Skills } from '@/components/Skills';
import { Tools } from '@/components/Tools';
import { Blog } from '@/components/Blog';
import { Contact } from '@/components/Contact';
import { usePageTitle } from '@/hooks/usePageTitle';

/** 首页 —— 纵向叙事：我是谁 → 研究什么 → 做过什么 → 能做什么 */
export function HomePage() {
  usePageTitle();
  return (
    <main>
      <Hero />
      <About />
      <Research />
      <Projects />
      <Achievements />
      <Skills />
      <Tools />
      <Blog />
      <Contact />
    </main>
  );
}
