"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const STEP_PHOTOS = ["/images/sprint.jpg", "/images/gameplay-hold.jpg", "/images/gameplay-tag.jpg"];
const STEP_POSITIONS = ["center 20%", "center 40%", "center 30%"];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function StepCard({ photo, pos, num, title, body, delay }: { photo: string; pos: string; num: string; title: string; body: string; delay: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: 0,
        transform: "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        cursor: "default",
        minHeight: 340,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Photo */}
      <div
        style={{ position: "absolute", inset: 0, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        className="step-photo-wrap"
      >
        <Image src={photo} alt={title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: pos }} />
      </div>
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,7,15,0.15) 0%, rgba(6,7,15,0.92) 65%, #06070f 100%)" }} />
      {/* Step number watermark */}
      <span style={{
        position: "absolute", top: 16, right: 20,
        fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 100,
        color: "rgba(132,204,22,0.08)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>{num}</span>
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 32px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 9, marginBottom: 16,
          background: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.3)",
        }}>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 14, color: "#84cc16" }}>{num}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.03em", color: "#fff", marginBottom: 10 }}>{title}</h3>
        <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontSize: 14 }}>{body}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useLang();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how" style={{ padding: "110px 24px", background: "#0d1117" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{ textAlign: "center", marginBottom: 64, opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>{t.what.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.0, textTransform: "uppercase", color: "#fff", whiteSpace: "pre-line", marginBottom: 16 }}>
            {t.what.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 460, margin: "0 auto" }}>{t.what.sub}</p>
        </div>

        {/* Step cards with photos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {t.what.steps.map((step, i) => (
            <StepCard key={i} photo={STEP_PHOTOS[i]} pos={STEP_POSITIONS[i]} num={step.num} title={step.title} body={step.body} delay={i * 120} />
          ))}
        </div>

        {/* YouTube CTA */}
        <div
          onClick={() => window.open("https://www.youtube.com/@PurInstinct", "_blank")}
          style={{
            marginTop: 48, borderRadius: 16, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)", background: "#13161f",
            padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 20, cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(132,204,22,0.3)"; (e.currentTarget as HTMLElement).style.background = "#15191f"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "#13161f"; }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 20, textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff", marginBottom: 4 }}>
              Voir PurInstinct en action
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>YouTube · @PurInstinct</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(132,204,22,0.12)", border: "1px solid rgba(132,204,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 6l9 5-9 5V6z" fill="#84cc16" /></svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`.step-photo-wrap:hover { transform: scale(1.04); }`}</style>
    </section>
  );
}
