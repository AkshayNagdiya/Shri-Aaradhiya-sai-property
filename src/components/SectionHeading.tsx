'use client';

import Link from 'next/link';
import Reveal from './Reveal';

interface Props {
  eyebrow: string;
  title: string;
  copy?: string;
  linkLabel?: string;
  linkTo?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  linkLabel,
  linkTo,
  align = 'left',
  dark = false,
}: Props) {
  const alignCls = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignCls}`}>
      <p className={`eyebrow ${dark ? 'text-clay' : ''}`}>{eyebrow}</p>
      <h2 className={`font-display font-h2 ${dark ? 'text-ivory' : 'text-ink'}`}>{title}</h2>
      {copy ? (
        <p className={`max-w-xl text-[15.5px] leading-relaxed md:text-base ${dark ? 'text-ivory/70' : 'text-ink-muted'}`}>
          {copy}
        </p>
      ) : null}
      {linkLabel && linkTo ? (
        <Link
          href={linkTo}
          className={`u-link mt-1 inline-flex w-fit text-[13px] font-semibold uppercase tracking-[0.18em] ${
            dark ? 'text-ivory' : 'text-navy-deep'
          }`}
        >
          {linkLabel} →
        </Link>
      ) : null}
    </Reveal>
  );
}
