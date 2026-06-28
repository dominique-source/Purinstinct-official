"use client";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

const CARD_PHOTOS = ["/images/coaching.jpg", "/images/gameplay-ball.jpg", "/images/championship.jpg"];
const CARD_POSITIONS = ["center 30%", "center 40%", "center 20%"];

function ServiceCard({ photo, pos, icon, title, body, cta }: { photo: string; pos: string; icon: string; title: string; body: string; cta: string; delay: number }) {
  return (
    <div
      className="service-card"
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: 460,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "default",
      }}
    >
      {/* Photo — zooms on card hover */}
      <div className="service-photo-wrap" style={{ position: "absolute", inset: 0 }}>
        <Image src={photo} alt={title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: pos }} />
      </div>

      {/* Dark overlay — lifts slightly on hover to reveal more photo */}
      <div className="service-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,7,15,0.1) 0%, rgba(6,7,15,0.55) 45%, rgba(6,7,15,0.97) 80%, #06070f 100%)" }} />

      {/* Lime accent bar bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right, #84cc16, transparent)", opacity: 0 }} className="service-bar" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "36px 32px 36px" }}>
        <span style={{ fontSize: 44, display: "block", marginBottom: 18 }}>{icon}</span>
        <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 26, textTransform: "uppercase", letterSpacing: "0.03em", color: "#fff", marginBottom: 14, lineHeight: 1.1 }}>{title}</h3>
        <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontSize: 15, marginBottom: 24 }}>{body}</p>
        <a
          href="#contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#84cc16", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
        >
          {cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function ForWhom() {
  const { t } = useLang();

  return (
    <section id="forwhom" style={{ padding: "110px 24px", background: "#0d1117" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>{t.forwhom.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.0, textTransform: "uppercase", color: "#fff", whiteSpace: "pre-line", marginBottom: 16 }}>
            {t.forwhom.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>{t.forwhom.sub}</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {t.forwhom.cards.map((card, i) => (
            <ServiceCard key={i} photo={CARD_PHOTOS[i]} pos={CARD_POSITIONS[i]} icon={card.icon} title={card.title} body={card.body} cta={card.cta} delay={i * 110} />
          ))}
        </div>
      </div>

      <style>{`
        .service-card:hover .service-photo-wrap { transform: scale(1.06); }
        .service-card:hover .service-overlay { background: linear-gradient(to bottom, rgba(6,7,15,0.0) 0%, rgba(6,7,15,0.35) 35%, rgba(6,7,15,0.92) 75%, #06070f 100%) !important; }
        .service-card:hover .service-bar { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
