"use client";
import { useLang } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLang();

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
        padding: "120px 24px 80px",
        textAlign: "center",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(132,204,22,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", maxWidth: 860, width: "100%" }}>
        {/* Label */}
        <div className="anim-fade-up" style={{ marginBottom: 24 }}>
          <span
            className="section-label"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(132,204,22,0.1)",
              border: "1px solid rgba(132,204,22,0.25)",
              borderRadius: 20,
              padding: "6px 16px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#84cc16",
                display: "inline-block",
                animation: "pulse-dot 1.6s ease-in-out infinite",
              }}
            />
            {t.hero.label}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="anim-fade-up delay-100"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(52px, 9vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#fff",
            marginBottom: 24,
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
            fontSize: "clamp(16px, 2.2vw, 20px)",
            color: "rgba(255,255,255,0.55)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.65,
          }}
        >
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div
          className="anim-fade-up delay-300"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            marginBottom: 0,
          }}
        >
          <a href="#how" className="btn-primary" style={{ fontSize: 15, padding: "16px 32px" }}>
            {t.hero.cta1}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#forwhom" className="btn-outline" style={{ fontSize: 15, padding: "16px 32px" }}>
            {t.hero.cta2}
          </a>
        </div>

      </div>

      {/* Scroll cue */}
      <a
        href="#how"
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.3)",
          textDecoration: "none",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 600,
        }}
      >
        {t.hero.scroll}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
