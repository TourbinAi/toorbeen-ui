import { env } from "@/env.mjs"
import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

import { locales } from "./i18n"

export const routing = defineRouting({
  locales,
  defaultLocale: "fa",
})

// https://next-intl-docs.vercel.app/docs/routing/navigation
export const { Link, redirect, usePathname, getPathname, useRouter } =
  createNavigation(routing)

export function isAppLink(link: string): boolean {
  try {
    const baseUrl = env.NEXT_PUBLIC_APP_PUBLIC_URL ?? ""
    const url = new URL(link, baseUrl)
    return url.hostname === new URL(baseUrl).hostname
  } catch (error) {
    return false
  }
}
