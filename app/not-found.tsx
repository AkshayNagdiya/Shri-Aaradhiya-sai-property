'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import { usePageMeta } from '../src/lib/seo';

export default function NotFound() {
  usePageMeta('Page not found — Surya Greens');

  return (
    <div className="flex min-h-[80vh] items-center bg-navy-deep pt-[68px] text-ivory md:pt-[106px]">
      <div className="gold-rule absolute inset-x-0 top-[68px] md:top-[106px]" aria-hidden />
      <div className="mx-auto w-full max-w-shell px-5 py-16 text-center md:px-10">
        <p className="inline-flex items-center gap-2 border border-gold/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-light">
          <Compass size={14} aria-hidden /> 404 — off the layout plan
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-none">
          This plot doesn’t exist.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-ivory/65">
          The address you followed isn’t part of Surya Greens. Let’s walk you back to the main gate.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn bg-gold px-8 py-4 text-navy-deep hover:bg-gold-light">
            <ArrowLeft size={16} aria-hidden /> Back home
          </Link>
          <Link href="/plots" className="btn btn-ghost">
            Explore plots <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
