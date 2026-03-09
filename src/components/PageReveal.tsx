import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const STRIPS = [
    { id: 1, dir: 'left', bg: 'bg-black' },
    { id: 2, dir: 'right', bg: 'bg-black' },
    { id: 3, dir: 'left', bg: 'bg-[#fccf2a]' },  // neo-yellow accent
    { id: 4, dir: 'right', bg: 'bg-black' },
    { id: 5, dir: 'left', bg: 'bg-black' },
];

export default function PageReveal({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    const [count, setCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [nameVisible, setNameVisible] = useState(false);

    const stripsRef = useRef<HTMLDivElement[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);
    const nameTriggeredRef = useRef(false);
    const doneRef = useRef(false);

    useEffect(() => {
        if (!mounted) return;

        const proxy = { val: 0 };

        const counterTween = gsap.to(proxy, {
            val: 100,
            duration: 1.4,
            ease: 'power2.in',
            onUpdate() {
                const v = proxy.val;
                setCount(Math.floor(v));
                setProgress(v);

                if (v >= 50 && !nameTriggeredRef.current) {
                    nameTriggeredRef.current = true;
                    setNameVisible(true);
                }
            },
            onComplete() {
                // Hold for 0.2s then split
                gsap.delayedCall(0.2, () => {
                    const lefts = stripsRef.current.filter((_, i) => STRIPS[i].dir === 'left');
                    const rights = stripsRef.current.filter((_, i) => STRIPS[i].dir === 'right');

                    gsap.to(lefts, { xPercent: -100, duration: 0.45, ease: 'power4.in' });
                    gsap.to(rights, {
                        xPercent: 100,
                        duration: 0.45,
                        ease: 'power4.in',
                        onComplete: () => {
                            if (!doneRef.current) {
                                doneRef.current = true;
                                onDone();
                                setMounted(false);
                            }
                        }
                    });

                    // Fade out overlay content simultaneously
                    if (overlayRef.current) {
                        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
                    }
                });
            },
        });

        return () => {
            counterTween.kill();
        };
    }, [mounted]);

    if (!mounted) return null;

    const displayCount = String(Math.min(count, 100)).padStart(2, '0');

    return (
        <>
            {/* ── 5 strips (bg layer, z-[9998]) ── */}
            <div className="fixed inset-0 z-9998 pointer-events-none">
                {STRIPS.map((strip, i) => (
                    <div
                        key={strip.id}
                        ref={el => { if (el) stripsRef.current[i] = el; }}
                        className={`absolute left-0 right-0 w-full ${strip.bg}`}
                        style={{
                            top: `${i * 20}vh`,
                            height: '20vh',
                        }}
                    />
                ))}
            </div>

            {/* ── Counter overlay (z-[9999]) ── */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-9999 flex flex-col items-center justify-center pointer-events-none select-none"
            >
                {/* LOADING label */}
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                    LOADING
                </p>

                {/* Counter */}
                <div
                    className="text-white font-black leading-none tabular-nums"
                    style={{ fontSize: 'clamp(5rem, 20vw, 20vw)', letterSpacing: '-0.04em' }}
                >
                    {displayCount}
                </div>

                {/* Name reveal */}
                <p
                    className="mt-6 text-white font-black uppercase tracking-[0.25em] text-sm md:text-base transition-opacity duration-500"
                    style={{ opacity: nameVisible ? 1 : 0 }}
                >
                    MAHMOOD IFFTY
                </p>

                {/* Progress bar */}
                <div className="fixed bottom-0 left-0 w-full h-[4px] bg-white/10">
                    <div
                        className="h-full bg-white transition-none"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </>
    );
}
