import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, MapPin, Phone, Tent, CableCar, Mountain, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import Stamp from '@/components/Stamp';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Section 1 — Page Header                                             */
/* ------------------------------------------------------------------ */

function PageHeader() {
  return (
    <header className="relative overflow-hidden pb-16 pt-20">
      {/* fog layers */}
      <div className="fog-layer left-[-10%] top-[-20%] h-[380px] w-[60%]" aria-hidden />
      <div className="fog-layer fog-layer-2 right-[-15%] top-[10%] h-[320px] w-[55%]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-mono text-xs tracking-[0.3em] text-case-amber"
        >
          FILE 01 — INCIDENT REPORT
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="mt-3 font-display text-6xl tracking-[0.02em] text-mist md:text-7xl"
        >
          案件档案
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="mt-4 font-mono text-xs tracking-widest text-mist-muted"
        >
          立案日期 2024-10-15 · 状态：失踪 · 搜救中止
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 h-px w-full max-w-md"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(159,179,200,0.5), transparent)',
          }}
        />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — 案情摘要                                                 */
/* ------------------------------------------------------------------ */

function Redacted({ children }: { children: string }) {
  return (
    <span className="group/red relative mx-0.5 inline-block cursor-help rounded-sm bg-[#2A2419] px-1 transition-colors duration-300 hover:bg-transparent">
      <span className="select-none blur-[6px] transition-all duration-300 group-hover/red:blur-0">
        {children}
      </span>
    </span>
  );
}

function DossierSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionHeader kicker="SUMMARY — 案情摘要" title="案情摘要" />
      <div className="grid gap-10 lg:grid-cols-5">
        {/* report sheet */}
        <motion.div
          initial={{ opacity: 0, rotateX: 12, transformOrigin: 'top' }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ perspective: 800 }}
          className="lg:col-span-3"
        >
          <div className="paper-card relative rounded-sm p-8 pt-10 shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:p-10">
            {/* torn top edge */}
            <div
              className="absolute -top-2 left-0 h-3 w-full"
              style={{
                background:
                  'linear-gradient(160deg, rgba(237,230,214,0.98), rgba(216,205,180,0.98))',
                clipPath:
                  'polygon(0 100%, 3% 20%, 7% 80%, 12% 10%, 18% 70%, 24% 15%, 31% 75%, 38% 25%, 45% 85%, 52% 15%, 60% 70%, 67% 20%, 74% 80%, 81% 15%, 88% 65%, 94% 25%, 100% 90%, 100% 100%)',
              }}
              aria-hidden
            />
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.25em] text-case-red">
                  雾岭派出所 · 失踪人口报案记录
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#5c5544]">
                  编号 2024-FR-07 · 记录员 王<Redacted>建国</Redacted>
                </p>
              </div>
              <Stamp text="已立案" variant="red" rotate={-6} animated />
            </div>
            <div className="space-y-4 text-[15px] leading-[1.9] text-[#2A2419]">
              <p>
                10月14日，校登山社组织雾岭一日穿越，成员 5 人。
                <Redacted>周远</Redacted>为地理信息科学系大三学生，有两次随队经验。
              </p>
              <p>
                17:40 山顶区域突发浓雾，能见度不足 5 米。周远在鹰嘴崖下方 300
                米岔路口离队，声称“下去拍张照片就回来”。据同行者
                <Redacted>林晓</Redacted>回忆，当时雾气“几乎是瞬间涌上来的”。
              </p>
              <p>
                18:10 队伍清点人数发现其未归，多次拨打其电话均无人接听。次日 06:00
                报警，搜救持续 72 小时，仅于溪谷发现其背包……
                <Redacted>登山杖至今下落不明</Redacted>。
              </p>
              <p className="border-l-2 border-case-red/60 pl-4 font-hand text-lg text-[#4a4231]">
                “他说就五分钟。我们等了五分钟，又五分钟，雾里的人喊不应了。” —— 同行者笔录
              </p>
            </div>
          </div>
        </motion.div>

        {/* victim polaroid */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          whileInView={{ opacity: 1, rotate: -3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:col-span-2"
        >
          <div className="relative mx-auto max-w-xs bg-[#F4EFE3] p-4 pb-6 shadow-[0_20px_48px_rgba(0,0,0,0.5)]">
            <img
              src="/string-pin.svg"
              alt=""
              className="absolute -top-4 left-1/2 z-10 h-10 w-10 -translate-x-1/2 drop-shadow-md"
            />
            <img
              src="/victim-photo.jpg"
              alt="失踪者 周远"
              className="aspect-square w-full object-cover sepia-[0.25]"
            />
            <div className="mt-4 space-y-1.5 font-mono text-xs leading-relaxed text-[#3d434e]">
              <p><span className="text-case-red">姓名</span> 周远</p>
              <p>21 岁 · 地理信息科学 大三</p>
              <p>身高 178cm</p>
              <p>失踪时着深蓝色冲锋衣</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — 互动时间线                                               */
/* ------------------------------------------------------------------ */

interface TimelineNode {
  time: string;
  title: string;
  detail: string;
  suspicious?: boolean;
  evidence?: { label: string; to: string };
}

const TIMELINE: TimelineNode[] = [
  {
    time: '10-14 08:30',
    title: '山脚营地集合，五人签到',
    detail: '周远、陈默、林晓、赵铭、苏晚。赵铭作为登山社社长领队，出发前检查装备。',
  },
  {
    time: '10:15',
    title: '乘缆车至 1,200m 平台',
    detail: '票据编号 E-6。购票记录显示 10:15 购得五张票，但售票员事后称“只来了四个人”。',
    evidence: { label: '关联证物：两张缆车票 →', to: '/evidence?open=E-6' },
  },
  {
    time: '13:50',
    title: '抵达鹰嘴崖，合影打卡',
    detail: '五人在崖顶合影。周远的运动相机记录下了这段画面——那是他最后一次出现在影像里。',
  },
  {
    time: '15:20',
    title: '开始下撤，赵铭提议走“近路”野径',
    detail: '赵铭称野径能省一小时。该路段不经过缆车检修站，却紧挨着检修物资堆放区。',
    suspicious: true,
  },
  {
    time: '17:40',
    title: '浓雾突至，周远在岔路离队',
    detail: '鹰嘴崖下方 300 米岔路口，能见度不足 5 米。周远说“下去拍张照片就回来”。',
    evidence: { label: '关联证物：运动相机 →', to: '/evidence?open=E-8' },
  },
  {
    time: '18:10',
    title: '清点人数，电话无人接听',
    detail: '四人折返寻找未果。事后在其手机中发现 17 通未接来电——但无人承认在那个凌晨继续拨打过。',
    suspicious: true,
    evidence: { label: '关联证物：碎屏手机 →', to: '/evidence?open=E-2' },
  },
  {
    time: '10-15 06:00',
    title: '报警，首批搜救队进山',
    detail: '雾岭派出所接警。首批 12 人搜救队携搜救犬进山，当日无果。',
  },
  {
    time: '10-17 18:00',
    title: '溪谷发现背包，搜救中止',
    detail: '背包在海拔 900m 的溪谷被发现，物品基本完整，登山杖不在其中。72 小时后搜救中止。',
    evidence: { label: '关联证物：周远的背包 →', to: '/evidence?open=E-1' },
  },
];

function TimelineCard({ node, index }: { node: TimelineNode; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const fromLeft = index % 2 === 0;
  return (
    <div className="relative grid md:grid-cols-2 md:gap-12">
      {/* node dot on the string */}
      <span
        className="absolute left-[7px] top-6 z-10 h-3.5 w-3.5 rounded-full border-2 border-case-red bg-[#0C0F14] md:left-1/2 md:-translate-x-1/2"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -48 : 48 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={
          fromLeft
            ? 'ml-8 md:col-start-1 md:ml-0 md:text-right'
            : 'ml-8 md:col-start-2 md:ml-0'
        }
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`group w-full rounded-sm border border-white/5 bg-ink-surface p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors hover:border-case-red/30 ${
            fromLeft ? 'md:text-right' : ''
          }`}
        >
          <div
            className={`flex items-center gap-2 ${fromLeft ? 'md:flex-row-reverse' : ''}`}
          >
            <span className="rounded-sm bg-case-red/15 px-2 py-0.5 font-mono text-[11px] tracking-widest text-case-red">
              {node.time}
            </span>
            {node.suspicious && (
              <span className="inline-flex animate-pulse items-center gap-1 rounded-sm border border-case-amber/50 bg-case-amber/10 px-2 py-0.5 font-mono text-[11px] text-case-amber [animation-duration:1.6s]">
                <AlertTriangle className="h-3 w-3" /> 疑点
              </span>
            )}
          </div>
          <p className="mt-2 font-medium text-mist">{node.title}</p>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-sm leading-relaxed text-mist-muted">{node.detail}</p>
                {node.evidence && (
                  <Link
                    to={node.evidence.to}
                    className="mt-2 inline-block font-mono text-xs text-case-red hover:underline"
                  >
                    {node.evidence.label}
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {!expanded && (
            <p className="mt-1 font-mono text-[10px] tracking-widest text-mist-muted/60">
              点击展开细节
            </p>
          )}
        </button>
      </motion.div>
    </div>
  );
}

function TimelineSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 80%', 'end 60%'],
  });

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        kicker="TIMELINE — 互动时间线"
        title="失联 58 小时"
        description="点击节点展开细节。带 ⚠ 疑点 的节点藏着与证物相矛盾的说法。"
      />
      <div ref={lineRef} className="relative space-y-8 py-4">
        {/* red string line, drawn by scroll */}
        <div className="absolute bottom-0 left-3 top-0 w-px md:left-1/2 md:-translate-x-1/2">
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="h-full w-[2px] border-l-2 border-dashed border-case-red"
          />
        </div>
        {TIMELINE.map((node, i) => (
          <TimelineCard key={node.time} node={node} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — 雾岭地图                                                 */
/* ------------------------------------------------------------------ */

interface Hotspot {
  id: string;
  label: string;
  icon: LucideIcon;
  x: string;
  y: string;
  intel: [string, string];
  alert?: boolean;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'camp',
    label: '山脚营地',
    icon: Tent,
    x: '12%',
    y: '78%',
    intel: ['10-14 08:30 五人集合签到。', '监控最后拍到周远是在出发前。'],
  },
  {
    id: 'cable',
    label: '缆车平台',
    icon: CableCar,
    x: '38%',
    y: '52%',
    intel: ['1,200m 平台，票据编号 E-6。', '检修区堆放油漆与工具，紧邻野径。'],
  },
  {
    id: 'cliff',
    label: '鹰嘴崖',
    icon: Mountain,
    x: '66%',
    y: '22%',
    intel: ['海拔 1,847m，合影打卡点。', '17:40 浓雾突至，周远在下方 300m 岔路离队。'],
    alert: true,
  },
  {
    id: 'creek',
    label: '发现背包的溪谷',
    icon: Waves,
    x: '58%',
    y: '84%',
    intel: ['海拔约 900m，偏离正常下撤路线。', '背包物品完整，登山杖失踪。'],
  },
];

function MapSection() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        kicker="MAP — 雾岭地形图"
        title="雾岭地图"
        description="点击图钉查看该地点的侦查情报。红圈标记处是最后的目击位置。"
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative rounded-sm border-[10px] border-[#3a2f22] bg-[#151A22] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      >
        <div className="relative overflow-hidden">
          <img
            src="/map-fog-ridge.png"
            alt="雾岭手绘地形图"
            className="block w-full brightness-[0.85]"
          />
          {HOTSPOTS.map((h, i) => (
            <motion.button
              key={h.id}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * i, type: 'spring', stiffness: 300, damping: 14 }}
              onClick={() => setActive(active === h.id ? null : h.id)}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: h.x, top: h.y }}
              aria-label={h.label}
            >
              {h.alert && (
                <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-case-red [animation-duration:2s]" />
              )}
              <img src="/string-pin.svg" alt="" className="h-9 w-9 drop-shadow-lg" />
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#0C0F14E6] px-2 py-0.5 font-mono text-[10px] tracking-widest text-mist opacity-0 transition-opacity group-hover:opacity-100">
                {h.label}
              </span>
              <AnimatePresence>
                {active === h.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute bottom-full left-1/2 z-20 mb-3 w-56 -translate-x-1/2 rounded-sm border border-case-red/30 bg-[#0C0F14F2] p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm"
                  >
                    <p className="mb-1 flex items-center gap-1.5 font-mono text-xs text-case-amber">
                      <h.icon className="h-3.5 w-3.5" /> {h.label}
                    </p>
                    {h.intel.map((line) => (
                      <p key={line} className="text-xs leading-relaxed text-mist-muted">
                        {line}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        <p className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] tracking-widest text-mist-muted/70">
          <MapPin className="h-3 w-3 text-case-red" />
          SURVEY MAP · N 30°14' E 118°02' · 比例尺 1:25,000
        </p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — 搜救记录                                                 */
/* ------------------------------------------------------------------ */

const SEARCH_LOGS = [
  {
    value: 'day1',
    title: 'Day 1 — 地面搜索',
    lines: [
      '06:00 接警，首批 12 人搜救队携搜救犬进山。',
      '09:30 沿常规下撤路线搜索，浓雾未散，能见度 < 20m。',
      '15:00 搜索范围扩大至野径，未发现衣物纤维或足迹。',
      '21:40 因夜间风险撤回营地。无发现。',
    ],
  },
  {
    value: 'day2',
    title: 'Day 2 — 无人机热成像',
    lines: [
      '07:00 两架无人机升空，覆盖鹰嘴崖—岔路口扇区。',
      '11:20 热成像在溪谷上游发现疑似热源，确认为野鹿。',
      '16:50 山风增强至 7 级，无人机停飞。',
      '备注：凌晨 02:00 前后，山脚值守队员报告“远处有红光”，未予采信。',
    ],
  },
  {
    value: 'day3',
    title: 'Day 3 — 溪谷发现与中止',
    lines: [
      '08:15 在海拔约 900m 溪谷石块间发现周远的背包。',
      '09:00 背包送检：手机、钱包、水壶俱在；登山杖缺失。',
      '14:00 指挥部研判：连续 72 小时无生命迹象，且天气预报新一轮浓雾将至。',
      '18:00 宣布搜救中止，转为失踪人口立案。',
    ],
  },
];

function SearchLogSection() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16">
      <SectionHeader kicker="SEARCH LOG — 搜救记录" title="72 小时搜救记录" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-sm border border-white/5 bg-ink-surface px-6 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
      >
        <Accordion type="single" collapsible>
          {SEARCH_LOGS.map((log) => (
            <AccordionItem key={log.value} value={log.value} className="border-white/5">
              <AccordionTrigger className="font-mono text-sm tracking-wider text-mist hover:text-case-red hover:no-underline">
                {log.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1.5 pb-2 font-mono text-xs leading-relaxed text-mist-muted">
                  {log.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
      <p className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-widest text-mist-muted/60">
        <Phone className="h-3 w-3" /> 录音归档 · 共 14 段 · 节选公开
      </p>
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
          to="/evidence"
          className="group inline-flex items-center gap-3 rounded-sm border border-case-red/50 bg-case-red/10 px-8 py-4 font-display text-xl tracking-[0.05em] text-mist transition-all duration-300 hover:bg-case-red/20 hover:shadow-[0_0_32px_rgba(226,62,46,0.35)]"
        >
          案卷看完了。现在，去看看他们留下了什么
          <ArrowRight className="h-5 w-5 text-case-red transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function CasePage() {
  return (
    <div className="relative">
      <PageHeader />
      <DossierSection />
      <TimelineSection />
      <MapSection />
      <SearchLogSection />
      <FooterCTA />
    </div>
  );
}
