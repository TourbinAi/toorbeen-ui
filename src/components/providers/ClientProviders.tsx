"use client"

import React, { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { z } from "zod"

import { AppError } from "@/types/general"

import { useErrorMessage } from "@/hooks/useErrorMessage"
import { useTranslatedZod } from "@/hooks/useTranslatedZod"

import { useToast } from "../ui/use-toast"

export function ClientProviders({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const { parseAppError } = useErrorMessage()
  const { toast } = useToast()

  useTranslatedZod(z)

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error: Error) => {
              const appError: AppError = JSON.parse(error.message)
              toast({
                variant: "destructive",
                description: parseAppError(appError),
              })
            },
          },
        },
      })
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme="light"
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
