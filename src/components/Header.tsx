'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  ChevronDown,
  Clock,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { useCms } from '../lib/cms';
import { connectivity } from '../data/project';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const galleryCats = [
  { title: 'Grand Entrance', cat: 'Entrance', img: '/images/main-gate.jpg', copy: 'Gates, avenue & walls' },
  { title: 'Gardens & Courts', cat: 'Gardens', img: '/images/garden-music.jpg', copy: '6 theme gardens' },
  { title: 'Gym & Sports Deck', cat: 'Sports', img: '/images/open-gym.jpg', copy: 'Gym, turfs & courts' },
  { title: 'Master Layout', cat: 'Master Plan', img: '/images/master-plan.jpg', copy: 'Numbered plot plan' },
] as const;

const locationPreview = connectivity.slice(0, 4);

function isActivePath(path: string, to: string) {
  if (to === '/') return path === '/';
  return path === to || path.startsWith(to + '/');
}

/* ------------------------------ desktop pill ----------------------------- */

function NavPill({
  href,
  label,
  active,
  solid,
  hasMenu,
  menuOpen,
  onEnter,
  onLeave,
  onToggle,
}: {
  href: string;
  label: string;
  active: boolean;
  solid: boolean;
  hasMenu?: boolean;
  menuOpen?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onToggle?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      aria-expanded={hasMenu ? menuOpen : undefined}
      aria-haspopup={hasMenu ? 'true' : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onClick={
        hasMenu
          ? (e) => {
              if (!menuOpen) {
                e.preventDefault();
                onToggle?.();
              }
            }
          : undefined
      }
      className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-gold ${
        solid
          ? active
            ? 'text-ivory'
            : 'text-navy-deep/75 hover:text-navy-deep'
          : active
            ? 'text-navy-deep'
            : 'text-ivory/80 hover:text-ivory'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={{ duration: 0.45, ease: EASE }}
          aria-hidden
          className={`absolute inset-0 rounded-full shadow-subtle ${solid ? 'bg-navy-deep' : 'bg-ivory'}`}
        />
      )}
      {!active && (
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            solid ? 'bg-navy/[0.07]' : 'bg-ivory/10'
          }`}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {label}
        {hasMenu && (
          <ChevronDown
            size={13}
            aria-hidden
            className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''} ${
              active ? '' : 'opacity-60 group-hover:opacity-100'
            }`}
          />
        )}
      </span>
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-[7px] left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
        />
      )}
    </Link>
  );
}

/* --------------------------------- header -------------------------------- */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<'plots' | 'gallery' | 'location' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>('plots');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });
  const lastY = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { project: PROJECT, plots, gallery } = useCms();

  /* Mounted gate: reduced-motion/scroll values can differ between server HTML
     and the client's first render, which causes hydration mismatch. */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Transparent theme while the dark amenity stack scrolls under the header */
  const [overDark, setOverDark] = useState(false);
  useEffect(() => {
    const el = document.getElementById('amenity-stack');
    if (!el) {
      setOverDark(false);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setOverDark(entry.isIntersecting),
      { rootMargin: '-72px 0px -80% 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = lastY.current;
    setScrolled(y > 28);
    if (!reduceMotion && !open && !openMenu) {
      const dy = y - prev;
      if (Math.abs(dy) >= 7) {
        if (y < 180 || dy < 0) setHidden(false);
        else setHidden(true);
      }
    } else if (open) {
      setHidden(false);
    }
    lastY.current = y;
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setOpenMenu(null);
    setMobileExpanded('plots');
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const menuEnter = (m: 'plots' | 'gallery' | 'location') => {
    cancelClose();
    setOpenMenu(m);
  };

  const solid = scrolled || !isHome || open;
  const collapsed = scrolled || open;
  /* visual theme only — sizes + utility bar still follow `solid` so nothing jumps */
  const themeSolid = solid && !overDark;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <motion.div
        initial={false}
        animate={{ y: hidden && !open ? '-115%' : '0%' }}
        transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* ── utility top bar ── */}
        <motion.div
          initial={false}
          animate={{ height: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="hidden overflow-hidden bg-navy-deep text-ivory md:block"
        >
          <div className="border-b border-ivory/10">
            <div className="mx-auto flex max-w-shell items-center justify-between gap-6 px-10 py-[7px] text-[11.5px]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-gold-light">
                  <BadgeCheck size={12} aria-hidden /> RERA · {PROJECT.reraNo}
                </span>
                <span className="hidden items-center gap-1.5 truncate text-ivory/70 lg:inline-flex">
                  <MapPin size={12} aria-hidden className="shrink-0 text-gold" />
                  {PROJECT.location}
                </span>
                <span className="hidden items-center gap-1.5 text-ivory/50 xl:inline-flex">
                  <Clock size={12} aria-hidden /> 10 AM – 6:30 PM · Every day
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {PROJECT.phones.map((p) => (
                  <a
                    key={p.display}
                    href={p.href}
                    className="inline-flex items-center gap-1.5 font-semibold text-ivory/85 transition hover:text-gold-light"
                  >
                    <Phone size={12} aria-hidden className="text-gold" /> {p.display}
                  </a>
                ))}
                <span aria-hidden className="h-3 w-px bg-ivory/20" />
                <a
                  href={PROJECT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center gap-1.5 text-ivory/70 transition hover:text-gold-light"
                >
                  <AtSign size={13} aria-hidden />
                </a>
                <a
                  href={PROJECT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-light/90 transition hover:text-gold-light"
                >
                  Live map →
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── floating main bar ── */}
        <div className="px-3 pt-2 sm:px-5 sm:pt-3">
          <header
            className={`relative mx-auto max-w-shell rounded-2xl border transition-all duration-500 ${
              themeSolid
                ? 'border-line bg-ivory/90 shadow-card backdrop-blur-xl'
                : 'border-ivory/15 bg-navy-deep/45 shadow-soft backdrop-blur-md'
            }`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
            />
            <div
              className={`flex items-center justify-between gap-3 pl-3 pr-2 transition-all duration-500 md:pl-4 md:pr-3 ${
                solid ? 'h-[62px] md:h-[68px]' : 'h-[68px] md:h-[78px]'
              }`}
            >
              {/* logo */}
              <Link href="/" aria-label="Surya Greens — home" className="group flex min-w-0 items-center gap-3">
                <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-light via-gold to-[#8a6d24] shadow-subtle ring-1 ring-gold-light/60 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-105"
                  />
                  <span aria-hidden className="absolute inset-[3px] rounded-[9px] border border-navy-deep/20" />
                  <span className="relative font-display text-[15px] font-bold tracking-wide text-navy-deep">
                    SA
                  </span>
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-navy-deep text-[8px] text-gold-light ring-2 ring-ivory"
                  >
                    ✦
                  </span>
                </span>
                <span className="min-w-0 leading-none">
                  <span
                    className={`block truncate font-display text-[13.5px] font-bold tracking-[0.09em] transition-colors md:text-[16.5px] ${
                      themeSolid ? 'text-navy-deep' : 'text-ivory'
                    }`}
                  >
                    SHRI AARADHYA SAI
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.26em] md:text-[9.5px]">
                    <span className={themeSolid ? 'text-gold-deep' : 'text-gold-light'}>Surya Greens</span>
                    <span aria-hidden className={themeSolid ? 'text-navy/30' : 'text-ivory/30'}>
                      ·
                    </span>
                    <span className={themeSolid ? 'text-ink-faint' : 'text-ivory/60'}>Since 2010</span>
                  </span>
                </span>
              </Link>

              {/* desktop nav */}
              <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
                <div onMouseLeave={scheduleClose}>
                  <NavPill href="/" label="Home" active={isActivePath(pathname, '/')} solid={themeSolid} />
                </div>
                <div onMouseEnter={() => menuEnter('plots')} onMouseLeave={scheduleClose}>
                  <NavPill
                    href="/plots"
                    label="Plots"
                    active={isActivePath(pathname, '/plots')}
                    solid={themeSolid}
                    hasMenu
                    menuOpen={openMenu === 'plots'}
                    onEnter={() => menuEnter('plots')}
                    onLeave={scheduleClose}
                    onToggle={() => setOpenMenu((m) => (m === 'plots' ? null : 'plots'))}
                  />
                </div>
                <div onMouseEnter={() => menuEnter('gallery')} onMouseLeave={scheduleClose}>
                  <NavPill
                    href="/gallery"
                    label="Gallery"
                    active={isActivePath(pathname, '/gallery')}
                    solid={themeSolid}
                    hasMenu
                    menuOpen={openMenu === 'gallery'}
                    onEnter={() => menuEnter('gallery')}
                    onLeave={scheduleClose}
                    onToggle={() => setOpenMenu((m) => (m === 'gallery' ? null : 'gallery'))}
                  />
                </div>
                <div onMouseEnter={() => menuEnter('location')} onMouseLeave={scheduleClose}>
                  <NavPill
                    href="/location"
                    label="Location"
                    active={isActivePath(pathname, '/location')}
                    solid={themeSolid}
                    hasMenu
                    menuOpen={openMenu === 'location'}
                    onEnter={() => menuEnter('location')}
                    onLeave={scheduleClose}
                    onToggle={() => setOpenMenu((m) => (m === 'location' ? null : 'location'))}
                  />
                </div>
                <div onMouseLeave={scheduleClose}>
                  <NavPill
                    href="/about"
                    label="About"
                    active={isActivePath(pathname, '/about')}
                    solid={themeSolid}
                  />
                </div>
              </nav>

              {/* actions */}
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={PROJECT.phones[0].href}
                  className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-[12px] font-bold tracking-wide transition-all duration-300 xl:inline-flex ${
                    themeSolid
                      ? 'border-navy/20 text-navy-deep hover:border-navy hover:bg-navy hover:text-ivory'
                      : 'border-ivory/25 bg-ivory/10 text-ivory backdrop-blur-sm hover:border-gold hover:text-gold-light'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <Phone size={14} aria-hidden />
                  {PROJECT.phones[0].display}
                </a>
                <Link
                  href="/contact"
                  className="group relative hidden overflow-hidden rounded-full bg-gradient-to-r from-[#a88434] via-gold to-gold-light px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.14em] text-navy-deep shadow-subtle transition-all duration-300 hover:-translate-y-px hover:shadow-card sm:inline-flex sm:items-center sm:gap-1.5"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative">Enquire</span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                <button suppressHydrationWarning
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors lg:hidden ${
                    themeSolid
                      ? 'border-navy/15 bg-navy/5 text-navy-deep'
                      : 'border-ivory/20 bg-ivory/10 text-ivory'
                  }`}
                >
                  <motion.span
                    key={open ? 'x' : 'menu'}
                    initial={{ rotate: -60, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className="inline-flex"
                  >
                    {open ? <X size={21} /> : <Menu size={21} />}
                  </motion.span>
                </button>
              </div>
            </div>

            {/* scroll progress — client only (hydration-safe) */}
            {mounted && !reduceMotion && (
              <motion.span
                aria-hidden
                style={{ scaleX: progress }}
                className="absolute inset-x-4 bottom-[-1px] h-[2px] origin-left rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
              />
            )}

            {/* ── desktop mega dropdowns ── */}
            <AnimatePresence>
              {openMenu && (
                <motion.div
                  key={openMenu}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.985 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  className="absolute left-1/2 top-[calc(100%+10px)] z-50 hidden w-[min(680px,90vw)] -translate-x-1/2 lg:block"
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-ivory text-ink shadow-card">
                    <div aria-hidden className="h-[3px] bg-gradient-to-r from-gold-light via-gold to-gold-dark" />

                    {openMenu === 'plots' && (
                      <div className="grid grid-cols-[1.5fr_1fr]">
                        <div className="p-3">
                          <p className="px-3 pb-2 pt-1 text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-deep">
                            Six formats · East & West facing
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {plots.map((p) => (
                              <Link
                                key={p.id}
                                href={`/plots/${p.slug}`}
                                className="group rounded-xl border border-transparent p-3 transition-all hover:border-gold/40 hover:bg-gold-mist/50"
                              >
                                <span className="flex items-center justify-between gap-2">
                                  <span className="font-display text-[19px] leading-none text-navy-deep">
                                    {p.sizeSqft} <span className="text-[12px] font-normal">sq.ft.</span>
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.12em] ${
                                      p.status === 'Premium'
                                        ? 'bg-navy-deep text-gold-light'
                                        : p.status === 'New Release'
                                          ? 'bg-gold text-navy-deep'
                                          : 'bg-navy-mist text-navy-deep'
                                    }`}
                                  >
                                    {p.status}
                                  </span>
                                </span>
                                <span className="mt-1 block text-[12px] font-semibold text-ink-muted">
                                  {p.dimensions} ft · {p.facing} facing
                                </span>
                                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep opacity-0 transition-all duration-300 group-hover:opacity-100">
                                  View plot <ArrowRight size={12} aria-hidden />
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="relative flex flex-col justify-end overflow-hidden bg-navy-deep p-5 text-ivory">
                          <img
                            src="/images/entrance-avenue.jpg"
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover opacity-45"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-transparent"
                          />
                          <div className="relative">
                            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-light">
                              Not sure? Compare
                            </p>
                            <p className="mt-1.5 font-display text-[22px] leading-tight">
                              Pick up to 3 plots, side by side.
                            </p>
                            <Link
                              href="/plots"
                              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-deep transition hover:bg-gold-light"
                            >
                              Compare all <ArrowUpRight size={14} aria-hidden />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {openMenu === 'gallery' && (
                      <div className="p-3">
                        <p className="px-3 pb-2 pt-1 text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-deep">
                          Renders, gardens & master plan
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {galleryCats.map((c) => {
                            const count = gallery.filter((g) => g.category === c.cat).length;
                            return (
                              <Link
                                key={c.cat}
                                href="/gallery"
                                className="group relative overflow-hidden rounded-xl border border-line"
                              >
                                <img
                                  src={c.img}
                                  alt=""
                                  aria-hidden
                                  loading="lazy"
                                  className="aspect-[16/8] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <span
                                  aria-hidden
                                  className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/25 to-transparent"
                                />
                                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                                  <span>
                                    <span className="block font-display text-[16px] text-ivory">{c.title}</span>
                                    <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
                                      {count} shots · {c.copy}
                                    </span>
                                  </span>
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm transition group-hover:bg-gold group-hover:text-navy-deep">
                                    <ArrowUpRight size={15} aria-hidden />
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <Link
                          href="/gallery"
                          className="mt-2 flex items-center justify-between rounded-xl bg-navy-mist px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-navy-deep transition hover:bg-navy-deep hover:text-ivory"
                        >
                          Open full gallery <ArrowRight size={15} aria-hidden />
                        </Link>
                      </div>
                    )}

                    {openMenu === 'location' && (
                      <div className="grid grid-cols-[1.4fr_1fr]">
                        <div className="p-3">
                          <p className="px-3 pb-2 pt-1 text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-deep">
                            Santer · Kishanganj – Mhow
                          </p>
                          <div className="space-y-1">
                            {locationPreview.map((c) => (
                              <Link
                                key={c.title}
                                href="/location"
                                className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-navy-mist"
                              >
                                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-deep text-gold-light transition group-hover:bg-gold group-hover:text-navy-deep">
                                  <MapPin size={17} aria-hidden />
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-[14px] font-bold text-navy-deep">
                                    {c.title}
                                  </span>
                                  <span className="block truncate text-[12.5px] text-ink-muted">
                                    {c.places.length} places · {c.places.slice(0, 2).join(', ')}
                                  </span>
                                </span>
                                <ArrowRight
                                  size={15}
                                  aria-hidden
                                  className="ml-auto shrink-0 text-gold-deep opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 border-l border-line bg-ivory-deep/60 p-5">
                          <div>
                            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-gold-deep">
                              10 km to Indore
                            </p>
                            <p className="mt-1.5 font-display text-[20px] leading-snug text-navy-deep">
                              Colleges, hospitals & malls within reach.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/location"
                              className="flex items-center justify-center gap-1.5 rounded-full bg-navy-deep px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-ivory transition hover:bg-navy"
                            >
                              Explore area
                            </Link>
                            <a
                              href={PROJECT.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-1.5 rounded-full border border-navy/20 px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-deep transition hover:border-navy hover:bg-ivory"
                            >
                              <MapPin size={14} aria-hidden /> Live map
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
        </div>
      </motion.div>

      {/* ── mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="grain fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy-deep px-5 pb-8 pt-[104px] text-ivory lg:hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/15 to-transparent"
            />
            <motion.nav
              aria-label="Mobile"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } }, hidden: {} }}
              className="relative flex flex-col"
            >
              {[
                { to: '/', label: 'Home', key: 'home' },
                { to: '/plots', label: 'Plots', key: 'plots', expand: true },
                { to: '/gallery', label: 'Gallery', key: 'gallery', expand: true },
                { to: '/location', label: 'Location', key: 'location', expand: true },
                { to: '/about', label: 'About', key: 'about' },
                { to: '/contact', label: 'Contact', key: 'contact' },
              ].map((l, idx) => {
                const active = isActivePath(pathname, l.to);
                const expanded = mobileExpanded === l.key;
                const expandable = 'expand' in l && l.expand;
                return (
                  <motion.div
                    key={l.key}
                    variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <div className="border-b border-ivory/10">
                      <div className="flex items-center justify-between gap-3 py-3.5">
                        <Link
                          href={l.to}
                          aria-current={active ? 'page' : undefined}
                          className="flex flex-1 items-baseline gap-3"
                        >
                          <span aria-hidden className="text-[11px] font-extrabold tracking-[0.2em] text-gold">
                            0{idx + 1}
                          </span>
                          <span
                            className={`font-display text-[30px] leading-none transition-colors ${
                              active ? 'text-gold-light' : 'text-ivory'
                            }`}
                          >
                            {l.label}
                          </span>
                          {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        </Link>
                        {expandable ? (
                          <button suppressHydrationWarning
                            type="button"
                            aria-expanded={expanded}
                            aria-label={`Expand ${l.label} submenu`}
                            onClick={() => setMobileExpanded(expanded ? null : l.key)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-gold-light"
                          >
                            <ChevronDown
                              size={17}
                              aria-hidden
                              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        ) : (
                          <span aria-hidden className="text-gold">
                            →
                          </span>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {expandable && expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-4 pl-8">
                              {l.key === 'plots' &&
                                plots.map((p) => (
                                  <Link
                                    key={p.id}
                                    href={`/plots/${p.slug}`}
                                    className="flex items-center justify-between rounded-lg bg-ivory/5 px-4 py-2.5 text-[14px] font-semibold text-ivory/90 transition hover:bg-ivory/10 hover:text-gold-light"
                                  >
                                    {p.sizeSqft} sq.ft. · {p.facing}
                                    <span className="text-[11px] uppercase tracking-[0.14em] text-gold/80">
                                      {p.dimensions}
                                    </span>
                                  </Link>
                                ))}
                              {l.key === 'gallery' &&
                                galleryCats.map((c) => (
                                  <Link
                                    key={c.cat}
                                    href="/gallery"
                                    className="flex items-center justify-between rounded-lg bg-ivory/5 px-4 py-2.5 text-[14px] font-semibold text-ivory/90 transition hover:bg-ivory/10 hover:text-gold-light"
                                  >
                                    {c.title}
                                    <span className="text-[11px] uppercase tracking-[0.14em] text-gold/80">
                                      {gallery.filter((g) => g.category === c.cat).length} shots
                                    </span>
                                  </Link>
                                ))}
                              {l.key === 'location' &&
                                locationPreview.map((c) => (
                                  <Link
                                    key={c.title}
                                    href="/location"
                                    className="flex items-center justify-between rounded-lg bg-ivory/5 px-4 py-2.5 text-[14px] font-semibold text-ivory/90 transition hover:bg-ivory/10 hover:text-gold-light"
                                  >
                                    {c.title}
                                    <span className="text-[11px] uppercase tracking-[0.14em] text-gold/80">
                                      {c.places.length} places
                                    </span>
                                  </Link>
                                ))}
                              <Link
                                href={l.to}
                                className="flex items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-navy-deep"
                              >
                                View all {l.label} <ArrowRight size={14} aria-hidden />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              className="relative mt-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {PROJECT.phones.map((p) => (
                  <a
                    key={p.display}
                    href={p.href}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3.5 text-[15px] font-extrabold text-navy-deep"
                  >
                    <Phone size={16} aria-hidden /> {p.display}
                  </a>
                ))}
              </div>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-xl border border-ivory/25 px-4 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.18em] text-ivory transition hover:bg-ivory hover:text-navy-deep"
              >
                Enquire online <ArrowUpRight size={15} aria-hidden />
              </Link>
              <div className="flex items-center justify-between border-t border-ivory/10 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory/55">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} aria-hidden className="text-gold" /> {PROJECT.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} aria-hidden className="text-gold" /> 10–6:30 PM
                </span>
              </div>
              <p className="text-center text-[11px] uppercase tracking-[0.22em] text-gold-light/70">
                RERA {PROJECT.reraNo} · {PROJECT.marketerSince}
              </p>
            </motion.div>

            <p
              aria-hidden
              className="text-outline-gold pointer-events-none mt-6 select-none text-center font-display text-[22vw] font-bold leading-[0.85] opacity-40"
            >
              SASP
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
