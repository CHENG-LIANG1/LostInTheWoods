interface SectionHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

/** Mono kicker + display heading + fog divider. */
export default function SectionHeader({
  kicker,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`mb-10 flex flex-col gap-3 ${alignCls}`}>
      <p className="font-mono text-xs tracking-[0.3em] text-case-amber">{kicker}</p>
      <h2 className="font-display text-4xl tracking-[0.02em] text-mist md:text-5xl">{title}</h2>
      {description && <p className="max-w-2xl text-sm text-mist-muted md:text-base">{description}</p>}
      <div
        className="mt-2 h-px w-full max-w-md"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(159,179,200,0.5), transparent)',
        }}
      />
    </div>
  );
}
