"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { celebrationsAndEvents } from "@/lib/validation/landing"
import { Form } from "@/components/ui/form"

import "react-phone-number-input/style.css"

import { useRouter } from "next/navigation"
import * as Sentry from "@sentry/nextjs"
import { useTranslations } from "next-intl"

import CustomFormField, {
  FormFieldType,
} from "@/components/forms/CustomeFormField"
import SubmitButton from "@/components/forms/SubmitButton"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const months = [
  "farvardin",
  "ordibehesht",
  "khordad",
  "tir",
  "mordad",
  "shahrivar",
  "mehr",
  "aban",
  "azar",
  "day",
  "bahman",
  "esfand",
] as const

export const CelebrationsAndEventForm = () => {
  const t = useTranslations("landingPage.featureDetails.celebrationsAndEvents")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof celebrationsAndEvents>>({
    resolver: zodResolver(celebrationsAndEvents),
    defaultValues: {
      occasion: "",
    },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    router.push("/blog/event/?blogtype=3&blogid=3")
    try {
      setIsLoading(true)
      router.push("blog/event/?blogtype=3&blogid=3")
    } catch (error) {
      Sentry.captureException(error)
      console.error(error)
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex-1 space-y-4"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occasion"
          label={t("form.occasion.title")}
          placeholder={t("form.occasion.placeholder")}
          iconLucid="MapPinned"
          iconAlt="origin"
        />
        <div className="flex flex-row items-center gap-2">
          <Label className="m-0 text-nowrap">{t("form.month.title")}</Label>
          <Select>
            <SelectTrigger className="flex items-center justify-center">
              <SelectValue placeholder={t("form.month.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map((month, i) => (
                  <SelectItem
                    key={i}
                    value={month}
                    className="flex w-full items-center justify-end text-right"
                  >
                    <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                      <p>{t(`form.month.options.${month}`)}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <SubmitButton className="mb-1 w-full" isLoading={isLoading}>
          {t("form.submit")}
        </SubmitButton>
      </form>
      <Button className="w-full" variant="outline" href="/blog">
        {t("form.goTo")}
      </Button>
    </Form>
  )
}
