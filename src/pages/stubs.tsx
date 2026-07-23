import SectionHeader from '@/components/SectionHeader';
import Evidence from './Evidence';
import Suspects from './Suspects';

function Stub({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <section className="mx-auto min-h-[60vh] max-w-6xl px-6 py-20">
      <SectionHeader kicker={kicker} title={title} description={description} />
      <p className="font-mono text-xs tracking-widest text-mist-muted">// 页面建设中 · UNDER INVESTIGATION</p>
    </section>
  );
}

export function CasePage() {
  return (
    <Stub
      kicker="FILE 01 — CASE FILE"
      title="案件档案"
      description="事件报告 · 互动时间线 · 雾岭地图"
    />
  );
}

export function EvidencePage() {
  return <Evidence />;
}

export function SuspectsPage() {
  return <Suspects />;
}

export function BoardPage() {
  return (
    <Stub
      kicker="FILE 04 — DEDUCTION BOARD"
      title="推理板"
      description="连线线索 · 最终指控 · 结局揭晓"
    />
  );
}

export function RulesPage() {
  return (
    <Stub
      kicker="FILE 05 — HOW TO PLAY"
      title="玩法指南"
      description="调查流程 · 线索清单 · 常见问题"
    />
  );
}
