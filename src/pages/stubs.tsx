import SectionHeader from '@/components/SectionHeader';
import Evidence from './Evidence';
import Suspects from './Suspects';

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
  return <Evidence />;
}

export function SuspectsPage() {
  return <Suspects />;
}

export { default as BoardPage } from '@/pages/Board';


