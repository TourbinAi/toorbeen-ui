import React from "react"

import { Attractions } from "./_components/Attractions"
import { FeatureDetails } from "./_components/FeatureDetails"
import { Hero } from "./_components/Hero"

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <FeatureDetails />
      <Attractions />
    </main>
  )
}
