"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "@/lib/navigation"
import { souvenirsAndFood } from "@/lib/validation/landing"
import CustomFormField, {
  FormFieldType,
} from "@/components/forms/CustomeFormField"
import SubmitButton from "@/components/forms/SubmitButton"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

export const SouvenirsAndFoodForm = () => {
  const t = useTranslations("landingPage.featureDetails.souvenirsAndFood")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof souvenirsAndFood>>({
    resolver: zodResolver(souvenirsAndFood),
    defaultValues: {
      food: "",
      city: "",
    },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    router.push("/blog/Souvenirs/?blogtype=2&blogid=3")
    try {
      setIsLoading(true)
    } catch (error) {
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
          name="food"
          label={t("form.food.title")}
          placeholder={t("form.food.placeholder")}
          iconLucid="CookingPot"
          iconAlt="food"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="city"
          label={t("form.city.title")}
          placeholder={t("form.city.placeholder")}
          iconLucid="Building2"
          iconAlt="city"
        />

        <SubmitButton isLoading={isLoading}>{t("form.submit")}</SubmitButton>
      </form>
      <Button className="w-full" variant="outline" href="/blog">
        {t("form.goTo")}
      </Button>
    </Form>
  )
}
