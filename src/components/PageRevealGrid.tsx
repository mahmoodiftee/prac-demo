import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ─── Grid cell definitions ────────────────────────────────────────────────────
// Each cell slides in FROM its edge, then exits back to that edge.
// `from` = offscreen starting position (CSS transform applied by GSAP).
// `pos`  = final on-screen position (% of viewport).
// `size` = width × height (% of viewport).
// `bg`   = background color token.
// `accent` = true → neo-yellow block overlay.
type EdgeDir = 'top' | 'right' | 'bottom' | 'left';

interface CellDef {
    id: number;
    from: EdgeDir;
    bg: string;          // Tailwind bg-* or inline hex
    accent?: boolean;    // yellow accent stripe
    top: string;
    left: string;
    width: string;
    height: string;
    delay: number;      // stagger delay (seconds)
}

const CELLS: CellDef[] = [
    // Top-left large block — slides from TOP
    {
        id: 1, from: 'top', bg: '#18181b',
        top: '0', left: '0', width: '55vw', height: '55vh',
        delay: 0,
    },
    // Top-right accent block — slides from RIGHT (yellow flash)
    {
        id: 2, from: 'right', bg: '#fccf2a', accent: true,
        top: '0', left: '55vw', width: '45vw', height: '30vh',
        delay: 0.07,
    },
    // Mid-right block — slides from RIGHT
    {
        id: 3, from: 'right', bg: '#18181b',
        top: '30vh', left: '60vw', width: '40vw', height: '35vh',
        delay: 0.14,
    },
    // Bottom-right block — slides from BOTTOM
    {
        id: 4, from: 'bottom', bg: '#18181b',
        top: '65vh', left: '40vw', width: '60vw', height: '35vh',
        delay: 0.21,
    },
    // Mid-left block — slides from LEFT
    {
        id: 5, from: 'left', bg: '#18181b',
        top: '55vh', left: '0', width: '40vw', height: '45vh',
        delay: 0.28,
    },
    // Gap-filler mid block — slides from BOTTOM (neo-blue accent strip)
    {
        id: 6, from: 'bottom', bg: '#1d3557',
        top: '30vh', left: '0', width: '60vw', height: '25vh',
        delay: 0.10,
    },
];

// Convert CellDef.from to the offscreen transform GSAP should start from
function getFromXY(dir: EdgeDir): { x?: string; y?: string } {
    switch (dir) {
        case 'top': return { y: '-110vh' };
        case 'bottom': return { y: '110vh' };
        case 'left': return { x: '-110vw' };
        case 'right': return { x: '110vw' };
    }
}

// Exit direction mirror (same edge they came from)
function getExitXY(dir: EdgeDir): { x?: string; y?: string } {
    return getFromXY(dir); // same offscreen position
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PageRevealGrid({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRef = useRef<HTMLDivElement>(null);
    const doneRef = useRef(false);

    useEffect(() => {
        if (!mounted) return;

        const tl = gsap.timeline({ paused: false });

        // ── 1. Initialise all cells offscreen ─────────────────────────────────
        CELLS.forEach((cell, i) => {
            const el = cellRefs.current[i];
            if (!el) return;
            const { x, y } = getFromXY(cell.from);
            gsap.set(el, { x: x ?? 0, y: y ?? 0, opacity: 1 });
        });

        // Hide text overlay initially
        if (textRef.current) {
            gsap.set(textRef.current, { opacity: 0, scale: 0.92 });
        }

        // ── 2. Cells SNAP in (staggered) ──────────────────────────────────────
        CELLS.forEach((cell, i) => {
            const el = cellRefs.current[i];
            if (!el) return;
            tl.to(el, {
                x: 0, y: 0,
                duration: 0.28,
                ease: 'power4.out',
            }, cell.delay);
        });

        // ── 3. Text STAMPS in after grid is assembled (~0.65s) ────────────────
        tl.to(textRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.18,
            ease: 'power3.out',
        }, 0.72);

        // ── 4. Hold for reading (0.6s) ────────────────────────────────────────
        // (timeline naturally holds while nothing is queued)

        // ── 5. ALL blocks exit simultaneously to their origin edges ───────────
        CELLS.forEach((cell, i) => {
            const el = cellRefs.current[i];
            if (!el) return;
            const { x, y } = getExitXY(cell.from);
            tl.to(el, {
                x: x ?? 0, y: y ?? 0,
                duration: 0.38,
                ease: 'power4.in',
            }, 1.55); // all start at same time = simultaneous
        });

        // Also fade out the text overlay slightly earlier
        tl.to(textRef.current, {
            opacity: 0,
            scale: 1.06,
            duration: 0.22,
            ease: 'power2.in',
        }, 1.48);

        // ── 6. Callback → unmount ─────────────────────────────────────────────
        tl.call(() => {
            if (!doneRef.current) {
                doneRef.current = true;
                onDone();
                setMounted(false);
            }
        }, [], 1.98);

        return () => {
            tl.kill();
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            className="fixed inset-0 z-9999 pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {/* ── Grid cells ── */}
            {CELLS.map((cell, i) => (
                <div
                    key={cell.id}
                    ref={el => { cellRefs.current[i] = el; }}
                    style={{
                        position: 'absolute',
                        top: cell.top,
                        left: cell.left,
                        width: cell.width,
                        height: cell.height,
                        background: cell.bg,
                        border: '4px solid var(--neo-border-color)',
                        boxShadow: cell.accent
                            ? '6px 6px 0 0 #000'
                            : '6px 6px 0 0 var(--neo-shadow-color)',
                        willChange: 'transform',
                        overflow: 'hidden',
                    }}
                >
                    {/* Yellow accent: diagonal stripe decoration */}
                    {cell.accent && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '60%',
                                height: '4px',
                                background: '#000',
                            }}
                        />
                    )}

                    {/* Blue cell: shows a muted label */}
                    {cell.bg === '#1d3557' && (
                        <span
                            style={{
                                position: 'absolute',
                                bottom: 12,
                                left: 16,
                                color: 'rgba(255,255,255,0.18)',
                                fontWeight: 900,
                                fontSize: '10px',
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                            }}
                        >
                            PORTFOLIO&nbsp;/&nbsp;2025
                        </span>
                    )}
                </div>
            ))}

            {/* ── Text overlay (sits above all cells, z-order via DOM) ── */}
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                    gap: 0,
                    mixBlendMode: 'difference', // punches through black + yellow
                }}
            >
                {/* Main name — massive, white, font-black */}
                <div
                    style={{
                        fontWeight: 900,
                        fontSize: 'clamp(3.5rem, 10vw, 11vw)',
                        color: '#ffffff',
                        letterSpacing: '-0.03em',
                        lineHeight: 0.9,
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        // Hard neo-shadow without a box
                        textShadow: '4px 4px 0 #000, -1px -1px 0 #000',
                    }}
                >
                    MAHMOOD
                    <br />
                    IFFTY
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 'clamp(180px, 30vw, 480px)',
                        height: '4px',
                        background: '#fccf2a',
                        margin: '18px 0 14px',
                    }}
                />

                {/* Sub-label */}
                <div
                    style={{
                        fontWeight: 900,
                        fontSize: 'clamp(0.65rem, 1.8vw, 1.25rem)',
                        color: '#ffffff',
                        letterSpacing: '0.42em',
                        textTransform: 'uppercase',
                        textShadow: '2px 2px 0 #000',
                    }}
                >
                    SOFTWARE&nbsp;ENGINEER
                </div>
            </div>
        </div>
    );
}
