"use client";
import { useLang } from "@/lib/i18n";

export default function ForWhom() {
  const { t } = useLang();

  return (
    <section id="forwhom" style={{ padding: "100px 24px", background: "#0d1117" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>
            {t.forwhom.label}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.0,
              textTransform: "uppercase",
              color: "#fff",
              whiteSpace: "pre-line",
              marginBottom: 16,
            }}
          >
            {t.forwhom.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            {t.forwhom.sub}
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {t.forwhom.cards.map((card, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: "#13161f",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 40 }}>{card.icon}</span>

              <h3
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#fff",
                }}
              >
                {card.title}
              </h3>

              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65, fontSize: 15, flex: 1 }}>
                {card.body}
              </p>

              <a
                href="https://purinstinct.com/contact-us-2/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#84cc16",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  marginTop: 4,
                  transition: "gap 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "10px")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "6px")}
              >
                {card.cta}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
