import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from './home/Hero';
import PinnedStory from './home/PinnedStory';
import StatsBand from './home/StatsBand';
import CaseCard from '@/components/CaseCard';
import SectionHeader from '@/components/SectionHeader';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TEASERS = [
  {
    fileTag: 'FILE 01',
    title: '案件档案',
    description: '时间线 · 地图 · 搜救记录',
    to: '/case',
    rotate: -2,
  },
  {
    fileTag: 'FILE 02',
    title: '证物室',
    description: '8 件证物，12 条线索等你收集',
    to: '/evidence',
    rotate: 1,
  },
  {
    fileTag: 'FILE 03',
    title: '嫌疑人',
    description: '4 份口供，找出说谎的人',
    to: '/suspects',
    rotate: -1,
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <PinnedStory />

      {/* Section 3 — 调查入口 */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          kicker="INVESTIGATION — ENTRY POINTS"
          title="调查入口"
          description="案卷已经摊开。从哪里开始，由你决定。"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {TEASERS.map((t, i) => (
            <motion.div
              key={t.fileTag}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
            >
              <CaseCard
                fileTag={t.fileTag}
                title={t.title}
                description={t.description}
                to={t.to}
                rotate={t.rotate}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4 — stats band */}
      <StatsBand />

      {/* Section 5 — 最终 CTA */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(159,179,200,0.14), transparent 70%)',
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <motion.img
            src="/stamp-classified.svg"
            alt="已解密"
            className="mb-8 w-64 -rotate-6"
            initial={{ scale: 1.6, opacity: 0, rotate: -18 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 13 }}
          />
          <motion.h2
            className="font-display text-5xl tracking-[0.02em] text-mist md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            案卷已解封
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-mist-muted"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            真相只有一个 —— 但你能找到它吗？
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            <Link
              to="/case"
              className="animate-glow-pulse mt-10 inline-flex items-center rounded-sm bg-case-red px-8 py-4 font-medium text-white transition-transform duration-300 hover:scale-[1.04]"
            >
              进入案件档案 →
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
