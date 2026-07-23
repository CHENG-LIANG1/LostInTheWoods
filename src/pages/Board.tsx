import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Scissors, Share2, RotateCcw, ArrowRight, Gavel } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import Stamp from '@/components/Stamp';
import Toast from '@/components/Toast';
import type { ToastData } from '@/components/Toast';
import {
  useGameState,
  addConnection,
  removeConnection,
  setAccusation,
  setGameSolved,
  resetGame,
  TOTAL_CLUES,
} from '@/lib/gameState';
import {
  CLUES,
  SUSPECTS,
  VICTIM_ID,
  chainMatch,
  countCorrectChains,
  nodeLabel,
  resolveEnding,
  ENDINGS,
} from '@/pages/board/data';
import type { EndingKind } from '@/pages/board/data';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const MIN_BOARD_CLUES = 6;
const MIN_ACCUSE_CLUES = 8;

interface Pt {
  x: number;
  y: number;
}

type NodeKind = 'victim' | 'clue' | 'suspect';

const NODE_SIZE: Record<NodeKind, { w: number; h: number }> = {
  victim: { w: 120, h: 140 },
  clue: { w: 132, h: 58 },
  suspect: { w: 76, h: 96 },
};

/* Default node positions as fractions of the board. */
const DEFAULT_POS: Record<string, [number, number]> = {
  [VICTIM_ID]: [0.5, 0.16],
  'suspect-chen': [0.14, 0.88],
  'suspect-lin': [0.38, 0.88],
  'suspect-zhao': [0.62, 0.88],
  'suspect-su': [0.86, 0.88],
};

const CLUE_SLOTS: [number, number][] = [
  [0.16, 0.38], [0.4, 0.34], [0.62, 0.36], [0.85, 0.4],
  [0.14, 0.6], [0.36, 0.56], [0.6, 0.58], [0.84, 0.62],
  [0.24, 0.76], [0.48, 0.74], [0.72, 0.78], [0.5, 0.5],
];

/* ================= Board canvas ================= */

interface BoardCanvasProps {
  clues: string[];
  connections: [string, string][];
  onToast: (message: string) => void;
}

function BoardCanvas({ clues, connections, onToast }: BoardCanvasProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState<Record<string, Pt>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Pt | null>(null);
  const dragRef = useRef<{ id: string; offX: number; offY: number; moved: boolean } | null>(null);

  const nodeIds = useMemo(
    () => [VICTIM_ID, ...clues, ...SUSPECTS.map((s) => s.id)],
    [clues],
  );

  /* Measure board. */
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Assign default positions to nodes that lack one. */
  useEffect(() => {
    if (size.w === 0) return;
    setPos((prev) => {
      const next = { ...prev };
      let clueIdx = 0;
      let changed = false;
      for (const id of nodeIds) {
        if (next[id]) {
          if (CLUES[id]) clueIdx += 1;
          continue;
        }
        let fx: number, fy: number;
        if (CLUES[id]) {
          [fx, fy] = CLUE_SLOTS[clueIdx % CLUE_SLOTS.length];
          clueIdx += 1;
        } else {
          [fx, fy] = DEFAULT_POS[id] ?? [0.5, 0.5];
        }
        next[id] = { x: fx * size.w, y: fy * size.h };
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [nodeIds, size]);

  const kindOf = (id: string): NodeKind =>
    id === VICTIM_ID ? 'victim' : CLUES[id] ? 'clue' : 'suspect';

  const clamp = (id: string, p: Pt): Pt => {
    const { w, h } = NODE_SIZE[kindOf(id)];
    return {
      x: Math.min(Math.max(p.x, w / 2 + 6), Math.max(size.w - w / 2 - 6, w / 2 + 6)),
      y: Math.min(Math.max(p.y, h / 2 + 6), Math.max(size.h - h / 2 - 6, h / 2 + 6)),
    };
  };

  /* Manual pointer dragging (spring-like overshoot via framer on release). */
  const onNodePointerDown = (e: React.PointerEvent, id: string) => {
    const p = pos[id];
    if (!p) return;
    dragRef.current = { id, offX: e.clientX - p.x, offY: e.clientY - p.y, moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onNodePointerMove = (e: React.PointerEvent, id: string) => {
    const d = dragRef.current;
    if (!d || d.id !== id) return;
    const next = clamp(id, { x: e.clientX - d.offX, y: e.clientY - d.offY });
    if (!d.moved) {
      const orig = pos[id];
      if (orig && Math.hypot(next.x - orig.x, next.y - orig.y) < 4) return;
      d.moved = true;
    }
    setPos((prev) => ({ ...prev, [id]: next }));
  };
  const onNodePointerUp = (e: React.PointerEvent, id: string) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && !d.moved) handleNodeClick(id);
    void e;
  };

  const handleNodeClick = (id: string) => {
    if (!selected) {
      setSelected(id);
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    const a = selected;
    const b = id;
    setSelected(null);
    const existed = connections.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a),
    );
    if (existed) return;
    addConnection(a, b);
    if (chainMatch(a, b)) onToast('✔ 合理的推论');
  };

  const cutConnection = (a: string, b: string) => {
    removeConnection(a, b);
    onToast(`剪断连线：${nodeLabel(a)} × ${nodeLabel(b)}`);
  };

  const pathFor = (a: Pt, b: Pt) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 + Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.18);
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Board */}
      <div
        ref={boardRef}
        className="relative min-h-[70vh] flex-1 select-none overflow-hidden rounded-lg border-[6px] border-[#3A2E22] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
        style={{ backgroundImage: 'url(/board-cork.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        onPointerMove={(e) => {
          const r = boardRef.current?.getBoundingClientRect();
          if (r) setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => setCursor(null)}
      >
        {/* amber lamp glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3 board-lamp"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(217,164,65,0.28), transparent 70%)',
          }}
        />

        {/* strings */}
        <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: 'none' }}>
          {connections.map(([a, b]) => {
            const pa = pos[a];
            const pb = pos[b];
            if (!pa || !pb) return null;
            const correct = !!chainMatch(a, b);
            const d = pathFor(pa, pb);
            return (
              <g key={`${a}|${b}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={correct ? '#FF2B1A' : '#E23E2E'}
                  strokeWidth={correct ? 3 : 2}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
                />
                {/* wide invisible hit path for cutting */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  style={{ pointerEvents: 'stroke', cursor: 'crosshair' }}
                  onClick={() => cutConnection(a, b)}
                >
                  <title>剪断这条红线</title>
                </path>
              </g>
            );
          })}
          {/* pending line to cursor */}
          {selected && pos[selected] && cursor && (
            <path
              d={pathFor(pos[selected], cursor)}
              fill="none"
              stroke="#D9A441"
              strokeWidth={1.5}
              strokeDasharray="6 6"
              opacity={0.8}
            />
          )}
        </svg>

        {/* nodes */}
        <AnimatePresence>
          {nodeIds.map((id, i) => {
            const p = pos[id];
            if (!p) return null;
            const kind = kindOf(id);
            const { w, h } = NODE_SIZE[kind];
            const isSelected = selected === id;
            return (
              <motion.div
                key={id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: isSelected ? 0 : (i % 2 === 0 ? -1.5 : 1.5),
                }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 17, delay: i * 0.05 }}
                className="absolute cursor-grab touch-none active:cursor-grabbing"
                style={{ left: p.x - w / 2, top: p.y - h / 2, width: w, height: h, zIndex: isSelected ? 20 : 10 }}
                onPointerDown={(e) => onNodePointerDown(e, id)}
                onPointerMove={(e) => onNodePointerMove(e, id)}
                onPointerUp={(e) => onNodePointerUp(e, id)}
                whileTap={{ scale: 1.06, rotate: 3 }}
              >
                {kind === 'victim' && (
                  <div className={`relative h-full w-full rounded-sm border-4 bg-paper p-1 shadow-[0_8px_20px_rgba(0,0,0,0.5)] ${isSelected ? 'border-case-amber ring-4 ring-case-amber/60' : 'border-case-red ring-2 ring-case-red/60'}`}>
                    <img src="/victim-photo.jpg" alt="周远" className="h-full w-full rounded-[2px] object-cover" draggable={false} />
                    <img src="/string-pin.svg" alt="" className="absolute -top-4 left-1/2 h-7 w-7 -translate-x-1/2" draggable={false} />
                  </div>
                )}
                {kind === 'clue' && (
                  <div className={`relative flex h-full w-full flex-col justify-center rounded-[2px] bg-paper px-2 py-1 shadow-[0_6px_14px_rgba(0,0,0,0.45)] ${isSelected ? 'ring-4 ring-case-amber/70' : ''}`}
                    style={{ clipPath: 'polygon(0 6%, 4% 0, 96% 2%, 100% 8%, 98% 94%, 94% 100%, 5% 98%, 0 92%)' }}
                  >
                    <img src="/string-pin.svg" alt="" className="absolute -top-3.5 left-1/2 h-6 w-6 -translate-x-1/2" draggable={false} />
                    <span className="font-mono text-[10px] tracking-widest text-case-red">{CLUES[id].exhibit}</span>
                    <span className="truncate text-xs font-medium text-ink">{CLUES[id].label}</span>
                  </div>
                )}
                {kind === 'suspect' && (
                  <div className={`relative h-full w-full overflow-hidden rounded-sm border-2 bg-ink-surface shadow-[0_6px_16px_rgba(0,0,0,0.5)] ${isSelected ? 'border-case-amber ring-4 ring-case-amber/60' : 'border-paper/30'}`}>
                    <img
                      src={SUSPECTS.find((s) => s.id === id)?.photo}
                      alt={nodeLabel(id)}
                      className="h-[72%] w-full object-cover"
                      draggable={false}
                    />
                    <div className="flex h-[28%] items-center justify-center bg-ink-deep">
                      <span className="font-display text-sm tracking-widest text-mist">{nodeLabel(id)}</span>
                    </div>
                    <img src="/string-pin.svg" alt="" className="absolute -top-1.5 left-1/2 h-5 w-5 -translate-x-1/2" draggable={false} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] tracking-widest text-mist/50">
          点击两张卡片以连线 · 点击红线剪断 <Scissors className="inline h-3 w-3" />
        </div>
      </div>

      {/* 推理日志 sidebar */}
      <aside className="w-full shrink-0 rounded-lg border border-white/10 bg-ink-surface p-4 lg:w-72">
        <h3 className="font-display text-xl tracking-widest text-mist">推理日志</h3>
        <p className="mt-1 font-mono text-[10px] tracking-widest text-mist-muted">
          CONNECTIONS {connections.length} · CHAINS {countCorrectChains(connections)}/5
        </p>
        <ul className="mt-3 space-y-2">
          {connections.length === 0 && (
            <li className="text-sm text-mist-muted">还没有连线。点击板上的两张卡片，把相关的线索钉在一起。</li>
          )}
          {connections.map(([a, b]) => {
            const correct = !!chainMatch(a, b);
            return (
              <li
                key={`${a}|${b}`}
                className={`flex items-center justify-between gap-2 rounded border px-2.5 py-2 text-xs ${correct ? 'border-case-red/60 bg-case-red/10 text-mist' : 'border-white/10 bg-ink-deep text-mist/80'}`}
              >
                <span className="min-w-0 truncate">
                  {correct && <span className="mr-1 text-case-red">✔</span>}
                  {nodeLabel(a)} × {nodeLabel(b)}
                </span>
                <button
                  onClick={() => cutConnection(a, b)}
                  className="shrink-0 text-mist-muted transition-colors hover:text-case-red"
                  aria-label="删除连线"
                >
                  <Scissors className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

/* ================= Ending modal ================= */

interface EndingModalProps {
  ending: EndingKind;
  correct: number;
  clueCount: number;
  minutes: number;
  onRetry: () => void;
  onToast: (message: string) => void;
}

function EndingModal({ ending, correct, clueCount, minutes, onRetry, onToast }: EndingModalProps) {
  const navigate = useNavigate();
  const data = ENDINGS[ending];
  const [typed, setTyped] = useState('');
  const done = typed.length >= data.verdict.length;

  useEffect(() => {
    setTyped('');
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(data.verdict.slice(0, i));
      if (i >= data.verdict.length) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [data.verdict]);

  const share = async () => {
    const summary = `【雾岭迷踪】${data.title} · 线索 ${clueCount}/${TOTAL_CLUES} · 正确推论 ${correct}/5 · 用时 ${minutes} 分钟`;
    try {
      await navigator.clipboard.writeText(summary);
      onToast('已复制结案报告');
    } catch {
      onToast('复制失败，请手动复制');
    }
  };

  const restart = () => {
    resetGame();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-deep/90 p-4 backdrop-blur-sm"
    >
      {/* falling red-string confetti on true ending */}
      {ending === 'true' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -60, x: `${(i * 73) % 100}vw`, rotate: 0, opacity: 0.9 }}
              animate={{ y: '110vh', rotate: 360 }}
              transition={{ duration: 3.5 + (i % 5) * 0.7, delay: i * 0.25, ease: 'linear' }}
              className="absolute top-0 h-10 w-[3px] rounded bg-case-red/80"
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-ink-surface p-6 sm:p-8"
      >
        <motion.div
          animate={{ x: [0, -4, 4, -3, 3, 0] }}
          transition={{ duration: 0.2, delay: 0.35 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[10px] tracking-widest text-mist-muted">FINAL VERDICT — CASE NO. 2024-FR-07</p>
            <h2 className="mt-2 font-display text-3xl tracking-[0.02em] text-mist sm:text-4xl">{data.title}</h2>
          </div>
          <motion.div
            initial={{ scale: 1.5, opacity: 0, rotate: -16 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.4 }}
          >
            <Stamp text={data.stamp} variant={data.stampVariant} rotate={0} className="text-base" />
          </motion.div>
        </motion.div>

        <div className="mt-6 min-h-[10rem] whitespace-pre-wrap font-mono text-sm leading-relaxed text-mist/90">
          {typed}
          {!done && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-case-red align-middle" />}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
              <div>
                <p className="font-mono text-lg text-case-amber">{minutes} min</p>
                <p className="text-xs text-mist-muted">用时</p>
              </div>
              <div>
                <p className="font-mono text-lg text-case-amber">{clueCount}/{TOTAL_CLUES}</p>
                <p className="text-xs text-mist-muted">线索</p>
              </div>
              <div>
                <p className="font-mono text-lg text-case-amber">{correct}/5</p>
                <p className="text-xs text-mist-muted">正确推论</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {ending === 'bad' && (
                <button
                  onClick={onRetry}
                  className="rounded-md bg-case-red px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                >
                  重新推理
                </button>
              )}
              <button
                onClick={restart}
                className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm text-mist transition-colors hover:border-case-amber hover:text-case-amber"
              >
                <RotateCcw className="h-4 w-4" /> 重新开始
              </button>
              <button
                onClick={share}
                className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm text-mist transition-colors hover:border-case-amber hover:text-case-amber"
              >
                <Share2 className="h-4 w-4" /> 分享结果
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ================= Page ================= */

export default function Board() {
  const { collectedClues, boardConnections, accusation, gameSolved } = useGameState();
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [suspectPick, setSuspectPick] = useState<string | null>(accusation);
  const [ending, setEnding] = useState<EndingKind | null>(null);
  const [elapsedMin, setElapsedMin] = useState(0);

  const clueCount = collectedClues.length;
  const gated = clueCount < MIN_BOARD_CLUES;
  const canAccuse = clueCount >= MIN_ACCUSE_CLUES;
  const correct = countCorrectChains(boardConnections);

  const pushToast = useCallback((message: string) => {
    setToasts((t) => [...t, { id: Date.now() + Math.random(), message }]);
  }, []);
  const dismissToast = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  /* elapsed investigation time (minutes since first visit) */
  useEffect(() => {
    const KEY = 'fog-ridge-start-ts';
    let start = Number(window.localStorage.getItem(KEY) || 0);
    if (!start) {
      start = Date.now();
      window.localStorage.setItem(KEY, String(start));
    }
    setElapsedMin(Math.max(1, Math.round((Date.now() - start) / 60000)));
  }, []);

  const submitAccusation = () => {
    if (!suspectPick || !canAccuse) return;
    setAccusation(suspectPick);
    const kind = resolveEnding(suspectPick, correct);
    if (kind === 'true') setGameSolved(true);
    setEnding(kind);
  };

  const retry = () => {
    setAccusation(null);
    setSuspectPick(null);
    setEnding(null);
  };

  void gameSolved;

  return (
    <div className="min-h-[100dvh] bg-ink pb-24">
      <style>{`
        @keyframes board-lamp-flicker { 0%,100% { opacity: 0.95 } 50% { opacity: 0.85 } }
        .board-lamp { animation: board-lamp-flicker 4s ease-in-out infinite; }
      `}</style>

      {/* header */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto max-w-7xl px-6 pt-24 pb-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            kicker="FILE 04 — DEDUCTION BOARD"
            title="推理板"
            description="把相关的线索钉在一起。当你确信真相时，做出指控。"
          />
          <div className="rounded-md border border-case-amber/40 bg-case-amber/10 px-4 py-2 font-mono text-sm text-case-amber">
            线索 {clueCount} / {TOTAL_CLUES}
          </div>
        </div>
      </motion.section>

      {/* board + gate */}
      <section className="relative mx-auto max-w-7xl px-6">
        <div className={gated ? 'pointer-events-none opacity-30 blur-[1px]' : ''} aria-hidden={gated}>
          <BoardCanvas clues={collectedClues} connections={boardConnections} onToast={pushToast} />
        </div>
        <AnimatePresence>
          {gated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-30 flex items-center justify-center"
            >
              <div className="mx-4 max-w-md rounded-lg border border-case-red/40 bg-ink-surface/95 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <img src="/string-pin.svg" alt="" className="mx-auto h-10 w-10" />
                <h3 className="mt-4 font-display text-2xl tracking-widest text-mist">线索不足</h3>
                <p className="mt-2 text-sm text-mist-muted">
                  已收集 {clueCount}/{TOTAL_CLUES}，至少需要 {MIN_BOARD_CLUES} 条线索才能铺开推理板。
                </p>
                <Link
                  to="/evidence"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-case-red px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                >
                  先去证物室继续调查 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* accusation panel */}
      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="rounded-lg border border-white/10 bg-ink-surface p-6 sm:p-10">
          <h2 className="font-display text-4xl tracking-[0.02em] text-mist">说出真相</h2>
          <p className="mt-2 text-mist-muted">谁该为周远的失踪负责？</p>

          {!canAccuse && (
            <p className="mt-4 rounded-md border border-case-amber/30 bg-case-amber/5 px-4 py-3 text-sm text-case-amber">
              证据还不足以指控任何人（{clueCount}/{TOTAL_CLUES}，需要 {MIN_ACCUSE_CLUES} 条）
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SUSPECTS.map((s) => {
              const active = suspectPick === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => canAccuse && setSuspectPick(active ? null : s.id)}
                  disabled={!canAccuse}
                  animate={{ rotate: active ? -2 : 0, scale: active ? 1.03 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative overflow-hidden rounded-md border-2 text-left transition-colors ${
                    active ? 'border-case-red ring-4 ring-case-red/40' : 'border-white/10 hover:border-white/30'
                  } ${canAccuse ? '' : 'cursor-not-allowed opacity-50'}`}
                >
                  <img src={s.photo} alt={s.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="bg-ink-deep px-3 py-2">
                    <p className="font-display text-lg tracking-widest text-mist">{s.name}</p>
                    <p className="font-mono text-[10px] tracking-widest text-mist-muted">{s.role}</p>
                  </div>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-case-red/15"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <motion.button
              onClick={submitAccusation}
              disabled={!suspectPick || !canAccuse}
              whileTap={{ scale: 0.96 }}
              animate={
                suspectPick && canAccuse
                  ? { boxShadow: ['0 0 0 0 rgba(226,62,46,0.5)', '0 0 0 12px rgba(226,62,46,0)'] }
                  : {}
              }
              transition={suspectPick && canAccuse ? { repeat: Infinity, duration: 1.6 } : {}}
              className={`flex items-center gap-2 rounded-md px-8 py-3.5 font-display text-xl tracking-[0.15em] transition-colors ${
                suspectPick && canAccuse
                  ? 'bg-case-red text-white hover:bg-[#c93324]'
                  : 'cursor-not-allowed bg-white/5 text-mist-muted'
              }`}
            >
              <Gavel className="h-5 w-5" /> 提交指控
            </motion.button>
            {suspectPick && canAccuse && (
              <span className="text-sm text-mist-muted">
                指控 <span className="text-case-red">{SUSPECTS.find((s) => s.id === suspectPick)?.name}</span> —— 没有回头路。
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ending modal */}
      <AnimatePresence>
        {ending && (
          <EndingModal
            ending={ending}
            correct={correct}
            clueCount={clueCount}
            minutes={elapsedMin}
            onRetry={retry}
            onToast={pushToast}
          />
        )}
      </AnimatePresence>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
