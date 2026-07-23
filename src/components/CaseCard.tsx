import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CaseCardProps {
  fileTag: string;
  title: string;
  description: string;
  to?: string;
  rotate?: number;
  children?: ReactNode;
  className?: string;
}

/** Paper-textured card with tape corners and a mono ID tag. */
export default function CaseCard({
  fileTag,
  title,
  description,
  to,
  rotate = 0,
  children,
  className = '',
}: CaseCardProps) {
  const inner = (
    <motion.div
      whileHover={{ y: -10, rotate: 0 }}
      whileTap={{ scale: 0.97 }}
      initial={false}
      style={{ rotate }}
      className={`paper-card group relative h-full rounded-sm p-6 pt-8 shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-shadow duration-300 hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)] ${className}`}
    >
      <span className="tape-corner -left-4 -top-2 -rotate-45 transition-opacity group-hover:opacity-90" />
      <span className="tape-corner -right-4 -top-2 rotate-45 transition-opacity group-hover:opacity-90" />
      <p className="mb-2 font-mono text-[11px] tracking-[0.2em] text-case-red">{fileTag}</p>
      <h3 className="mb-2 font-display text-3xl text-[#151A22]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#3d434e]">{description}</p>
      {children}
      {to && (
        <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-case-red opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          打开档案 <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </motion.div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}
