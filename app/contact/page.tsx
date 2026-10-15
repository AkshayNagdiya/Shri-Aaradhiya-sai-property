'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../../src/components/SectionHeading';
import Reveal from '../../src/components/Reveal';
import { useCms } from '../../src/lib/cms';
import { usePageMeta } from '../../src/lib/seo';

interface Errs {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

export default function Contact() {
  const { project: PROJECT } = useCms();
  usePageMeta('Contact — Surya Greens', 'Call 77249-85563 or 91316-44787, or request a site visit to Santer, Kishanganj–Mhow.');

  const [v, setV] = useState({ name: '', email: '', phone: '', interest: '600–800 sq.ft. plot', message: '' });
  const [errs, setErrs] = useState<Errs>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof v, val: string) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrs((p) => ({ ...p, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n: Errs = {};
    if (v.name.trim().length < 2) n.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) n.email = 'Please enter a valid email.';
    if (v.phone.trim() && !/^[+\d][\d\s-]{6,14}$/.test(v.phone.trim())) n.phone = 'Please enter a valid phone number.';
    if (v.message.trim().length < 10) n.message = 'Please add a little detail (min. 10 characters).';
    setErrs(n);
    if (Object.keys(n).length === 0) setDone(true);
  };

  const errCls = (e?: string) => `field ${e ? 'border-red-700 ring-2 ring-red-700/15' : ''}`;

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-12 md:px-10 md:py-16">
          <SectionHeading
            eyebrow="Contact"
            title="Book Your Site Visit."
            copy="Call for instant answers on price and availability — or send a visit request and we’ll call you back."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {PROJECT.phones.map((p) => (
              <a key={p.display} href={p.href} className="btn btn-primary">
                <Phone size={15} aria-hidden /> {p.display}
              </a>
            ))}
            <a href={PROJECT.mapUrl} target="_blank" rel="noreferrer" className="btn btn-outline-dark">
              <MapPin size={15} aria-hidden /> Open live map
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-shell gap-10 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <div className="space-y-4">
            {[
              { icon: MapPin, t: 'Site address', d: 'Surya Greens, Santer, Kishanganj – Mhow (MP)' },
              { icon: Phone, t: 'Call us', d: PROJECT.phones.map((p) => p.display).join('  ·  ') },
              { icon: Mail, t: 'Marketed by', d: `${PROJECT.marketer} — ${PROJECT.marketerTagline}` },
              { icon: Clock, t: 'Site visits', d: 'Every day, 10:00 AM – 6:30 PM (call ahead)' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-4 border border-line bg-ivory p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-navy-mist text-navy-deep">
                  <Icon size={19} aria-hidden />
                </span>
                <span>
                  <span className="block text-[12px] font-bold uppercase tracking-[0.18em] text-ink-faint">{t}</span>
                  <span className="mt-0.5 block text-[15.5px] font-medium text-navy-deep">{d}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-hidden border border-gold/40">
            <img
              src="/images/route-map.jpg"
              alt="Route map to Surya Greens — scan the QR code for live location"
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {done ? (
            <div role="status" className="border border-navy/25 bg-navy-mist p-8">
              <h2 className="font-display text-2xl text-navy-deep">Thank you, {v.name.split(' ')[0] || 'friend'}.</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">
                Your visit request for a “{v.interest}” has been noted. For confirmation within the hour,
                please call <a className="font-bold text-navy-deep underline" href={PROJECT.phones[0].href}>{PROJECT.phones[0].display}</a>.
                Demo form — nothing was transmitted online.
              </p>
              <button suppressHydrationWarning
                type="button"
                onClick={() => { setDone(false); setV({ name: '', email: '', phone: '', interest: '600–800 sq.ft. plot', message: '' }); }}
                className="btn btn-outline-dark mt-6"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form suppressHydrationWarning onSubmit={submit} noValidate aria-label="Site visit request form" className="border border-line p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Name *</label>
                  <input suppressHydrationWarning id="c-name" autoComplete="name" className={errCls(errs.name)} value={v.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" aria-invalid={Boolean(errs.name)} />
                  {errs.name ? <p role="alert" className="mt-1.5 text-sm text-red-800">{errs.name}</p> : null}
                </div>
                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Phone *</label>
                  <input suppressHydrationWarning id="c-phone" type="tel" autoComplete="tel" className={errCls(errs.phone)} value={v.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" aria-invalid={Boolean(errs.phone)} />
                  {errs.phone ? <p role="alert" className="mt-1.5 text-sm text-red-800">{errs.phone}</p> : null}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="c-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Email *</label>
                <input suppressHydrationWarning id="c-email" type="email" autoComplete="email" className={errCls(errs.email)} value={v.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" aria-invalid={Boolean(errs.email)} />
                {errs.email ? <p role="alert" className="mt-1.5 text-sm text-red-800">{errs.email}</p> : null}
              </div>
              <div className="mt-4">
                <label htmlFor="c-interest" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">I’m interested in</label>
                <select suppressHydrationWarning id="c-interest" className="field" value={v.interest} onChange={(e) => set('interest', e.target.value)}>
                  <option>600–800 sq.ft. plot</option>
                  <option>875–925 sq.ft. plot</option>
                  <option>976–1000 sq.ft. premium plot</option>
                  <option>East facing plot</option>
                  <option>West facing plot</option>
                  <option>Loan assistance</option>
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="c-msg" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Message *</label>
                <textarea suppressHydrationWarning id="c-msg" rows={5} className={`${errCls(errs.message)} resize-y`} value={v.message} onChange={(e) => set('message', e.target.value)} placeholder="I’d like to visit this Sunday morning with family…" />
                {errs.message ? <p role="alert" className="mt-1.5 text-sm text-red-800">{errs.message}</p> : null}
              </div>
              <button suppressHydrationWarning type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">Request site visit</button>
              <p className="mt-3 text-[13px] text-ink-faint">Demo form — for instant help call {PROJECT.phones[0].display}.</p>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
