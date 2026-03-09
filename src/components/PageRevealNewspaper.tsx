import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function PageRevealNewspaper({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    const doneRef = useRef(false);

    // Layer refs
    const whiteLayerRef = useRef<HTMLDivElement>(null);
    const halftoneLayerRef = useRef<HTMLDivElement>(null);
    const rollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mounted) return;

        const proxy = { pct: 0 };

        // Initial state
        if (whiteLayerRef.current)
            whiteLayerRef.current.style.clipPath = 'inset(0 0 0% 0)';
        if (halftoneLayerRef.current)
            halftoneLayerRef.current.style.clipPath = 'inset(100% 0 0 0)';
        if (rollerRef.current) {
            rollerRef.current.style.top = '0px';
            rollerRef.current.style.opacity = '1';
        }
        const tl = gsap.timeline();

        // ── Phase 1: Roller sweeps top → bottom (1.2s, linear) ───────────────
        tl.to(proxy, {
            pct: 100,
            duration: 1.2,
            ease: 'none',
            onUpdate() {
                const p = proxy.pct;
                if (whiteLayerRef.current)
                    whiteLayerRef.current.style.clipPath = `inset(0 0 ${p}% 0)`;
                if (halftoneLayerRef.current)
                    halftoneLayerRef.current.style.clipPath = `inset(${100 - p}% 0 0 0)`;
                if (rollerRef.current)
                    rollerRef.current.style.top = `${p}vh`;
            },
        });

        // ── Phase 2: Hold for 1s — absorb the printed look ────────────────────
        tl.to({}, { duration: 1.0 });

        // ── Phase 3: Halftone fades out to reveal full color (0.4s) ──────────
        tl.to(halftoneLayerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, '-=0.05');

        // ── Phase 4: Roller line fades out (overlapping) ─────────────────────
        tl.to(rollerRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
        }, '-=0.35');

        // ── Done ──────────────────────────────────────────────────────────────
        tl.call(() => {
            if (!doneRef.current) {
                doneRef.current = true;
                onDone();
                setMounted(false);
            }
        });

        return () => { tl.kill(); };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <>
            {/* ── White layer — unprinted region above roller ── */}
            <div
                ref={whiteLayerRef}
                style={{
                    position: 'fixed', inset: 0,
                    zIndex: 9998,
                    background: '#fafafa',
                    pointerEvents: 'none',
                    willChange: 'clip-path',
                }}
                aria-hidden="true"
            />

            {/* ── Halftone layer — grayscale dot-print region below roller ── */}
            <div
                ref={halftoneLayerRef}
                style={{
                    position: 'fixed', inset: 0,
                    zIndex: 9997,
                    pointerEvents: 'none',
                    willChange: 'clip-path, opacity',
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.45) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                    backdropFilter: 'grayscale(1) contrast(1.15) brightness(0.92)',
                    WebkitBackdropFilter: 'grayscale(1) contrast(1.15) brightness(0.92)',
                }}
                aria-hidden="true"
            />

            {/* ── Roller scan line ── */}
            <div
                ref={rollerRef}
                style={{
                    position: 'fixed', left: 0,
                    width: '100%', height: '4px',
                    zIndex: 10000,
                    background: '#18181b',
                    pointerEvents: 'none',
                    willChange: 'top, opacity',
                    boxShadow: '0 0 8px 2px rgba(0,0,0,0.5), 0 2px 0 0 rgba(255,255,255,0.15)',
                }}
                aria-hidden="true"
            />
        </>
    );
}
