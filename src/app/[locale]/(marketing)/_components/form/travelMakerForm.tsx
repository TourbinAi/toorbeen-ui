"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import moment from "jalali-moment"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "@/lib/navigation"
import {
  SidebarSchema,
  TravelMakerSelectValues as tmsv,
} from "@/lib/validation/travelMaker"
import CustomFormField, {
  FormFieldType,
} from "@/components/forms/CustomeFormField"
import SubmitButton from "@/components/forms/SubmitButton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"

const persianDate = moment().format("jYYYY-jM-jD")

const [year, month, day] = persianDate.split("-").map(Number)

export const TravelMakerForm = () => {
  const t = useTranslations("travelMaker")
  const router = useRouter()

  const form = useForm<z.infer<typeof SidebarSchema>>({
    resolver: zodResolver(SidebarSchema),
    defaultValues: {
      origin: "",
      direction: "north",
      distance: "3h",
      duration: "1d",
      tags: [],
      route: "easy",
      vehicle: "car",
      oldPerson: false,
      routStop: "multiple",
      accommodation: "camp",
      date: {
        year: year,
        month: month,
        day: day,
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof SidebarSchema>) => {
    // console.log("yes");
    const queryParams = new URLSearchParams(values as any).toString()
    router.push(`/travelMaker?${queryParams}`)
  }

  return (
    <div className="flex size-full flex-wrap justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="origin"
            label={t("form.origin.title")}
            placeholder={t("form.origin.placeholder")}
          >
            {["تهران", "مشهد"].map((city, i) => (
              <SelectItem key={i} value={city}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{city}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="distance"
            label={t("form.distance.title")}
            placeholder={t("form.distance.placeholder")}
          >
            {tmsv.distance.map((dis, i) => (
              <SelectItem key={i} value={dis}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{t(`form.distance.select.${dis}`)}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.MULTISELECT}
            control={form.control}
            name="tags"
            label={t("form.place.placeholder")}
            placeholder={t("form.place.select.title-nature-placeHolder")}
            options={tmsv.placeNature.map((p) => ({
              value: p,
              label: t(`form.place.select.${p}`),
            }))}
            searchText={t("form.place.search")}
            selectAllText={t("form.place.selectAll")}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="duration"
            label={t("form.duration.title")}
            placeholder={t("form.duration.placeholder")}
          >
            {tmsv.duration.map((time, i) => (
              <SelectItem key={i} value={time}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{t(`form.duration.select.${time}`)}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="route"
            label={t("form.route.title")}
            placeholder={t("form.route.placeholder")}
          >
            {tmsv.route.map((route, i) => (
              <SelectItem key={i} value={route}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{t(`form.route.select.${route}`)}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="routStop"
            label={t("form.destination-state.title")}
            placeholder={t("form.destination-state.placeholder")}
          >
            {tmsv.disState.map((state, i) => (
              <SelectItem key={i} value={state}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{t(`form.destination-state.select.${state}`)}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="vehicle"
            label={t("form.vehicle.title")}
            placeholder={t("form.vehicle.placeholder")}
          >
            {tmsv.vehicle.map((vehicle, i) => (
              <SelectItem key={i} value={vehicle}>
                <div className="flex w-full cursor-pointer flex-row items-center gap-2 ltr:flex-row-reverse">
                  <p>{t(`form.vehicle.select.${vehicle}`)}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <Accordion type="single" collapsible>
            <AccordionItem value="optional">
              <AccordionTrigger>{t("form.popover-button")}</AccordionTrigger>
              <AccordionContent>
                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="oldPerson"
                  label={t("form.oldPerson.title")}
                  // placeholder={t("form.oldPerson.placeholder")}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="direction"
                  label={t("form.travel-direction.title")}
                  placeholder={t("form.travel-direction.placeholder")}
                >
                  {tmsv.direction.map((dir, i) => (
                    <SelectItem key={i} value={dir}>
                      <p>{t(`form.travel-direction.select.${dir}`)}</p>
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="accommodation"
                  label={t("form.accommodation.title")}
                  placeholder={t("form.accommodation.placeholder")}
                >
                  {tmsv.accommodation.map((accommodation, i) => (
                    <SelectItem key={i} value={accommodation}>
                      <p>
                        {t(
                          `form.accommodation.accommodationSelect.${accommodation}`
                        )}
                      </p>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <SubmitButton>{t("form.Button")}</SubmitButton>
        </form>
      </Form>
    </div>
  )
}
