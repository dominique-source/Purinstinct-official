"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

export const translations = {
  fr: {
    nav: {
      learn: "Apprendre",
      shop: "Boutique",
      contact: "Contact",
      games: "PurInstinct Games",
      comingSoon: "Bientôt",
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
      sub: "Un match qui met à l'épreuve chaque qualité athlétique.",
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
    moves: {
      label: "Gestes essentiels",
      title: "3 gestes.\nÀ maîtriser.",
      items: [
        { frame: "01/03", tag: "Fondamentaux", title: "Courir", sub: "La base de tout. Traverse le terrain, évite les défenseurs et garde le ballon en main." },
        { frame: "02/03", tag: "Technique", title: "Passe latérale", sub: "Décale le jeu. La passe latérale crée des espaces et déstabilise la défense instantanément." },
        { frame: "03/03", tag: "Maîtrise", title: "Redirection", sub: "Le geste d'élite. Change la trajectoire du ballon en une fraction de seconde." },
      ],
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
          desc: "2×6 joueurs · 3 contre 2",
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
    levels: {
      label: "Progression de jeu",
      title: "Un sport.\n6 niveaux de difficulté",
      sub: "Commence à ton niveau. Maîtrise les règles une à une, jusqu'au jeu complet.",
      prev: "Niveau précédent",
      next: "Niveau suivant",
      items: [
        { num: "01", name: "Débutant", stars: 1, tag: "Toutes les passes autorisées", body: "Apprends les bases du jeu et marque des points. Toutes les passes sont permises — concentre-toi sur le mouvement, la coordination et le timing." },
        { num: "02", name: "Explorateur", stars: 2, tag: "Passe finale interdite", body: "Découvre toutes les façons de marquer des points sans passe finale. Course, punch, kick, redirection — à toi de créer le jeu." },
        { num: "03", name: "Stratège", stars: 3, tag: "Passes avant derrière la ligne centrale seulement", body: "Les passes vers l'avant sont autorisées uniquement derrière la ligne centrale. La lecture du terrain et le positionnement deviennent essentiels." },
        { num: "04", name: "Tacticien", stars: 4, tag: "Aucune passe avant dans l'aire de jeu", body: "Seuls les punches, coups de pied et redirections font avancer le ballon. Chaque décision compte — la stratégie collective prime." },
        { num: "05", name: "Discipliné", stars: 5, tag: "Poke interdit vers joueur en zone des buts", body: "Aucun poke vers un joueur déjà dans la zone des buts. La précision, l'anticipation et le timing deviennent les armes décisives." },
        { num: "06", name: "Maître", stars: 6, tag: "Règles complètes PurInstinct", body: "Le jeu dans sa forme ultime. Instinct pur, anticipation maximale, timing parfait. Six niveaux franchis — bienvenue à l'élite." },
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
      label: "Le guide de jeu",
      title: "Prêt à jouer ?",
      sub: "Remplis le formulaire et reçois le guide de jeu officiel gratuitement.",
      placeholderName: "Ton nom",
      placeholderOrg: "École ou organisation (facultatif)",
      placeholder: "Ton adresse courriel",
      btn: "Recevoir le guide",
      success: "Téléchargement lancé !",
      retry: "Le téléchargement n'a pas démarré ? Clique ici.",
      disclaimer: "Gratuit · PDF · On t'informera des prochains événements.",
    },
    contact: {
      label: "Contact",
      title: "Parlons-en",
      sub: "Une question, un projet d'événement ou de clinique ? Écris-nous, on répond vite.",
      city: "Québec, Canada",
      phoneLabel: "Téléphone",
      phone: "418-265-2149",
      emailLabel: "Courriel",
      email: "dominique@purinstinct.com",
      formName: "Ton nom",
      formEmail: "Ton courriel",
      formMessage: "Ton message",
      formBtn: "Envoyer le message",
      formSent: "Message envoyé ! On te répond bientôt.",
    },
    footer: {
      tagline: "Le sport à l'état pur.",
      links: [
        { label: "Apprendre", href: "#how" },
        { label: "Le guide", href: "#cta" },
        { label: "Contact", href: "#contact" },
      ],
      copy: `© ${new Date().getFullYear()} PurInstinct. Tous droits réservés.`,
    },
  },
  en: {
    nav: {
      learn: "Learn",
      shop: "Shop",
      contact: "Contact",
      games: "PurInstinct Games",
      comingSoon: "Soon",
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
      sub: "A match that tests every athletic quality.",
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
    moves: {
      label: "Essential moves",
      title: "3 moves.\nMaster them.",
      items: [
        { frame: "01/03", tag: "Fundamentals", title: "Running", sub: "The foundation of everything. Cross the field, avoid defenders, keep the ball in hand." },
        { frame: "02/03", tag: "Technique", title: "Lateral pass", sub: "Shift the play. The lateral pass creates space and unsettles the defense in an instant." },
        { frame: "03/03", tag: "Mastery", title: "Redirection", sub: "The elite move. Change the ball's trajectory in a fraction of a second." },
      ],
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
          desc: "2×6 players · 3 vs 2",
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
    levels: {
      label: "Game Progression",
      title: "One sport.\n6 levels of difficulty",
      sub: "Start at your level. Master the rules one by one, all the way to the full game.",
      prev: "Previous level",
      next: "Next level",
      items: [
        { num: "01", name: "Beginner", stars: 1, tag: "All passes allowed", body: "Learn the basics and score points. All passes are permitted — focus on movement, coordination and timing." },
        { num: "02", name: "Explorer", stars: 2, tag: "No final pass", body: "Discover every way to score without a final pass. Run, punch, kick, redirect — create the play your way." },
        { num: "03", name: "Strategist", stars: 3, tag: "Forward pass behind centre line only", body: "Forward passes are allowed only behind the centre line. Reading the field and positioning become essential." },
        { num: "04", name: "Tactician", stars: 4, tag: "No forward pass in the playing area", body: "Only punches, kicks and redirections can advance the ball. Every decision matters — collective strategy takes over." },
        { num: "05", name: "Disciplined", stars: 5, tag: "No poke to player in the scoring zone", body: "No poke toward a player already in the scoring zone. Precision, anticipation and timing become the decisive weapons." },
        { num: "06", name: "Master", stars: 6, tag: "Full PurInstinct rules", body: "The game in its ultimate form. Pure instinct, maximum anticipation, perfect timing. Six levels cleared — welcome to the elite." },
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
      label: "The game guide",
      title: "Ready to play?",
      sub: "Fill out the form and get the official game guide for free.",
      placeholderName: "Your name",
      placeholderOrg: "School or organization (optional)",
      placeholder: "Your email address",
      btn: "Get the guide",
      success: "Download started!",
      retry: "Download didn't start? Click here.",
      disclaimer: "Free · PDF · We'll keep you posted on upcoming events.",
    },
    contact: {
      label: "Contact",
      title: "Let's talk",
      sub: "A question, an event or a clinic in mind? Write to us, we reply fast.",
      city: "Québec, Canada",
      phoneLabel: "Phone",
      phone: "418-265-2149",
      emailLabel: "Email",
      email: "dominique@purinstinct.com",
      formName: "Your name",
      formEmail: "Your email",
      formMessage: "Your message",
      formBtn: "Send message",
      formSent: "Message sent! We'll get back to you soon.",
    },
    footer: {
      tagline: "Sport at its purest.",
      links: [
        { label: "Learn", href: "#how" },
        { label: "The guide", href: "#cta" },
        { label: "Contact", href: "#contact" },
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
