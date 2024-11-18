import Image, { StaticImageData } from "next/image"
import { FeatureDetailsType } from "@/constants"
import { useTranslations } from "next-intl"
import outlinedCompass from "public/assets/images/compass_outlined.png"
import compass from "public/assets/images/compass.webp"
import outlinedMagnifier from "public/assets/images/magnifier_outlined.png"
import magnifier from "public/assets/images/magnifier.webp"
import outlinedMarket from "public/assets/images/market_outlined.png"
import market from "public/assets/images/market.webp"
import tent from "public/assets/images/planeTent.webp"
import outlinedRitual from "public/assets/images/ritual_outlined.png"
import ritual from "public/assets/images/ritual.webp"
import outlinedTent from "public/assets/images/tent_outlined.png"

import { cn } from "@/lib/styles"
import { Button } from "@/components/ui/button"

import { CelebrationsAndEventForm } from "./form/celebrationsAndEventsForm"
import { PathFinderForm } from "./form/pathFinderForm"
import { SouvenirsAndFoodForm } from "./form/souvenirsAndFoodForm"
import { TravelMakerForm } from "./form/travelMakerForm"

interface SectionProps {
  dir: "ltr" | "rtl"
  name: FeatureDetailsType | "about"
  children: React.ReactNode
  image: StaticImageData | string
  outlinedImage: StaticImageData | string
}

function Section({
  dir = "ltr",
  name,
  children,
  image,
  outlinedImage,
}: SectionProps) {
  const t = useTranslations(`landingPage.featureDetails.${name}`)
  return (
    <div
      id={name}
      className={cn(
        "flex min-h-0 flex-col items-stretch justify-start lg:min-h-[600px] lg:justify-stretch",
        dir == "ltr" ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      <div className="relative hidden w-1/2 items-center justify-start overflow-hidden lg:flex">
        <div className="absolute flex size-full items-center justify-start p-24">
          <Image
            alt="compass"
            src={outlinedImage}
            className={cn(
              "h-auto w-full",
              dir === "ltr" ? "right-0" : "left-0"
            )}
          />
        </div>
      </div>
      <div className="lg:hidden">
        <Image
          alt="compass"
          src={image}
          className="aspect-video object-cover"
        />
      </div>
      <div className="flex grow flex-col items-center justify-center">
        <div className="w-full max-w-[600px]">
          <section className="space-y-2 self-stretch p-4">
            <h2 className="text-2xl font-semibold">{t("title")}</h2>
            <p>{t("description")}</p>
          </section>
          <div className="px-4 pb-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function FeatureDetails() {
  const t = useTranslations("landingPage.featureDetails")

  return (
    <div className="flex w-full flex-col justify-stretch">
      <Section dir="ltr" name="about" image={tent} outlinedImage={outlinedTent}>
        <Button>{t("about.readMore")}</Button>
      </Section>
      <Section
        dir="rtl"
        name="routeFinder"
        image={compass}
        outlinedImage={outlinedCompass}
      >
        <PathFinderForm />
      </Section>
      <Section
        dir="ltr"
        name="travelMaker"
        image={magnifier}
        outlinedImage={outlinedMagnifier}
      >
        <TravelMakerForm />
      </Section>
      <Section
        dir="rtl"
        name="souvenirsAndFood"
        image={market}
        outlinedImage={outlinedMarket}
      >
        <SouvenirsAndFoodForm />
      </Section>
      <Section
        dir="ltr"
        name="celebrationsAndEvents"
        image={ritual}
        outlinedImage={outlinedRitual}
      >
        <CelebrationsAndEventForm />
      </Section>
    </div>
  )
}
