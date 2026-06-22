import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import RulesVideo from "@/components/RulesVideo";
import CoreRules from "@/components/CoreRules";
import ActionMoves from "@/components/ActionMoves";
import Transition from "@/components/Transition";
import GameLevels from "@/components/GameLevels";
import ForWhom from "@/components/ForWhom";
import EmailCapture from "@/components/EmailCapture";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <RulesVideo />
        <CoreRules />
        <ActionMoves />
        <Transition />
        <GameLevels />
        <ForWhom />
        <EmailCapture />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  );
}
