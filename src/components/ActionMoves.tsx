"use client";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import useScrollReveal from "@/lib/useScrollReveal";

const LIME = "#84cc16";
const ACCENTS = [LIME, "#f97316", "#a855f7", "#eab308", "#38bdf8"] as const;
const ATHLETES = [
  "/images/running no background.png",
  "/images/pass lateral no background.png",
  "/images/poke.png",
  "/images/kick.png",
  "/images/redirection no background.png",
] as const;
const IMG_SCALES = [1.35, 1.35, 1.35, 1.0, 1.0] as const;

function CornerBrackets({ color }: { color: string }) {
  const b = `1.5px solid ${color}55`;
  const sz = 18, off = 14;
  const base = { position: "absolute" as const, width: sz, height: sz, zIndex: 3, pointerEvents: "none" as const };
  return (
    <>
      <div aria-hidden="true" style={{ ...base, top: off, left: off, borderTop: b, borderLeft: b }} />
      <div aria-hidden="true" style={{ ...base, top: off, right: off, borderTop: b, borderRight: b }} />
      <div aria-hidden="true" style={{ ...base, bottom: off, left: off, borderBottom: b, borderLeft: b }} />
      <div aria-hidden="true" style={{ ...base, bottom: off, right: off, borderBottom: b, borderRight: b }} />
    </>
  );
}

interface MoveContent { frame: string; tag: string; title: string; sub: string; special?: string; }

function MoveCard({ idx, content, accent, athlete, imgScale }: {
  idx: number;
  content: MoveContent;
  accent: string;
  athlete: string;
  imgScale: number;
}) {
  const isAlt = idx % 2 === 1;
  const cardRef = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      className="reveal"
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "#0c0d17",
        border: `1px solid ${accent}22`,
        boxShadow: "0 24px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      {/* Radial accent glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 80% at ${isAlt ? "22%" : "78%"} 50%, ${accent}1a 0%, transparent 65%)`,
      }} />
      {/* Subtle scanline texture */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.012) 39px, rgba(255,255,255,0.012) 40px)",
      }} />

      <CornerBrackets color={accent} />

      {/* Cinematic frame counter */}
      <div style={{
        position: "absolute", top: 18, right: 22, zIndex: 4,
        fontFamily: "'Courier New', monospace",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
        color: `${accent}75`, textTransform: "uppercase",
      }}>
        FRAME {content.frame}
      </div>

      <div className={`amoves-grid${isAlt ? " amoves-alt" : ""}`}>

        {/* ── Text column ── */}
        <div className="amoves-text" style={{
          padding: "clamp(36px, 4vw, 60px)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", zIndex: 2,
        }}>
          {/* Ghost watermark number */}
          <div aria-hidden="true" style={{
            position: "absolute",
            bottom: -20,
            ...(isAlt ? { right: -8 } : { left: -8 }),
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(110px, 13vw, 190px)",
            lineHeight: 1,
            color: `${accent}09`,
            userSelect: "none", pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}>
            {String(idx + 1).padStart(2, "0")}
          </div>

          <div style={{ position: "relative" }}>
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: accent, boxShadow: `0 0 10px ${accent}`, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase", color: accent,
              }}>{content.tag}</span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(50px, 5.8vw, 86px)",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 22,
            }}>{content.title}</h3>

            {/* Accent rule */}
            <div style={{
              width: 38, height: 1.5,
              background: `linear-gradient(90deg, ${accent}cc, transparent)`,
              marginBottom: 18,
            }} />

            {/* Description */}
            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(14px, 1.3vw, 15.5px)",
              lineHeight: 1.78, maxWidth: 340,
            }}>{content.sub}</p>

            {/* Special power callout */}
            {content.special && (
              <div style={{
                marginTop: 18,
                marginLeft: 4,
                paddingLeft: 12,
                borderLeft: "2px solid #38bdf855",
              }}>
                <p style={{
                  color: "#38bdf8cc",
                  fontSize: "clamp(12.5px, 1.2vw, 14px)",
                  lineHeight: 1.7,
                  maxWidth: 320,
                  fontStyle: "italic",
                  letterSpacing: "0.01em",
                }}>{content.special}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Image column ── */}
        <div className="amoves-img" style={{ position: "relative", overflow: "hidden", minHeight: 280 }}>
          {/* Image fades in just after the card body */}
          <div className="reveal reveal-fade" style={{
            position: "absolute", inset: 0,
            ...({ "--reveal-delay": "160ms" } as React.CSSProperties),
          }}>
            <Image
              src={athlete}
              alt={content.title}
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center 85%",
                transform: `scale(${imgScale})`,
                transformOrigin: "center 85%",
                filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.85))",
              }}
              sizes="(max-width: 768px) 92vw, 56vw"
              priority={idx === 0}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ActionMoves() {
  const { t } = useLang();
  const headerRef = useScrollReveal();
  const moves = t.moves.items as unknown as MoveContent[];
  const [line1, line2] = t.moves.title.split("\n");

  return (
    <section
      id="moves"
      style={{
        background: "#06070f",
        padding: "clamp(36px,4vw,56px) clamp(16px, 4vw, 40px) clamp(60px, 8vw, 100px)",
        position: "relative",
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "50%", height: 1,
        background: `linear-gradient(90deg, transparent, ${LIME}45, transparent)`,
        pointerEvents: "none",
      }} />

      {/* Section header */}
      <div ref={headerRef} className="reveal" style={{
        textAlign: "center", maxWidth: 560, margin: "0 auto clamp(44px, 6vw, 68px)",
      }}>
        <span className="section-label" style={{ display: "inline-block", marginBottom: 16 }}>
          {t.moves.label}
        </span>
        <h2 style={{
          fontFamily: "var(--font-barlow), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(40px, 5.5vw, 72px)",
          lineHeight: 0.95,
          textTransform: "uppercase",
          color: "#fff",
          letterSpacing: "-0.01em",
        }}>
          {line1}<br />
          <span className="gradient-text">{line2}</span>
        </h2>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        {moves.map((mv, i) => (
          <MoveCard key={i} idx={i} content={mv} accent={ACCENTS[i]} athlete={ATHLETES[i]} imgScale={IMG_SCALES[i]} />
        ))}
      </div>

      <style>{`
        .amoves-grid {
          display: grid;
          grid-template-columns: 44% 56%;
          min-height: 420px;
          position: relative;
          z-index: 1;
        }
        .amoves-alt .amoves-text { order: 2; }
        .amoves-alt .amoves-img  { order: 1; }
        @media (max-width: 768px) {
          .amoves-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .amoves-text { order: 0 !important; }
          .amoves-img  { order: 1 !important; min-height: 220px; }
        }
      `}</style>
    </section>
  );
}
