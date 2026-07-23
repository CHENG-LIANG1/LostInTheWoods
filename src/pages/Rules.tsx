import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Users,
  Network,
  ArrowRight,
  Check,
  RotateCcw,
  Eye,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGameState, resetGame, TOTAL_CLUES } from '@/lib/gameState';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Section 1 — Page Header                                             */
/* ------------------------------------------------------------------ */

function PageHeader() {
  return (
    <header className="relative overflow-hidden pb-16 pt-20">
      <div className="fog-layer left-[-10%] top-[-20%] h-[380px] w-[60%]" aria-hidden />
      <div className="fog-layer fog-layer-2 right-[-15%] top-[10%] h-[320px] w-[55%]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-mono text-xs tracking-[0.3em] text-case-amber"
        >
          FIELD MANUAL
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="mt-3 font-display text-6xl tracking-[0.02em] text-mist md:text-7xl"
        >
          玩法指南
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="mt-4 text-mist-muted"
        >
          第一次当侦探？五分钟读完这份手册。
        </motion.p>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — 调查四步                                                 */
/* ------------------------------------------------------------------ */

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    icon: FileText,
    title: '读案卷',
    desc: '在案件档案里了解时间线与地形，记下每一个“疑点”标记。',
  },
  {
    num: '02',
    icon: Search,
    title: '搜证物',
    desc: '在证物室检视 8 件证物，提取全部 12 条隐藏线索。',
  },
  {
    num: '03',
    icon: Users,
    title: '对口供',
    desc: '逐条比对照疑人的说辞与证物，找出矛盾之处。',
  },
  {
    num: '04',
    icon: Network,
    title: '下指控',
    desc: '在推理板上连线证据，指控真凶，解锁结局。',
  },
];

function StepsSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 85%', 'end 55%'],
  });

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionHeader kicker="PROTOCOL — 调查四步" title="调查四步" />
      <div ref={lineRef} className="relative">
        {/* connecting dashed red line (desktop) */}
        <div className="absolute left-0 right-0 top-10 hidden h-px lg:block">
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            className="h-full border-t-2 border-dashed border-case-red/60"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="relative rounded-sm border border-white/5 bg-ink-surface p-6 shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-start justify-between">
                <motion.span
                  initial={{ opacity: 0, rotateX: 90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE }}
                  className="font-mono text-4xl text-case-red"
                >
                  {s.num}
                </motion.span>
                <s.icon className="h-6 w-6 text-case-amber" />
              </div>
              <h3 className="mt-4 font-display text-2xl text-mist">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — 线索清单                                                 */
/* ------------------------------------------------------------------ */

interface ClueEntry {
  id: string;
  label: string;
  exhibit: string;
}

const CLUES: ClueEntry[] = [
  { id: 'E-1-a', label: '侧袋的矿泉水是满的——他不缺水', exhibit: 'E-1' },
  { id: 'E-1-b', label: '背包在溪谷，登山杖却不在', exhibit: 'E-1' },
  { id: 'E-2-a', label: '17 通未接来电', exhibit: 'E-2' },
  { id: 'E-2-b', label: '草稿短信：“如果我出事，问赵铭”', exhibit: 'E-2' },
  { id: 'E-3-a', label: '登山扣断口是人为锯痕', exhibit: 'E-3' },
  { id: 'E-4-a', label: '字条：“缆车票据能对上时间，但人对不上”', exhibit: 'E-4' },
  { id: 'E-5-a', label: '凌晨 2 点有人燃放过信号弹', exhibit: 'E-5' },
  { id: 'E-6-a', label: '缆车购票时间为 10:15', exhibit: 'E-6' },
  { id: 'E-6-b', label: '售票员记得“只来了四个人”', exhibit: 'E-6' },
  { id: 'E-7-a', label: '袖口污渍是油漆，与缆车检修漆一致', exhibit: 'E-7' },
  { id: 'E-8-a', label: '运动相机 SD 卡缺失', exhibit: 'E-8' },
  { id: 'E-8-b', label: '机身最后定位在缆车站而非溪谷', exhibit: 'E-8' },
];

function ChecklistSection() {
  const { collectedClues } = useGameState();
  const [justReset, setJustReset] = useState(false);
  const collected = new Set(collectedClues);

  const handleReset = () => {
    resetGame();
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 1200);
  };

  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16">
      <SectionHeader
        kicker="CHECKLIST — 线索清单"
        title="线索清单"
        description="与证物室的收集进度实时同步。没找到的线索，会提示它藏在哪件证物里。"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="paper-card relative rounded-sm p-6 pt-10 shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:p-8 md:pt-12"
      >
        <span className="tape-corner -left-3 -top-2 -rotate-45" />
        <span className="tape-corner -right-3 -top-2 rotate-45" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.25em] text-[#5c5544]">
            INVESTIGATION PROGRESS · {collectedClues.length}/{TOTAL_CLUES}
          </p>
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center gap-1.5 rounded-sm border border-case-red/60 bg-case-red/10 px-3 py-1.5 font-mono text-xs text-case-red transition-colors hover:bg-case-red/20">
              <RotateCcw className="h-3.5 w-3.5" /> 重置调查进度
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-ink-surface">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-2xl text-mist">
                  确定要重置调查进度？
                </AlertDialogTitle>
                <AlertDialogDescription className="text-mist-muted">
                  已收集的 {collectedClues.length} 条线索、推理板上的连线和指控记录都将被清除。此操作无法撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 bg-transparent text-mist hover:bg-white/5 hover:text-mist">
                  再想想
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-case-red text-white hover:bg-case-red/90"
                >
                  确认重置
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <ul className="space-y-2.5">
          {CLUES.map((clue, i) => {
            const got = collected.has(clue.id);
            return (
              <motion.li
                key={clue.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                className={`flex items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors duration-500 ${
                  got
                    ? 'border-case-green/40 bg-case-green/10'
                    : 'border-[#2A2419]/15 bg-[#2A2419]/5'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 ${
                    got ? 'border-case-green bg-case-green' : 'border-[#2A2419]/40'
                  }`}
                >
                  <AnimatePresence>
                    {got && !justReset && (
                      <motion.svg
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.path
                          d="M3 8.5 L6.5 12 L13 4.5"
                          fill="none"
                          stroke="#0C0F14"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </span>
                <span className="flex-1 text-sm text-[#2A2419]">
                  {got ? (
                    clue.label
                  ) : (
                    <span className="select-none tracking-wider text-[#2A2419]/70 blur-[4px]">
                      ??? 未发现的线索
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-widest text-[#5c5544]">
                  {got ? clue.exhibit : `藏于 ${clue.exhibit}`}
                </span>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-6 border-t border-dashed border-[#2A2419]/20 pt-4 font-mono text-[10px] tracking-widest text-[#5c5544]">
          {collectedClues.length >= TOTAL_CLUES
            ? '✔ 线索收集完毕 — 去推理板把它们连起来'
            : `尚缺 ${TOTAL_CLUES - collectedClues.length} 条 · 去证物室继续调查`}
        </p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — 难度与提示                                               */
/* ------------------------------------------------------------------ */

const HINTS = [
  { value: 'hint-1', title: '提示 1', text: '售票员的记忆和票据数量对不上。' },
  { value: 'hint-2', title: '提示 2', text: '登山扣的断口值得仔细看。' },
  { value: 'hint-3', title: '提示 3', text: '谁在凌晨两点还没睡？' },
];

function HintRow({ title, text }: { title: string; text: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 rounded-sm border border-white/5 bg-[#0C0F14]/60 px-4 py-3">
      <div>
        <p className="font-mono text-[11px] tracking-widest text-case-amber">{title}</p>
        <p
          className={`mt-1 text-sm text-mist transition-all duration-500 ${
            revealed ? '' : 'select-none blur-[6px]'
          }`}
        >
          {text}
        </p>
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-case-amber/50 px-3 py-1.5 font-mono text-xs text-case-amber transition-colors hover:bg-case-amber/10"
        >
          <Eye className="h-3.5 w-3.5" /> 显示提示
        </button>
      )}
    </div>
  );
}

function DifficultySection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionHeader kicker="DIFFICULTY & HINTS — 难度与提示" title="难度与提示" />
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-sm border border-white/5 bg-ink-surface p-7 shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
        >
          <h3 className="font-display text-2xl text-mist">难度说明</h3>
          <ul className="mt-4 space-y-3 text-sm text-mist-muted">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-case-green" /> 标准难度 — 适合初次接触推理游戏
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-case-green" /> 预计 20–40 分钟通关
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-case-green" /> 无时间限制，慢慢想
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-case-green" /> 进度自动保存在本地
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="rounded-sm border border-white/5 bg-ink-surface p-7 shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
        >
          <h3 className="font-display text-2xl text-mist">卡关了？</h3>
          <p className="mt-1 mb-4 text-xs text-mist-muted">
            三条渐进式提示，防剧透处理，看完一条再看下一条。
          </p>
          <div className="space-y-3">
            {HINTS.map((h) => (
              <HintRow key={h.value} title={h.title} text={h.text} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — FAQ                                                     */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: '这个故事是真的吗？',
    a: '纯属虚构，灵感来自户外失踪题材；人物与事件均为创作。',
  },
  {
    q: '我的进度会丢吗？',
    a: '不会，所有线索与连线保存在浏览器本地。',
  },
  {
    q: '指控错了会怎样？',
    a: '会触发“坏结局”，但可以随时重新推理，不影响已收集的线索。',
  },
  {
    q: '有多个结局吗？',
    a: '三个：坏结局、普通结局、真结局。证据链越完整，结局越接近全部真相。',
  },
];

function FaqSection() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16">
      <SectionHeader kicker="FAQ — 常见问题" title="常见问题" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-sm border border-white/5 bg-ink-surface px-6 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
      >
        <Accordion type="single" collapsible>
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-white/5">
              <AccordionTrigger className="text-left text-sm font-medium text-mist hover:text-case-red hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-mist-muted">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Footer CTA                                              */
/* ------------------------------------------------------------------ */

function FooterCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Link
          to="/case"
          className="group inline-flex items-center gap-3 rounded-sm border border-case-red/50 bg-case-red/10 px-8 py-4 font-display text-xl tracking-[0.05em] text-mist transition-all duration-300 hover:bg-case-red/20 hover:shadow-[0_0_32px_rgba(226,62,46,0.35)]"
        >
          手册读完。侦探，该开工了
          <ArrowRight className="h-5 w-5 text-case-red transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function RulesPage() {
  return (
    <div className="relative">
      <PageHeader />
      <StepsSection />
      <ChecklistSection />
      <DifficultySection />
      <FaqSection />
      <FooterCTA />
    </div>
  );
}
