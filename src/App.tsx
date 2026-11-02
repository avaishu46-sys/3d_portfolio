import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { initPortrait } from './portrait';

/* ---------- reusable ---------- */
function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className = '', style }:
  { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; as?: ElementType; className?: string; style?: CSSProperties }) {
  const Comp: any = motion.create(as as any);
  return (
    <Comp className={className} style={style} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }} transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </Comp>
  );
}

function ContactButton() {
  return (
    <button className="contact-btn rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-medium uppercase tracking-widest"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
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
  return (
    <section className="relative h-screen flex flex-col px-0" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
          {nav.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="hover:opacity-70 transition-opacity duration-200">{n}</a>)}
        </nav>
      </FadeIn>
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full mt-6 sm:mt-4 md:-mt-5 text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">Hi, i&apos;m Vaishnavi</h1>
        </FadeIn>
      </div>
      <Portrait />
      <div className="flex-1" />
      <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            a 3d creator driven by crafting striking and unforgettable projects
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
  const Row = ({ items, dx }: { items: string[]; dx: number }) => (
    <div className="flex gap-3 w-max" style={{ transform: `translateX(${dx}px)`, willChange: 'transform' }}>
      {[...items, ...items, ...items].map((src, i) => (
        <img key={i} src={src} loading="lazy" alt="" className="w-[420px] h-[270px] min-w-[420px] rounded-2xl object-cover" />
      ))}
    </div>
  );
  return (
    <section ref={ref} className="pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3" style={{ background: '#0C0C0C', overflow: 'hidden' }}>
      <Row items={row1} dx={offset - 200} />
      <Row items={row2} dx={-(offset - 200)} />
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
          text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />
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
  { n: '01', cat: 'Client', name: 'Nextlevel Studio', imgs: ['20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db', '20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8', '20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327'] },
  { n: '02', cat: 'Personal', name: 'Aura Brand Identity', imgs: ['20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f', '20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1', '20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea'] },
  { n: '03', cat: 'Client', name: 'Solaris Digital', imgs: ['20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f', '20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b', '20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee'] },
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
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
