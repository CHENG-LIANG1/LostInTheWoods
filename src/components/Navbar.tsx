import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';
import { useGameState, TOTAL_CLUES } from '@/lib/gameState';

const LINKS = [
  { to: '/', label: '首页' },
  { to: '/case', label: '案件档案' },
  { to: '/evidence', label: '证物室' },
  { to: '/suspects', label: '嫌疑人' },
  { to: '/board', label: '推理板' },
  { to: '/rules', label: '玩法指南' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { collectedClues } = useGameState();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? '#0C0F14EE' : 'rgba(12,15,20,0.35)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          borderBottom: scrolled ? '1px solid #FFFFFF14' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group flex items-baseline gap-3">
            <span className="font-display text-2xl tracking-[0.02em] text-mist transition-colors group-hover:text-case-red">
              雾岭迷踪
            </span>
            <span className="hidden font-mono text-[11px] tracking-widest text-mist-muted sm:inline">
              CASE NO. 2024-FR-07
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative text-sm transition-colors hover:text-mist ${
                    isActive ? 'text-case-red' : 'text-mist-muted'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-1.5 rounded-full border border-case-amber/40 bg-case-amber/10 px-3 py-1 font-mono text-xs text-case-amber">
              <MapPin className="h-3.5 w-3.5" />
              线索收集 {collectedClues.length}/{TOTAL_CLUES}
            </div>
          </nav>

          <button
            className="flex h-10 w-10 items-center justify-center text-mist lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="打开菜单"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[#080A0EF5] backdrop-blur-md lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <span className="font-display text-2xl text-mist">雾岭迷踪</span>
              <button
                className="flex h-10 w-10 items-center justify-center text-mist"
                onClick={() => setOpen(false)}
                aria-label="关闭菜单"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-10">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `font-display text-4xl ${isActive ? 'text-case-red' : 'text-mist'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * LINKS.length, duration: 0.35 }}
                className="mt-4 flex items-center gap-2 rounded-full border border-case-amber/40 bg-case-amber/10 px-4 py-1.5 font-mono text-sm text-case-amber"
              >
                <MapPin className="h-4 w-4" />
                线索收集 {collectedClues.length}/{TOTAL_CLUES}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
