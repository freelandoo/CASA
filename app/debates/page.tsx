import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import DebatesHeroSection from "@/components/debates/hero-section"
import DebatesStatsSection from "@/components/debates/stats-section"
import UpcomingDebatesSection from "@/components/debates/upcoming-debates"
import CastSection from "@/components/debates/cast-section"
import RankingSection from "@/components/debates/ranking-section"
import PastDebatesSection from "@/components/debates/past-debates"

export default function DebatesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <DebatesHeroSection />
      <DebatesStatsSection />
      <RankingSection />
      <UpcomingDebatesSection />
      <CastSection />
      <PastDebatesSection />
      <Footer />
    </div>
  )
}
