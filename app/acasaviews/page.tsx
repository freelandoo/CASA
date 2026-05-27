import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import InvestorHeroSection from "@/components/acasaviews/investor-hero-section"
import MarketOpportunitySection from "@/components/acasaviews/market-opportunity-section"
import InvestmentThesisSection from "@/components/acasaviews/investment-thesis-section"
import GroupsConflictSection from "@/components/acasaviews/groups-conflict-section"
import HorizontalGameDeckSection from "@/components/acasaviews/horizontal-game-deck-section"
import BrandOpportunitySection from "@/components/acasaviews/brand-opportunity-section"
import RankingTechnologySection from "@/components/acasaviews/ranking-technology-section"
import InvestorCTASection from "@/components/acasaviews/investor-cta-section"

export default function ACasaViewsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#06060c] pt-16 text-white">
        <InvestorHeroSection />
        <MarketOpportunitySection />
        <InvestmentThesisSection />
        <GroupsConflictSection />
        <HorizontalGameDeckSection />
        <BrandOpportunitySection />
        <RankingTechnologySection />
        <InvestorCTASection />
        <Footer />
      </main>
    </>
  )
}
