import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import MafiaHero from "@/components/mafia/hero-section"
import GameOverview from "@/components/mafia/game-overview"
import RolesSection from "@/components/mafia/roles-section"
import HowToPlay from "@/components/mafia/how-to-play"

export default function MafiaPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <MafiaHero />
      <GameOverview />
      <RolesSection />
      <HowToPlay />
      <Footer />
    </main>
  )
}
