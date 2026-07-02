"use client";
import { useLang } from "@/lib/i18n";
import useScrollReveal from "@/lib/useScrollReveal";

export default function RulesVideo() {
  const { t, lang } = useLang();
  const revealRef = useScrollReveal();

  return (
    <section id="rules" style={{ padding: "120px 24px", background: "#06070f", position: "relative", overflow: "hidden" }}>
      {/* Dominant lime glow behind the video — this is the body's peak moment */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 60% at 50% 55%, rgba(132,204,22,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Massive watermark number */}
      <span
        aria-hidden
        style={{
          position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(200px, 38vw, 460px)",
          color: "rgba(132,204,22,0.035)", lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
        }}
      >
        3:00
      </span>

      <div
        ref={revealRef}
        style={{
          maxWidth: 900, margin: "0 auto", position: "relative", textAlign: "center",
        }}
      >
        <span className="section-label reveal" style={{ display: "inline-block", marginBottom: 22 }}>{t.rules.label}</span>

        <h2 className="reveal" style={{
          fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900,
          fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 0.92,
          textTransform: "uppercase", color: "#fff", marginBottom: 18, letterSpacing: "-0.01em",
          ...({ "--reveal-delay": "60ms" } as React.CSSProperties),
        }}>
          {t.rules.titleA}<br />
          <span className="gradient-text">{t.rules.titleHighlight}</span>
        </h2>

        <p className="reveal" style={{ color: "rgba(255,255,255,0.55)", fontSize: 18, marginBottom: 48, ...({ "--reveal-delay": "120ms" } as React.CSSProperties) }}>{t.rules.sub}</p>

        {/* Video frame — large, with lime border accent */}
        <div className="reveal" style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(132,204,22,0.25)",
          boxShadow: "0 0 60px rgba(132,204,22,0.15), 0 30px 80px rgba(0,0,0,0.5)",
          background: "#000", aspectRatio: "16 / 9",
          ...({ "--reveal-delay": "180ms" } as React.CSSProperties),
        }}>
          <iframe
            key={lang}
            src={`https://www.youtube.com/embed/${lang === "fr" ? "DB-3cgM8Nq4" : "9Q1YW1LgouE"}?rel=0&modestbranding=1&color=white`}
            title={lang === "fr" ? "Règles PurInstinct" : "PurInstinct Rules"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </section>
  );
}
