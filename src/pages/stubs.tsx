import SectionHeader from '@/components/SectionHeader';

export { default as CasePage } from './Case';
export { default as RulesPage } from './Rules';

function Stub({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <section className="mx-auto min-h-[60vh] max-w-6xl px-6 py-20">
      <SectionHeader kicker={kicker} title={title} description={description} />
      <p className="font-mono text-xs tracking-widest text-mist-muted">// 页面建设中 · UNDER INVESTIGATION</p>
    </section>
  );
}

export function EvidencePage() {
  return (
    <Stub
      kicker="FILE 02 — EVIDENCE"
      title="证物室"
      description="8 件证物 · 12 条隐藏线索"
    />
  );
}

export function SuspectsPage() {
  return (
    <Stub
      kicker="FILE 03 — SUSPECTS"
      title="嫌疑人"
      description="4 份口供 · 找出矛盾之处"
    />
  );
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


