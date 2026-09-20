import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** Adds the soft blue wash and grid behind the section. */
  tint?: boolean;
  children: ReactNode;
}

const Section = ({ id, eyebrow, title, description, tint = false, children }: SectionProps) => (
  <section id={id} className="border-t border-primary/10">
    <div className="mx-auto w-full max-w-[70.9rem]">
      <div className={`relative overflow-hidden border-x border-primary/10 ${tint ? 'section-tint' : 'bg-surface'}`}>
        <div className="relative mx-auto max-w-3xl px-5 py-14 sm:px-7 sm:py-16">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-raised px-3 py-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[11px] font-medium uppercase tracking-[2px] text-primary/60">{eyebrow}</p>
            </div>
            <h2 className="text-[clamp(1.6rem,2.4vw,2.25rem)] font-normal leading-tight tracking-[-0.03em]">{title}</h2>
            {description && <p className="max-w-xl text-sm leading-7 text-secondary">{description}</p>}
          </div>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  </section>
);

export default Section;
