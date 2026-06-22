"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

const COLORS = ["#84cc16", "#ef4444", "#38bdf8", "#f59e0b"] as const;
const DELAYS = [0, 0, 0.2, 0.2] as const;

/* viewBox 0 0 340 470 — wider field, def box near centre,
   left cone bottom-left at the teal/maroon intersection.
   Groups: 0 = on-field offense → def box, 1 = on-field defense → off box,
   2 = waiting def box → round RIGHT cone → off box,
   3 = waiting off box → round LEFT cone → def box. */
const PATHS: string[][] = [
  [
    "M150,165 C148,220 145,270 140,296",
    "M185,150 C175,215 155,272 146,300",
    "M120,185 C124,235 132,276 134,304",
  ],
  [
    "M150,330 C210,360 270,386 300,402",
    "M195,330 C240,360 285,388 308,408",
  ],
  [
    "M130,292 C205,296 272,300 294,336 C304,352 300,362 305,400",
    "M150,292 C215,298 278,302 298,338 C308,354 304,364 309,402",
    "M130,308 C205,312 272,316 296,344 C306,360 300,368 305,404",
    "M150,308 C215,314 278,318 300,346 C310,362 306,370 309,406",
  ],
  [
    "M296,400 C180,366 80,360 46,342 C40,356 56,368 88,356 C112,344 128,322 138,302",
    "M306,406 C190,372 86,364 50,346 C44,360 60,372 92,360 C116,348 132,326 142,304",
    "M300,412 C182,378 80,368 44,350 C38,364 54,376 86,364 C110,352 126,330 136,306",
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
      <circle cx={reduced ? sx : 0} cy={reduced ? sy : 0} r="6" fill={color} stroke="#06070f" strokeWidth="1.7" />
      <circle cx={reduced ? sx - 1.8 : -1.8} cy={reduced ? sy - 1.8 : -1.8} r="1.9" fill="#fff" opacity="0.55" />
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

function Box({ x, y, color, label, labelDy }: { x: number; y: number; color: string; label: string; labelDy: number }) {
  return (
    <g>
      <rect x={x - 15} y={y - 15} width="30" height="30" rx="3" fill={`${color}1a`} stroke={color} strokeWidth="1.7" strokeDasharray="3 3" />
      <text x={x} y={y + labelDy} textAnchor="middle" fill={color} fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="10.5" letterSpacing="0.12em">{label.toUpperCase()}</text>
    </g>
  );
}

export default function Transition() {
  const { t } = useLang();
  const tr = t.transition;
  const [reduced, setReduced] = useState(false);
  const [sel, setSel] = useState<number | null>(null); // null = all categories

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setReduced(m.matches);
    u();
    m.addEventListener("change", u);
    return () => m.removeEventListener("change", u);
  }, []);

  const TEAL = "#15596b";
  const MAROON = "#7e2244";
  const counts = ["3", "2", "4", "3"];

  return (
    <section id="transition" style={{ background: "#0b0d18", padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 50% at 30% 40%, rgba(56,189,248,0.10) 0%, transparent 65%)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto clamp(36px,5vw,56px)" }}>
          <span className="section-label" style={{ display: "inline-block", marginBottom: 16 }}>{tr.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em" }}>
            <span className="gradient-text">{tr.title}</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, marginTop: 18 }}>{tr.sub}</p>
        </div>

        <div className="tr-grid">
          {/* ── Field stage ── */}
          <div className="tr-field" style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#0c0d17", border: "1px solid rgba(56,189,248,0.18)", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", padding: "clamp(26px,3.5vw,38px) clamp(14px,2.5vw,24px)" }}>
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={`${v}${h}`} aria-hidden style={{ position: "absolute", [v]: 14, [h]: 14, width: 18, height: 18, [`border${v[0].toUpperCase()+v.slice(1)}`]: "1.5px solid rgba(56,189,248,0.5)", [`border${h[0].toUpperCase()+h.slice(1)}`]: "1.5px solid rgba(56,189,248,0.5)", zIndex: 3, pointerEvents: "none" } as React.CSSProperties} />
            ))}
            <div style={{ position: "absolute", top: 16, left: 18, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span className="tr-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{tr.trigger}</span>
            </div>
            <div style={{ position: "absolute", top: 16, right: 18, zIndex: 4, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(56,189,248,0.85)", textTransform: "uppercase" }}>{tr.frame}</div>

            {/* key forces SMIL restart when the selected category changes */}
            <svg key={sel ?? "all"} viewBox="0 0 340 470" width="100%" style={{ display: "block", maxHeight: "66vh" }} role="img" aria-label={tr.title}>
              {/* zones */}
              <rect x="72" y="24" width="196" height="98" fill={TEAL} />
              <rect x="72" y="122" width="196" height="226" fill={MAROON} />
              <rect x="72" y="348" width="196" height="98" fill={TEAL} />
              <line x1="72" y1="336" x2="268" y2="336" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="5 5" />
              <rect x="72" y="24" width="196" height="422" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="2.5" />

              <text x="170" y="72" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.end.toUpperCase()}</text>
              <text x="170" y="210" textAnchor="middle" fill="#fff" fillOpacity="0.85" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.play.toUpperCase()}</text>
              <text x="170" y="402" textAnchor="middle" fill="#fff" fontFamily="var(--font-barlow), sans-serif" fontWeight="800" fontSize="12" letterSpacing="0.14em">{tr.zones.start.toUpperCase()}</text>

              {/* boxes + cones */}
              <Box x={140} y={300} color={COLORS[2]} label={tr.zones.def} labelDy={26} />
              <Box x={305} y={405} color={COLORS[1]} label={tr.zones.off} labelDy={28} />
              <Cone x={288} y={348} />
              <Cone x={52} y={348} />

              {/* faint route guides (filtered) */}
              {!reduced && PATHS.map((grp, gi) =>
                (sel === null || sel === gi) && grp.map((p, pi) => (
                  <path key={`g${gi}-${pi}`} d={p} fill="none" stroke={COLORS[gi]} strokeOpacity={sel === gi ? 0.4 : 0.16} strokeWidth="1.3" strokeDasharray="2 5" strokeLinecap="round" />
                ))
              )}

              {/* players (filtered) */}
              {PATHS.map((grp, gi) =>
                (sel === null || sel === gi) && grp.map((p, pi) => (
                  <Player key={`p${gi}-${pi}`} path={p} color={COLORS[gi]} delay={DELAYS[gi]} reduced={reduced} />
                ))
              )}
            </svg>
          </div>

          {/* ── Legend / clickable tabs ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => setSel(null)}
                style={{ cursor: "pointer", fontFamily: "var(--font-barlow), sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "7px 16px", borderRadius: 999, border: `1px solid ${sel === null ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)"}`, background: sel === null ? "rgba(255,255,255,0.1)" : "transparent", color: sel === null ? "#fff" : "rgba(255,255,255,0.55)", transition: "all 0.2s ease" }}
              >
                {tr.all}
              </button>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{tr.hint}</span>
            </div>

            <ol className="tr-legend">
              {tr.legend.map((row, i) => {
                const on = sel === i;
                const dim = sel !== null && !on;
                return (
                  <li key={i}>
                    <button
                      onClick={() => setSel(on ? null : i)}
                      aria-pressed={on}
                      className="tr-tab"
                      style={{
                        width: "100%", textAlign: "left", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start",
                        padding: "14px 16px", borderRadius: 14,
                        background: on ? `${COLORS[i]}14` : "#11131f",
                        border: `1px solid ${on ? COLORS[i] : `${COLORS[i]}26`}`,
                        opacity: dim ? 0.45 : 1,
                        transform: on ? "translateX(5px)" : "translateX(0)",
                        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", background: `${COLORS[i]}1f`, border: `1px solid ${COLORS[i]}` }}>
                        <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 15, color: COLORS[i] }}>{counts[i]}</span>
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}` }} />
                          <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.02em", color: "#fff" }}>{row.title}</h3>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, lineHeight: 1.6, marginTop: 5 }}>{row.desc}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <style>{`
        .tr-grid { display: grid; grid-template-columns: minmax(0,380px) 1fr; gap: clamp(24px,4vw,56px); align-items: center; }
        .tr-legend { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .tr-tab:hover { border-color: ${"rgba(255,255,255,0.4)"} !important; }
        .tr-pulse { animation: trPulse 1.4s ease-in-out infinite; }
        @keyframes trPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @media (max-width: 820px) {
          .tr-grid { grid-template-columns: 1fr; }
          .tr-field { max-width: 380px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
