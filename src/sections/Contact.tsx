import { motion } from 'framer-motion';
import CustomButton from '../components/CustomButton';
import { Linkedin, Github, ArrowUpRight, Facebook } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const slideLeft: any = {
    hidden: { x: -30, opacity: 0 },
    whileInView: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const slideRight: any = {
    hidden: { x: 30, opacity: 0 },
    whileInView: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const fadeUp: any = {
    hidden: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

const stagger: any = {
    hidden: { opacity: 0 },
    whileInView: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const socials = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/mahmoodiffty', Icon: Linkedin },
    { label: 'GitHub', href: 'https://github.com/mahmoodiftee', Icon: Github },
    { label: 'Facebook', href: 'https://www.facebook.com/mahmood.iftee00', Icon: Facebook },
];

const marqueeText = [
    '● THANKS FOR VISITING',
    '● MAHMOOD IFFTY',
    '● BASED IN DHAKA',
    '● AVAILABLE GLOBALLY',
    '● LET\'S BUILD SOMETHING GREAT',
    '● THANKS FOR VISITING',
    '● MAHMOOD IFFTY',
    '● BASED IN DHAKA',
    '● AVAILABLE GLOBALLY',
    '● LET\'S BUILD SOMETHING GREAT',
].join('   ');

import { useState, useRef, useEffect } from 'react';

const CAL_LINK = 'mahmoodiftee/30min';

// Dynamically import Cal.com only when needed
const loadCal = () => import("@calcom/embed-react");

function CalEmbed({ theme }: { theme: string }) {
    const brandColor = theme === 'dark' ? '#fccf2a' : '#18181b';
    const [isLoaded, setIsLoaded] = useState(false);
    const [CalComponent, setCalComponent] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Initialize loading of library
                loadCal().then((mod) => {
                    setCalComponent(() => mod.default);
                    setIsLoaded(true);
                });
                observer.disconnect();
            }
        }, { rootMargin: '200px' });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        (async function () {
            try {
                const { getCalApi } = await loadCal();
                const cal = await getCalApi();
                if (!cal) return;

                cal("ui", {
                    theme: theme as any,
                    cssVarsPerTheme: {
                        light: { "cal-brand": brandColor },
                        dark: { "cal-brand": brandColor },
                    },
                    hideEventTypeDetails: true,
                    layout: "month_view"
                });
            } catch (e) {
                // Silently handle Cal.com initialization noise
            }
        })();
    }, [theme, brandColor, isLoaded]);

    return (
        <div ref={containerRef} className="w-full min-h-[400px] overflow-auto" aria-label="Meeting Scheduler">
            {isLoaded && CalComponent ? (
                <CalComponent
                    calLink={CAL_LINK}
                    style={{ width: "100%", height: "100%", overflow: "scroll" }}
                    config={{ overlayCalendar: true, layout: "month_view" } as any}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-(--foreground) opacity-40 font-bold uppercase tracking-widest text-xs animate-pulse">
                    Loading Scheduler...
                </div>
            )}
        </div>
    );
}

const Contact = () => {
    const { theme } = useTheme();

    return (
        <section id="contact" className="py-12 px-4 md:px-8 xl:px-12 bg-(--background) flex flex-col justify-center items-center">
            <div className="w-full max-w-360 mx-auto overflow-hidden border-4 border-(--neo-border-color) neo-shadow-lg bg-(--background) relative z-10 transition-colors duration-300">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row border-b-4 border-(--neo-border-color)">
                    <div className="flex-1 p-4 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-(--foreground) tracking-tighter">CONTACT</h2>
                        <span className="text-xl md:text-2xl font-black uppercase opacity-60">( 05 )</span>
                    </div>
                    <div className="flex-1 p-4 md:p-8 flex items-center md:justify-end">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-60">LET'S BUILD SOMETHING</span>
                    </div>
                </div>

                {/* Row 1 — Statement + Cal.com Embed */}
                <div className="flex flex-col border-b-4 border-(--neo-border-color)">
                    <motion.div
                        variants={slideLeft}
                        initial="hidden"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: '-60px' }}
                        className="flex-1 p-4 md:p-10 xl:p-14 border-b-4 md:border-b-0 border-(--neo-border-color) flex flex-col md:flex-row gap-8"
                    >
                        <div className="flex-1 flex flex-col gap-4 justify-center">
                            <div>
                                <h3 className="text-5xl md:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-(--foreground) leading-none">
                                    GOT AN<br />
                                    IDEA?<br />
                                    <span className="text-neo-red">LET'S TALK.</span>
                                </h3>
                            </div>

                            <p className="text-base md:text-lg font-medium text-(--foreground) opacity-80 leading-relaxed max-w-sm">
                                I'm always open to interesting projects, collaborations, or just a good conversation about tech.
                            </p>

                            <div className="">
                                <a href="mailto:mahmoodiftee@gmail.com">
                                    <CustomButton variant="auto" size="lg" className="flex items-center gap-2">
                                        SEND EMAIL <ArrowUpRight size={18} strokeWidth={3} />
                                    </CustomButton>
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-[250px] md:min-h-0">
                            <DotLottieReact
                                src="https://lottie.host/056d4a56-2d98-4791-8f21-60ab6250e7d4/it5qHM98nh.lottie"
                                loop
                                autoplay
                                className="w-full h-auto max-w-[300px] md:max-w-full scale-125 md:scale-100"
                                aria-label="Animated illustration of a person thinking or working on an idea"
                            />
                        </div>
                    </motion.div>

                    {/* Right — Cal.com Scheduler */}
                    <motion.div
                        variants={slideRight}
                        initial="hidden"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: '-60px' }}
                        className="flex-1 flex flex-col border-t-4 border-b-4 md:border-b-0 border-(--neo-border-color) overflow-hidden"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60 text-center m-4">BOOK A CALL</span>
                        <CalEmbed key={theme} theme={theme} />
                    </motion.div>
                </div>

                {/* Row 2 — Footer Strip */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: '-40px' }}
                    className="flex flex-col md:flex-row border-b-4 border-(--neo-border-color)"
                >
                    {/* Cell 1 — Monogram */}
                    <motion.div
                        variants={fadeUp}
                        className="flex-1 p-4 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) bg-(--foreground) text-(--background) flex flex-col justify-between gap-4"
                    >
                        <span className="text-7xl md:text-8xl font-black text-neo-yellow leading-none tracking-tighter">MI</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70">MAHMOOD IFFTY</span>
                    </motion.div>

                    {/* Cell 2 — Socials */}
                    <motion.div
                        variants={fadeUp}
                        className="flex-1 p-4 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-(--neo-border-color) flex flex-col justify-between gap-6"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">FIND ME ON</span>
                        <div className="flex flex-row flex-wrap gap-4">
                            {socials.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="p-3 bg-(--background) border-4 border-(--neo-border-color) group-hover:-translate-y-1 group-hover:bg-neo-yellow transition-all duration-300">
                                        <Icon size={24} strokeWidth={2.5} className="text-(--foreground)" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Cell 3 — Closing line */}
                    <motion.div
                        variants={fadeUp}
                        className="flex-1 flex flex-row justify-between items-center p-4 md:p-8 bg-neo-yellow "
                    >
                        <div className='flex flex-col justify-between'>
                            <p className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black leading-tight">
                                MADE WITH<br />
                                COFFEE &<br />
                                CURIOSITY.
                            </p>
                            <span className="text-xs font-black uppercase tracking-widest text-black opacity-60 mt-4">© 2026 <br /> MAHMOOD IFFTY</span>
                        </div>

                        <div className="w-1/3 md:w-1/2 flex items-center justify-center">
                            <DotLottieReact
                                src="https://lottie.host/eecd7ce7-11fa-4b4b-bf76-69f6112eb8d0/OjrRIwk2vY.lottie"
                                loop
                                autoplay
                                className="w-full h-auto scale-150"
                                aria-label="Decorative animated illustration"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Marquee Strip */}
                <div className="bg-black text-white overflow-hidden py-4">
                    <div className="animate-marquee-slow inline-block font-black uppercase tracking-widest text-base md:text-xl w-max whitespace-nowrap">
                        {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{marqueeText}
                    </div>
                </div>

            </div >
        </section >
    );
};

export default Contact;
