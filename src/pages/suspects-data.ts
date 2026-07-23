/** Suspect dossiers, interrogations and contradiction logic for /suspects. */

export interface QA {
  q: string;
  a: string;
}

export interface Contradiction {
  /** the suspect's claim, shown with strikethrough toggle */
  claim: string;
  /** clue ids that must ALL be collected to unlock */
  clueIds: string[];
  /** shown when unlocked */
  detail: string;
}

export interface Suspect {
  id: string;
  tag: string; // 'SUSPECT A'
  letter: string;
  name: string;
  age: number;
  role: string;
  relation: string;
  quote: string;
  suspicion: number; // 1-5
  portrait: string;
  alibi: string;
  qa: QA[];
  contradictions: Contradiction[];
}

export const SUSPECTS: Suspect[] = [
  {
    id: 'chen',
    tag: 'SUSPECT A',
    letter: 'A',
    name: '陈野',
    age: 22,
    role: '体育生',
    relation: '室友',
    quote: '我们关系铁得很，我怎么会害他？',
    suspicion: 3,
    portrait: '/suspect-chen.jpg',
    alibi: '自称 10 月 14 日 23:00 起一直在帐篷内睡觉',
    qa: [
      {
        q: '你和周远最后一次说话是什么时候？',
        a: '晚饭的时候吧。他心情不太好，说想早点休息。我就没多问。',
      },
      {
        q: '10 月 14 日夜里你在哪里？',
        a: '十一点不到我就钻进睡袋了，整晚都在帐篷里睡觉，一觉到天亮。',
      },
      {
        q: '有没有听到什么动静？',
        a: '山里晚上风声大，我睡得死。什么都没听见，真的。',
      },
      {
        q: '听说你们之前因为奖学金的事吵过架？',
        a: '那是上个月的事了，早翻篇了。我们关系铁得很，我怎么会害他？',
      },
    ],
    contradictions: [
      {
        claim: '陈野声称整晚在帐篷睡觉，从未离开。',
        clueIds: ['e5-flare'],
        detail:
          'E-5 信号弹：凌晨 2 点有人燃放过信号弹，目击者称火光靠近男生帐篷区——若他整晚熟睡，信号弹是谁放的？',
      },
    ],
  },
  {
    id: 'lin',
    tag: 'SUSPECT B',
    letter: 'B',
    name: '林晚',
    age: 21,
    role: '周远前女友',
    relation: '前任',
    quote: '分手是分手了，但那天我一直在队伍前面。',
    suspicion: 2,
    portrait: '/suspect-lin.jpg',
    alibi: '自称全程走在队伍最前方，与其他三人同行',
    qa: [
      {
        q: '你和周远是什么时候分手的？',
        a: '九月底。和平分手，没什么狗血剧情，你们别往那方面想。',
      },
      {
        q: '10 月 14 日上山时你的位置？',
        a: '我一直在队伍前面。分手是分手了，但那天我一直在队伍前面，赵铭可以作证。',
      },
      {
        q: '缆车票是怎么回事？',
        a: '大家一起买的票啊，还能怎么回事。具体谁去买的我不清楚。',
      },
      {
        q: '周远失踪前有没有和你单独接触过？',
        a: '没有。我们全程几乎没说话，他要走野径，我劝了一句他不听。',
      },
    ],
    contradictions: [
      {
        claim: '林晚声称"一直在队伍前面"，与大部队同行购票。',
        clueIds: ['e6-count'],
        detail:
          'E-6 缆车票：售票员记得只来了四个人，第五人分开购票且时间晚 20 分钟——"一直在队伍前面"的人，为什么票是单独买的？',
      },
    ],
  },
  {
    id: 'zhao',
    tag: 'SUSPECT C',
    letter: 'C',
    name: '赵铭',
    age: 26,
    role: '登山社社长 · 带队人',
    relation: '社长',
    quote: '走野径是集体决定，不是我一个人的主意。',
    suspicion: 5,
    portrait: '/suspect-zhao.jpg',
    alibi: '自称改走野径后在队尾殿后，未察觉周远离队',
    qa: [
      {
        q: '为什么临时改走野径？',
        a: '天气好，大家想快点登顶看日落。走野径是集体决定，不是我一个人的主意。',
      },
      {
        q: '出发前谁负责检查装备？',
        a: '装备是我统一检查的，登山扣、绳索都没问题，我用社长的名义担保。',
      },
      {
        q: '周远的手机草稿里写着"如果我出事，问赵铭"。你怎么解释？',
        a: '……他爱写什么写什么。我带队三年零事故，周远对我有误会，这我管不着。',
      },
      {
        q: '你袖口为什么有和缆车检修区一样的油漆？',
        a: '上周社团义务帮缆车站刷漆，全队都知道。这也能算证据？',
      },
    ],
    contradictions: [
      {
        claim: '赵铭声称走野径是"集体决定"，装备也经他检查无误。',
        clueIds: ['e2-draft', 'e3-saw'],
        detail:
          'E-2 手机草稿短信"如果我出事，问赵铭"+ E-3 登山扣是人为锯痕——而全队的装备恰恰由他负责检查。',
      },
    ],
  },
  {
    id: 'su',
    tag: 'SUSPECT D',
    letter: 'D',
    name: '苏晴',
    age: 20,
    role: '社团新人',
    relation: '暗恋者',
    quote: '我……我那天看到了一些东西，但我不敢说。',
    suspicion: 4,
    portrait: '/suspect-su.jpg',
    alibi: '自称中途体力不支，独自在缆车站休息区等待',
    qa: [
      {
        q: '你为什么中途没有跟队登顶？',
        a: '我体力不好，爬到缆车站就喘不上气了，就在休息区等他们。',
      },
      {
        q: '在缆车站期间你见过什么人？',
        a: '没有……吧。人挺多的，我戴着帽子玩手机，没注意。',
      },
      {
        q: '周远的运动相机为什么在缆车站失物招领处？',
        a: '我……我不知道。可能他自己落在那儿了吧。',
      },
      {
        q: '你还有什么想补充的吗？',
        a: '我……我那天看到了一些东西，但我不敢说。给我一点时间，好吗？',
      },
    ],
    contradictions: [
      {
        claim: '苏晴声称什么都没看见，对相机的事毫不知情。',
        clueIds: ['e8-gps'],
        detail:
          'E-8 相机最后定位在缆车站：她曾捡到相机却未上交——"什么都不知道"的人，为什么相机会经她的手？',
      },
    ],
  },
];
