"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "@/lib/i18n";

const LIME = "#84cc16";
const RED = "#ef4444";
const AUTOPLAY_MS = 7000;

interface Step { n: string; tag: string; title: string; desc: string; hint: string; badge: string; }

/* ───────────────────────── Field scaffold (shared) ───────────────────────── */
function Field({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 440 280" width="100%" style={{ display: "block" }} role="img">
      {/* pitch */}
      <rect x="8" y="8" width="424" height="264" rx="16" fill="#0a1410" stroke="rgba(132,204,22,0.18)" strokeWidth="1.5" />
      {/* yard lines */}
      {[115, 220, 325].map((x) => (
        <line key={x} x1={x} y1="16" x2={x} y2="264" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="3 7" />
      ))}
      {/* centre circle */}
      <circle cx="220" cy="140" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      {/* end zone (right) */}
      <rect x="372" y="8" width="60" height="264" rx="0" fill="rgba(132,204,22,0.08)" />
      <line x1="372" y1="8" x2="372" y2="272" stroke={LIME} strokeOpacity="0.5" strokeWidth="2" />
      <text x="402" y="140" fill={LIME} fillOpacity="0.45" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.3em" textAnchor="middle" transform="rotate(90 402 140)">ZONE</text>
      {children}
    </svg>
  );
}

function Pawn({ x, y, fill, label, cls }: { x: number; y: number; fill: string; label: string; cls?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <g className={cls}>
        <circle r="15" fill={fill} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <text y="5.5" textAnchor="middle" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="15">{label}</text>
      </g>
    </g>
  );
}

function Ball({ x, y, cls }: { x: number; y: number; cls?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <g className={cls}>
        <circle r="9" fill="#eaffd1" stroke={LIME} strokeWidth="2.5" />
        <circle r="2.6" fill={LIME} />
      </g>
    </g>
  );
}

function Check({ x, y, text, color, cls }: { x: number; y: number; text: string; color: string; cls: string }) {
  return (
    <g className={cls} transform={`translate(${x},${y})`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x="-52" y="-19" width="104" height="38" rx="19" fill={color} />
      <text textAnchor="middle" y="6" fill="#06070f" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.04em">{text}</text>
    </g>
  );
}

/* ───────────────────────── Scenes ───────────────────────── */
function SceneScore({ badge }: { badge: string }) {
  return (
    <Field>
      {/* defenders get beaten */}
      <Pawn x={252} y={108} fill={RED} label="D" cls="cr-s1-d1" />
      <Pawn x={252} y={188} fill={RED} label="D" cls="cr-s1-d2" />
      {/* offense */}
      <Pawn x={72} y={200} fill={LIME} label="2" cls="cr-s1-o2" />
      <Pawn x={155} y={140} fill={LIME} label="3" cls="cr-s1-o3" />
      <Pawn x={72} y={95} fill={LIME} label="1" cls="cr-s1-o1" />
      {/* ball starts at O1's shoulder */}
      <Ball x={91} y={86} cls="cr-s1-ball" />
      <Check x={340} y={150} text={badge} color={LIME} cls="cr-s1-badge" />
    </Field>
  );
}

function SceneTag({ badge }: { badge: string }) {
  return (
    <Field>
      {/* reach arc that whiffs */}
      <path className="cr-s2-reach" d="M300 110 Q250 150 235 175" fill="none" stroke={RED} strokeWidth="3" strokeDasharray="5 6" strokeLinecap="round" />
      {/* defender lunging */}
      <Pawn x={300} y={95} fill={RED} label="D" cls="cr-s2-def" />
      {/* ghost where carrier WOULD be tagged */}
      <g className="cr-s2-ghost" transform="translate(250,140)">
        <circle r="15" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="3 4" />
        <line x1="-7" y1="-7" x2="7" y2="7" stroke={RED} strokeWidth="2.5" />
        <line x1="7" y1="-7" x2="-7" y2="7" stroke={RED} strokeWidth="2.5" />
      </g>
      {/* carrier jukes */}
      <g className="cr-s2-car">
        <Pawn x={130} y={140} fill={LIME} label="1" />
        <Ball x={148} y={132} />
      </g>
      <Check x={300} y={228} text={badge} color={LIME} cls="cr-s2-badge" />
    </Field>
  );
}

function SceneHold({ badge }: { badge: string }) {
  return (
    <Field>
      {/* consequence: dropped ball + OUT (faded) */}
      <g className="cr-s3-drop" transform="translate(120,150)">
        <circle r="9" fill="#eaffd1" fillOpacity="0.5" stroke={RED} strokeWidth="2" />
        <g transform="translate(0,-30)">
          <line x1="-6" y1="-6" x2="6" y2="6" stroke={RED} strokeWidth="2.5" />
          <line x1="6" y1="-6" x2="-6" y2="6" stroke={RED} strokeWidth="2.5" />
        </g>
        <text y="34" textAnchor="middle" fill={RED} fillOpacity="0.8" fontFamily="var(--font-barlow), sans-serif" fontWeight="900" fontSize="13" letterSpacing="0.1em">OUT</text>
      </g>
      {/* hands cupping the ball */}
      <g transform="translate(290,150)">
        <path d="M-34 28 Q-30 2 -8 4 L-8 24 Z" fill="#1a2820" stroke="rgba(132,204,22,0.4)" strokeWidth="2" />
        <path d="M34 28 Q30 2 8 4 L8 24 Z" fill="#1a2820" stroke="rgba(132,204,22,0.4)" strokeWidth="2" />
        {/* secure lock ring */}
        <circle className="cr-s3-lock" r="22" fill="none" stroke={LIME} strokeWidth="2.5" strokeDasharray="4 5" />
        <g className="cr-s3-ball">
          <circle r="13" fill="#eaffd1" stroke={LIME} strokeWidth="3" />
          <circle r="4" fill={LIME} />
        </g>
      </g>
      <Check x={290} y={228} text={badge} color={LIME} cls="cr-s3-badge" />
    </Field>
  );
}

/* ───────────────────────── Main ───────────────────────── */
export default function CoreRules() {
  const { t } = useLang();
  const steps = t.play.steps as unknown as Step[];
  const [line1, line2] = t.play.title.split("\n");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const go = useCallback((i: number) => setActive(((i % steps.length) + steps.length) % steps.length), [steps.length]);

  useEffect(() => {
    if (paused || !inView) return;
    timer.current = setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [active, paused, inView, go]);

  const scenes = [
    <SceneScore key="0" badge={steps[0].badge} />,
    <SceneTag key="1" badge={steps[1].badge} />,
    <SceneHold key="2" badge={steps[2].badge} />,
  ];

  return (
    <section
      id="play"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ background: "#0b0d18", padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}
    >
      {/* ambient glow follows active accent */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 50% 55% at 70% 45%, ${LIME}14 0%, transparent 65%)`, transition: "opacity 0.6s ease" }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(40px,5vw,64px)" }}>
          <span className="section-label" style={{ display: "inline-block", marginBottom: 16 }}>{t.play.label}</span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em" }}>
            {line1}<br /><span className="gradient-text">{line2}</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, marginTop: 18 }}>{t.play.sub}</p>
        </div>

        {/* interactive layout */}
        <div className="cr-grid">
          {/* ── Stage ── */}
          <div className="cr-stage" style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#0c0d17", border: `1px solid ${LIME}22`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)" }}>
            {/* corner brackets */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={`${v}${h}`} aria-hidden style={{ position: "absolute", [v]: 14, [h]: 14, width: 18, height: 18, [`border${v[0].toUpperCase()+v.slice(1)}`]: `1.5px solid ${LIME}66`, [`border${h[0].toUpperCase()+h.slice(1)}`]: `1.5px solid ${LIME}66`, zIndex: 3, pointerEvents: "none" } as React.CSSProperties} />
            ))}
            {/* live tag */}
            <div style={{ position: "absolute", top: 16, left: 18, zIndex: 4, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span className="cr-live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: RED }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{t.play.live}</span>
            </div>
            {/* frame counter */}
            <div style={{ position: "absolute", top: 16, right: 18, zIndex: 4, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: `${LIME}90` }}>
              RULE {steps[active].n}/03
            </div>
            <div style={{ padding: "clamp(40px,5vw,56px) clamp(20px,3vw,32px) clamp(24px,3vw,32px)" }}>
              {/* key forces animation restart on rule change */}
              <div key={active} className="cr-scene">{scenes[active]}</div>
            </div>
          </div>

          {/* ── Steps ── */}
          <div className="cr-steps">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-pressed={on}
                  className="cr-step"
                  style={{
                    position: "relative", textAlign: "left", width: "100%", cursor: "pointer",
                    background: on ? "#11131f" : "transparent",
                    border: `1px solid ${on ? `${LIME}3a` : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 16, padding: "18px 20px", overflow: "hidden",
                    transition: "background 0.4s ease, border-color 0.4s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                    transform: on ? "translateX(6px)" : "translateX(0)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 17, background: on ? LIME : "rgba(255,255,255,0.06)", color: on ? "#06070f" : "rgba(255,255,255,0.5)", transition: "background 0.4s ease, color 0.4s ease" }}>{s.n}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: on ? LIME : "rgba(255,255,255,0.4)" }}>{s.tag}</span>
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 5, padding: "1px 6px" }}>{s.hint}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: 21, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.05 }}>{s.title}</h3>
                    </div>
                  </div>
                  {/* expanding description */}
                  <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.7, paddingTop: 14, paddingLeft: 54 }}>{s.desc}</p>
                    </div>
                  </div>
                  {/* autoplay progress bar */}
                  {on && (
                    <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: "100%", background: "rgba(255,255,255,0.06)" }}>
                      <div key={`${active}-${paused}`} className={paused ? "" : "cr-progress"} style={{ height: "100%", background: LIME, width: paused ? "100%" : 0, opacity: paused ? 0.4 : 1 }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .cr-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(20px,3vw,40px); align-items: center; }
        .cr-steps { display: flex; flex-direction: column; gap: 12px; }
        .cr-step:hover { border-color: ${LIME}3a !important; }
        .cr-live-dot { animation: crBlink 1.4s ease-in-out infinite; }
        .cr-progress { animation: crProg ${AUTOPLAY_MS}ms linear forwards; }
        @keyframes crProg { from { width: 0; } to { width: 100%; } }
        @keyframes crBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }

        /* scene enter */
        .cr-scene { animation: crIn 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes crIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

        /* ── Rule 1: 3v2 → score ── */
        .cr-s1-o1 { animation: s1o1 3.8s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s1o1 { 0% { transform: translateX(0); } 26%,100% { transform: translateX(58px); } }
        /* O2 receives the pass on the bottom lane and scores */
        .cr-s1-o2 { animation: s1o2 3.8s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s1o2 { 0% { transform: translate(0,0); } 26% { transform: translate(58px,0); } 46% { transform: translate(58px,0); } 82%,100% { transform: translate(316px,5px); } }
        /* O3 stays centre as a decoy to pull the defenders in */
        .cr-s1-o3 { animation: s1o3 3.8s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s1o3 { 0% { transform: translateX(0); } 26%,100% { transform: translateX(55px); } }
        .cr-s1-ball { animation: s1ball 3.8s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s1ball { 0% { transform: translate(0,0); } 26% { transform: translate(58px,0); } 46% { transform: translate(58px,105px); } 82%,100% { transform: translate(316px,110px); } }
        /* defenders collapse onto the decoy, leaving the bottom lane open */
        .cr-s1-d1 { animation: s1d1 3.8s ease-in-out infinite; }
        @keyframes s1d1 { 0% { transform: translate(0,0); } 50% { transform: translate(-14px,28px); } 100% { transform: translate(-26px,44px); } }
        .cr-s1-d2 { animation: s1d2 3.8s ease-in-out infinite; }
        @keyframes s1d2 { 0% { transform: translate(0,0); } 50% { transform: translate(-16px,-28px); } 100% { transform: translate(-28px,-46px); } }
        .cr-s1-badge { opacity: 0; animation: s1badge 3.8s ease infinite; }
        @keyframes s1badge { 0%,72% { opacity: 0; transform: scale(0.6); } 82% { opacity: 1; transform: scale(1.12); } 90%,100% { opacity: 1; transform: scale(1); } }

        /* ── Rule 2: don't get tagged ── */
        .cr-s2-car { animation: s2car 3.6s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s2car { 0% { transform: translate(0,0); } 40% { transform: translate(118px,0); } 56% { transform: translate(150px,42px); } 100% { transform: translate(252px,42px); } }
        .cr-s2-def { animation: s2def 3.6s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s2def { 0% { transform: translate(0,0); } 46% { transform: translate(-42px,28px); } 60% { transform: translate(-46px,34px); } 100% { transform: translate(8px,8px); } }
        .cr-s2-reach { opacity: 0; }
        .cr-s2-reach { animation: s2reach 3.6s ease infinite; }
        @keyframes s2reach { 0%,38% { opacity: 0; } 48%,62% { opacity: 0.9; } 74%,100% { opacity: 0; } }
        .cr-s2-ghost { opacity: 0; animation: s2ghost 3.6s ease infinite; }
        @keyframes s2ghost { 0%,50% { opacity: 0; } 60% { opacity: 0.85; } 80%,100% { opacity: 0; } }
        .cr-s2-badge { opacity: 0; animation: s2badge 3.6s ease infinite; }
        @keyframes s2badge { 0%,74% { opacity: 0; transform: scale(0.6); } 84% { opacity: 1; transform: scale(1.12); } 92%,100% { opacity: 1; transform: scale(1); } }

        /* ── Rule 3: don't drop ── */
        .cr-s3-ball { animation: s3ball 3.2s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s3ball { 0% { transform: translate(0,0) rotate(0); } 18% { transform: translate(-7px,-5px) rotate(-10deg); } 38% { transform: translate(7px,3px) rotate(8deg); } 54% { transform: translate(0,0) rotate(0); } 100% { transform: translate(0,0) rotate(0); } }
        .cr-s3-lock { opacity: 0; transform-box: fill-box; transform-origin: center; animation: s3lock 3.2s cubic-bezier(0.16,1,0.3,1) infinite; }
        @keyframes s3lock { 0%,50% { opacity: 0; transform: scale(1.6) rotate(0); } 64% { opacity: 1; transform: scale(1) rotate(40deg); } 90%,100% { opacity: 1; transform: scale(1) rotate(120deg); } }
        .cr-s3-drop { opacity: 0; animation: s3drop 3.2s ease infinite; }
        @keyframes s3drop { 0%,8% { opacity: 0; } 22% { opacity: 0.9; } 44%,100% { opacity: 0; } }
        .cr-s3-badge { opacity: 0; animation: s3badge 3.2s ease infinite; }
        @keyframes s3badge { 0%,66% { opacity: 0; transform: scale(0.6); } 78% { opacity: 1; transform: scale(1.12); } 88%,100% { opacity: 1; transform: scale(1); } }

        @media (max-width: 860px) {
          .cr-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cr-scene *, .cr-live-dot, .cr-progress { animation: none !important; }
          .cr-s1-badge, .cr-s2-badge, .cr-s3-badge, .cr-s3-lock, .cr-s2-reach { opacity: 1 !important; }
          .cr-s2-ghost, .cr-s3-drop { opacity: 0 !important; }
        }
      `}</style>
    </section>
  );
}
