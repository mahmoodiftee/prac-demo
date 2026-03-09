import { motion } from 'framer-motion';
import MahmoodImg from '../assets/dp.png';
import { ChevronRight } from 'lucide-react';

// ─── Shared data ───────────────────────────────────────────────
const currently = [
    { label: 'WORKING AT', value: 'Dotlines, Dhaka' },
    { label: 'LEARNING', value: 'LLD, System Design & Distributed Systems' },
    { label: 'BUILDING', value: 'AI Chat Assistant' },
];

const stats = [
    { number: '3+', label: 'YEARS CODING' },
    { number: '10+', label: 'PROJECTS BUILT' },
    { number: '3', label: 'LANGUAGES SPOKEN' },
    { number: '∞', label: 'BUGS FIXED' },
];

// ─── Shared animation variants ─────────────────────────────────
const fadeUp: any = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};
const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Shared sub-components ─────────────────────────────────────
const SectionHeader = ({ subtitle }: { subtitle: string }) => (
    <div className="flex flex-col md:flex-row border-b-4 border-(--neo-border-color)">
        <div className="flex-1 p-4 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) flex items-center gap-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-(--foreground) tracking-tighter">ABOUT</h2>
            <span className="text-xl md:text-2xl font-black uppercase opacity-60">( 01 )</span>
        </div>
        <div className="flex-1 p-4 md:p-8 flex items-center md:justify-end">
            <span className="text-sm font-bold uppercase tracking-widest opacity-60">{subtitle}</span>
        </div>
    </div>
);

const CurrentlyBlock = ({ dark = false }: { dark?: boolean }) => (
    <div className={`p-4 md:p-8 h-full ${dark ? 'bg-neo-blue' : ''}`}>
        <span className={`text-xs font-bold uppercase tracking-widest mb-6 block ${dark ? 'text-white opacity-80' : 'opacity-60'}`}>CURRENTLY</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-2">
            {currently.map((item, i) => (
                <div
                    key={item.label}
                    className={`flex items-start gap-3 py-4 ${i < currently.length - 1 ? `border-b-2 lg:border-b-2 ${dark ? 'border-white/20' : 'border-(--neo-border-color)'}` : ''} 
                    ${i === 0 ? 'md:border-b-2 lg:border-b-2' : ''}
                    ${i === 1 ? 'md:border-b-0 lg:border-b-2' : ''}
                    `}
                >
                    <ChevronRight size={14} className={`shrink-0 mt-1 ${dark ? 'text-white' : 'text-(--foreground) opacity-60'}`} />
                    <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-white opacity-70' : 'text-(--foreground) opacity-60'}`}>{item.label}</span>
                        <span className={`text-sm font-bold leading-tight ${dark ? 'text-white' : 'text-(--foreground) opacity-90'}`}>{item.value}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Photo = ({ className = '' }: { className?: string }) => (
    <img
        src={MahmoodImg}
        alt="Mahmood Iffty - Software Engineer Professional Portrait"
        className={`w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500 ${className}`}
    />
);

const EducationCell = () => (
    <div className="p-4 md:p-8 bg-neo-yellow flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-black opacity-70">EDUCATION</span>
        <p className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black leading-tight">B.Sc. Computer Science</p>
        <p className="text-sm font-bold text-black opacity-80">Ahsanullah University of Science & Technology</p>
        <p className="text-xs font-black uppercase tracking-widest text-black opacity-60 mt-1">2020 — 2024</p>
    </div>
);

const Bio = ({ className = '' }: { className?: string }) => (
    <div className={className}>
        <p className="text-base md:text-xl font-medium leading-relaxed text-(--foreground) opacity-90">
            I'm Mahmood — a software engineer based in Dhaka, Bangladesh.
            I started coding out of curiosity and somehow never stopped.
            I enjoy the problem-solving side of engineering more than anything —
            figuring out why something breaks, how to make it faster,
            or how to design a system that won't fall apart at scale.
        </p>
        <p className="mt-3 md:mt-5 text-base md:text-xl font-medium leading-relaxed text-(--foreground) opacity-90">
            I'm backend at heart but comfortable across the stack.
            Right now I'm working at Dotlines, building infrastructure
            for large-scale telecom products. Outside of work I'm usually
            reading about distributed systems, contributing to side projects,
            or figuring out why my code worked yesterday but not today.
        </p>
    </div>
);

const About = () => {
    return (
        <section id="about" className="py-12 px-4 md:px-8 xl:px-12 bg-(--background) flex flex-col items-center">
            <motion.div
                variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                className="w-full max-w-360 mx-auto overflow-hidden border-4 border-(--neo-border-color) neo-shadow-lg bg-(--background) relative z-10 transition-colors duration-300"
            >
                <SectionHeader subtitle="THE PERSON BEHIND THE CODE" />

                {/* ── Top: statement banner ── */}
                <motion.div
                    variants={fadeUp}
                    className="bg-(--foreground) text-(--background) border-b-4 border-(--neo-border-color) flex flex-col md:flex-row items-stretch"
                >
                    <div className="flex-1 p-4 md:p-12 flex items-center">
                        <h3 className="text-3xl md:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-tight">
                            I BUILD SYSTEMS.<br />
                            I BREAK THINGS.<br />
                            I LEARN FROM BOTH.
                        </h3>
                    </div>
                    <div className="md:w-56 bg-neo-yellow border-t-4 md:border-t-0 md:border-l-4 border-(--neo-border-color) p-4 md:p-6 flex flex-col justify-center gap-2">
                        <span className="text-3xl font-black uppercase tracking-tighter text-black leading-none">MAHMOOD<br />IFFTY.</span>
                        <span className="text-xs font-black uppercase tracking-widest text-black opacity-70 mt-2">Software Engineer<br />Dhaka, Bangladesh</span>
                    </div>
                </motion.div>

                {/* ── Mid row: photo | bio | stats ── */}
                <div className="flex flex-col md:flex-row border-b-4 border-(--neo-border-color)">

                    {/* Photo */}
                    <motion.div variants={fadeUp} className="md:w-[30%] overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) h-72 md:h-auto">
                        <Photo />
                    </motion.div>

                    {/* Bio */}
                    <motion.div variants={fadeUp} className="flex-1 p-4 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) relative flex items-center">
                        <span className="absolute top-4 left-6 text-[7rem] md:text-[9rem] font-black opacity-[0.09] md:opacity-[0.04] leading-none pointer-events-none select-none text-(--foreground)">WHO</span>
                        <Bio />
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={stagger} className="md:w-55 grid grid-cols-2 md:grid-cols-1">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label} variants={fadeUp}
                                className={`p-5 flex flex-col gap-1 bg-neo-yellow hover:bg-(--foreground) transition-colors duration-200 group
                                ${i % 2 === 0 ? 'border-r-4 md:border-r-0 border-(--neo-border-color)' : ''}
                                ${i < stats.length - 1 ? 'border-b-4 border-(--neo-border-color)' : ''}`}
                            >
                                <span className="text-4xl md:text-5xl font-black text-black group-hover:text-(--background) tracking-tighter leading-none transition-colors duration-200">{s.number}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black opacity-70 group-hover:text-(--background) group-hover:opacity-100 mt-1 leading-tight transition-all duration-200">{s.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Bottom row: currently | education ── */}
                <div className="flex flex-col md:flex-row">

                    {/* Currently */}
                    <motion.div variants={fadeUp} className="flex-1 md:border-r-4 border-(--neo-border-color) bg-neo-blue">
                        <CurrentlyBlock dark />
                    </motion.div>

                    {/* Education + closing line */}
                    <motion.div variants={fadeUp} className="flex-1 flex flex-col justify-between p-4 md:p-8 gap-6">
                        <EducationCell />
                        <div className="border-4 border-(--neo-border-color) p-5">
                            <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-(--foreground) leading-tight">
                                ALWAYS LEARNING.<br />NEVER DONE.
                            </p>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </section>
    );
};

export default About;
