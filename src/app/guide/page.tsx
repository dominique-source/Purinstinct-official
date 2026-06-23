import { LangProvider } from "@/lib/i18n";
import GuideClient from "./GuideClient";

export const metadata = {
  title: "Le Guide PurInstinct",
  description: "Maîtrise les règles, les gestes et les transitions. Accède au guide interactif complet.",
};

export default function GuidePage() {
  return (
    <LangProvider>
      <GuideClient />
    </LangProvider>
  );
}
