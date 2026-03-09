import { motion } from 'framer-motion';
import CustomButton from '../components/CustomButton';
import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../hooks/useTheme';
import MahmoodImg from '../assets/dp.png';
import SocialLink from '../components/SocialLink';
import { Linkedin, Github, Facebook } from 'lucide-react';
import wink from '../assets/json/wink.json';
import arrow from '../assets/json/arrow.json';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import { useVisits } from '../hooks/useVisits';


const Hero = () => {
    const { theme } = useTheme();
    const lottieRef = useRef<any>(null);
    const { lenis } = useSmoothScroll();
    const { count: visitCount, latestVisitor } = useVisits();
    const [currentTime, setCurrentTime] = useState('');

    const handleScrollTo = (e: React.MouseEvent, id: string) => {
        if (lenis) {
            e.preventDefault();
            const target = document.querySelector(id);
            if (target) {
                lenis.scrollTo(target as HTMLElement, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
            }
        }
    };

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(0.4);
        }
    }, []);
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const socials = [
        { label: 'LinkedIn', url: 'https://linkedin.com/in/mahmoodiffty', icon: Linkedin },
        { label: 'GitHub', url: 'https://github.com/mahmoodiftee', icon: Github },
        { label: 'Facebook', url: 'https://www.facebook.com/mahmood.iftee00', icon: Facebook },
    ];

    return (
        <section id="hero" className="min-h-screen pt-24 pb-12 px-4 md:px-8 xl:px-12 bg-(--background) relative flex flex-col justify-center items-center">
            <div className="w-full max-w-360 mx-auto overflow-hidden border-4 border-(--neo-border-color) neo-shadow-lg grid grid-cols-1 xl:grid-cols-12 bg-(--background) relative z-10 transition-colors duration-300">

                <div className="xl:col-span-7 flex flex-col justify-center p-4 md:p-14 xl:p-20 border-b-4 xl:border-b-0 xl:border-r-4 border-(--neo-border-color)">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-black uppercase leading-[0.85] tracking-tighter text-(--foreground) mb-6 md:mb-8">
                            USUALLY<br />
                            FULL STACK.<br />
                            JUST A BIT<br />
                            PARTIAL FOR<br />

                            <span className="inline-flex items-end">
                                BACKEND
                                <motion.span
                                    key={theme}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="md:w-[1.9em] w-[2.7em] -ml-9 -mb-4.5 md:-ml-16 md:-mb-8"
                                >
                                    <DotLottieReact
                                        // src="https://lottie.host/b085eedd-9f5d-4e64-9baa-4078b4d4d3d0/8Oubnwq7VU.lottie"
                                        data={wink}
                                        loop
                                        autoplay
                                        className={theme === "dark" ? "invert pointer-events-none" : "pointer-events-none"}
                                        aria-label="Decorative animated wink"
                                    />
                                </motion.span>
                            </span>
                        </h1>

                        <p className="text-xl md:text-3xl font-comic font-bold tracking-wider md:leading-9 border-l-2 md:border-l-[6px] border-(--neo-border-color) pl-2 md:pl-5 text-(--foreground) mb-6 md:mb-8 max-w-2xl leading-5.5">
                            Hi, I'm Mahmood. I love building Software — mostly backends, sometimes the whole stack. Always learning, madly curious, occasionally confused, never bored.
                        </p>
                        <div className="relative inline-block mb-3 md:mb-0">
                            <motion.span
                                key={theme}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ duration: 0.4 }}
                                className="absolute left-13 -top-6 md:left-32 md:-top-10 w-[3.7em] md:w-[6em] z-0 pointer-events-none"
                            >
                                <DotLottieReact
                                    data={arrow}
                                    loop
                                    autoplay
                                    className={theme === "dark" ? "invert pointer-events-none" : "pointer-events-none"}
                                    aria-label="Decorative animated arrow"
                                />
                            </motion.span>
                            <CustomButton
                                variant="auto"
                                size="sm"
                                className="relative z-10 text-xl md:text-2xl px-2 py-1 md:px-10 md:py-5"
                                onClick={() => window.open('https://drive.google.com/file/d/1F78qcgDqsaCxhrV5CDP3pYtBkU_sduRT/view?usp=sharing', '_blank')}
                            >
                                Resume
                            </CustomButton>
                        </div>
                    </motion.div>
                </div>

                <div className="xl:col-span-5 flex flex-col">

                    <div className="flex flex-col sm:flex-row border-b-4 border-(--neo-border-color) flex-1 min-w-0">

                        <div className="flex-1 p-4 md:p-8 lg:p-10 sm:border-r-4 border-b-4 sm:border-b-0 border-(--neo-border-color) flex flex-col justify-center min-w-0">
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 lg:mb-8 block opacity-60">Navigation</span>
                            <nav className="flex flex-col gap-3 md:gap-4 lg:gap-6">
                                {['Projects', 'About', 'Contact'].map((item) => (
                                    <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => handleScrollTo(e, `#${item.toLowerCase()}`)} className="relative text-2xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-black uppercase flex items-center gap-2 hover:text-neo-yellow transition-colors group w-fit">
                                        <span className="truncate">{item}</span>
                                        <span className="absolute -right-22 -top-3 w-12 md:w-25 h-16 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0 flex items-center justify-center">
                                            <DotLottieReact
                                                data={arrow}
                                                loop
                                                autoplay
                                                className={theme === "dark" ? "invert pointer-events-none w-full h-full" : "pointer-events-none w-full h-full"}
                                                aria-label="Decorative animated arrow"
                                            />
                                        </span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="flex-1 bg-neo-yellow p-4 lg:p-10 flex flex-row md:flex-col justify-between items-end border-(--neo-border-color) min-w-0 overflow-hidden">
                            <div className="flex gap-2 mb-16 shrink-0">
                                <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full bg-black"></div>
                                <div className="w-4 lg:w-5 h-4 lg:h-5 bg-black"></div>
                                <div className="w-0 h-0 border-l-8 lg:border-l-10 border-r-8 lg:border-r-10 border-b-14 lg:border-b-18 border-l-transparent border-r-transparent border-b-black"></div>
                            </div>

                            <div className="w-32 h-36 lg:w-40 lg:h-48 rounded-full overflow-hidden border-4 border-black">
                                <img src={MahmoodImg} alt="Mahmood Iffty - Full Stack Developer Profile Picture" className="w-full h-full object-cover scale-140 translate-y-6 translate-x-1 md:translate-y-6.5 md:translate-x-2" />
                            </div>

                            <div className="text-right w-full hidden md:block">
                                <span className="text-6xl lg:text-7xl xl:text-6xl 2xl:text-8xl font-black text-black leading-none block truncate">DHK</span>
                                <span className="text-xs lg:text-sm font-bold text-black uppercase tracking-widest block truncate">BANGLADESH</span>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Right Split: Inquiry & Socials */}
                    <div className="flex flex-col sm:flex-row h-auto xl:h-auto min-h-[200px]">
                        {/* Inquiry Cell */}
                        <div className="flex-1 p-4 md:p-6 border-b-4 sm:border-b-0 sm:border-r-4 border-(--neo-border-color) flex flex-col justify-center bg-neo-blue relative group">
                            <div className="relative z-10">
                                <div className="flex flex-col gap-4">
                                    <span className="text-lg font-black uppercase text-white opacity-70">Status</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 md:border-t md:border-white/20">
                                        <div className="md:py-4">
                                            <span className="text-xs font-bold uppercase text-white/60 block mb-1">Local Time</span>
                                            <span className="text-xl lg:text-2xl 2xl:text-3xl font-black text-white tracking-normal">{currentTime || '00:00:00'}</span>
                                        </div>
                                        <div className="border-t border-white/20 pt-4 mt-0 md:border-t-0 md:border-l md:pt-4 md:pl-4">
                                            <span className="text-xs font-bold uppercase text-white/60 block mb-1">Total Visits</span>
                                            <span className="text-xl lg:text-2xl 2xl:text-3xl font-black text-white tracking-normal font-mono">
                                                {visitCount !== null ? visitCount.toLocaleString().padStart(6, '0') : '------'}
                                            </span>
                                        </div>

                                        {latestVisitor && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="col-span-1 md:col-span-2 mt-2 border-t border-white/10 pt-2"
                                            >
                                                <span className="text-[10px] font-bold uppercase text-white/40 block">Recent Visit</span>
                                                <span className="text-xs font-bold text-neo-yellow uppercase truncate block">
                                                    {latestVisitor.city}, {latestVisitor.country}
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Cell */}
                        <div className="flex-1 flex flex-row justify-between items-center bg-(--background) p-4 md:p-6">
                            <div className='text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-black uppercase [writing-mode:vertical-rl] rotate-180'>
                                Social
                            </div>
                            <div className="flex md:flex-col flex-row gap-4 sm:gap-4 justify-center">
                                {socials.map((social) => (
                                    <SocialLink key={social.label} url={social.url} icon={social.icon} label={social.label} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marquee Floor */}
                <div className="xl:col-span-12 border-t-4 border-(--neo-border-color) bg-(--foreground) text-(--background) overflow-hidden py-4 whitespace-nowrap flex items-center">
                    <div className="animate-marquee inline-block font-black uppercase tracking-widest text-base md:text-xl w-max">
                        {/* Sequence 1 */}
                        <span className="mx-6">● COFFEE - CODE - DEPLOY</span>
                        <span className="mx-6">● OPEN TO WORK ● LET'S BUILD SOMETHING</span>
                        <span className="mx-6">● DHAKA, BD - WORKING GLOBALLY</span>
                        <span className="mx-6">● COFFEE - CODE - DEPLOY</span>
                        <span className="mx-6">● OPEN TO WORK ● LET'S BUILD SOMETHING</span>
                        <span className="mx-6">● DHAKA, BD - WORKING GLOBALLY</span>
                        {/* Repeat Sequence exactly for seamless loop */}
                        <span className="mx-6">● COFFEE - CODE - DEPLOY</span>
                        <span className="mx-6">● OPEN TO WORK ● LET'S BUILD SOMETHING</span>
                        <span className="mx-6">● DHAKA, BD - WORKING GLOBALLY</span>
                        <span className="mx-6">● COFFEE - CODE - DEPLOY</span>
                        <span className="mx-6">● OPEN TO WORK ● LET'S BUILD SOMETHING</span>
                        <span className="mx-6">● DHAKA, BD - WORKING GLOBALLY</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
