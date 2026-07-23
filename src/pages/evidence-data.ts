/**
 * Canonical evidence & clue data for 雾岭迷踪.
 * Clue IDs here are referenced by the suspects page (疑点比对)
 * and by the deduction board page — do NOT rename.
 */

export type EvidenceTag = '随身物品' | '现场发现' | '文件票据';

export interface Clue {
  id: string;
  /** short label used in toasts / board scraps */
  label: string;
  /** full clue text revealed in the modal */
  text: string;
  key?: boolean;
}

export interface EvidenceItem {
  id: string; // e.g. 'E-1'
  exhibit: string; // 'EXHIBIT E-1'
  title: string;
  photo: string;
  tag: EvidenceTag;
  report: string;
  rotate: number; // card rotation -2..2
  clues: Clue[];
}

export const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'E-1',
    exhibit: 'EXHIBIT E-1',
    title: '周远的背包',
    photo: '/ev-backpack.jpg',
    tag: '现场发现',
    report:
      '背包在鹰嘴崖下方的溪谷边被发现，主袋拉链完好，内部物品整齐，没有翻找或挣扎的痕迹。侧袋插着一瓶未开封的矿泉水。',
    rotate: -1.5,
    clues: [
      { id: 'e1-water', label: '满瓶的矿泉水', text: '侧袋的矿泉水是满的——他不缺水。' },
      { id: 'e1-pole', label: '失踪的登山杖', text: '背包在溪谷，但登山杖不在。' },
    ],
  },
  {
    id: 'E-2',
    exhibit: 'EXHIBIT E-2',
    title: '碎屏手机',
    photo: '/ev-phone.jpg',
    tag: '随身物品',
    report:
      '屏幕碎裂但主板完好。解锁后通话记录显示大量未接来电集中在 10 月 14 日夜间；短信草稿箱里有一条没有发出的消息。',
    rotate: 1.2,
    clues: [
      { id: 'e2-calls', label: '17 通未接来电', text: '锁屏上显示 17 通未接来电。' },
      {
        id: 'e2-draft',
        label: '草稿短信',
        text: '最后一条草稿短信："如果我出事，问赵铭。"',
        key: true,
      },
    ],
  },
  {
    id: 'E-3',
    exhibit: 'EXHIBIT E-3',
    title: '断裂的登山扣',
    photo: '/ev-carabiner.jpg',
    tag: '现场发现',
    report:
      '在鹰嘴崖中段岩缝中找到的铝合金登山扣，从锁门处断开。显微检验显示断口平整、有重复摩擦痕迹，与坠崖瞬间拉断的纤维撕裂形态不符。',
    rotate: -0.8,
    clues: [
      {
        id: 'e3-saw',
        label: '断口处的锯痕',
        text: '断口是人为锯痕，而非坠崖拉断。',
        key: true,
      },
    ],
  },
  {
    id: 'E-4',
    exhibit: 'EXHIBIT E-4',
    title: '未寄出的字条',
    photo: '/ev-note.jpg',
    tag: '文件票据',
    report:
      '在周远背包夹层里找到的横线纸条，被揉成一团又展开过，字迹潦草仓促，像是在行进途中写下的。',
    rotate: 1.8,
    clues: [
      {
        id: 'e4-note',
        label: '潦草的字条',
        text: '字迹潦草："缆车票据能对上时间，但人对不上。"',
      },
    ],
  },
  {
    id: 'E-5',
    exhibit: 'EXHIBIT E-5',
    title: '燃尽的信号弹',
    photo: '/ev-flare.jpg',
    tag: '现场发现',
    report:
      '在男生帐篷区后方的岩石上发现的红色信号弹残骸，完全燃尽。燃烧残留物的湿度推断燃放时间为凌晨 2 点左右，而搜救记录中并无任何信号弹目击报告。',
    rotate: -1.9,
    clues: [
      {
        id: 'e5-flare',
        label: '凌晨两点的信号弹',
        text: '凌晨 2 点有人燃放过信号弹——搜救队当时并未记录。',
      },
    ],
  },
  {
    id: 'E-6',
    exhibit: 'EXHIBIT E-6',
    title: '两张缆车票',
    photo: '/ev-ticket.jpg',
    tag: '文件票据',
    report:
      '在营地垃圾桶里找到的两张缆车票存根和一张收据。票面信息与售票处记录相符，但售票员的证言存在明显出入。',
    rotate: 0.9,
    clues: [
      { id: 'e6-time', label: '10:15 的购票时间', text: '购票时间为 10:15。' },
      {
        id: 'e6-count',
        label: '只来了四个人',
        text: '售票员记得"只来了四个人"。',
        key: true,
      },
    ],
  },
  {
    id: 'E-7',
    exhibit: 'EXHIBIT E-7',
    title: '沾泥的冲锋衣',
    photo: '/ev-jacket.jpg',
    tag: '随身物品',
    report:
      '周远的冲锋衣袖口有大片暗色污渍，初检记录为"泥浆"。复检光谱分析显示其中含有醇酸树脂与铁红颜料成分，并非泥土。',
    rotate: -1.1,
    clues: [
      {
        id: 'e7-paint',
        label: '袖口的油漆',
        text: '袖口的暗色污渍不是泥——是油漆，与缆车检修漆一致。',
        key: true,
      },
    ],
  },
  {
    id: 'E-8',
    exhibit: 'EXHIBIT E-8',
    title: '运动相机',
    photo: '/ev-camera.jpg',
    tag: '随身物品',
    report:
      '在缆车站失物招领处取回的运动相机，镜头有划痕，SD 卡槽敞开。机身内置 GPS 模块记录了最后一次开机定位。',
    rotate: 1.6,
    clues: [
      { id: 'e8-sd', label: '缺失的 SD 卡', text: 'SD 卡缺失。' },
      {
        id: 'e8-gps',
        label: '缆车站的定位',
        text: '机身最后定位在缆车站，而非溪谷。',
        key: true,
      },
    ],
  },
];

export const CLUE_MAP: Record<string, Clue & { evidenceId: string; evidenceTitle: string }> =
  Object.fromEntries(
    EVIDENCE_ITEMS.flatMap((e) =>
      e.clues.map((c) => [c.id, { ...c, evidenceId: e.id, evidenceTitle: e.title }]),
    ),
  );
