"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { RefreshCcw } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

type Props = {
  error: Error
  reset(): void
}

export default function Error({ error, reset }: Props) {
  const t = useTranslations("errors.global")

  useEffect(() => {
    Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <main className="flex size-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <Button
        variant="link"
        className="space-y-2 px-0 text-2xl"
        onClick={reset}
        type="button"
      >
        <span>{t("tryAgain")}</span>
        <RefreshCcw />
      </Button>
    </main>
  )
}
