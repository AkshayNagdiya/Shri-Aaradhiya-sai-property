'use client';

import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No residences match your search',
  copy = 'Try widening the price range, removing a filter, or exploring a different city.',
  action,
}: {
  title?: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center border border-dashed border-ink/25 bg-ivory-deep/60 px-6 py-16 text-center md:py-20"
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-olive-light text-olive-dark">
        <SearchX size={24} aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-muted">{copy}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
