"use client";
import { useLang } from "@/lib/i18n";

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section id="how" style={{ padding: "100px 24px", background: "#0d1117" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>
            {t.what.label}
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
            {t.what.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
            {t.what.sub}
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {t.what.steps.map((step, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: "#13161f",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "36px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Step number watermark */}
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  right: 20,
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 900,
                  fontSize: 96,
                  color: "rgba(132,204,22,0.05)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {step.num}
              </span>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(132,204,22,0.12)",
                  border: "1px solid rgba(132,204,22,0.2)",
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 900,
                    fontSize: 15,
                    color: "#84cc16",
                  }}
                >
                  {step.num}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65, fontSize: 15 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Video placeholder */}
        <div
          style={{
            marginTop: 56,
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "#13161f",
            aspectRatio: "16 / 7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => window.open("https://www.youtube.com/@PurInstinct", "_blank")}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(132,204,22,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(132,204,22,0.15)",
              border: "1px solid rgba(132,204,22,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s, background 0.2s",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M10 8l12 6-12 6V8z" fill="#84cc16" />
            </svg>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              fontFamily: "var(--font-barlow), sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Voir PurInstinct en action · YouTube
          </span>
        </div>
      </div>
    </section>
  );
}
