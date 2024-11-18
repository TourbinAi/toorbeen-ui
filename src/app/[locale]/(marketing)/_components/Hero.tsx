"use client"

import Image from "next/image"
import { primaryFeatures } from "@/constants"
import { useTranslations } from "next-intl"
import BeachImage from "public/assets/images/beachSunSet.png"
import Logo from "public/assets/images/logo.png"

import { Card, CardContent } from "@/components/ui/card"

export function Hero() {
  const t = useTranslations("landingPage")

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const href = event.currentTarget.getAttribute("href")
    const targetId = href?.replace("#", "")
    const targetElement = document.getElementById(targetId || "")

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      id="hero"
      className="relative flex h-auto min-h-screen w-full flex-col"
    >
      <div className="absolute inset-0 -z-10 h-[80vh] bg-gradient-to-t from-[#faf8f1] to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 [mask-image:linear-gradient(to_bottom,white_40%,transparent)]">
        <Image
          src={BeachImage}
          alt="Main Background"
          className="h-screen w-full object-cover lg:h-[80vh]"
        />
      </div>
      sm:basis-80
      <div className="mt-32 flex w-full flex-col items-center justify-center gap-16 pb-4">
        <Image src={Logo} alt="Centered Image" className="w-1/2 md:w-1/5" />
        <h1 className="text-gl flex items-center justify-center text-center font-bold text-blue-900 sm:text-xl md:text-2xl lg:text-3xl">
          {t("hero.header.top")}
          <br />
          {t("hero.header.bottom")}
        </h1>
        <ul className="flex w-full flex-wrap items-stretch justify-center gap-x-1 gap-y-4 px-2 sm:hidden sm:flex-wrap sm:gap-x-10 sm:px-10 md:gap-x-32">
          {primaryFeatures.map((feature) => (
            <li key={feature.name}>
              <a
                href={feature.href}
                onClick={handleSmoothScroll}
                className="group flex flex-col flex-nowrap items-center justify-center gap-8 sm:flex-wrap"
              >
                <Card className="flex aspect-square size-28 flex-col items-center justify-center gap-2 border border-primary">
                  <CardContent className="flex size-full flex-col items-center justify-center gap-2 p-3">
                    <Image
                      className="transition-all group-hover:scale-110"
                      alt={feature.name}
                      src={feature.icon}
                      width={50}
                      height={50}
                    />
                    <span className="text-nowrap text-xs font-semibold text-secondary">
                      {t(`primaryFeatures.${feature.name}`)}
                    </span>
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>
        <ul className="hidden w-full flex-wrap items-stretch justify-center gap-x-1 gap-y-4 px-2 sm:flex sm:flex-wrap sm:gap-x-10 sm:px-10 md:gap-x-32">
          {primaryFeatures.map((feature) => (
            <li key={feature.name}>
              <a
                href={feature.href}
                onClick={handleSmoothScroll}
                className="group flex flex-col flex-nowrap items-center justify-center gap-8 sm:flex-wrap"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <Image
                    className="transition-all group-hover:scale-110"
                    alt={feature.name}
                    src={feature.icon}
                    width={100}
                    height={100}
                  />
                  <span className="text-nowrap font-semibold text-secondary">
                    {t(`primaryFeatures.${feature.name}`)}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
