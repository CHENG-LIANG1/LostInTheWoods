import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  {
    num: '01',
    title: '出发',
    text: '10 月 14 日，登山社五人小队进入雾岭。天气预报：晴。',
    img: '/victim-photo.jpg',
    caption: '失踪者 周远 · 大三',
  },
  {
    num: '02',
    title: '消失',
    text: '17:40，浓雾骤起。周远在鹰嘴崖下方岔路离队"去拍张照片"，从此失联。',
    img: '/map-fog-ridge.png',
    caption: '雾岭步道图 · 鹰嘴崖',
  },
  {
    num: '03',
    title: '疑云',
    text: '搜救只找到他的背包。四名队友的口供，至少有一人在说谎。',
    img: '/ev-note.jpg',
    caption: '未寄出的字条 · 证物 E-04',
  },
];

export default function PinnedStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const beats = gsap.utils.toArray<HTMLElement>('.story-beat');

      beats.forEach((b, i) => {
        gsap.set(b, {
          opacity: i === 0 ? 1 : 0,
          visibility: i === 0 ? 'visible' : 'hidden',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo(
        '.beat-0 .beat-inner',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.6 },
        0,
      );

      for (let i = 1; i < beats.length; i++) {
        const at = i * 1.2;
        // previous beat fades to 15% and slides left, then hides
        tl.to(`.beat-${i - 1}`, { opacity: 0.15, x: -40, duration: 0.6 }, at);
        tl.set(`.beat-${i - 1}`, { visibility: 'hidden' }, at + 0.6);
        // current beat in
        tl.set(`.beat-${i}`, { visibility: 'visible' }, at);
        tl.fromTo(`.beat-${i}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6 }, at);
        tl.fromTo(
          `.beat-${i} .beat-num`,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6 },
          at,
        );
        tl.fromTo(
          `.beat-${i} .beat-polaroid`,
          { rotate: -8 },
          { rotate: -2, duration: 0.8 },
          at,
        );
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#0C0F14]">
      <div className="mx-auto flex min-h-[100dvh] max-w-6xl items-center px-6">
        <div className="relative h-[70vh] w-full">
          {BEATS.map((beat, i) => (
            <div key={beat.num} className={`story-beat beat-${i} absolute inset-0`}>
              <div className="beat-inner grid h-full items-center gap-10 md:grid-cols-2">
                <div>
                  <p className="beat-num font-mono text-7xl text-case-red/90 md:text-8xl">
                    {beat.num}
                  </p>
                  <h3 className="mt-4 font-display text-5xl tracking-[0.02em] text-mist md:text-6xl">
                    {beat.title}
                  </h3>
                  <p className="mt-6 max-w-md text-lg leading-[1.75] text-mist-muted">{beat.text}</p>
                </div>
                <div className="beat-polaroid mx-auto w-full max-w-sm rotate-[-2deg] bg-paper p-3 pb-10 shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
                  <img
                    src={beat.img}
                    alt={beat.caption}
                    className="aspect-square w-full object-cover sepia-[0.25]"
                  />
                  <p className="mt-3 text-center font-hand text-xl text-[#3d434e]">{beat.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
