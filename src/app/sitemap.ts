import { MetadataRoute } from "next"
import { env } from "@/env.mjs"

import { defaultLocale, locales, pathnames } from "@/lib/i18n"
import { getPathname } from "@/lib/navigation"

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(pathnames) as Array<keyof typeof pathnames>

  function getUrl(
    key: keyof typeof pathnames,
    locale: (typeof locales)[number]
  ) {
    const pathname = getPathname({ locale, href: key })
    return `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/${locale}${pathname === "/" ? "" : pathname}`
  }

  return keys.map((key) => ({
    url: getUrl(key, defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl(key, locale)])
      ),
    },
  }))
}
