import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-[#080A0E]">
      {/* red string line with pins */}
      <svg
        className="absolute -top-3 left-0 h-6 w-full"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="0"
          y1="12"
          x2="1200"
          y2="12"
          stroke="#E23E2E"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity="0.6"
        />
        {[120, 430, 760, 1050].map((x) => (
          <g key={x}>
            <circle cx={x} cy="12" r="5" fill="#E23E2E" />
            <circle cx={x - 1.5} cy="10.5" r="1.6" fill="#fff" opacity="0.5" />
          </g>
        ))}
      </svg>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-display text-xl text-mist">关于本游戏</h3>
          <p className="text-sm leading-relaxed text-mist-muted">
            《雾岭迷踪》是一款网页推理游戏。阅读案卷、检验证物、质询嫌疑人，在推理板上连起真相。
            本作纯属虚构，人物、地点与事件均为创作内容，与现实无关。
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-display text-xl text-mist">快速导航</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-mist-muted">
            <li><Link className="hover:text-case-red" to="/case">案件档案</Link></li>
            <li><Link className="hover:text-case-red" to="/evidence">证物室</Link></li>
            <li><Link className="hover:text-case-red" to="/suspects">嫌疑人</Link></li>
            <li><Link className="hover:text-case-red" to="/board">推理板</Link></li>
            <li><Link className="hover:text-case-red" to="/rules">玩法指南</Link></li>
            <li><Link className="hover:text-case-red" to="/">首页</Link></li>
          </ul>
        </div>
        <div className="font-mono text-xs leading-loose text-mist-muted">
          <p>CASE NO. 2024-FR-07</p>
          <p>OPENED · 2024-10-14 17:40</p>
          <p>LOC · N 30°14' E 118°02' · 1,847m</p>
          <p className="text-case-amber">STATUS · 未结悬案</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center font-mono text-[11px] text-mist-muted/60">
        雾岭迷踪 FOG RIDGE · A FICTIONAL DEDUCTION GAME
      </div>
    </footer>
  );
}
