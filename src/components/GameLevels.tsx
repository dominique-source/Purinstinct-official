"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const IMGS: Record<string, Record<string, string>> = {
  fr: {
    "01": "/images/level-1-fr.png",
    "02": "/images/level-2-fr.png",
    "03": "/images/level-3-fr.png",
    "04": "/images/level-4-fr.png",
    "05": "/images/level-5-fr.png",
    "06": "/images/levels-overview-fr.png",
  },
  en: {
    "01": "/images/level-1-en.png",
    "02": "/images/level-2-en.png",
    "03": "/images/level-3-en.png",
    "04": "/images/level-4-en.png",
    "05": "/images/level-5-en.png",
    "06": "/images/levels-overview-en.png",
  },
};

function Star({ on }: { on: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.35l-3.52 1.85.67-3.93L2.3 5.64l3.94-.57L8 1.5z"
        fill={on ? "#84cc16" : "rgba(255,255,255,0.13)"}
      />
    </svg>
  );
}

export default function GameLevels() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const select = (idx: number) => {
    if (idx === active) return;
    setImgVisible(false);
    setTimeout(() => { setActive(idx); setImgVisible(true); }, 200);
    // Scroll tab into view on mobile
    const tab = tabsRef.current?.children[idx] as HTMLElement | undefined;
    tab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const levels = t.levels.items;
  const cur = levels[active];
  const imgs = IMGS[lang];

  const titleParts = t.levels.title.split("\n");

  return (
    <section
      ref={sectionRef}
      id="levels"
      style={{ padding: "110px 24px", background: "#06070f", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,204,22,0.07) 0%, transparent 65%)",
      }} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>

        {/* ── Header ── */}
        <div style={{
          textAlign: "center", marginBottom: 52,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.75s ease, transform 0.75s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span className="section-label" style={{ display: "inline-block", marginBottom: 18 }}>
            {t.levels.label}
          </span>
          <h2 style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 6.5vw, 84px)",
            lineHeight: 0.93,
            textTransform: "uppercase",
            color: "#fff",
            letterSpacing: "-0.01em",
            marginBottom: 18,
          }}>
            {titleParts[0]}
            <br />
            <span className="gradient-text">{titleParts[1]}</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
            {t.levels.sub}
          </p>
        </div>

        {/* ── Level tabs ── */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t.levels.label}
          style={{
            display: "flex",
            marginBottom: 40,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.75s 0.12s ease, transform 0.75s 0.12s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {levels.map((lv, i) => {
            const on = i === active;
            return (
              <button
                key={lv.num}
                role="tab"
                aria-selected={on}
                onClick={() => select(i)}
                style={{
                  flex: "1 0 auto",
                  minWidth: 118,
                  padding: "14px 10px 12px",
                  cursor: "pointer",
                  textAlign: "center",
                  scrollSnapAlign: "start",
                  background: on ? "rgba(132,204,22,0.09)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${on ? "rgba(132,204,22,0.38)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: i === 0 ? "12px 0 0 12px" : i === levels.length - 1 ? "0 12px 12px 0" : "0",
                  borderLeft: i > 0 ? "none" : undefined,
                  transition: "background 0.22s ease, border-color 0.22s ease",
                  outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.outline = "2px solid rgba(132,204,22,0.6)"; e.currentTarget.style.outlineOffset = "2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                <div style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: on ? "#84cc16" : "rgba(255,255,255,0.3)",
                  marginBottom: 4,
                  transition: "color 0.22s ease",
                }}>
                  N°{lv.num}
                </div>
                <div style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 800, fontSize: 13,
                  textTransform: "uppercase", letterSpacing: "0.04em",
                  color: on ? "#fff" : "rgba(255,255,255,0.45)",
                  marginBottom: 7,
                  transition: "color 0.22s ease",
                }}>
                  {lv.name}
                </div>
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {Array.from({ length: 6 }).map((_, s) => <Star key={s} on={s < lv.stars} />)}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 40, alignItems: "center",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.75s 0.22s ease, transform 0.75s 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}>

          {/* Left: info */}
          <div style={{ position: "relative", paddingTop: 16 }}>
            {/* Giant faded number watermark */}
            <div aria-hidden="true" style={{
              position: "absolute", top: -32, left: -16,
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(120px, 18vw, 200px)",
              lineHeight: 1,
              color: "rgba(132,204,22,0.05)",
              userSelect: "none", pointerEvents: "none",
              letterSpacing: "-0.05em",
              transition: "opacity 0.2s ease",
              opacity: imgVisible ? 1 : 0,
            }}>
              {cur.num}
            </div>

            <div style={{ position: "relative" }}>
              {/* Stars row */}
              <div
                style={{
                  display: "flex", gap: 4, marginBottom: 16,
                  opacity: imgVisible ? 1 : 0,
                  transform: imgVisible ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.28s ease, transform 0.28s ease",
                }}
                aria-label={`${cur.stars} étoiles sur 6`}
              >
                {Array.from({ length: 6 }).map((_, s) => (
                  <svg key={s} width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.35l-3.52 1.85.67-3.93L2.3 5.64l3.94-.57L8 1.5z"
                      fill={s < cur.stars ? "#84cc16" : "rgba(255,255,255,0.1)"}
                    />
                  </svg>
                ))}
              </div>

              {/* Level name */}
              <h3 style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(44px, 6vw, 76px)",
                lineHeight: 0.92,
                textTransform: "uppercase",
                color: "#fff",
                letterSpacing: "-0.01em",
                marginBottom: 22,
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.25s 0.04s ease, transform 0.25s 0.04s ease",
              }}>
                {cur.name}
              </h3>

              {/* Rule badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "rgba(132,204,22,0.08)",
                border: "1px solid rgba(132,204,22,0.22)",
                borderRadius: 9, padding: "9px 16px",
                marginBottom: 22,
                opacity: imgVisible ? 1 : 0,
                transition: "opacity 0.25s 0.08s ease",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#84cc16", flexShrink: 0 }} />
                <span style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "#84cc16",
                }}>
                  {cur.tag}
                </span>
              </div>

              {/* Body */}
              <p style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: 16, lineHeight: 1.72,
                maxWidth: 420, marginBottom: 32,
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.25s 0.1s ease, transform 0.25s 0.1s ease",
              }}>
                {cur.body}
              </p>

              {/* Prev / Next buttons */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={() => select(Math.max(0, active - 1))}
                  disabled={active === 0}
                  aria-label={t.levels.prev}
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    cursor: active === 0 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: active === 0 ? 0.28 : 1,
                    transition: "opacity 0.2s ease, background 0.2s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { if (active > 0) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M11 14L6 9l5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  onClick={() => select(Math.min(levels.length - 1, active + 1))}
                  disabled={active === levels.length - 1}
                  aria-label={t.levels.next}
                  style={{
                    height: 48, padding: "0 22px",
                    borderRadius: 12,
                    background: active < levels.length - 1 ? "rgba(132,204,22,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active < levels.length - 1 ? "rgba(132,204,22,0.3)" : "rgba(255,255,255,0.09)"}`,
                    cursor: active === levels.length - 1 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: active === levels.length - 1 ? 0.28 : 1,
                    transition: "opacity 0.2s ease, background 0.2s ease",
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 700, fontSize: 13,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: active < levels.length - 1 ? "#84cc16" : "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => { if (active < levels.length - 1) e.currentTarget.style.background = "rgba(132,204,22,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = active < levels.length - 1 ? "rgba(132,204,22,0.12)" : "rgba(255,255,255,0.04)"; }}
                >
                  {t.levels.next}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div style={{
            position: "relative",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(132,204,22,0.06)",
            aspectRatio: "16/9",
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
            transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <Image
              src={imgs[cur.num]}
              alt={`${cur.name} — ${cur.tag}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, 58vw"
              priority={active === 0}
            />
            {/* Subtle lime corner accent */}
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(135deg, rgba(132,204,22,0.05) 0%, transparent 40%)",
            }} />
          </div>

        </div>

        {/* ── Progress dots ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 8, marginTop: 40,
          opacity: revealed ? 1 : 0,
          transition: "opacity 0.75s 0.3s ease",
        }}
          aria-hidden="true"
        >
          {levels.map((_, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === active ? "#84cc16" : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
