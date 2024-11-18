"use client"

import React, { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { ClassValue } from "clsx"
import { Languages } from "lucide-react"
import { useLocale } from "next-intl"

import { AppLocale } from "@/types/general"

import { locales } from "@/lib/i18n"
import { usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select"

/**
 * LocaleSwitcher component.
 *
 * This component renders a dropdown menu for switching between different locales.
 * It uses the `Select` component from `@/components/ui/select` and the `useTransition`
 * hook from React to prevent the locale switch from blocking the UI thread.
 *
 * The component accepts a `locale` prop, which is the current locale.
 *
 * @see LocaleSwitcherProps
 * @see Select
 */

const localeTranslation = {
  en: "English",
  fa: "فارسی",
}

const LocaleSwitcher = ({ className }: { className: ClassValue }) => {
  // prevent the locale switch from blocking the UI thread
  const [, startTransition] = useTransition()

  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLocaleChange = (locale: AppLocale) => {
    const queryParams = searchParams.toString()

    // next-intl router.replace does not persist query params
    startTransition(() => {
      router.replace(
        queryParams.length > 0 ? `${pathname}?${queryParams}` : pathname,
        { locale }
      )
    })
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className={cn(className, "w-32 font-bold uppercase")}>
        <Languages size={17} />
        {locale === "en" ? "en" : "فا"}
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale, index) => (
          <React.Fragment key={locale}>
            <SelectItem key={locale} value={locale}>
              {localeTranslation[locale]}
            </SelectItem>
            {index < locales.length - 1 && (
              <SelectSeparator key={`${locale}-separator`} />
            )}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LocaleSwitcher
