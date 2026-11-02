import {
  createContext, useContext, useEffect, useMemo, useRef, useState,
  type ElementType, type ReactNode, type CSSProperties, type FormEvent,
} from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion';
import {
  Mail, Phone, MapPin, X, Copy, Check, ArrowUpRight, Send, Sparkles,
  Github, Linkedin, Instagram, Twitter, type LucideIcon,
} from 'lucide-react';
import { initPortrait } from './portrait';

/* =====================================================================
   EDIT YOUR CONTACT INFO HERE  (this is what the pop-up displays)
   ===================================================================== */
const CONTACT: {
  name: string; role: string; email: string; phone: string; location: string; reply: string;
  socials: { label: string; href: string; icon: LucideIcon }[];
  skills: string[];
} = {
  name: 'Vaishu',
  role: 'Front-End Developer',
  email: 'vaish@gmail.com',
  phone: '+91 95676 78778',
  location: 'Pune Maharastra, India',
  reply: 'Usually replies within 24 hours',
  socials: [
    { label: 'GitHub', href: 'https://github.com/avaishu46-sys/', icon: Github },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-username', icon: Linkedin },
    { label: 'Instagram', href: 'https://instagram.com/your-username', icon: Instagram },
    { label: 'Twitter', href: 'https://twitter.com/your-username', icon: Twitter },
  ],
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Figma', 'Next.js', 'Node.js'],
};

/* ---------- contact pop-up state (provider keeps App from re-rendering) ---------- */
const ContactCtx = createContext<{ open: () => void }>({ open: () => {} });
const useContact = () => useContext(ContactCtx);

/* ---------- reusable ---------- */
function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className = '', style }:
  { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; as?: ElementType; className?: string; style?: CSSProperties }) {
  // memoised so the motion component is not re-created (and re-mounted) on every render
  const Comp: any = useMemo(() => motion.create(as as any), [as]);
  return (
    <Comp className={className} style={style} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }} transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </Comp>
  );
}

const GRADIENT = 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

function ContactButton() {
  const { open } = useContact();
  return (
    <button onClick={open} className="contact-btn rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-medium uppercase tracking-widest"
      style={{
        background: GRADIENT,
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white', outlineOffset: '-3px',
      }}>Contact Me</button>
  );
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors">Live Project</button>
  );
}

function Char({ ch, i, total, progress }: { ch: string; i: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / total, (i + 1) / total], [0.2, 1]);
  return (
    <span className="relative">
      <span style={{ opacity: 0 }}>{ch}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">{ch}</motion.span>
    </span>
  );
}

function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const words = text.split(' ');
  let c = 0;
  return (
    <p ref={ref} className={className} style={style}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {w.split('').map((ch) => <Char key={c} ch={ch} i={c++} total={text.length} progress={scrollYProgress} />)}
          {wi < words.length - 1 && (c++, ' ')}
        </span>
      )).reduce<ReactNode[]>((a, el, i) => (i ? [...a, ' ', el] : [el]), [])}
    </p>
  );
}

/* =====================================================================
   CONTACT MODAL  (animated pop-up with your information)
   ===================================================================== */
const listV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } };
const itemV: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

function Blob({ color, size, className, dur, path }: { color: string; size: number; className: string; dur: number; path: { x: number[]; y: number[]; scale: number[] } }) {
  return (
    <motion.div aria-hidden className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, background: color, filter: 'blur(80px)', opacity: 0.45 }}
      animate={path} transition={{ duration: dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />
  );
}

function RotatingRing() {
  return (
    <div className="relative w-[170px] h-[170px] sm:w-[200px] sm:h-[200px]">
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        <defs><path id="ringPath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
        <text fill="#D7E2EA" fontSize="12.5" fontWeight="500" letterSpacing="3">
          <textPath href="#ringPath" textLength="498" lengthAdjust="spacing">{"AVAILABLE FOR WORK • LET'S BUILD SOMETHING • "}</textPath>
        </text>
      </motion.svg>
      <motion.div className="absolute inset-[26%] rounded-full flex items-center justify-center"
        style={{ background: GRADIENT, boxShadow: '0 0 40px rgba(182,0,168,.55), 4px 4px 12px #7721B1 inset' }}
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <Sparkles className="text-white" size={34} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SkillTicker() {
  const items = [...CONTACT.skills, ...CONTACT.skills];
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)' }}>
      <motion.div className="flex gap-2 w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        {items.map((s, i) => (
          <span key={i} className="px-4 py-1.5 rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA] text-xs uppercase tracking-widest whitespace-nowrap">{s}</span>
        ))}
      </motion.div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string; href?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard unavailable */ }
  };
  const Tag: any = href ? 'a' : 'div';
  return (
    <motion.div variants={itemV}>
      <Tag href={href} className="group relative flex items-center gap-4 rounded-2xl border border-[#D7E2EA]/15 bg-white/[0.04] p-4 overflow-hidden transition-colors hover:border-[#B600A8]/70 hover:bg-white/[0.07]">
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(182,0,168,.18), transparent)' }} />
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: GRADIENT, boxShadow: '4px 4px 10px #7721B1 inset' }}>
          <Icon size={20} className="text-white" />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-widest text-[#D7E2EA]/50">{label}</span>
          <span className="block truncate text-[#D7E2EA] font-medium text-sm sm:text-base">{value}</span>
        </span>
        <button type="button" onClick={copy} aria-label={`Copy ${label}`}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? 'ok' : 'cp'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.18 }}>
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </Tag>
    </motion.div>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello ${CONTACT.name} - message from ${name || 'your portfolio'}`);
    const body = encodeURIComponent(`${msg}\n\n-- ${name}${email ? ` (${email})` : ''}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true); setTimeout(() => setSent(false), 3000);
  };

  const field = 'w-full rounded-xl border border-[#D7E2EA]/20 bg-white/[0.04] px-4 py-3 text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/35 outline-none transition-colors focus:border-[#B600A8] focus:bg-white/[0.07]';

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          style={{ perspective: 1400 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          role="dialog" aria-modal="true" aria-label="Contact information">
          {/* backdrop */}
          <motion.div className="absolute inset-0 bg-[#0C0C0C]/75 backdrop-blur-xl" onClick={onClose} />

          {/* panel */}
          <motion.div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] sm:rounded-[44px] border-2 border-[#D7E2EA]/30 bg-[#0C0C0C]"
            initial={{ opacity: 0, scale: 0.88, y: 70, rotateX: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40, rotateX: -8 }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}>

            {/* animated background graphics */}
            <Blob color="#B600A8" size={380} className="-top-24 -left-24" dur={7} path={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.25, 1] }} />
            <Blob color="#7621B0" size={340} className="top-1/3 -right-20" dur={9} path={{ x: [0, -70, 0], y: [0, -30, 0], scale: [1.1, 0.9, 1.1] }} />
            <Blob color="#BE4C00" size={300} className="-bottom-24 left-1/3" dur={8} path={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.18]"
              style={{ backgroundImage: 'radial-gradient(#D7E2EA 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

            {/* close */}
            <motion.button ref={closeRef} onClick={onClose} aria-label="Close contact"
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] bg-[#0C0C0C]/60 hover:bg-[#D7E2EA]/10"
              initial={{ opacity: 0, rotate: -180, scale: 0 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 16 }}
              whileHover={{ rotate: 90, scale: 1.08 }} whileTap={{ scale: 0.9 }}>
              <X size={20} />
            </motion.button>

            <div className="relative max-h-[92vh] overflow-y-auto">
              <div className="grid md:grid-cols-5">
                {/* LEFT: big heading + graphic */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start justify-between gap-8 p-6 sm:p-10 md:p-12 md:border-r border-[#D7E2EA]/10">
                  <div className="w-full">
                    <motion.p className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm mb-3"
                      initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                      {CONTACT.role}
                    </motion.p>
                    <div className="overflow-hidden">
                      <motion.h2 className="hero-heading font-black uppercase leading-[0.9] tracking-tight text-center md:text-left"
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
                        initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
                        Let&apos;s talk
                      </motion.h2>
                    </div>
                    <motion.div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5"
                      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-emerald-300 text-xs uppercase tracking-widest">Available for work</span>
                    </motion.div>
                    <motion.p className="mt-4 text-[#D7E2EA]/70 font-light leading-relaxed text-sm sm:text-base max-w-sm mx-auto md:mx-0 text-center md:text-left"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                      Got an idea, a project or just want to say hi? Drop a message - {CONTACT.reply.toLowerCase()}.
                    </motion.p>
                  </div>

                  <motion.div className="mx-auto md:mx-0" initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.45, type: 'spring', stiffness: 120, damping: 14 }}>
                    <RotatingRing />
                  </motion.div>

                  <div className="w-full"><SkillTicker /></div>
                </div>

                {/* RIGHT: info, form, socials */}
                <motion.div className="md:col-span-3 flex flex-col gap-4 p-6 sm:p-10 md:p-12 md:pt-20" variants={listV} initial="hidden" animate="show">
                  <InfoCard icon={Mail} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
                  <InfoCard icon={Phone} label="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} />
                  <InfoCard icon={MapPin} label="Location" value={CONTACT.location} />

                  <motion.form variants={itemV} onSubmit={submit} className="flex flex-col gap-3 mt-2">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                      <input className={field} type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <textarea className={`${field} resize-none`} rows={3} placeholder="Tell me about your project..." value={msg} onChange={(e) => setMsg(e.target.value)} required />
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="relative overflow-hidden rounded-full px-8 py-3.5 text-white font-medium uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-2"
                      style={{ background: GRADIENT, boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset', outline: '2px solid white', outlineOffset: '-3px' }}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={sent ? 'sent' : 'send'} className="flex items-center gap-2"
                          initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.2 }}>
                          {sent ? <><Check size={16} /> Opening your mail app</> : <><Send size={16} /> Send message</>}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </motion.form>

                  <motion.div variants={itemV} className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50 mr-1">Find me on</span>
                    {CONTACT.socials.map((s, i) => (
                      <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                        className="group flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-[#D7E2EA] text-xs uppercase tracking-widest hover:bg-[#D7E2EA]/10 hover:border-[#B600A8] transition-colors"
                        whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}
                        animate={{ y: [0, -3, 0] }} transition={{ y: { duration: 3, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' } }}>
                        <s.icon size={15} />
                        {s.label}
                        <ArrowUpRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);
  return (
    <ContactCtx.Provider value={value}>
      {children}
      <ContactModal open={isOpen} onClose={() => setIsOpen(false)} />
    </ContactCtx.Provider>
  );
}

/* ---------- hero ---------- */
function Portrait() {
  useEffect(() => { initPortrait(); }, []);
  return (
    <div className="hero-portrait-wrap" id="magnetWrap">
      <FadeIn delay={0.6} y={30}>
        <div className="hero-portrait-inner" id="magnetInner">
          <img id="faceFallback" alt="Portrait" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261031_040619_2f6f349e-a4a7-40db-8e9b-03b6acd8b99a.png&w=1024&q=92" />
          <canvas id="faceGl" aria-hidden="true" />
          <div id="faceProps" aria-hidden="true">
            <svg id="faceFly" viewBox="0 0 32 32"><path className="wing" d="M15 15C12 9.500 4.500 8.500 2 13c2.500 4.500 10 4.500 13 2z" /><path className="wing r" d="M17 15c3-5.500 10.500-6.500 13-2-2.500 4.500-10 4.500-13 2z" /><ellipse cx="16" cy="19.500" rx="4" ry="6.500" /><circle cx="16" cy="11.500" r="3.300" /></svg>
            <svg id="faceHand" viewBox="0 0 32 32"><path className="open" d="M10.500 16.500V8.200a1.800 1.800 0 0 1 3.600 0V14v-8a1.800 1.800 0 0 1 3.600 0V14 7a1.800 1.800 0 0 1 3.600 0v8-5a1.800 1.800 0 0 1 3.600 0v10.500c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-3.500-5.600c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.600 1z" /><path className="grab" d="M10.500 17v-3.300a1.800 1.800 0 0 1 3.600 0V14v-1.800a1.800 1.800 0 0 1 3.600 0V14v-1.300a1.800 1.800 0 0 1 3.600 0V14v-.3a1.800 1.800 0 0 1 3.600 0v6.800c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-2.300-3.700c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.700 1z" /></svg>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function HeroSection() {
  const nav = ['About', 'Price', 'Projects', 'Contact'];
  const { open } = useContact();
  return (
    <section className="relative h-screen flex flex-col px-0" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
          {nav.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="hover:opacity-70 transition-opacity duration-200"
              onClick={n === 'Contact' ? (e) => { e.preventDefault(); open(); } : undefined}>{n}</a>
          ))}
        </nav>
      </FadeIn>
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full mt-6 sm:mt-4 md:-mt-5 text-[12vw] sm:text-[15vw] md:text-[14vw] lg:text-[14.5vw] text-center">Hi, i&apos;m Vaishu</h1>
        </FadeIn>
      </div>
      <Portrait />
      <div className="flex-1" />
      <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
           Pixels, performance and a little bit of magic.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><ContactButton /></FadeIn>
      </div>
    </section>
  );
}

/* ---------- marquee ---------- */
const GIFS = ['space-voyage-eECLH3Yc', 'codenest-Cgppc2qV', 'vex-ventures-BczMFIiw', 'stellar-ai-v2-DjvxjG3C', 'asme-B_nGDnTP', 'transform-data-Cx5OU29N', 'vitara-Cjz2QYyU', 'terra-BFjrCr7T', 'skyelite-DHaZIgUv', 'aethera-DknSlcTa', 'designpro-D8c5_een', 'stellar-ai-D3HL6bw1', 'xportfolio-D4A8maiC', 'orbit-web3-BXt4OttD', 'nexora-cx5HmUgo', 'evr-ventures-DZxeVFEX', 'planet-orbit-DWAP8Z1P', 'new-era-CocuDUm9', 'wealth-B70idl_u', 'luminex-CxOP7ce6', 'celestia-0yO3jXO8']
  .map((s) => `https://motionsites.ai/assets/hero-${s.replace(/-([^-]+)$/, '-preview-$1')}.gif`);

// defined outside MarqueeSection so images are not re-mounted on every scroll tick
function MarqueeRow({ items, dx }: { items: string[]; dx: number }) {
  return (
    <div className="flex gap-3 w-max" style={{ transform: `translateX(${dx}px)`, willChange: 'transform' }}>
      {[...items, ...items, ...items].map((src, i) => (
        <img key={i} src={src} loading="lazy" alt="" className="w-[420px] h-[270px] min-w-[420px] rounded-2xl object-cover" />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const top = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const row1 = GIFS.slice(0, 11), row2 = GIFS.slice(11);
  return (
    <section ref={ref} className="pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3" style={{ background: '#0C0C0C', overflow: 'hidden' }}>
      <MarqueeRow items={row1} dx={offset - 200} />
      <MarqueeRow items={row2} dx={-(offset - 200)} />
    </section>
  );
}

/* ---------- about ---------- */
const FIG = 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/';
function AboutSection() {
  const deco = [
    { src: 'moon_icon.11395d36.png', cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%]', delay: 0.1, x: -80 },
    { src: 'p59_1.4659672e.png', cls: 'w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]', delay: 0.25, x: -80 },
    { src: 'lego_icon-1.703bb594.png', cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%]', delay: 0.15, x: 80 },
    { src: 'Group_134-1.2e04f3ce.png', cls: 'w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]', delay: 0.3, x: 80 },
  ];
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 gap-16 sm:gap-20 md:gap-24" style={{ background: '#0C0C0C' }}>
      {deco.map((d) => (
        <FadeIn key={d.src} delay={d.delay} x={d.x} y={0} duration={0.9} className={`absolute ${d.cls}`}>
          <img src={FIG + d.src} alt="" className="w-full h-auto" />
        </FadeIn>
      ))}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-[1]">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</h2>
        </FadeIn>
        <AnimatedText className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          text="With more than three years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />
      </div>
      <div className="relative z-[1]"><ContactButton /></div>
    </section>
  );
}

/* ---------- services ---------- */
const SERVICES = [
  ['3D Modeling', 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],
  ['Rendering', 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],
  ['Motion Design', 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],
  ['Branding', 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.'],
  ['Web Design', 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'],
];
function ServicesSection() {
  return (
    <section id="price" className="relative rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: '#FFFFFF' }}>
      <h2 className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)' }}>Services</h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map(([name, desc], i) => (
          <FadeIn key={name} delay={i * 0.1} className="flex gap-6 sm:gap-10 md:gap-16 py-8 sm:py-10 md:py-12" style={{ borderTop: i ? '1px solid rgba(12, 12, 12, 0.15)' : undefined, color: '#0C0C0C' }}>
            <span className="font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', color: '#0C0C0C' }}>0{i + 1}</span>
            <div className="flex flex-col gap-3">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{name}</h3>
              <p className="font-light leading-relaxed max-w-2xl" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}>{desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ---------- projects ---------- */
const H = (id: string) => `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${id}.png&w=1280&q=85`;
const PROJECTS = [
  { n: '01', cat: 'Client', name: 'B2b CRM', imgs: ['20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db', '20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8', '20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327'] },
  { n: '02', cat: 'Personal', name: 'Cars Bidding Platform', imgs: ['20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f', '20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1', '20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea'] },
  { n: '03', cat: 'Client', name: 'B2b Website', imgs: ['20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f', '20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b', '20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee'] },
];

function ProjectCard({ p, index, total, progress }: { p: typeof PROJECTS[number]; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const r = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';
  return (
    <div className="h-[85vh]">
      <motion.div style={{ scale, top: `${index * 28}px`, background: '#0C0C0C', transformOrigin: 'top center' }}
        className={`sticky top-24 md:top-32 border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 ${r}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{p.n}</span>
            <div>
              <p className="text-[#D7E2EA]/60 font-light uppercase tracking-widest text-xs sm:text-sm">{p.cat}</p>
              <h3 className="text-[#D7E2EA] font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{p.name}</h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
            <img src={H(p.imgs[0])} alt="" loading="lazy" className={`w-full object-cover ${r}`} style={{ height: 'clamp(130px, 16vw, 230px)' }} />
            <img src={H(p.imgs[1])} alt="" loading="lazy" className={`w-full object-cover ${r}`} style={{ height: 'clamp(160px, 22vw, 340px)' }} />
          </div>
          <div style={{ width: '60%' }}>
            <img src={H(p.imgs[2])} alt="" loading="lazy" className={`w-full h-full object-cover ${r}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section id="projects" className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20" style={{ background: '#0C0C0C' }}>
      <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Project</h2>
      <div ref={ref} className="max-w-7xl mx-auto">
        {PROJECTS.map((p, i) => <ProjectCard key={p.n} p={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />)}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <ContactProvider>
      <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
      </main>
    </ContactProvider>
  );
}