"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import moment from "jalali-moment"
import { ChevronRight } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import RouteCard from "./card"
import SheetLayout from "./sheetLayout"

// Inside your TravelMakerForm component:
const persianDate = moment().format("jYYYY-jM-jD") // Get the current Persian date

const [year, month, day] = persianDate.split("-").map(Number)

const defaultValue = {
  origin: "",
  direction: "north",
  distance: "3h",
  duration: "2d",
  tags: ["sunnyAndSea"],
  route: "easy",
  vehicle: "car",
  oldPerson: false,
  routStop: "oneWay",
  accommodation: "camp",
  date: {
    year: year,
    month: month,
    day: day,
  },
} as z.infer<typeof SidebarSchema>

export default function TravelMaker() {
  const searchParams = useSearchParams() // Get search params
  const query = Object.fromEntries(searchParams.entries()) // Convert search params to object
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [list, setList] = useState<TravelMakerListRes>()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("travelMaker")

  const router = useRouter()

  const form = useForm<z.infer<typeof SidebarSchema>>({
    resolver: zodResolver(SidebarSchema),
    defaultValues: defaultValue,
  })

  const updateQuery = useCallback(() => {
    // console.log("updating query...");
    const queryParams = new URLSearchParams(form.getValues() as any).toString()
    router.push(`/travelMaker?${queryParams}`)
  }, [form, router])

  const onSubmit = useCallback(
    async (values: z.infer<typeof SidebarSchema>) => {
      updateQuery()
      setLoading(true)
      try {
        const requestObject: TravelMakerListReq = {
          origin_of_trip: values.origin,
          distance_from_origin:
            ([3, 5, 7] as const).at(tmsv.distance.indexOf(values.distance)) ||
            3,
          time_limit:
            ([1, 2, 3] as const).at(tmsv.duration.indexOf(values.duration)) ||
            1,
          route_type:
            ([1, 2] as const).at(tmsv.route.indexOf(values.route)) || 1,
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

        const respond = await TravelMakerList(requestObject)
        setList(respond.data)
      } catch (error) {
        console.error("Form submission failed:", error)
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
    [updateQuery, setLoading, setOpen, setList]
  )
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const parseTags = (tags: string): string[] =>
        tags ? tags.split(",") : []

      const parseDate = (dateStr: string | undefined): Date | undefined => {
        if (dateStr) {
          const parsedDate = new Date(dateStr)
          return isNaN(parsedDate.getTime()) ? undefined : parsedDate
        }
        return undefined
      }

      const safeQuery = {
        origin: query.origin
          ? decodeURIComponent(query.origin)
          : defaultValue.origin,
        distance: tmsv.distance.includes(query.distance as any)
          ? (query.distance as any)
          : defaultValue.distance,
        duration: ["1d", "2d", "3d"].includes(query.duration as any)
          ? (query.duration as any)
          : defaultValue.duration,
        tags: parseTags(query.tags || "").filter((tag) =>
          tmsv.placeNature.includes(tag as any)
        ),
        route: tmsv.route.includes(query.route as any)
          ? (query.route as any)
          : defaultValue.route,
        vehicle: tmsv.vehicle.includes(query.vehicle as any)
          ? (query.vehicle as any)
          : defaultValue.vehicle,
        routStop: tmsv.disState.includes(query.routStop as any)
          ? (query.routStop as any)
          : defaultValue.routStop,
        direction: tmsv.direction.includes(query.direction as any)
          ? (query.direction as any)
          : defaultValue.direction,
        oldPerson: query.oldPerson
          ? query.oldPerson === "false"
            ? false
            : true
          : defaultValue.oldPerson,
        accommodation: tmsv.accommodation.includes(query.accommodation as any)
          ? (query.accommodation as any)
          : defaultValue.accommodation,
        date: parseDate(query.date) || defaultValue.date, // Ensure date is parsed and valid
      }

      const result = SidebarSchema.safeParse(safeQuery)
      if (result.success) {
        // Reset form with the new default values
        form.reset(result.data)

        // Immediately submit the form with these values
        form.handleSubmit(onSubmit)()
      } else {
        console.error("Query parsing or schema validation failed", result.error)
      }
    }
    setMounted(true)
  }, [mounted, form, query, onSubmit])

  if (!mounted) return null

  return (
    <SheetLayout
      open={open}
      setOpen={setOpen}
      button={typeof list === "undefined" ? false : list.length !== 0}
      sideBarComponent={
        <div className="h-full overflow-x-hidden p-5">
          <div className="flex h-full flex-wrap justify-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  onChange={updateQuery}
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
                {/* 
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  onChange={updateQuery}
                  control={form.control}
                  name="date"
                  label={t("form.date.title")}
                /> */}

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  onChange={updateQuery}
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
                  onChange={updateQuery}
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
                  onChange={updateQuery}
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
                  onChange={updateQuery}
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
                  onChange={updateQuery}
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
                  onChange={updateQuery}
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
                    <AccordionTrigger>
                      {t("form.popover-button")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        onChange={updateQuery}
                        control={form.control}
                        name="oldPerson"
                        label={t("form.oldPerson.title")}
                        // placeholder={t("form.oldPerson.placeholder")}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        onChange={updateQuery}
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
                        onChange={updateQuery}
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
                <SubmitButton isLoading={loading}>
                  {t("form.Button")}
                </SubmitButton>
              </form>
            </Form>
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="flx-col flex w-full gap-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <>
          {list ? (
            <>
              {list.length === 0 ? (
                <div className="flex size-full items-center justify-center">
                  <Card className="max-w-96">
                    <CardHeader className="flex w-full flex-col items-center justify-center">
                      <CardTitle className="flex gap-2 pb-2">
                        <span>{t("form.noResults")}</span>
                        <span className="-translate-y-1 text-2xl">):</span>
                      </CardTitle>
                      <CardDescription className="text-center">
                        {t("form.tryAnother")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex size-full flex-col items-center justify-center">
                      <Button
                        className="flex lg:hidden"
                        variant="outline"
                        onClick={() => setOpen(true)}
                      >
                        <ChevronRight />
                        {t("form.form-header.fillForm")}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-4">
                  {list.map((item) => (
                    <RouteCard
                      key={item.id}
                      id={item.id}
                      name={item.description}
                      description={item.description}
                      latitude={item.latitude}
                      longitude={item.longitude}
                      cities={[...item.places].reverse()}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <Card className="max-w-96">
                <CardHeader className="flex w-full flex-col items-center justify-center">
                  <CardTitle className="pb-2">
                    {t("form.form-header.title")}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {t("form.form-header.text")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex size-full flex-col items-center justify-center">
                  <Button
                    className="flex lg:hidden"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    <ChevronRight />
                    {t("form.form-header.fillForm")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </SheetLayout>
  )
}
