'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function InquiryForm({ subject }: { subject: string }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof values, v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = 'Please enter a valid email.';
    if (values.phone.trim() && !/^[+\d][\d\s-]{6,14}$/.test(values.phone.trim()))
      next.phone = 'Please enter a valid phone number, or leave it blank.';
    if (values.message.trim().length < 10) next.message = 'Please tell us a little more (min. 10 characters).';
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="border border-navy/25 bg-navy-mist px-6 py-6">
        <p className="font-display text-xl text-navy-deep">Thank you, {values.name.split(' ')[0]}.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          Your enquiry about <strong>{subject}</strong> has been noted. For the fastest response, please
          call <a className="font-semibold text-navy-deep underline" href="tel:+917724985563">77249-85563</a> or{' '}
          <a className="font-semibold text-navy-deep underline" href="tel:+919131644787">91316-44787</a>.
          Demo form — nothing was transmitted online.
        </p>
      </div>
    );
  }

  const inputCls = (err?: string) => `field ${err ? 'border-red-700 ring-2 ring-red-700/15' : ''}`;

  return (
    <form suppressHydrationWarning onSubmit={submit} noValidate aria-label={`Enquire about ${subject}`} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Full name *
          </label>
          <input suppressHydrationWarning
            id="inq-name"
            autoComplete="name"
            className={inputCls(errors.name)}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'inq-name-err' : undefined}
            placeholder="Your full name"
          />
          {errors.name ? <p id="inq-name-err" role="alert" className="mt-1.5 text-sm text-red-800">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="inq-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Email *
          </label>
          <input suppressHydrationWarning
            id="inq-email"
            type="email"
            autoComplete="email"
            className={inputCls(errors.email)}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'inq-email-err' : undefined}
            placeholder="you@example.com"
          />
          {errors.email ? <p id="inq-email-err" role="alert" className="mt-1.5 text-sm text-red-800">{errors.email}</p> : null}
        </div>
      </div>
      <div>
        <label htmlFor="inq-phone" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Phone (optional)
        </label>
        <input suppressHydrationWarning
          id="inq-phone"
          type="tel"
          autoComplete="tel"
          className={inputCls(errors.phone)}
          value={values.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="+91 98200 00000"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'inq-phone-err' : undefined}
        />
        {errors.phone ? <p id="inq-phone-err" role="alert" className="mt-1.5 text-sm text-red-800">{errors.phone}</p> : null}
      </div>
      <div>
        <label htmlFor="inq-msg" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Message *
        </label>
        <textarea suppressHydrationWarning
          id="inq-msg"
          rows={4}
          className={`${inputCls(errors.message)} resize-y`}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder={`I’d like to visit ${subject} and know the price…`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'inq-msg-err' : undefined}
        />
        {errors.message ? <p id="inq-msg-err" role="alert" className="mt-1.5 text-sm text-red-800">{errors.message}</p> : null}
      </div>
      <button suppressHydrationWarning type="submit" className="btn btn-primary w-full sm:w-auto">
        Request site visit
      </button>
      <p className="text-[13px] text-ink-faint">Demo form — for instant help call 77249-85563 / 91316-44787.</p>
    </form>
  );
}
