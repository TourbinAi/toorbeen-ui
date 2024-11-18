import { notFound } from "next/navigation"
import { LocalePrefix, Pathnames } from "next-intl/routing"
import { getRequestConfig } from "next-intl/server"

export const locales = ["en", "fa"] as const
export const defaultLocale = "en"

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    fa: "/masir",
  },
}

export const localePrefix: LocalePrefix<typeof locales> = "always"

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  if (!locales.includes(locale as any)) {
    notFound()
  }

  return {
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../../locales/en.json")
        : import(`../../locales/${locale}.json`))
    ).default,
    timeZone: "Europe/Prague",
  }
})
