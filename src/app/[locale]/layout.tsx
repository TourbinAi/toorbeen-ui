import "@/styles/globals.css"

import { notFound } from "next/navigation"

import { LayoutProps } from "@/types/next"

import { fontSans } from "@/lib/fonts"
import { setupLibraries } from "@/lib/general-helpers"
import { locales } from "@/lib/i18n"
import { cn } from "@/lib/styles"
import { TailwindIndicator } from "@/components/elementary/TailwindIndicator"
import { ClientProviders } from "@/components/providers/ClientProviders"
import { ServerProviders } from "@/components/providers/ServerProviders"
import { Toaster } from "@/components/ui/sonner"

setupLibraries()

export default async function RootLayout({ children, params }: LayoutProps) {
  if (!locales.includes(params.locale)) {
    notFound()
  }

  return (
    <html
      lang={params.locale}
      className={`${fontSans.variable} font-sans`}
      dir={params.locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ServerProviders params={params}>
          <ClientProviders>
            <div className="h-full">{children}</div>
            <TailwindIndicator />
            <Toaster />
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  )
}
