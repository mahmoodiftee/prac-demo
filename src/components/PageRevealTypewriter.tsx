import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ─── Manifesto lines ──────────────────────────────────────────────────────────
const LINES = [
    { label: 'NAME', value: 'MAHMOOD IFFTY' },
    { label: 'ROLE', value: 'SOFTWARE ENGINEER' },
    { label: 'STACK', value: 'NODE.JS / REACT / MORE' },
    { label: 'STATUS', value: 'AVAILABLE FOR WORK' },
];

// Typing speed (ms per character) and inter-line pause (ms)
const CHAR_DELAY = 38;
const LINE_PAUSE = 220;
const POST_PAUSE = 550; // pause after last line before strikethrough

// Full formatted line strings
const FULL_LINES = LINES.map(l => `${l.label}: ${l.value}`);

export default function PageRevealTypewriter({ onDone }: { onDone: () => void }) {
    const [mounted, setMounted] = useState(true);
    // typedChars[i] = how many chars of FULL_LINES[i] are visible
    const [typedChars, setTypedChars] = useState<number[]>(LINES.map(() => 0));
    const [cursorLine, setCursorLine] = useState(0);    // which line cursor is on
    const [cursorVisible, setCursorVisible] = useState(true); // blink state
    const [typingDone, setTypingDone] = useState(false);

    const textBlockRef = useRef<HTMLDivElement>(null);
    const strikeRef = useRef<HTMLDivElement>(null);
    const doneRef = useRef(false);
    const blinkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Cursor blink ────────────────────────────────────────────────────────
    useEffect(() => {
        blinkTimerRef.current = setInterval(() => {
            setCursorVisible(v => !v);
        }, 530);
        return () => {
            if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
        };
    }, []);

    // ── Typing engine ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!mounted) return;

        let cancelled = false;
        const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

        async function runTyping() {
            for (let lineIdx = 0; lineIdx < FULL_LINES.length; lineIdx++) {
                if (cancelled) return;
                setCursorLine(lineIdx);
                const fullText = FULL_LINES[lineIdx];

                // Type each character
                for (let charIdx = 1; charIdx <= fullText.length; charIdx++) {
                    if (cancelled) return;
                    setTypedChars(prev => {
                        const next = [...prev];
                        next[lineIdx] = charIdx;
                        return next;
                    });
                    await delay(CHAR_DELAY);
                }

                // Pause between lines
                if (lineIdx < FULL_LINES.length - 1) {
                    await delay(LINE_PAUSE);
                }
            }

            // Move cursor past last line (no more line to type)
            setCursorLine(FULL_LINES.length); // off all lines = hide
            await delay(POST_PAUSE);
            if (!cancelled) setTypingDone(true);
        }

        runTyping();
        return () => { cancelled = true; };
    }, [mounted]);

    // ── GSAP phase: strikethrough → drop → done ──────────────────────────────
    useEffect(() => {
        if (!typingDone || !mounted) return;

        // Stop cursor blinking on completion
        if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
        setCursorVisible(false);

        const tl = gsap.timeline();

        // Strikethrough slams in L→R
        tl.fromTo(
            strikeRef.current,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.28, ease: 'power4.in' },
        );

        // Brief flash hold on strikethrough
        tl.to({}, { duration: 0.22 });

        // Text block + strikethrough drop off screen
        tl.to(textBlockRef.current, {
            y: '105vh',
            duration: 0.35,
            ease: 'power3.in',
        });

        // Call done
        tl.call(() => {
            if (!doneRef.current) {
                doneRef.current = true;
                onDone();
                setMounted(false);
            }
        });

        return () => { tl.kill(); };
    }, [typingDone, mounted]);

    if (!mounted) return null;

    return (
        <div
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
            {/* ── Text block (types + drops) ── */}
            <div
                ref={textBlockRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    transform: 'translateY(-50%)',
                    padding: '0 clamp(32px, 8vw, 120px)',
                }}
            >
                {/* Lines */}
                {FULL_LINES.map((fullText, lineIdx) => (
                    <div
                        key={lineIdx}
                        style={{
                            fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
                            fontWeight: 700,
                            fontSize: 'clamp(1rem, 2.8vw, 2.2rem)',
                            color: '#18181b',
                            lineHeight: 1.65,
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            minHeight: '1.65em', // reserve space before this line types
                        }}
                    >
                        {/* Typed portion */}
                        {fullText.slice(0, typedChars[lineIdx])}

                        {/* Cursor — shown only on the currently active line */}
                        {cursorLine === lineIdx && (
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '0.55em',
                                    height: '1.1em',
                                    background: cursorVisible ? '#18181b' : 'transparent',
                                    verticalAlign: 'text-bottom',
                                    marginLeft: '2px',
                                    // Hard rect cursor, not a caret
                                    borderRadius: 0,
                                    transition: 'background 0s',
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* ── Strikethrough bar (absolutely positioned over text block) ── */}
                <div
                    ref={strikeRef}
                    style={{
                        position: 'absolute',
                        // vertically centre on the text block
                        top: '50%',
                        left: 'clamp(32px, 8vw, 120px)',
                        right: 'clamp(32px, 8vw, 120px)',
                        height: '5px',
                        background: '#18181b',
                        transform: 'translateY(-50%) scaleX(0)',
                        transformOrigin: 'left center',
                    }}
                />
            </div>
        </div>
    );
}
