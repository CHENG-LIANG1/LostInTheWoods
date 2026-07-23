import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import Stamp from '@/components/Stamp';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGameState } from '@/lib/gameState';
import { CLUE_MAP } from './evidence-data';
import { SUSPECTS, type Contradiction, type Suspect } from './suspects-data';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STAR_KEY = 'fog-ridge-starred-suspects';

function loadStars(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(STAR_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

/* ---------- suspicion meter: 5-segment bar ---------- */
function SuspicionMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] tracking-widest text-mist-muted">嫌疑度</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-2.5 w-4 rounded-[1px] ${i <= level ? 'bg-case-red' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-case-red">{level}/5</span>
    </div>
  );
}

/* ---------- dossier card ---------- */
function SuspectCard({ suspect, index, onOpen }: { suspect: Suspect; index: number; onOpen: (s: Suspect) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(suspect)}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
      whileHover={{ y: -8 }}
      className="group relative block w-full overflow-hidden rounded-md border border-white/10 bg-ink-surface text-left shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_26px_52px_rgba(0,0,0,0.6)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={suspect.portrait}
          alt={suspect.name}
          className="aspect-[4/5] w-full object-cover saturate-[0.4] transition-all duration-500 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(12,15,20,0.85)_100%)]" />
        <p className="absolute left-3 top-3 font-mono text-[11px] tracking-[0.25em] text-case-amber">
          {suspect.tag}
        </p>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-2xl text-mist">{suspect.name}</h3>
            <span className="font-mono text-xs text-mist-muted">
              {suspect.age} · {suspect.role}
            </span>
          </div>
          <span className="mt-2 inline-block rounded-full border border-fog/30 bg-fog/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-fog">
            {suspect.relation}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <p className="relative font-hand text-lg leading-snug text-mist/90">
          “{suspect.quote}”
          <svg
            className="absolute -bottom-1 left-0 h-2 w-3/4"
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M2 5 Q 60 1 110 4 T 198 3"
              fill="none"
              stroke="#E23E2E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0]"
            />
          </svg>
        </p>
        <SuspicionMeter level={suspect.suspicion} />
      </div>
    </motion.button>
  );
}

/* ---------- contradiction row ---------- */
function ContradictionRow({ c, collected }: { c: Contradiction; collected: string[] }) {
  const [struck, setStruck] = useState(false);
  const unlocked = c.clueIds.every((id) => collected.includes(id));
  const missing = c.clueIds.find((id) => !collected.includes(id));
  const missingMeta = missing ? CLUE_MAP[missing] : null;

  return (
    <div className="relative overflow-hidden rounded-md border border-white/10 bg-white/[0.03] p-4">
      <button
        type="button"
        onClick={() => setStruck((s) => !s)}
        className="block w-full text-left"
        title="点击划线 / 取消划线"
      >
        <p
          className={`text-sm leading-relaxed transition-all ${
            struck ? 'text-mist-muted/60 line-through decoration-case-red/70' : 'text-mist'
          }`}
        >
          {c.claim}
        </p>
      </button>

      <div className="mt-3">
        {unlocked ? (
          <div className="space-y-2">
            <Stamp text="矛盾!" rotate={-6} animated className="text-base" />
            <p className="text-sm leading-relaxed text-mist/80">{c.detail}</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded border border-white/10 p-3">
            {/* shimmer sweep */}
            <motion.span
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-120%', '420%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <p className="flex flex-wrap items-center gap-2 text-xs text-mist-muted">
              <Lock className="h-3.5 w-3.5 text-case-amber" />
              需先在证物室收集：
              {missingMeta && (
                <span className="font-mono text-case-amber">
                  {missingMeta.evidenceId} {missingMeta.evidenceTitle}
                </span>
              )}
              <Link to="/evidence" className="font-mono text-case-red underline underline-offset-2">
                前往证物室 →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- interrogation drawer ---------- */
function SuspectDrawer({
  suspect,
  onClose,
  starred,
  toggleStar,
}: {
  suspect: Suspect | null;
  onClose: () => void;
  starred: string[];
  toggleStar: (id: string) => void;
}) {
  const { collectedClues } = useGameState();
  const isStarred = suspect ? starred.includes(suspect.id) : false;

  return (
    <Sheet open={suspect !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/10 bg-[#11151D] p-0 sm:max-w-[55vw]"
      >
        {suspect && (
          <div>
            {/* portrait header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={suspect.portrait}
                alt={suspect.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11151D] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6">
                <p className="font-mono text-[11px] tracking-[0.25em] text-case-amber">
                  {suspect.tag}
                </p>
                <SheetTitle className="font-display text-4xl text-mist">{suspect.name}</SheetTitle>
              </div>
            </div>

            {/* mono meta */}
            <div className="grid grid-cols-1 gap-2 border-b border-white/10 px-6 py-4 font-mono text-xs text-mist-muted sm:grid-cols-3">
              <p>年龄 · <span className="text-mist">{suspect.age}</span></p>
              <p>与死者关系 · <span className="text-mist">{suspect.relation}</span></p>
              <p>不在场证明 · <span className="text-mist">{suspect.alibi}</span></p>
            </div>

            <div className="px-6 py-6">
              <Tabs defaultValue="qa">
                <TabsList className="mb-6 w-full justify-start rounded-lg border border-white/10 bg-ink-surface p-1">
                  <TabsTrigger
                    value="qa"
                    className="rounded-md px-5 py-1.5 font-mono text-xs tracking-wider text-mist-muted data-[state=active]:bg-case-red/20 data-[state=active]:text-mist data-[state=active]:shadow-none"
                  >
                    口供记录
                  </TabsTrigger>
                  <TabsTrigger
                    value="gaps"
                    className="rounded-md px-5 py-1.5 font-mono text-xs tracking-wider text-mist-muted data-[state=active]:bg-case-red/20 data-[state=active]:text-mist data-[state=active]:shadow-none"
                  >
                    疑点比对
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="qa">
                  <Accordion type="single" collapsible className="space-y-2">
                    {suspect.qa.map((qa, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
                      >
                        <AccordionItem
                          value={`qa-${i}`}
                          className="rounded-md border border-white/10 bg-white/[0.02] px-4"
                        >
                          <AccordionTrigger className="py-3 text-left font-mono text-sm text-case-amber hover:no-underline">
                            问：{qa.q}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <p className="font-hand text-lg leading-relaxed text-mist/90">
                              答：{qa.a}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="gaps" className="space-y-4">
                  {suspect.contradictions.map((c, i) => (
                    <ContradictionRow key={i} c={c} collected={collectedClues} />
                  ))}
                </TabsContent>
              </Tabs>

              {/* footer star toggle */}
              <button
                type="button"
                onClick={() => toggleStar(suspect.id)}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 font-mono text-sm transition-colors ${
                  isStarred
                    ? 'border-case-amber/60 bg-case-amber/15 text-case-amber'
                    : 'border-white/15 text-mist-muted hover:border-case-amber/40 hover:text-case-amber'
                }`}
              >
                <Star className={`h-4 w-4 ${isStarred ? 'fill-case-amber' : ''}`} />
                {isStarred ? '已标记为主要怀疑对象' : '标记为主要怀疑对象'}
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---------- relationship strip ---------- */
function RelationshipStrip() {
  // layout: victim center, 4 suspects around
  const nodes = [
    { s: SUSPECTS[0], x: 12, y: 20, label: '室友' },
    { s: SUSPECTS[1], x: 88, y: 20, label: '前任' },
    { s: SUSPECTS[2], x: 12, y: 78, label: '社长' },
    { s: SUSPECTS[3], x: 88, y: 78, label: '暗恋者' },
  ];
  const cx = 50;
  const cy = 50;

  return (
    <div className="relative mx-auto h-[420px] max-w-3xl">
      {/* strings */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {nodes.map((n, i) => (
          <g key={n.s.id}>
            <motion.line
              x1={cx}
              y1={cy}
              x2={n.x}
              y2={n.y}
              stroke="#E23E2E"
              strokeWidth="0.45"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </svg>
      {nodes.map((n) => (
        <span
          key={`lbl-${n.s.id}`}
          className="absolute rounded border border-case-red/40 bg-[#0C0F14CC] px-2 py-0.5 font-mono text-[10px] text-case-red"
          style={{
            left: `${(n.x + cx) / 2}%`,
            top: `${(n.y + cy) / 2}%`,
            transform: 'translate(-50%,-50%)',
          }}
        >
          {n.label}
        </span>
      ))}

      {/* victim polaroid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative rounded-sm bg-paper p-2 pb-6 shadow-[0_14px_36px_rgba(0,0,0,0.6)] ring-2 ring-case-red/60" style={{ transform: 'rotate(-2deg)' }}>
          <img src="/string-pin.svg" alt="" className="absolute -top-3 left-1/2 h-7 w-7 -translate-x-1/2" />
          <img src="/victim-photo.jpg" alt="周远" className="h-28 w-28 rounded-[2px] object-cover" />
          <p className="mt-1 text-center font-hand text-sm text-[#1b1e24]">周远 · 失踪者</p>
        </div>
      </motion.div>

      {/* suspect avatars */}
      {nodes.map((n, i) => (
        <motion.div
          key={n.s.id}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 240, damping: 16 }}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <img
            src={n.s.portrait}
            alt={n.s.name}
            className="h-16 w-16 rounded-full border-2 border-white/20 object-cover object-top"
          />
          <span className="font-mono text-[11px] text-mist">{n.s.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */
export default function Suspects() {
  const [active, setActive] = useState<Suspect | null>(null);
  const [starred, setStarred] = useState<string[]>(loadStars);

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STAR_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {/* ---------- Section 1: fog header ---------- */}
      <header className="relative overflow-hidden">
        <div className="fog-layer left-[-10%] top-[-20%] h-[340px] w-[70%] opacity-60" aria-hidden />
        <div className="fog-layer fog-layer-2 right-[-15%] top-[10%] h-[300px] w-[60%] opacity-50" aria-hidden />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mx-auto max-w-7xl px-6 pb-4 pt-14"
        >
          <SectionHeader
            kicker="FILE 03 — PERSONS OF INTEREST"
            title="嫌疑人"
            description="四个人，四段口供。至少一个人在说谎。把他们的说辞和你找到的证物对照。"
          />
        </motion.div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        {/* ---------- Section 2: dossier grid ---------- */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {SUSPECTS.map((s, i) => (
            <SuspectCard key={s.id} suspect={s} index={i} onOpen={setActive} />
          ))}
        </div>

        {/* ---------- Section 4: relationship strip ---------- */}
        <div className="mt-24">
          <SectionHeader
            kicker="RELATIONSHIP MAP"
            title="关系图谱"
            description="以周远为中心的关系网。每条红线，都可能是动机。"
          />
          <RelationshipStrip />
        </div>

        {/* ---------- Section 5: footer CTA ---------- */}
        <div className="mt-20 flex flex-col items-center gap-5 text-center">
          <p className="font-display text-2xl text-mist md:text-3xl">
            口供里的裂缝已经很明显了。
          </p>
          <Link
            to="/board"
            className="rounded-md bg-case-red px-7 py-3 font-mono text-sm text-mist transition-transform hover:scale-[1.04]"
          >
            去推理板，把证据连成真相 →
          </Link>
        </div>
      </div>

      {/* ---------- Section 3: interrogation drawer ---------- */}
      <AnimatePresence>
        <SuspectDrawer
          suspect={active}
          onClose={() => setActive(null)}
          starred={starred}
          toggleStar={toggleStar}
        />
      </AnimatePresence>
    </div>
  );
}
