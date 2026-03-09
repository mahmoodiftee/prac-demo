import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ─── Constants ────────────────────────────────────────────────────────────────
const GLITCH_CHARS = ['█', '▓', '░', '■', '▪', '▒', '◆', '◼', '▀', '▄'];
const TARGET_TEXT = 'SOFTWARE ENGINEER';
const SNAP_TIME = 1.8;    // seconds until hard cut
const RESOLVE_TIME = 0.8;    // seconds until corrupted text fully resolves

function randomGlyphString(length: number) {
    return Array.from({ length }, () =>
        GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    ).join('');
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PageRevealGlitch({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    const [corruptedText, setCorruptedText] = useState(
        () => randomGlyphString(TARGET_TEXT.length)
    );

    const doneRef = useRef(false);
    const glitchGroupRef = useRef<HTMLDivElement>(null);  // name + sub wrapper
    const redRef = useRef<HTMLSpanElement>(null);
    const whiteRef = useRef<HTMLSpanElement>(null);
    const blueRef = useRef<HTMLSpanElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    // Running timers / tweens we need to kill on snap
    const glitchJumpTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const flickerTween = useRef<gsap.core.Tween | null>(null);
    const resolveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const snapCall = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!mounted) return;

        // ── 1. RGB flicker (rapid opacity yoyo on the 3 layers) ──────────────
        flickerTween.current = gsap.to([redRef.current, whiteRef.current, blueRef.current], {
            opacity: 0.35,
            duration: 0.07,
            repeat: -1,
            yoyo: true,
            ease: 'none',
            stagger: { each: 0.04, repeat: -1, yoyo: true },
        });

        // ── 2. Random horizontal glitch jumps every 150ms ────────────────────
        glitchJumpTimer.current = setInterval(() => {
            if (!glitchGroupRef.current) return;
            const jumpX = (Math.random() - 0.5) * 40; // –20 to +20 px
            gsap.to(glitchGroupRef.current, {
                x: jumpX,
                duration: 0.04,
                ease: 'none',
                onComplete: () => {
                    gsap.to(glitchGroupRef.current, { x: 0, duration: 0.04, ease: 'none' });
                },
            });
        }, 150);

        // ── 3. Corrupted text resolves into TARGET_TEXT over RESOLVE_TIME ────
        let lockedChars = 0;
        const totalChars = TARGET_TEXT.length;
        const resolveStep = RESOLVE_TIME * 1000 / totalChars; // ms per char lock-in

        resolveTimer.current = setInterval(() => {
            lockedChars = Math.min(lockedChars + 1, totalChars);
            const locked = TARGET_TEXT.slice(0, lockedChars);
            const corrupt = randomGlyphString(totalChars - lockedChars);
            setCorruptedText(locked + corrupt);
            if (lockedChars >= totalChars && resolveTimer.current) {
                clearInterval(resolveTimer.current);
            }
        }, resolveStep);

        // ── 4. Hard snap at SNAP_TIME ────────────────────────────────────────
        snapCall.current = gsap.delayedCall(SNAP_TIME, () => {
            // Kill all glitch effects immediately
            flickerTween.current?.kill();
            if (glitchJumpTimer.current) clearInterval(glitchJumpTimer.current);
            if (resolveTimer.current) clearInterval(resolveTimer.current);

            // Restore full opacity / clean position instantly
            [redRef.current, whiteRef.current, blueRef.current].forEach(el => {
                if (el) gsap.set(el, { opacity: 1, x: 0 });
            });
            if (glitchGroupRef.current) gsap.set(glitchGroupRef.current, { x: 0 });

            // White flash: 0 → 1 → 0 in 2 × 0.05s
            gsap.to(flashRef.current, {
                opacity: 1,
                duration: 0.05,
                ease: 'none',
                onComplete: () => {
                    gsap.to(flashRef.current, {
                        opacity: 0,
                        duration: 0.05,
                        ease: 'none',
                        onComplete: () => {
                            if (!doneRef.current) {
                                doneRef.current = true;
                                onDone();
                                setMounted(false);
                            }
                        },
                    });
                },
            });
        }) as gsap.core.Tween;

        return () => {
            flickerTween.current?.kill();
            snapCall.current?.kill();
            if (glitchJumpTimer.current) clearInterval(glitchJumpTimer.current);
            if (resolveTimer.current) clearInterval(resolveTimer.current);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
            aria-hidden="true"
        >
            {/* ── Name + sub-line wrapper (receives glitch jumps) ── */}
            <div
                ref={glitchGroupRef}
                style={{ position: 'relative', textAlign: 'center' }}
            >
                {/* ── RGB chromatic aberration: 3 absolutely stacked text copies ── */}
                <div
                    style={{
                        position: 'relative',
                        // Height set by the white (main) copy
                        fontSize: 'clamp(3rem, 10vw, 10vw)',
                        fontWeight: 900,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        userSelect: 'none',
                        isolation: 'isolate',
                    }}
                >
                    {/* Red copy (left offset) */}
                    <span
                        ref={redRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            color: '#ff2020',
                            transform: 'translateX(-6px)',
                            mixBlendMode: 'screen',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        MAHMOOD IFFTY
                    </span>

                    {/* White/main copy (center — sets element height) */}
                    <span
                        ref={whiteRef}
                        style={{
                            position: 'relative',
                            color: '#ffffff',
                            transform: 'translateX(0)',
                            display: 'block',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        MAHMOOD IFFTY
                    </span>

                    {/* Blue copy (right offset) */}
                    <span
                        ref={blueRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            color: '#60a5fa',
                            transform: 'translateX(6px)',
                            mixBlendMode: 'screen',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        MAHMOOD IFFTY
                    </span>
                </div>

                {/* ── Yellow divider line ── */}
                <div
                    style={{
                        width: '100%',
                        height: '3px',
                        background: '#fccf2a',
                        margin: '14px 0 12px',
                    }}
                />

                {/* ── Corrupted sub-text ── */}
                <div
                    style={{
                        fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
                        fontWeight: 700,
                        fontSize: 'clamp(0.8rem, 2vw, 1.4rem)',
                        color: '#fafafa',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        opacity: 0.85,
                    }}
                >
                    {corruptedText}
                </div>
            </div>

            {/* ── White flash layer (opacity starts at 0, flashes to 1) ── */}
            <div
                ref={flashRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fafafa',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
