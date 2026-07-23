import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex items-center gap-2.5 rounded-md border border-case-red/40 bg-[#151A22F2] px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-sm"
    >
      <img src="/string-pin.svg" alt="" className="h-6 w-6" />
      <MapPin className="hidden h-4 w-4 text-case-red" />
      <span className="text-sm text-mist">{toast.message}</span>
    </motion.div>
  );
}

/** Clue-collected notification stack, slides up from bottom. */
export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
