import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 8, label: '件证物' },
  { value: 12, label: '条隐藏线索' },
  { value: 4, label: '名嫌疑人' },
  { value: 3, label: '种结局' },
];

export default function StatsBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
        const target = Number(el.dataset.value ?? '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
      gsap.fromTo(
        '.stat-divider',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-[#151A22] py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="relative flex flex-col items-center gap-2">
            {i > 0 && (
              <span className="stat-divider absolute left-0 top-1/2 hidden h-12 w-px origin-left -translate-y-1/2 bg-white/10 md:block" />
            )}
            <span
              className="stat-num font-mono text-6xl font-semibold text-case-amber"
              data-value={s.value}
            >
              0
            </span>
            <span className="text-sm text-mist-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
