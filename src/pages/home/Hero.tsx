import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'power3.out';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Load-in timeline
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(
        '.hero-kicker',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.2,
      )
        .fromTo(
          '.hero-char',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.04 },
          0.3,
        )
        .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, 1.0)
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          1.2,
        )
        .fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.5);

      // Scroll parallax + fade/blur out over first 80vh
      gsap.to(bg.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(content.current, {
        opacity: 0,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '80% top', scrub: true },
      });
    },
    { scope: root },
  );

  const line1 = '他从雾里'.split('');
  const line2 = '没有回来'.split('');

  return (
    <section
      ref={root}
      className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* Background */}
      <div ref={bg} className="absolute inset-0 scale-110">
        <img
          src="/hero-fog-ridge.jpg"
          alt="雾岭夜色"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F14E6] via-[#0C0F1480] to-[#0C0F1433]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0C0F14] to-transparent" />
      </div>

      {/* Drifting fog layers */}
      <div className="fog-layer left-[-10%] top-[15%] h-[45vh] w-[70vw]" />
      <div className="fog-layer fog-layer-2 right-[-15%] top-[45%] h-[55vh] w-[75vw]" />

      {/* Content */}
      <div ref={content} className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16">
        <p className="hero-kicker mb-6 font-mono text-sm tracking-[0.3em] text-case-amber">
          CASE NO. 2024-FR-07 · 未结悬案
        </p>
        <h1 className="font-display leading-[1.05] tracking-[0.02em]" style={{ fontSize: 'clamp(52px, 9vw, 88px)' }}>
          <span className="block text-mist">
            {line1.map((c, i) => (
              <span key={i} className="hero-char inline-block">{c}</span>
            ))}
          </span>
          <span className="block text-case-red">
            {line2.map((c, i) => (
              <span key={i} className="hero-char inline-block">{c}</span>
            ))}
          </span>
        </h1>
        <p className="hero-sub mt-8 max-w-xl text-lg leading-[1.75] text-mist-muted">
          大三学生周远在雾岭团建登山途中失踪。72 小时搜救一无所获，只留下一只背包、四段互相矛盾的口供，和一张没有寄出的字条。现在，案卷交到你手里。
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/case"
            className="hero-cta inline-flex items-center gap-2 rounded-sm bg-case-red px-7 py-3.5 font-medium text-white transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_32px_rgba(226,62,46,0.45)]"
          >
            开始调查 →
          </Link>
          <Link
            to="/rules"
            className="hero-cta inline-flex items-center rounded-sm border border-mist-muted px-7 py-3.5 text-mist transition-colors duration-300 hover:bg-[#151A22]"
          >
            查看玩法
          </Link>
        </div>
      </div>

      {/* Bottom-left coordinates */}
      <div className="hero-meta absolute bottom-8 left-6 z-10 flex items-center gap-2.5 font-mono text-xs tracking-wider text-mist-muted">
        <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-case-red" />
        N 30°14' · E 118°02' · 海拔 1,847m
      </div>

      {/* Bottom-center scroll hint */}
      <div className="hero-meta absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="animate-bounce-hint font-mono text-xs tracking-widest text-mist-muted">
          ▼ 下滑阅读案卷
        </div>
      </div>
    </section>
  );
}
