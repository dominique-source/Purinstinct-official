"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLang();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.38}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 100px",
        textAlign: "center",
      }}
    >
      {/* Parallax photo */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-20% 0",
          willChange: "transform",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/hero-bg.jpg"
          alt="PurInstinct gameplay"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
      </div>

      {/* Gradient overlays — bottom-heavy so text is clear */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(6,7,15,0.55) 0%, rgba(6,7,15,0.3) 40%, rgba(6,7,15,0.82) 85%, #06070f 100%)" }} />
      {/* Side vignettes */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to right, rgba(6,7,15,0.6) 0%, transparent 30%, transparent 70%, rgba(6,7,15,0.6) 100%)" }} />

      {/* Signature slash — lime diagonal accent top-right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "38%",
          height: "100%",
          zIndex: 1,
          background: "linear-gradient(135deg, transparent 60%, rgba(132,204,22,0.06) 100%)",
          clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Lime vertical slash bar — the PurInstinct signature */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "12%",
          width: 3,
          height: "70%",
          background: "linear-gradient(to bottom, transparent, #84cc16, transparent)",
          opacity: 0.35,
          transform: "rotate(12deg)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, maxWidth: 860, width: "100%" }}>
        {/* Label */}
        <div className="anim-fade-up" style={{ marginBottom: 28 }}>
          <span
            className="section-label"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(132,204,22,0.12)",
              border: "1px solid rgba(132,204,22,0.3)",
              borderRadius: 20,
              padding: "6px 18px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#84cc16", display: "inline-block", animation: "pulse-dot 1.6s ease-in-out infinite" }} />
            {t.hero.label}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="anim-fade-up delay-100"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(56px, 9.5vw, 116px)",
            lineHeight: 0.93,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: 28,
            textShadow: "0 4px 40px rgba(0,0,0,0.5)",
          }}
        >
          {t.hero.h1a}
          <br />
          <span className="gradient-text">{t.hero.h1b}</span>
        </h1>

        {/* Sub */}
        <p
          className="anim-fade-up delay-200"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "rgba(255,255,255,0.7)",
            maxWidth: 520,
            margin: "0 auto 44px",
            lineHeight: 1.65,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div
          className="anim-fade-up delay-300"
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}
        >
          <a href="#how" className="btn-primary" style={{ fontSize: 15, padding: "16px 34px", boxShadow: "0 0 32px rgba(132,204,22,0.35)" }}>
            {t.hero.cta1}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#forwhom" className="btn-outline" style={{ fontSize: 15, padding: "16px 34px", backdropFilter: "blur(8px)" }}>
            {t.hero.cta2}
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#how"
        style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "rgba(255,255,255,0.45)", textDecoration: "none",
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700,
          zIndex: 3, animation: "scroll-bounce 2s ease-in-out infinite",
        }}
      >
        {t.hero.scroll}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <style>{`
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.4} }
        @keyframes scroll-bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(5px)} }
      `}</style>
    </section>
  );
}
