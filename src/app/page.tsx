import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ForWhom from "@/components/ForWhom";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <ForWhom />
        <EmailCapture />
      </main>
      <Footer />
    </LangProvider>
  );
}
