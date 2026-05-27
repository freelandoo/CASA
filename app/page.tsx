"use client"

import Navbar from "@/components/shared/navbar"
import Hero from "@/components/home/hero"
import About from "@/components/home/about"
import Projects from "@/components/home/projects"
import Partnerships from "@/components/home/partnerships"
import Contact from "@/components/home/contact"
import Footer from "@/components/shared/footer"
import { FadeInSection } from "@/components/shared/fade-in-section"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-16">
        <Hero />
        <FadeInSection>
          <About />
        </FadeInSection>
        <FadeInSection>
          <Projects />
        </FadeInSection>
        <FadeInSection>
          <Partnerships />
        </FadeInSection>
        <FadeInSection>
          <Contact />
        </FadeInSection>
        <FadeInSection>
          <Footer />
        </FadeInSection>
      </main>
    </>
  )
}
