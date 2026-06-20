"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

export const translations = {
  fr: {
    nav: {
      learn: "Apprendre",
      shop: "Boutique",
      contact: "Contact",
      cta: "Commencer",
    },
    hero: {
      label: "Le mouvement",
      h1a: "PurInstinct.",
      h1b: "Le sport à l'état pur",
      sub: "Un sport révolutionnaire qui fusionne vitesse, habileté et intelligence de jeu.",
      cta1: "Apprendre à jouer",
      cta2: "Organiser un événement",
      scroll: "Découvrir le sport",
    },
    what: {
      label: "Comment ça marche",
      title: "Simple à apprendre,\nimpossible à maîtriser",
      sub: "Un match de 5 minutes qui met à l'épreuve chaque qualité athlétique.",
      steps: [
        {
          num: "01",
          title: "2 équipes de 6",
          body: "Deux équipes s'affrontent. 3 joueurs offensifs contre 2 défenseurs, en rotation constante.",
        },
        {
          num: "02",
          title: "16 secondes pour marquer",
          body: "L'équipe offensive traverse le terrain avec le ballon sans se faire toucher et sans l'échapper.",
        },
        {
          num: "03",
          title: "3 retraits = changement",
          body: "Chaque arrêt donne 1 retrait à la défense. Après 3 retraits, les équipes se swappent dynamiquement.",
        },
      ],
    },
    rules: {
      label: "Les règles",
      titleA: "Apprends le sport en",
      titleHighlight: "3 minutes",
      sub: "Une vidéo, et tu es prêt à jouer.",
    },
    zones: {
      label: "Les zones",
      title: "5 zones.\n1 arène.",
      sub: "Chaque zone teste une qualité athlétique différente. Les points s'accumulent à travers toutes les zones.",
      items: [
        {
          icon: "🏟️",
          color: "#84cc16",
          name: "PurInstinct",
          tag: "Zone principale",
          desc: "Match 5 min · 2×6 joueurs · 3 contre 2",
          pts: "Victoire +10 pts",
        },
        {
          icon: "⚡",
          color: "#f97316",
          name: "Vitesse",
          tag: "Sprint 40m",
          desc: "4 à 50 joueurs · Handicap sur 5 niveaux",
          pts: "Victoire +4 pts",
        },
        {
          icon: "✋",
          color: "#3b82f6",
          name: "Habileté Main",
          tag: "Ultimatum Ball",
          desc: "2×3 joueurs · Élimination en duel",
          pts: "Victoire +4 pts",
        },
        {
          icon: "👟",
          color: "#56A0D3",
          name: "Habileté Pied",
          tag: "Jeux de Lumières",
          desc: "1 vs 1 · Réactivité au sol",
          pts: "Victoire +4 pts",
        },
        {
          icon: "🎯",
          color: "#eab308",
          name: "Agilité",
          tag: "Ultimatum Tag",
          desc: "2×3 joueurs · Chasseur vs chassé · 7 sec",
          pts: "Victoire +4 pts",
        },
        {
          icon: "🧠",
          color: "#a855f7",
          name: "IQ de Jeu",
          tag: "3 vs 3 Chrono",
          desc: "Passes et courses · 1 min par équipe",
          pts: "Victoire +4 pts",
        },
      ],
    },
    forwhom: {
      label: "Pour qui",
      title: "Du terrain au\nchampionnat",
      sub: "PurInstinct s'adapte à tous les contextes, du primaire au championnat national.",
      cards: [
        {
          icon: "🏫",
          title: "Écoles & Clubs",
          body: "Clinique en classe clé en main. Adapté au primaire et secondaire. Le professeur reçoit une formation complète.",
          cta: "Demander une soumission",
        },
        {
          icon: "🏢",
          title: "Événements corporatifs",
          body: "Activité de team-building unique. Mobilise des groupes de 12 à 200+ personnes. Clé en main.",
          cta: "Demander une soumission",
        },
        {
          icon: "🏆",
          title: "Championnats",
          body: "Rejoignez le circuit officiel. Championnats régionaux et provinciaux à travers le Québec.",
          cta: "Voir les championnats",
        },
      ],
    },
    stats: {
      label: "PurInstinct en chiffres",
      items: [
        { value: "5 000+", label: "Joueurs actifs" },
        { value: "50+", label: "Événements organisés" },
        { value: "10", label: "Villes au Québec" },
        { value: "10 000 $", label: "Prix au championnat" },
      ],
    },
    cta: {
      label: "Rejoindre le mouvement",
      title: "Prêt à jouer ?",
      sub: "Recevez le guide de jeu gratuit et soyez informé des prochains événements près de chez vous.",
      placeholder: "Votre adresse courriel",
      btn: "Recevoir le guide gratuit",
      disclaimer: "Gratuit. Sans spam. Désabonnement en un clic.",
    },
    footer: {
      tagline: "Le sport à l'état pur.",
      links: [
        { label: "Apprendre", href: "#how" },
        { label: "Boutique", href: "https://purinstinct.com/boutique/" },
        { label: "Contact", href: "https://purinstinct.com/contact-us-2/" },
      ],
      copy: `© ${new Date().getFullYear()} PurInstinct. Tous droits réservés.`,
    },
  },
  en: {
    nav: {
      learn: "Learn",
      shop: "Shop",
      contact: "Contact",
      cta: "Get started",
    },
    hero: {
      label: "The movement",
      h1a: "PurInstinct.",
      h1b: "Sport at its purest",
      sub: "A revolutionary sport that fuses speed, skill, and game intelligence.",
      cta1: "Learn to play",
      cta2: "Host an event",
      scroll: "Discover the sport",
    },
    what: {
      label: "How it works",
      title: "Simple to learn,\nimpossible to master",
      sub: "A 5-minute match that tests every athletic quality.",
      steps: [
        {
          num: "01",
          title: "2 teams of 6",
          body: "Two teams face off. 3 offensive players vs 2 defenders, in constant rotation.",
        },
        {
          num: "02",
          title: "16 seconds to score",
          body: "The offensive team crosses the field with the ball without being tagged or dropping it.",
        },
        {
          num: "03",
          title: "3 outs = swap",
          body: "Each stop gives 1 out to the defense. After 3 outs, the teams swap dynamically.",
        },
      ],
    },
    rules: {
      label: "The rules",
      titleA: "Learn the sport in",
      titleHighlight: "3 minutes",
      sub: "One video, and you're ready to play.",
    },
    zones: {
      label: "The zones",
      title: "5 zones.\n1 arena.",
      sub: "Each zone tests a different athletic quality. Points accumulate across all zones.",
      items: [
        {
          icon: "🏟️",
          color: "#84cc16",
          name: "PurInstinct",
          tag: "Main zone",
          desc: "5 min match · 2×6 players · 3 vs 2",
          pts: "Win +10 pts",
        },
        {
          icon: "⚡",
          color: "#f97316",
          name: "Speed",
          tag: "40m Sprint",
          desc: "4 to 50 players · 5-level handicap system",
          pts: "Win +4 pts",
        },
        {
          icon: "✋",
          color: "#3b82f6",
          name: "Hand Skill",
          tag: "Ultimatum Ball",
          desc: "2×3 players · Elimination duels",
          pts: "Win +4 pts",
        },
        {
          icon: "👟",
          color: "#56A0D3",
          name: "Foot Skill",
          tag: "Light Games",
          desc: "1 vs 1 · Floor light reactivity",
          pts: "Win +4 pts",
        },
        {
          icon: "🎯",
          color: "#eab308",
          name: "Agility",
          tag: "Ultimatum Tag",
          desc: "2×3 players · Chaser vs chased · 7 sec",
          pts: "Win +4 pts",
        },
        {
          icon: "🧠",
          color: "#a855f7",
          name: "Game IQ",
          tag: "3 vs 3 Timer",
          desc: "Passes & runs · 1 min per team",
          pts: "Win +4 pts",
        },
      ],
    },
    forwhom: {
      label: "Who it's for",
      title: "From the field to\nthe championship",
      sub: "PurInstinct adapts to any context, from elementary schools to national championships.",
      cards: [
        {
          icon: "🏫",
          title: "Schools & Clubs",
          body: "Turnkey in-class clinic. Designed for elementary and high school. Teachers receive full training.",
          cta: "Request a quote",
        },
        {
          icon: "🏢",
          title: "Corporate events",
          body: "Unique team-building activity. Engages groups of 12 to 200+ people. Fully managed.",
          cta: "Request a quote",
        },
        {
          icon: "🏆",
          title: "Championships",
          body: "Join the official circuit. Regional and provincial championships across Québec.",
          cta: "View championships",
        },
      ],
    },
    stats: {
      label: "PurInstinct in numbers",
      items: [
        { value: "5,000+", label: "Active players" },
        { value: "50+", label: "Events organized" },
        { value: "10", label: "Cities in Québec" },
        { value: "$10,000", label: "Championship prize" },
      ],
    },
    cta: {
      label: "Join the movement",
      title: "Ready to play?",
      sub: "Get the free game guide and be notified about upcoming events near you.",
      placeholder: "Your email address",
      btn: "Get the free guide",
      disclaimer: "Free. No spam. Unsubscribe anytime.",
    },
    footer: {
      tagline: "Sport at its purest.",
      links: [
        { label: "Learn", href: "#how" },
        { label: "Shop", href: "https://purinstinct.com/boutique/" },
        { label: "Contact", href: "https://purinstinct.com/contact-us-2/" },
      ],
      copy: `© ${new Date().getFullYear()} PurInstinct. All rights reserved.`,
    },
  },
} as const;

type TranslationShape = (typeof translations)[Lang];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationShape;
}

const LangContext = createContext<LangCtx>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr as TranslationShape,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as TranslationShape }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
