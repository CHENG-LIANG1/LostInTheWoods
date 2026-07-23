import { motion } from 'framer-motion';

type StampVariant = 'red' | 'amber' | 'green';

const COLORS: Record<StampVariant, string> = {
  red: '#E23E2E',
  amber: '#D9A441',
  green: '#4E9F6E',
};

interface StampProps {
  text: string;
  variant?: StampVariant;
  rotate?: number;
  animated?: boolean;
  className?: string;
}

/** Rotated rubber-stamp label (已确认 / 存疑 / 关键证物 …). */
export default function Stamp({
  text,
  variant = 'red',
  rotate = -8,
  animated = false,
  className = '',
}: StampProps) {
  const color = COLORS[variant];
  const body = (
    <span
      className={`inline-block select-none rounded-sm border-2 px-3 py-1 font-display text-lg tracking-[0.2em] ${className}`}
      style={{ color, borderColor: color, transform: `rotate(${rotate}deg)`, opacity: 0.9 }}
    >
      {text}
    </span>
  );

  if (!animated) return body;

  return (
    <motion.span
      initial={{ scale: 1.6, opacity: 0, rotate: rotate * 2 }}
      whileInView={{ scale: 1, opacity: 1, rotate }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      className="inline-block"
    >
      {body}
    </motion.span>
  );
}
