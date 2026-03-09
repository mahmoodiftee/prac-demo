import { motion, AnimatePresence } from 'framer-motion';
import CustomButton from '../components/CustomButton';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const projects = [
    {
        id: '01',
        name: 'DISTRIBUTED ORDER PROCESSING SYSTEM',
        fullName: 'DISTRIBUTED ORDER PROCESSING SYSTEM',
        description: 'A NestJS microservices project built in three phases, from naive HTTP coupling all the way to saga orchestration with crash recovery. Built to understand what happens when things go wrong.',
        tags: ['NestJS', 'Kafka', 'PostgreSQL', 'Prisma', 'Docker', 'Saga Pattern'],
        liveLink: 'https://saga-system-visualizer.vercel.app/',
        githubLink: 'https://github.com/mahmoodiftee/Distributed-Order-Processing-System',
        featured: true,
        accentLabel: 'BACKEND',
        accentNote: 'MICROSERVICES',
    },
    {
        id: '02',
        name: 'KEEBHOUSE',
        fullName: 'KEEBHOUSE',
        description: 'An e-commerce platform for keyboard enthusiasts — admin panel, Stripe checkout, analytics and PDF invoices.',
        tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe', 'Framer Motion', 'GSAP'],
        liveLink: 'https://keebhouse.vercel.app/',
        githubLink: 'https://github.com/mahmoodiftee/ecom-supabase',
        featured: false,
        accentLabel: null,
        accentNote: null,
    },
    {
        id: '03',
        name: 'HOPE HOSPITAL',
        fullName: 'HOPE HOSPITAL',
        description: 'A mobile app for doctor-patient management — OTP login, appointment booking, patient history.',
        tags: ['React Native', 'TypeScript', 'Appwrite', 'Zustand'],
        liveLink: 'https://expo.dev/artifacts/eas/pW1vo5MSCcfePGFmyqNmGc.apk',
        githubLink: 'https://github.com/mahmoodiftee/hope-hospital',
        featured: false,
        accentLabel: null,
        accentNote: null,
    },
    {
        id: '04',
        name: 'PETHOUSE',
        fullName: 'PETHOUSE',
        description: 'An NPO adoption platform for stray pets with listings, blogs, and community features.',
        tags: ['React', 'Express.js', 'MongoDB', 'TanStack Query', 'Tailwind'],
        liveLink: 'https://pethouse-0.firebaseapp.com/',
        githubLink: 'https://github.com/mahmoodiftee/PetHouse',
        featured: false,
        accentLabel: null,
        accentNote: null,
        hidden: true,
    },
];

const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

const ProjectCard = ({ project, className = '' }: { project: typeof projects[0], className?: string }) => (
    <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className={`flex flex-col relative group border-l-4 border-l-transparent hover:border-l-neo-yellow transition-colors duration-200 ${className}`}
    >
        {/* Featured Badge */}
        {project.featured && (
            <div className="absolute top-0 right-0 bg-neo-yellow border-b-4 border-l-4 border-(--neo-border-color) px-2 md:px-4 md:py-2 z-10">
                <span className="text-xs font-black text-black uppercase tracking-widest">FEATURED</span>
            </div>
        )}

        <div className="py-8 px-4 md:p-12 xl:p-16 flex flex-col flex-1 h-full min-h-[400px]">
            {/* BG Number */}
            <div className="text-[8rem] font-black opacity-[0.05] absolute top-2 left-4 leading-none select-none pointer-events-none">
                {project.id}
            </div>

            {/* Full name watermark for featured */}
            {project.featured && (
                <div className="absolute right-[-40%] top-1/2 -translate-y-1/2 text-[8rem] xl:text-[12rem] font-black opacity-[0.03] pointer-events-none leading-none select-none hidden md:block uppercase tracking-tighter">
                    MICROSERVICES
                </div>
            )}

            <div className="mt-auto z-10 flex flex-col gap-6">
                {/* Phase pills for featured */}
                {project.featured && (
                    <div className="flex gap-2 flex-wrap">
                        {['PHASE 1 — HTTP', 'PHASE 2 — KAFKA', 'PHASE 3 — SAGA'].map((phase) => (
                            <span key={phase} className="bg-(--foreground) text-(--background) text-[10px] font-black uppercase tracking-widest px-3 py-1">
                                {phase}
                            </span>
                        ))}
                    </div>
                )}

                <div>
                    <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-(--foreground) group-hover:text-neo-pink transition-colors duration-300 mb-2 md:mb-4 inline-block">
                        {project.name}
                    </h3>
                    <p className="text-lg md:text-xl font-bold text-(--foreground) opacity-80 max-w-3xl md:leading-normal">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="border-2 border-(--neo-border-color) px-1.5 md:px-3  md:py-1 text-xs font-bold uppercase tracking-widest text-(--foreground)">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-2">
                    {project.liveLink && (
                        <Link
                            target="_blank"
                            to={project.liveLink}
                            aria-label={`View live demo of ${project.name}`}
                        >
                            <CustomButton as="span" variant="auto" size="sm" className="flex items-center gap-2 group/btn px-2 md:px-4">
                                LIVE <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </CustomButton>
                        </Link>
                    )}
                    {project.githubLink && (
                        <Link
                            target="_blank"
                            to={project.githubLink}
                            aria-label={`View source code of ${project.name} on GitHub`}
                        >
                            <CustomButton as="span" variant="auto" size="sm" className="flex items-center gap-2 group/btn px-2 md:px-4">
                                GITHUB <Github size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </CustomButton>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

const Projects = () => {
    const [showHidden, setShowHidden] = useState(false);

    const featured = projects[0];
    const middle = projects.slice(1, 3);
    const hidden = projects.find(p => p.hidden);

    return (
        <section id="projects" className="py-12 px-4 md:px-8 xl:px-12 bg-(--background) relative flex flex-col justify-center items-center">
            <div className="w-full max-w-360 mx-auto overflow-hidden border-4 border-(--neo-border-color) neo-shadow-lg grid grid-cols-1 bg-(--background) relative z-10 transition-colors duration-300">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row border-b-4 border-(--neo-border-color)">
                    <div className="flex-1 p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-(--foreground) tracking-tighter">PROJECTS</h2>
                        <span className="text-xl md:text-2xl font-black uppercase opacity-60"></span>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex items-center md:justify-end bg-(--background)">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-60">SELECTED WORK — 2023/26</span>
                    </div>
                </div>

                {/* Row 1 — Featured full width */}
                <div className="border-b-4 border-(--neo-border-color)">
                    <ProjectCard project={featured} />
                </div>

                {/* Row 2 — Middle two side by side */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${!showHidden ? 'border-b-0' : 'border-b-4'} border-(--neo-border-color)`}>
                    {middle.map((project, i) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            className={`border-b-4 md:border-b-0 border-(--neo-border-color) ${i === 0 ? 'md:border-r-4 border-(--neo-border-color)' : ''}`}
                        />
                    ))}
                </div>

                {/* Reveal button */}
                <AnimatePresence>
                    {!showHidden && (
                        <motion.button
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={() => setShowHidden(true)}
                            className="w-full border-t-4 border-(--neo-border-color) py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-base md:text-lg hover:bg-(--foreground) hover:text-(--background) transition-colors duration-300 group"
                        >
                            <span>ONE MORE</span>
                            <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Row 3 — Hidden project, full width, revealed */}
                <AnimatePresence>
                    {showHidden && hidden && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="border-t-4 border-(--neo-border-color) overflow-hidden"
                        >
                            <ProjectCard project={hidden} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Bar */}
                <a
                    href="https://github.com/mahmoodiftee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-t-4 border-(--neo-border-color) bg-black text-white hover:bg-neo-yellow hover:text-black transition-colors duration-300 py-6 text-center group"
                >
                    <span className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4">
                        MORE ON GITHUB
                        <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                </a>

            </div>
        </section>
    );
};

export default Projects;