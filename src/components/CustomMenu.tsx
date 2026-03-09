import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '../context/SmoothScrollContext';

export interface StaggeredMenuItem {
    label: string;
    ariaLabel: string;
    link: string;
}
export interface StaggeredMenuSocialItem {
    label: string;
    link: string;
}
export interface StaggeredMenuProps {
    colors?: string[];
    items?: StaggeredMenuItem[];
    socialItems?: StaggeredMenuSocialItem[];
    displaySocials?: boolean;
    displayItemNumbering?: boolean;
    className?: string;
    accentColor?: string;
    closeOnClickAway?: boolean;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
    colors = ['#B19EEF', '#5227FF'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    accentColor = '#5227FF',
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose
}: StaggeredMenuProps) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const preLayersRef = useRef<HTMLDivElement | null>(null);
    const preLayerElsRef = useRef<HTMLElement[]>([]);

    const closeHRef = useRef<HTMLSpanElement | null>(null);
    const closeVRef = useRef<HTMLSpanElement | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const openBtnRef = useRef<HTMLButtonElement | null>(null);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);
    const busyRef = useRef(false);
    const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            if (!panel) return;

            let preLayers: HTMLElement[] = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
            }
            preLayerElsRef.current = preLayers;

            gsap.set([panel, ...preLayers], { xPercent: 100 });

            // Close button starts hidden
            if (closeBtnRef.current) {
                gsap.set(closeBtnRef.current, { autoAlpha: 0, scale: 0.5, rotate: -90 });
            }

            // X lines already set to ×  via CSS, no extra gsap needed
        });
        return () => ctx.revert();
    }, []);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        const numberEls = Array.from(
            panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        // Fade out MENU button immediately
        if (openBtnRef.current) {
            tl.to(openBtnRef.current, { autoAlpha: 0, scale: 0.8, duration: 0.18, ease: 'power2.in' }, 0);
        }

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        // Pop in the X close button after panel arrives
        if (closeBtnRef.current) {
            tl.to(
                closeBtnRef.current,
                { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(1.7)' },
                panelInsertTime + 0.2
            );
        }

        if (itemEls.length) {
            const itemsStart = panelInsertTime + panelDuration * 0.15;
            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );
            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },
                    itemsStart + 0.1
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;
            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => { gsap.set(socialLinks, { clearProps: 'opacity' }); }
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => { busyRef.current = false; });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        // Spin & hide the X button
        if (closeBtnRef.current) {
            gsap.to(closeBtnRef.current, { autoAlpha: 0, scale: 0.5, rotate: 90, duration: 0.22, ease: 'power2.in' });
        }
        // Bring back the MENU button
        if (openBtnRef.current) {
            gsap.to(openBtnRef.current, { autoAlpha: 1, scale: 1, duration: 0.3, delay: 0.15, ease: 'back.out(1.4)' });
        }

        const all: HTMLElement[] = [...layers, panel];
        closeTweenRef.current?.kill();
        closeTweenRef.current = gsap.to(all, {
            xPercent: 100,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
                const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')) as HTMLElement[];
                if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
                const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
                const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
                busyRef.current = false;
            }
        });
    }, []);

    const openMenu = useCallback(() => {
        if (openRef.current) return;
        openRef.current = true;
        setOpen(true);
        onMenuOpen?.();
        playOpen();
    }, [playOpen, onMenuOpen]);

    const closeMenu = useCallback(() => {
        if (!openRef.current) return;
        openRef.current = false;
        setOpen(false);
        onMenuClose?.();
        playClose();
    }, [playClose, onMenuClose]);

    const { lenis } = useSmoothScroll();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        if (link.startsWith('#') && lenis) {
            e.preventDefault();
            const target = document.querySelector(link);
            if (target) {
                lenis.scrollTo(target as HTMLElement, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
                closeMenu();
            }
        } else {
            closeMenu();
        }
    };

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                closeBtnRef.current &&
                !closeBtnRef.current.contains(event.target as Node) &&
                openBtnRef.current &&
                !openBtnRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [closeOnClickAway, open, closeMenu]);

    return (
        <>
            {/* MENU button */}
            <button
                ref={openBtnRef}
                className="sm-open-btn"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="staggered-menu-panel"
                onClick={openMenu}
                type="button"
            >
                MENU
                <span className="sm-open-icon" aria-hidden="true">
                    <span className="sm-open-line" />
                    <span className="sm-open-line sm-open-line-v" />
                </span>
            </button>

            {/* X close button — floats above the panel, no background box */}
            <button
                ref={closeBtnRef}
                className="sm-close-btn"
                aria-label="Close menu"
                onClick={closeMenu}
                type="button"
            >
                <span className="sm-x-icon" aria-hidden="true">
                    <span ref={closeHRef} className="sm-x-line sm-x-line-h" />
                    <span ref={closeVRef} className="sm-x-line sm-x-line-v" />
                </span>
            </button>

            {/* Panel + pre-layers */}
            <div
                className="sm-scope"
                data-active={open}
                style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
            >
                <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
                    {(() => {
                        const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
                        let arr = [...raw];
                        if (arr.length >= 3) {
                            const mid = Math.floor(arr.length / 2);
                            arr.splice(mid, 1);
                        }
                        return arr.map((c, i) => (
                            <div key={i} className="sm-prelayer" style={{ background: c }} />
                        ));
                    })()}
                </div>

                <aside
                    id="staggered-menu-panel"
                    ref={panelRef}
                    className={`staggered-menu-panel${className ? ' ' + className : ''}`}
                    aria-hidden={!open}
                >
                    <div className="sm-panel-inner">
                        <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
                            {items && items.length ? (
                                items.map((it, idx) => (
                                    <li className="sm-panel-itemWrap" key={it.label + idx}>
                                        <a className="sm-panel-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1} onClick={(e) => handleLinkClick(e, it.link)}>
                                            <span className="sm-panel-itemLabel">{it.label}</span>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="sm-panel-itemWrap" aria-hidden="true">
                                    <span className="sm-panel-item">
                                        <span className="sm-panel-itemLabel">No items</span>
                                    </span>
                                </li>
                            )}
                        </ul>

                        {displaySocials && socialItems && socialItems.length > 0 && (
                            <div className="sm-socials" aria-label="Social links">
                                <h3 className="sm-socials-title">Socials</h3>
                                <ul className="sm-socials-list" role="list">
                                    {socialItems.map((s, i) => (
                                        <li key={s.label + i} className="sm-socials-item">
                                            <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                                                {s.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <style>{`
/* ── Panel container ── */
.sm-scope { position: fixed; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 480px); pointer-events: none; z-index: 999; }
.sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: 100%; pointer-events: none; z-index: 5; }
.sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; border-left: 0; }
.staggered-menu-panel { position: absolute; top: 0; right: 0; width: 100%; height: 100%; background: var(--background); display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow-y: auto; z-index: 10; border-left: 0; pointer-events: auto; }
.sm-scope[data-active="true"] .sm-prelayer, .sm-scope[data-active="true"] .staggered-menu-panel { border-left: 1px solid var(--neo-border-color); }

/* ── MENU open button ── */
.sm-open-btn { position: fixed; top: 2em; right: 2em; z-index: 1000; display: inline-flex; align-items: center; gap: 0.4rem; background: var(--background); border: 4px solid var(--neo-border-color); box-shadow: 4px 4px 0px 0px var(--neo-shadow-color); cursor: pointer; color: var(--foreground); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; padding: 0.5rem 1rem; font-family: inherit; }
.sm-open-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px var(--neo-shadow-color); }
.sm-open-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; }
.sm-open-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); }
.sm-open-line-v { transform: translate(-50%, -50%) rotate(90deg); }

/* ── X close button ── */
.sm-close-btn { position: fixed; top: 2em; right: 2em; z-index: 1001; background: transparent; border: none; cursor: pointer; padding: 0; line-height: 1; visibility: hidden; }
.sm-x-icon { position: relative; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border: 4px solid var(--neo-border-color); box-shadow: 4px 4px 0px 0px var(--neo-shadow-color); background: var(--background); }
.sm-close-btn:active .sm-x-icon { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px var(--neo-shadow-color); }
.sm-x-line { position: absolute; left: 50%; top: 50%; width: 55%; height: 3px; background: var(--foreground); border-radius: 2px; will-change: transform; transform-origin: 50% 50%; }
.sm-x-line-h { transform: translate(-50%, -50%) rotate(45deg); }
.sm-x-line-v { transform: translate(-50%, -50%) rotate(-45deg); }

/* ── Panel internals ── */
.sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; counter-reset: smItem; }
.sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-panel-item { position: relative; color: var(--foreground); font-weight: 600; font-size: 4rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; text-decoration: none; display: inline-block; padding-right: 1.4em; transition: color 0.25s; }
.sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
.sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-socials-link { font-size: 1.2rem; font-weight: 500; color: var(--foreground); text-decoration: none; display: inline-block; padding: 2px 0; transition: color 0.3s ease; }
.sm-socials-link:hover { color: var(--sm-accent, #ff0000); }

@media (max-width: 640px) { 
  .sm-scope { width: 100%; } 
  .sm-panel-item { font-size: 3.25rem; letter-spacing: -1px; padding-right: 1.2em; }
  .sm-panel-list[data-numbering] .sm-panel-item::after { font-size: 14px; right: 2.4em; }
  .staggered-menu-panel { padding: 5em 1.5em 1.5em 1.5em; }
}
      `}</style>
        </>
    );
};

export default StaggeredMenu;