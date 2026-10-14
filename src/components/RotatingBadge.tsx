'use client';

export default function RotatingBadge({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="relative inline-flex h-28 w-28 items-center justify-center md:h-32 md:w-32" aria-hidden>
      <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
        </defs>
        <text className="fill-current text-[8.2px] font-bold uppercase" style={{ letterSpacing: '0.24em' }}>
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-display text-[26px] font-semibold md:text-3xl">{sub}</span>
    </div>
  );
}
