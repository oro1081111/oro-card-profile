import { getPublishedContent } from "@/lib/content/getPublishedContent";
import { MobileShell } from "@/components/public/MobileShell";
import { HeroSection } from "@/components/public/HeroSection";
import { CardDeck } from "@/components/public/CardDeck";
import { ContactSection } from "@/components/public/ContactSection";

export default async function HomePage() {
  const content = await getPublishedContent();

  return (
    <MobileShell content={content}>
      <HeroSection profile={content.profile} theme={content.theme} />
      <CardDeck cards={content.cards} theme={content.theme} />
      <ContactSection profile={content.profile} theme={content.theme} />
    </MobileShell>
  );
}
