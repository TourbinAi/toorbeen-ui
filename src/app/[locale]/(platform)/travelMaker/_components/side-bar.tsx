"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { TravelMakerListReq, TravelMakerListRes } from "@/types/api"

import { TravelMakerList } from "@/lib/api"
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

interface TravelFormProps<TFieldValues> {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  defaultValue?: TFieldValues
  setList: Dispatch<SetStateAction<TravelMakerListRes | undefined>>
  triggerSubmit: boolean
  setSubmit: Dispatch<SetStateAction<boolean>>
  updateQuery: boolean
  setUpdateQuery: Dispatch<SetStateAction<boolean>>
}

function TravelForm({
  triggerSubmit,
  setSubmit,
  updateQuery,
  setUpdateQuery,
  loading,
  setLoading,
  setList,
  defaultValue,
}: TravelFormProps<z.infer<typeof SidebarSchema>>) {
  const t = useTranslations("travelMaker")
  const router = useRouter()

  const form = useForm<z.infer<typeof SidebarSchema>>({
    resolver: zodResolver(SidebarSchema),
    defaultValues: defaultValue,
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(form.getValues() as any).toString()
    router.push(`/travelMaker?${queryParams}`)
    setUpdateQuery(false)
  }, [updateQuery])

  useEffect(() => {
    if (triggerSubmit) {
      onSubmit(form.getValues())
      setSubmit(false)
    }
  }, [triggerSubmit])

  const onSubmit = async (values: z.infer<typeof SidebarSchema>) => {
    setLoading(true)
    try {
      const requestObject: TravelMakerListReq = {
        origin_of_trip: values.origin,
        distance_from_origin:
          ([3, 5, 7] as const).at(tmsv.distance.indexOf(values.distance)) || 3,
        time_limit:
          ([1, 2, 3] as const).at(tmsv.duration.indexOf(values.duration)) || 1,
        route_type: ([1, 2] as const).at(tmsv.route.indexOf(values.route)) || 1,
        stop_and_quit:
          ([1, 2] as const).at(tmsv.disState.indexOf(values.routStop)) || 1,
        overnight_stay: ([1, 2, 3] as const).at(
          tmsv.accommodation.indexOf(values.accommodation)
        ),
        count_of_elder_people: values.oldPerson ? 1 : 0,
        tags: values.tags.map((place) => tmsv.placeNature.indexOf(place)),
        means_of_travel:
          ([1, 2, 3, 4, 5, 6, 7, 8] as const).at(
            tmsv.vehicle.indexOf(values.vehicle)
          ) || 1,
        direction_of_movement: ([1, 2, 3, 4] as const).at(
          tmsv.direction.indexOf(values.direction)
        ),
      }

      // console.log("request object: ", requestObject);
      const respond = await TravelMakerList(requestObject)
      setList(respond.data)

      // console.log("respond: ", respond);
    } catch (error) {
      console.error("Form submission failed:", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex h-full flex-wrap justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="origin"
            label={t("form.origin.title")}
            placeholder={t("form.origin.placeholder")}
          />

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
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="oldPerson"
                  label={t("form.oldPerson.title")}
                  placeholder={t("form.oldPerson.placeholder")}
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
          <SubmitButton isLoading={loading}>{t("form.Button")}</SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export default TravelForm
