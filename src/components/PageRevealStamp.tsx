import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ─── Stamp definitions ────────────────────────────────────────────────────────
interface StampLine {
    text: string;
    yellow: boolean;  // yellow bg slab behind the word
    offsetX: string;  // slight horizontal offset for visual rhythm
}

const STAMPS: StampLine[] = [
    { text: 'USUALLY', yellow: false, offsetX: '-4vw' },
    { text: 'FULL STACK.', yellow: false, offsetX: '3vw' },
    { text: 'PARTIAL FOR BACKEND.', yellow: true, offsetX: '-2vw' },
];

export default function PageRevealStamp({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    const doneRef = useRef(false);

    // Refs
    const overlayRef = useRef<HTMLDivElement>(null);  // root overlay (white bg)
    const inkRef = useRef<HTMLDivElement>(null);  // black ink fill layer
    const wipeRef = useRef<HTMLDivElement>(null);  // white wipe bar
    const stampRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!mounted) return;

        const tl = gsap.timeline({ paused: false });

        // ── Initial state ─────────────────────────────────────────────────────
        // Ink layer: clip it to 0 height at top
        gsap.set(inkRef.current, { scaleY: 0, transformOrigin: 'top center' });

        // Stamp lines: hidden, slightly scaled up + rotated (pre-stamp state)
        stampRefs.current.forEach(el => {
            if (!el) return;
            gsap.set(el, {
                opacity: 0,
                scale: 1.4,
                rotation: -3,
                transformOrigin: 'center center',
            });
        });

        // White wipe: start collapsed at left edge
        gsap.set(wipeRef.current, { scaleX: 0, transformOrigin: 'left center' });

        // ── Step 1: Black ink slams down (0.4s power4.in) ────────────────────
        tl.to(inkRef.current, {
            scaleY: 1,
            duration: 0.4,
            ease: 'power4.in',
        }, 0);

        // ── Step 2: Stamps, staggered 0.3s apart ─────────────────────────────
        const STAMP_START = 0.5; // slightly after ink finishes
        STAMPS.forEach((_, i) => {
            const el = stampRefs.current[i];
            if (!el) return;
            tl.to(el, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.22,
                ease: 'back.out(4)',  // rubbery stamp bounce
            }, STAMP_START + i * 0.3);
        });

        // ── Step 3: Hold for 0.4s (last stamp lands at ~1.3s, hold to ~1.7s) ─

        // ── Step 4: White wipe left → right (0.5s power4.out) ────────────────
        tl.to(wipeRef.current, {
            scaleX: 1,
            duration: 0.5,
            ease: 'power4.out',
        }, 1.7);

        // ── Step 5: Done — unmount overlay ───────────────────────────────────
        tl.call(() => {
            if (!doneRef.current) {
                doneRef.current = true;
                onDone();
                setMounted(false);
            }
        }, [], 2.25);

        return () => {
            tl.kill();
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        /* Root overlay — starts white so the sliver before ink lands is white */
        <div
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#fafafa',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        >
            {/* ── Ink fill layer (black, scaleY 0→1 from top) ── */}
            <div
                ref={inkRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#18181b',
                }}
            >
                {/* ── Stamp text lines (live inside the black layer) ── */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'clamp(8px, 2vh, 24px)',
                        paddingLeft: '6vw',
                        paddingRight: '6vw',
                    }}
                >
                    {STAMPS.map((stamp, i) => (
                        <div
                            key={stamp.text}
                            ref={el => { stampRefs.current[i] = el; }}
                            style={{
                                // Slight horizontal rhythm offsets
                                alignSelf: stamp.offsetX.startsWith('-')
                                    ? 'flex-start'
                                    : stamp.offsetX === '0vw'
                                        ? 'center'
                                        : 'flex-end',
                                marginLeft: stamp.offsetX.startsWith('-') ? stamp.offsetX : undefined,
                                marginRight: stamp.offsetX.startsWith('3') ? undefined : undefined,
                                // Yellow slab behind "PARTIAL FOR BACKEND."
                                background: stamp.yellow ? '#fccf2a' : 'transparent',
                                padding: stamp.yellow ? '2px 18px 4px' : '0',
                                // Border for yellow slab (neo-brutal)
                                border: stamp.yellow ? '4px solid #18181b' : 'none',
                                boxShadow: stamp.yellow ? '5px 5px 0 0 rgba(255,255,255,0.15)' : 'none',
                                // Typography
                                color: stamp.yellow ? '#18181b' : '#ffffff',
                                fontWeight: 900,
                                fontSize: 'clamp(2.2rem, 7.5vw, 9vw)',
                                lineHeight: 1,
                                letterSpacing: '-0.03em',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                // Stamp feel: no anti-smoothing blurriness
                                textRendering: 'geometricPrecision',
                                willChange: 'transform, opacity',
                            }}
                        >
                            {stamp.text}
                        </div>
                    ))}

                    {/* ── Thin subline below stamps ── */}
                    <div
                        style={{
                            marginTop: 'clamp(8px, 2vh, 20px)',
                            color: 'rgba(255,255,255,0.35)',
                            fontWeight: 900,
                            fontSize: 'clamp(0.55rem, 1.4vw, 1rem)',
                            letterSpacing: '0.45em',
                            textTransform: 'uppercase',
                        }}
                    >
                        SOFTWARE ENGINEER · PORTFOLIO
                    </div>
                </div>
            </div>

            {/* ── White wipe bar (scaleX 0→1, transforms from left edge) ── */}
            <div
                ref={wipeRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fafafa',
                    transformOrigin: 'left center',
                }}
            />
        </div>
    );
}
