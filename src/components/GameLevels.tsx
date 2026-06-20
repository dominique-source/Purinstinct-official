"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const IMGS: Record<string, Record<string, string>> = {
  fr: {
    "01": "/images/level-1-fr.png",
    "02": "/images/level-2-fr.png",
    "03": "/images/level-3-fr.png",
    "04": "/images/level-4-fr.png",
    "05": "/images/level-5-fr.png",
    "06": "/images/level-6-fr.png",
  },
  en: {
    "01": "/images/level-1-en.png",
    "02": "/images/level-2-en.png",
    "03": "/images/level-3-en.png",
    "04": "/images/level-4-en.png",
    "05": "/images/level-5-en.png",
    "06": "/images/level-6-en.png",
  },
};

const LIME = "#84cc16";

function StarRow({ count, total = 6, size = 20 }: { count: number; total?: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }} aria-label={`${count}/${total}`}>
      {Array.from({ length: total }).map((_, s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.35l-3.52 1.85.67-3.93L2.3 5.64l3.94-.57L8 1.5z"
            fill={s < count ? LIME : "rgba(255,255,255,0.12)"}
          />
        </svg>
      ))}
    </div>
  );
}

type Level = {
  num: string;
  name: string;
  stars: number;
  tag: string;
  body: string;
};

/* ── Shared text block ── */
function LevelText({ lv, large }: { lv: Level; large?: boolean }) {
  return (
    <div style={{ position: "relative" }}>
      <StarRow count={lv.stars} size={large ? 22 : 18} />
      <h3
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 900,
          fontSize: large ? "clamp(48px, 5.6vw, 88px)" : "clamp(38px, 9vw, 56px)",
          lineHeight: 0.9,
          textTransform: "uppercase",
          color: "#fff",
          letterSpacing: "-0.01em",
          margin: "16px 0 20px",
        }}
      >
        {lv.name}
      </h3>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          background: "rgba(132,204,22,0.08)",
          border: "1px solid rgba(132,204,22,0.22)",
          borderRadius: 9,
          padding: "9px 16px",
          marginBottom: 22,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: LIME, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: LIME,
          }}
        >
          {lv.tag}
        </span>
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.58)",
          fontSize: large ? 17 : 15.5,
          lineHeight: 1.72,
          maxWidth: 440,
        }}
      >
        {lv.body}
      </p>
    </div>
  );
}

export default function GameLevels() {
  const { t, lang } = useLang();
  const levels = t.levels.items as unknown as Level[];
  const n = levels.length;
  const imgs = IMGS[lang];

  const [mode, setMode] = useState<"pinned" | "native">("pinned");
  const [active, setActive] = useState(0);
  const [headerRevealed, setHeaderRevealed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastIdx = useRef(0);
  const rafPending = useRef(false);

  /* Decide mode: pinned on desktop, native scroll-snap on mobile / reduced-motion */
  useEffect(() => {
    const small = window.matchMedia("(max-width: 980px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(small.matches || reduce.matches ? "native" : "pinned");
    update();
    small.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  /* Header reveal */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderRevealed(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Pinned horizontal scroll driver ── */
  const onScroll = useCallback(() => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const vw = window.innerWidth;
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-container.getBoundingClientRect().top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;

      const maxX = (n - 1) * vw;
      const x = progress * maxX;
      track.style.transform = `translate3d(${-x}px,0,0)`;

      if (fillRef.current) fillRef.current.style.width = `${progress * 100}%`;

      // Depth: scale + opacity per panel based on distance from viewport center
      for (let i = 0; i < n; i++) {
        const panel = panelRefs.current[i];
        if (!panel) continue;
        const d = Math.abs(i * vw - x) / vw; // 0 = centered
        const close = Math.max(0, 1 - d);
        panel.style.opacity = String(0.32 + 0.68 * close);
        const inner = panel.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `scale(${0.93 + 0.07 * close})`;
      }

      const idx = Math.round(progress * (n - 1));
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        setActive(idx);
      }
    });
  }, [n]);

  useEffect(() => {
    if (mode !== "pinned") return;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode, onScroll]);

  /* ── Native (mobile) active dot tracking ── */
  const nativeRef = useRef<HTMLDivElement>(null);
  const onNativeScroll = useCallback(() => {
    const el = nativeRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.86));
    setActive(Math.min(n - 1, Math.max(0, idx)));
  }, [n]);

  const titleParts = t.levels.title.split("\n");

  /* ── Section header (shared) ── */
  const Header = (
    <div
      ref={headerRef}
      style={{
        textAlign: "center",
        maxWidth: 560,
        margin: "0 auto",
        padding: "0 24px",
        opacity: headerRevealed ? 1 : 0,
        transform: headerRevealed ? "translateY(0)" : "translateY(26px)",
        transition: "opacity 0.75s ease, transform 0.75s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span className="section-label" style={{ display: "inline-block", marginBottom: 18 }}>
        {t.levels.label}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(44px, 6.5vw, 84px)",
          lineHeight: 0.93,
          textTransform: "uppercase",
          color: "#fff",
          letterSpacing: "-0.01em",
          marginBottom: 18,
        }}
      >
        {titleParts[0]}
        <br />
        <span className="gradient-text">{titleParts[1]}</span>
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65 }}>{t.levels.sub}</p>
    </div>
  );

  return (
    <section
      id="levels"
      style={{ background: "#06070f", position: "relative", paddingTop: 110 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(132,204,22,0.07) 0%, transparent 60%)",
        }}
      />

      {Header}

      {mode === "pinned" ? (
        /* ───────────── DESKTOP: pinned horizontal scroll ───────────── */
        <div
          ref={containerRef}
          style={{ height: `${n * 88}vh`, position: "relative", marginTop: 56 }}
        >
          <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
            {/* Track */}
            <div
              ref={trackRef}
              style={{
                display: "flex",
                height: "100%",
                width: `${n * 100}vw`,
                willChange: "transform",
              }}
            >
              {levels.map((lv, i) => (
                <div
                  key={lv.num}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  style={{
                    flex: "0 0 100vw",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6vw",
                    opacity: i === 0 ? 1 : 0.32,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 1180,
                      display: "grid",
                      gridTemplateColumns: "1fr 1.12fr",
                      gap: 56,
                      alignItems: "center",
                      willChange: "transform",
                      transition: "transform 0.1s linear",
                    }}
                  >
                    {/* Left: text + watermark */}
                    <div style={{ position: "relative" }}>
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: -70,
                          left: -20,
                          fontFamily: "var(--font-barlow), sans-serif",
                          fontWeight: 900,
                          fontSize: "clamp(150px, 16vw, 230px)",
                          lineHeight: 1,
                          color: "rgba(132,204,22,0.05)",
                          userSelect: "none",
                          pointerEvents: "none",
                          letterSpacing: "-0.05em",
                        }}
                      >
                        {lv.num}
                      </div>
                      <div style={{ position: "relative" }}>
                        <LevelText lv={lv} large />
                      </div>
                    </div>

                    {/* Right: image */}
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 18,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
                        aspectRatio: "16/9",
                      }}
                    >
                      <Image
                        src={imgs[lv.num]}
                        alt={`${lv.name} — ${lv.tag}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="56vw"
                        priority={i === 0}
                      />
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background: "linear-gradient(135deg, rgba(132,204,22,0.05) 0%, transparent 42%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress UI (stays fixed while pinned) */}
            <div
              style={{
                position: "absolute",
                bottom: 44,
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(560px, 78vw)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.16em",
                    color: LIME,
                  }}
                >
                  N°{levels[active].num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {levels[active].name}
                </span>
              </div>
              {/* Line + fill */}
              <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                <div
                  ref={fillRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "0%",
                    background: LIME,
                    borderRadius: 2,
                    boxShadow: `0 0 12px ${LIME}`,
                  }}
                />
                {/* Ticks */}
                <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between" }}>
                  {levels.map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        marginTop: -3,
                        background: i <= active ? LIME : "rgba(255,255,255,0.2)",
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Hint */}
              <div
                aria-hidden="true"
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                <span>{t.levels.next}</span>
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="scroll-hint-arrow">
                  <path d="M2 7h17m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ───────────── MOBILE: native scroll-snap carousel ───────────── */
        <div style={{ marginTop: 44, paddingBottom: 90 }}>
          <div
            ref={nativeRef}
            onScroll={onNativeScroll}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              padding: "0 24px 8px",
            }}
          >
            {levels.map((lv, i) => (
              <div
                key={lv.num}
                style={{
                  flex: "0 0 86%",
                  scrollSnapAlign: "center",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", width: "100%" }}>
                  <Image
                    src={imgs[lv.num]}
                    alt={`${lv.name} — ${lv.tag}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="86vw"
                    priority={i === 0}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 14,
                      fontFamily: "var(--font-barlow), sans-serif",
                      fontWeight: 900,
                      fontSize: 40,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                    }}
                  >
                    {lv.num}
                  </span>
                </div>
                <div style={{ padding: "22px 22px 26px" }}>
                  <LevelText lv={lv} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }} aria-hidden="true">
            {levels.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === active ? LIME : "rgba(255,255,255,0.18)",
                  transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
