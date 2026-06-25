"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

const LIME = "#84cc16";
const CYAN = "#38bdf8";
const AMBER = "#f59e0b";

const TIERS = [
  {
    key: "debutant" as const,
    color: CYAN,
    num: "01–02",
    fr: "Débutant",
    en: "Beginner",
    stars: 2,
    pts_score: 1,
    pts_bonus: 0,
    fr_desc: "Toutes les passes autorisées. Concentre-toi sur le mouvement et la coordination.",
    en_desc: "All passes allowed. Focus on movement, coordination, and timing.",
    rules_fr: ["1 point par score en zone", "Toutes les passes permises", "Aucun bonus"],
    rules_en: ["1 point per end-zone score", "All passes allowed", "No bonuses"],
  },
  {
    key: "intermediaire" as const,
    color: AMBER,
    num: "03–04",
    fr: "Intermédiaire",
    en: "Intermediate",
    stars: 4,
    pts_score: 1,
    pts_bonus: 1,
    fr_desc: "Passes avant restreintes. La stratégie collective commence à compter.",
    en_desc: "Forward passes restricted. Collective strategy starts to matter.",
    rules_fr: ["1 point par score", "+1 pt si aucune passe avant dans l'aire de jeu", "Passes latérales et arrière seulement en zone"],
    rules_en: ["1 point per score", "+1 pt if no forward pass in play area", "Lateral and backward passes only in the play area"],
  },
  {
    key: "avance" as const,
    color: LIME,
    num: "05–06",
    fr: "Avancé",
    en: "Advanced",
    stars: 6,
    pts_score: 1,
    pts_bonus: 2,
    fr_desc: "Règles complètes PurInstinct. Instinct pur, anticipation maximale, timing parfait.",
    en_desc: "Full PurInstinct rules. Pure instinct, maximum anticipation, perfect timing.",
    rules_fr: ["1 point par score", "+1 pt si aucune passe avant", "+1 pt si score en moins de 8 secondes"],
    rules_en: ["1 point per score", "+1 pt if no forward pass", "+1 pt if scored in under 8 seconds"],
  },
] as const;

type TierKey = typeof TIERS[number]["key"];

function Star({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.35l-3.52 1.85.67-3.93L2.3 5.64l3.94-.57L8 1.5z"
        fill={filled ? color : "rgba(255,255,255,0.1)"}
      />
    </svg>
  );
}

export default function PointSystem() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [active, setActive] = useState<TierKey>("debutant");
  const tier = TIERS.find(t => t.key === active)!;

  return (
    <section
      id="points"
      style={{ background: "#0c0e1a", padding: "clamp(80px,10vw,130px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 45% 50% at 30% 40%, ${tier.color}0e 0%, transparent 65%)`, transition: "background 0.5s ease" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* header */}
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto clamp(36px,5vw,56px)" }}>
          <span style={{ display: "inline-block", marginBottom: 16, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: LIME, border: `1px solid ${LIME}44`, background: `${LIME}10`, borderRadius: 999, padding: "5px 16px" }}>
            {fr ? "Progression" : "Progression"}
          </span>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(36px,5.5vw,70px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.01em", margin: "0 0 16px" }}>
            {fr ? "Système de points" : "Point system"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            {fr
              ? "Selon le niveau, les règles changent et les opportunités de bonus également."
              : "Based on the level of play, the rules change and so do the bonus opportunities."}
          </p>
        </div>

        {/* tier tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 52, flexWrap: "wrap" }}>
          {TIERS.map(t => {
            const on = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  padding: "12px 26px", borderRadius: 14, cursor: "pointer",
                  border: `1.5px solid ${on ? t.color : "rgba(255,255,255,0.09)"}`,
                  background: on ? `${t.color}18` : "#11131f",
                  transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                  transform: on ? "translateY(-3px)" : "none",
                  boxShadow: on ? `0 10px 30px ${t.color}22` : "none",
                }}
              >
                <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: on ? 900 : 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: on ? t.color : "rgba(255,255,255,0.42)", marginBottom: 6, transition: "color 0.2s" }}>
                  {fr ? t.fr : t.en}
                </div>
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Star key={i} filled={i < t.stars} color={t.color} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* tier detail */}
        <div key={active} className="pts-grid" style={{ animation: "ptsIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>

          {/* score card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ borderRadius: 20, padding: "clamp(28px,4vw,40px)", background: `${tier.color}10`, border: `1px solid ${tier.color}30`, textAlign: "center" }}>
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: tier.color }}>
                {fr ? "Niveaux" : "Levels"} {tier.num}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 88, lineHeight: 1, color: "#fff" }}>
                  {tier.pts_score}
                </span>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {fr ? "pt / score" : "pt / score"}
                </span>
              </div>
              {tier.pts_bonus > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${tier.color}14`, border: `1px solid ${tier.color}40`, borderRadius: 999, padding: "5px 16px", marginTop: 6 }}>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 14, color: tier.color }}>
                    +{tier.pts_bonus} {fr ? "pt bonus max." : "bonus pt max."}
                  </span>
                </div>
              )}
              <p style={{ margin: "18px 0 0", color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.65 }}>
                {fr ? tier.fr_desc : tier.en_desc}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Star key={i} filled={i < tier.stars} color={tier.color} />
              ))}
            </div>
          </div>

          {/* rules list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ margin: "0 0 8px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
              {fr ? "Règles de pointage" : "Scoring rules"}
            </p>
            {(fr ? tier.rules_fr : tier.rules_en).map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex", gap: 14, alignItems: "center",
                  padding: "16px 18px", borderRadius: 14,
                  background: i === 0 ? `${tier.color}0c` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? `${tier.color}30` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: "grid", placeItems: "center",
                  background: `${tier.color}18`, border: `1px solid ${tier.color}40`,
                  fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: 14, color: tier.color,
                }}>
                  {i === 0 ? "1" : `+${i}`}
                </span>
                <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontSize: 15, color: i === 0 ? "#fff" : "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px,3vw,48px); align-items: start; }
        @keyframes ptsIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (max-width: 720px) { .pts-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
