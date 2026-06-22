"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

const COLORS = ["#84cc16", "#ef4444", "#38bdf8", "#f59e0b"] as const;
const DELAYS = [0, 0, 0.2, 0.2] as const;

/* Each player's full route in SVG user space (viewBox 0 0 300 560).
   Groups: 0 = on-field offense → def box, 1 = on-field defense → off box,
   2 = waiting def box → round right cone → off box,
   3 = waiting off box → round left cone → def box. */
const PATHS: string[][] = [
  [
    "M132,200 C95,280 70,360 66,414",
    "M168,176 C120,270 78,360 70,410",
    "M198,210 C150,300 80,380 62,420",
  ],
  [
    "M138,415 C190,450 235,470 252,496",
    "M186,418 C215,455 245,478 256,502",
  ],
  [
    "M56,408 C150,345 255,300 270,350 C278,395 260,455 256,492",
    "M70,408 C160,350 255,308 272,352 C282,400 262,460 258,496",
    "M56,424 C150,365 250,320 268,356 C276,402 256,462 252,494",
    "M70,424 C165,370 252,322 274,358 C284,405 264,464 254,498",
  ],
  [
    "M250,492 C150,430 72,300 52,250 C44,300 58,372 64,412",
    "M258,496 C160,440 78,305 56,248 C46,298 62,368 70,410",
    "M254,506 C155,450 70,310 50,254 C40,305 56,378 60,420",
  ],
];

function start(path: string): [number, number] {
  const m = path.match(/^M\s*([\d.]+)[ ,]([\d.]+)/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : [0, 0];
}

function Player({ path, color, delay, reduced }: { path: string; color: string; delay: number; reduced: boolean }) {
  const [sx, sy] = start(path);
  return (
    <g opacity={reduced ? 1 : 0}>
      <circle cx={reduced ? sx : 0} cy={reduced ? sy : 0} r="5.6" fill={color} stroke="#06070f" strokeWidth="1.6" />
      <circle cx={reduced ? sx - 1.6 : -1.6} cy={reduced ? sy - 1.6 : -1.6} r="1.7" fill="#fff" opacity="0.55" />
      {!reduced && (
        <>
          <animateMotion dur="5s" begin={`${delay}s`} repeatCount="indefinite" path={path}
            keyPoints="0;1;1" keyTimes="0;0.78;1" calcMode="spline" keySplines="0.45 0 0.55 1;0 0 1 1" />
          <animate attributeName="opacity" dur="5s" begin={`${delay}s`} repeatCount="indefinite"
            values="0;1;1;0;0" keyTimes="0;0.06;0.72;0.88;1" />
        </>
      )}
    </g>
  );
}

function Cone({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 7} rx="7" ry="2.4" fill="rgba(0,0,0,0.45)" />
      <path d={`M${x - 6},${y + 7} L${x},${y - 9} L${x + 6},${y + 7} Z`} fill="#f59e0b" />
      <rect x={x - 3.4} y={y - 1.5} width="6.8" height="2.6" rx="1" fill="#fff" opacity="0.85" />
    </g>
  );
}

function Box({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 14} width="28" height="28" rx="3" fill={`${color}14`} stroke={color} strokeWidth="1.6" strokeDasharray="3 3" />
      <text x={x} y={y + 28} textAnchor="middle" fill={color} fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.12em">{label.toUpperCase()}</text>
    </g>
  );
}

export default function Transition() {
  const { t } = useLang();
  const tr = t.transition;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setReduced(m.matches);
    u();
    m.addEventListener("change", u);
    return () => m.removeEventListener("change", u);
  }, []);

  const TEAL = "#15596b";
  const MAROON = "#7e2244";

  return (
    <section id="transition" style={{ background: "#0b0d18", padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 50% at 30% 40%, rgba(56,189,248,0.10) 0%, transparent 65%)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto clamp(40px,5vw,60px)" }}>
          <span className="section-label" style={{ display: "inline-block", marginBottom: 16 }}>{tr.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em" }}>
            <span className="gradient-text">{tr.title}</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, marginTop: 18 }}>{tr.sub}</p>
        </div>

        <div className="tr-grid">
          {/* ── Field stage ── */}
          <div className="tr-field" style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#0c0d17", border: "1px solid rgba(56,189,248,0.18)", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", padding: "clamp(28px,4vw,40px) clamp(16px,3vw,28px)" }}>
            {/* corner brackets */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={`${v}${h}`} aria-hidden style={{ position: "absolute", [v]: 14, [h]: 14, width: 18, height: 18, [`border${v[0].toUpperCase()+v.slice(1)}`]: "1.5px solid rgba(56,189,248,0.5)", [`border${h[0].toUpperCase()+h.slice(1)}`]: "1.5px solid rgba(56,189,248,0.5)", zIndex: 3, pointerEvents: "none" } as React.CSSProperties} />
            ))}
            {/* trigger badge */}
            <div style={{ position: "absolute", top: 16, left: 18, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span className="tr-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{tr.trigger}</span>
            </div>
            <div style={{ position: "absolute", top: 16, right: 18, zIndex: 4, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(56,189,248,0.85)", textTransform: "uppercase" }}>{tr.frame}</div>

            <svg viewBox="0 0 300 560" width="100%" style={{ display: "block", maxHeight: "70vh" }} role="img" aria-label={tr.title}>
              {/* zones */}
              <rect x="85" y="24" width="150" height="94" fill={TEAL} />
              <rect x="85" y="118" width="150" height="344" fill={MAROON} />
              <rect x="85" y="462" width="150" height="74" fill={TEAL} />
              {/* defensive start line */}
              <line x1="85" y1="450" x2="235" y2="450" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="5 5" />
              {/* field border */}
              <rect x="85" y="24" width="150" height="512" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="2.5" />

              {/* zone labels */}
              <text x="160" y="75" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.end.toUpperCase()}</text>
              <text x="160" y="288" textAnchor="middle" fill="#fff" fillOpacity="0.85" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.play.toUpperCase()}</text>
              <text x="160" y="504" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.start.toUpperCase()}</text>

              {/* boxes + cones */}
              <Box x={60} y={415} color={COLORS[2]} label={tr.zones.def} />
              <Box x={258} y={498} color={COLORS[1]} label={tr.zones.off} />
              <Cone x={262} y={352} />
              <Cone x={56} y={251} />

              {/* faint route guides */}
              {!reduced && PATHS.map((grp, gi) =>
                grp.map((p, pi) => (
                  <path key={`g${gi}-${pi}`} d={p} fill="none" stroke={COLORS[gi]} strokeOpacity="0.16" strokeWidth="1.3" strokeDasharray="2 5" strokeLinecap="round" />
                ))
              )}

              {/* players */}
              {PATHS.map((grp, gi) =>
                grp.map((p, pi) => (
                  <Player key={`p${gi}-${pi}`} path={p} color={COLORS[gi]} delay={DELAYS[gi]} reduced={reduced} />
                ))
              )}
            </svg>
          </div>

          {/* ── Legend ── */}
          <ol className="tr-legend">
            {tr.legend.map((row, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, background: "#11131f", border: `1px solid ${COLORS[i]}26` }}>
                <span style={{ flexShrink: 0, position: "relative", width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", background: `${COLORS[i]}1f`, border: `1px solid ${COLORS[i]}` }}>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 15, color: COLORS[i] }}>{row.count}</span>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}` }} />
                    <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.02em", color: "#fff" }}>{row.title}</h3>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.6, marginTop: 5 }}>{row.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        .tr-grid { display: grid; grid-template-columns: minmax(0,360px) 1fr; gap: clamp(24px,4vw,56px); align-items: center; }
        .tr-legend { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .tr-pulse { animation: trPulse 1.4s ease-in-out infinite; }
        @keyframes trPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @media (max-width: 820px) {
          .tr-grid { grid-template-columns: 1fr; }
          .tr-field { max-width: 360px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
