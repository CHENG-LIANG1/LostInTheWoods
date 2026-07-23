/**
 * Deduction-board local data: canonical clue IDs -> display labels, suspects,
 * correct chains, ending copy. Canonical clue IDs are the contract with the
 * evidence page; do not import from other pages' files.
 */

export interface ClueInfo {
  id: string;
  exhibit: string; // mono exhibit tag, e.g. E-3
  label: string; // short paper-scrap label
}

export const CLUES: Record<string, ClueInfo> = {
  'e1-water': { id: 'e1-water', exhibit: 'E-1', label: '满瓶矿泉水' },
  'e1-pole': { id: 'e1-pole', exhibit: 'E-1', label: '消失的登山杖' },
  'e2-calls': { id: 'e2-calls', exhibit: 'E-2', label: '17 通未接来电' },
  'e2-draft': { id: 'e2-draft', exhibit: 'E-2', label: '草稿短信：问赵铭' },
  'e3-saw': { id: 'e3-saw', exhibit: 'E-3', label: '登山扣人为锯痕' },
  'e4-note': { id: 'e4-note', exhibit: 'E-4', label: '未寄出的字条' },
  'e5-flare': { id: 'e5-flare', exhibit: 'E-5', label: '凌晨燃放的信号弹' },
  'e6-time': { id: 'e6-time', exhibit: 'E-6', label: '10:15 的缆车票' },
  'e6-count': { id: 'e6-count', exhibit: 'E-6', label: '「只来了四个人」' },
  'e7-paint': { id: 'e7-paint', exhibit: 'E-7', label: '袖口检修油漆' },
  'e8-sd': { id: 'e8-sd', exhibit: 'E-8', label: '缺失的 SD 卡' },
  'e8-gps': { id: 'e8-gps', exhibit: 'E-8', label: '相机定位在缆车站' },
};

export interface SuspectInfo {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export const SUSPECTS: SuspectInfo[] = [
  { id: 'suspect-chen', name: '陈野', role: '队友 · 体育生', photo: '/suspect-chen.jpg' },
  { id: 'suspect-lin', name: '林晚', role: '队友 · 周远女友', photo: '/suspect-lin.jpg' },
  { id: 'suspect-zhao', name: '赵铭', role: '登山社社长', photo: '/suspect-zhao.jpg' },
  { id: 'suspect-su', name: '苏晴', role: '队友 · 记录者', photo: '/suspect-su.jpg' },
];

export const CULPRIT_ID = 'suspect-zhao';
export const VICTIM_ID = 'victim';

/**
 * The 5 silent correct chains. Each chain is a pair of node-ID groups;
 * a slot accepts several clue IDs (e.g. either cable-ticket clue).
 */
export interface Chain {
  a: string[];
  b: string[];
  note: string;
}

export const CHAINS: Chain[] = [
  { a: ['e3-saw'], b: ['e7-paint'], note: '登山扣 × 油漆 → 指向缆车检修区' },
  { a: ['e2-draft'], b: ['suspect-zhao'], note: '草稿短信 × 赵铭' },
  { a: ['e6-time', 'e6-count'], b: ['suspect-lin'], note: '缆车票 × 林晚' },
  { a: ['e5-flare'], b: ['suspect-chen'], note: '信号弹 × 陈野' },
  { a: ['e8-gps'], b: ['suspect-su'], note: '相机定位 × 苏晴' },
];

export function chainMatch(a: string, b: string): Chain | null {
  for (const c of CHAINS) {
    if ((c.a.includes(a) && c.b.includes(b)) || (c.a.includes(b) && c.b.includes(a))) {
      return c;
    }
  }
  return null;
}

export function countCorrectChains(connections: [string, string][]): number {
  const seen = new Set<number>();
  connections.forEach(([a, b]) => {
    CHAINS.forEach((c, i) => {
      if (seen.has(i)) return;
      if ((c.a.includes(a) && c.b.includes(b)) || (c.a.includes(b) && c.b.includes(a))) {
        seen.add(i);
      }
    });
  });
  return seen.size;
}

export function nodeLabel(id: string): string {
  if (id === VICTIM_ID) return '周远（失踪者）';
  const clue = CLUES[id];
  if (clue) return `${clue.exhibit} ${clue.label}`;
  const s = SUSPECTS.find((x) => x.id === id);
  return s ? s.name : id;
}

/* ---- Endings ---- */

export type EndingKind = 'true' | 'normal' | 'bad';

export function resolveEnding(accusation: string, correctChains: number): EndingKind {
  if (accusation !== CULPRIT_ID) return 'bad';
  return correctChains >= 3 ? 'true' : 'normal';
}

export const ENDINGS: Record<
  EndingKind,
  { title: string; stamp: string; stampVariant: 'green' | 'amber' | 'red'; verdict: string }
> = {
  true: {
    title: '真结局 · 真相大白',
    stamp: 'CASE CLOSED',
    stampVariant: 'green',
    verdict:
      '赵铭在缆车检修区动了手脚——登山扣上的锯痕与检修油漆，把他钉在了案发前夜。那条没发出去的草稿短信，是周远留给世界最后的指认。\n\n其他人各自藏着秘密：林晚改过时间线，陈野深夜燃过信号弹，苏晴删掉了相机里的定位——但那些是掩盖，不是谋杀。\n\n雾岭的雾散了。周远，可以回家了。',
  },
  normal: {
    title: '普通结局 · 抓对了人，但证据链不完整',
    stamp: '证据不足',
    stampVariant: 'amber',
    verdict:
      '赵铭被带走问话。你的直觉是对的——但卷宗里还缺几段关键的红线。\n\n他闭口不言，律师在场。登山扣与油漆之间的关系、草稿短信的含义，都还只是推测。\n\n回到推理板，把剩下的线索连起来。真相需要一条完整的证据链。',
  },
  bad: {
    title: '坏结局 · 错指',
    stamp: '指控失败',
    stampVariant: 'red',
    verdict:
      '指控在证据面前崩塌了。警局走廊的灯白得刺眼，卷宗被退回，嫌疑人在你身后离开。\n\n与此同时，真正的线索正在冷掉——检修区的油漆会被重新粉刷，草稿短信会随手机一起沉寂。\n\n雾岭又起雾了。重新推理，还来得及。',
  },
};
