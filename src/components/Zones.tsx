"use client";
import { useLang } from "@/lib/i18n";

export default function Zones() {
  const { t } = useLang();

  return (
    <section id="zones" style={{ padding: "100px 24px", background: "#06070f" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 16 }}>
            {t.zones.label}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24, justifyContent: "space-between" }}>
            <h2
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(36px, 5.5vw, 64px)",
                lineHeight: 1.0,
                textTransform: "uppercase",
                color: "#fff",
                whiteSpace: "pre-line",
              }}
            >
              {t.zones.title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 360, lineHeight: 1.6 }}>
              {t.zones.sub}
            </p>
          </div>
        </div>

        {/* Zone grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: 16,
          }}
        >
          {t.zones.items.map((zone, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                background: "#0d1117",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "28px 28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Icon + tag */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 32 }}>{zone.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: zone.color,
                    background: `${zone.color}18`,
                    border: `1px solid ${zone.color}30`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontFamily: "var(--font-barlow), sans-serif",
                  }}
                >
                  {zone.tag}
                </span>
              </div>

              {/* Name */}
              <h3
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#fff",
                }}
              >
                {zone.name}
              </h3>

              {/* Desc */}
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.55 }}>
                {zone.desc}
              </p>

              {/* Points */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.8 3.6 4 .58-2.9 2.82.69 3.99L7 10.1l-3.58 1.9.69-4L1.2 5.18l4-.58L7 1z" fill={zone.color} />
                </svg>
                <span style={{ fontSize: 13, color: zone.color, fontWeight: 600 }}>{zone.pts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
