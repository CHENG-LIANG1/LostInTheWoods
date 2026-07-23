import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle2, Search, X } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import Stamp from '@/components/Stamp';
import Toast, { type ToastData } from '@/components/Toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collectClue, useGameState, TOTAL_CLUES } from '@/lib/gameState';
import { EVIDENCE_ITEMS, type Clue, type EvidenceItem } from './evidence-data';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TABS = ['全部', '随身物品', '现场发现', '文件票据'] as const;
type Tab = (typeof TABS)[number];

/* ---------- evidence card with pointer-tracked tilt ---------- */
function EvidenceCard({ item, onOpen }: { item: EvidenceItem; onOpen: (it: EvidenceItem) => void }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [4, -4]);
  const rotateY = useTransform(mx, [0, 1], [-4, 4]);
  const hasKey = item.clues.some((c) => c.key);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ perspective: 800 }}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, rotate: item.rotate, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -8 }}
        className="group relative block w-full rounded-sm bg-ink-surface p-3 pb-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_26px_52px_rgba(0,0,0,0.6)]"
      >
        {/* tape corners */}
        <span className="tape-corner -left-4 -top-2 -rotate-45" />
        <span className="tape-corner -right-4 -top-2 rotate-45" />

        <div className="relative overflow-hidden rounded-[2px]">
          <img
            src={item.photo}
            alt={item.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[#0C0F14B3] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full border border-mist/30 px-4 py-1.5 font-mono text-xs tracking-widest text-mist">
              <Search className="h-3.5 w-3.5" /> 点击检视
            </span>
          </div>
          {hasKey && (
            <div className="absolute right-3 top-3">
              <Stamp text="关键证物" rotate={-8} className="text-sm" />
            </div>
          )}
        </div>

        <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-case-amber">
          {item.exhibit}
        </p>
        <h3 className="font-display text-xl text-mist">{item.title}</h3>
        <p className="mt-1 font-mono text-[11px] text-mist-muted">
          {item.tag} · 隐藏线索 {item.clues.length} 条
        </p>
      </motion.button>
    </motion.div>
  );
}

/* ---------- single clue row inside the modal ---------- */
function ClueRow({
  clue,
  collected,
  onExtract,
}: {
  clue: Clue;
  collected: boolean;
  onExtract: (clue: Clue) => void;
}) {
  const [revealed, setRevealed] = useState(collected);
  useEffect(() => {
    if (collected) setRevealed(true);
  }, [collected]);

  return (
    <li className="rounded-md border border-white/8 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between gap-3">
        <motion.p
          animate={{ filter: revealed ? 'blur(0px)' : 'blur(8px)', opacity: revealed ? 1 : 0.7 }}
          transition={{ duration: 0.5 }}
          className="flex-1 select-none text-sm leading-relaxed text-mist"
        >
          {clue.text}
        </motion.p>
        {collected ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-case-green/40 bg-case-green/10 px-2.5 py-1 font-mono text-[11px] text-case-green">
            <CheckCircle2 className="h-3 w-3" /> 已收集
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onExtract(clue)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-case-red/50 bg-case-red/10 px-3 py-1 font-mono text-[11px] text-case-red transition-colors hover:bg-case-red/25"
          >
            <img src="/string-pin.svg" alt="" className="h-4 w-4" />
            提取线索
          </button>
        )}
      </div>
      {clue.key && revealed && (
        <p className="mt-1.5 font-mono text-[10px] tracking-widest text-case-amber">
          ★ KEY CLUE · 关键线索
        </p>
      )}
    </li>
  );
}

/* ---------- page ---------- */
export default function Evidence() {
  const { collectedClues } = useGameState();
  const [tab, setTab] = useState<Tab>('全部');
  const [active, setActive] = useState<EvidenceItem | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [searchParams] = useSearchParams();

  // honor deep links like /evidence?open=E-6 (from the case timeline)
  useEffect(() => {
    const openId = searchParams.get('open');
    if (!openId) return;
    const item = EVIDENCE_ITEMS.find((e) => e.id === openId);
    if (item) setActive(item);
  }, [searchParams]);

  const count = collectedClues.length;
  const filtered = useMemo(
    () => (tab === '全部' ? EVIDENCE_ITEMS : EVIDENCE_ITEMS.filter((e) => e.tag === tab)),
    [tab],
  );

  const pushToast = (message: string) =>
    setToasts((ts) => [...ts, { id: Date.now() + Math.random(), message }]);
  const dismissToast = (id: number) => setToasts((ts) => ts.filter((t) => t.id !== id));

  const extract = (clue: Clue) => {
    if (collectClue(clue.id)) pushToast(`+1 线索：${clue.label}`);
  };

  return (
    <div className="relative">
      {/* ---------- Section 1: fog header ---------- */}
      <header className="relative overflow-hidden">
        <div
          className="fog-layer left-[-10%] top-[-20%] h-[340px] w-[70%] opacity-60"
          aria-hidden
        />
        <div
          className="fog-layer fog-layer-2 right-[-15%] top-[10%] h-[300px] w-[60%] opacity-50"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 pb-4 pt-14"
        >
          <SectionHeader
            kicker="FILE 02 — EVIDENCE LOCKER"
            title="证物室"
            description="点击证物进行检视。藏在线索里的细节，可能就是破案的关键。"
          />
          <motion.div
            key={count}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            className="mb-10 flex items-center gap-2 rounded-full border border-case-amber/40 bg-case-amber/10 px-4 py-1.5 font-mono text-sm text-case-amber"
          >
            <img src="/string-pin.svg" alt="" className="h-4 w-4" />
            已收集线索 {count} / {TOTAL_CLUES}
          </motion.div>
        </motion.div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        {/* ---------- Section 2: filter tabs ---------- */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="mb-8 flex h-auto w-fit flex-wrap gap-1 rounded-lg border border-white/10 bg-ink-surface p-1.5">
            {TABS.map((t) => {
              const n =
                t === '全部' ? EVIDENCE_ITEMS.length : EVIDENCE_ITEMS.filter((e) => e.tag === t).length;
              const isActive = tab === t;
              return (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="relative rounded-md px-4 py-1.5 font-mono text-xs tracking-wider text-mist-muted data-[state=active]:bg-transparent data-[state=active]:text-mist data-[state=active]:shadow-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="evidence-tab-indicator"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-md bg-case-red/20 ring-1 ring-case-red/50"
                    />
                  )}
                  <span className="relative">
                    {t} <span className="text-case-amber">{n}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* ---------- Section 3: evidence grid ---------- */}
        <motion.div layout className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: EASE }}
              >
                <EvidenceCard item={item} onOpen={setActive} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ---------- Section 5: completion banner ---------- */}
        <AnimatePresence>
          {count >= TOTAL_CLUES && (
            <motion.div
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-md border border-case-green/40 bg-case-green/10 p-6"
            >
              <div className="flex items-center gap-5">
                <Stamp text="线索收集完毕" variant="green" rotate={-6} animated className="text-base" />
                <p className="text-sm text-mist">
                  所有碎片都在你手里了。去推理板，把它们连起来。
                </p>
              </div>
              <Link
                to="/board"
                className="rounded-md bg-case-red px-5 py-2.5 font-mono text-sm text-mist transition-transform hover:scale-[1.03]"
              >
                前往推理板 →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Section 4: detail modal ---------- */}
      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] w-[min(94vw,880px)] max-w-none overflow-y-auto border-white/10 bg-ink-surface p-0 sm:max-w-none [&>button]:hidden">
          {active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="grid md:grid-cols-2"
            >
              {/* photo with Ken Burns zoom */}
              <div className="relative min-h-[280px] overflow-hidden">
                <motion.img
                  src={active.photo}
                  alt={active.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{ scale: [1, 1.1, 1], x: [0, -8, 0] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F14AA] to-transparent" />
              </div>

              {/* right panel */}
              <div className="relative p-6 md:p-8">
                <DialogTitle className="sr-only">
                  {active.exhibit} {active.title}
                </DialogTitle>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="关闭"
                  className="absolute right-4 top-4 rounded-full p-1.5 text-mist-muted transition-colors hover:text-mist"
                >
                  <X className="h-5 w-5" />
                </button>

                <p className="font-mono text-[11px] tracking-[0.25em] text-case-amber">
                  {active.exhibit}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-4">
                  <h3 className="font-display text-3xl text-mist">{active.title}</h3>
                  {active.clues.some((c) => c.key) && <Stamp text="关键证物" rotate={-8} className="text-sm" />}
                </div>
                <p className="mt-1 font-mono text-[11px] text-mist-muted">分类 · {active.tag}</p>

                <h4 className="mt-6 font-mono text-xs tracking-[0.25em] text-fog">检验报告</h4>
                <p className="mt-2 text-sm leading-relaxed text-mist/85">{active.report}</p>

                <h4 className="mt-6 font-mono text-xs tracking-[0.25em] text-fog">
                  🔎 发现的线索
                </h4>
                <ul className="mt-3 space-y-3">
                  {active.clues.map((clue) => (
                    <ClueRow
                      key={clue.id}
                      clue={clue}
                      collected={collectedClues.includes(clue.id)}
                      onExtract={extract}
                    />
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
