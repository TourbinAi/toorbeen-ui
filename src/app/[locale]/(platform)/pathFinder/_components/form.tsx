"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Sentry from "@sentry/nextjs"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { NeshanDataItemType } from "@/types/api"

import { neshanSearchAPI } from "@/lib/neshan"
import { PathFinderSchema } from "@/lib/validation/pathFinder"
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback"
import SubmitButton from "@/components/forms/SubmitButton"
import { AutoComplete } from "@/components/ui/autoComplete"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface FormProps {
  FormData: (DataOrigin: any, DataDestination: any[]) => void
  SheetOpen: (Value: boolean) => void
}

export const PathFinderForm: React.FC<FormProps> = ({
  FormData,
  SheetOpen,
}) => {
  const t = useTranslations("PathFinder")
  const [neshanDataOrigin, setNeshanDataOrigin] = useState<
    NeshanDataItemType[]
  >([])
  const [neshanDataDestinations, setNeshanDataDestinations] = useState<
    NeshanDataItemType[][]
  >([[]])
  const [DataOrigin, setDataOrigin] = useState<NeshanDataItemType>()
  const [DataDestination, setDataDestination] = useState<NeshanDataItemType[]>(
    []
  )
  const [loadingOrigin, setLoadOrigin] = useState<boolean>(false)
  const [loadingDes, setLoadDes] = useState<boolean[]>([])
  const searchParams = useSearchParams()
  const [isDataReady, setIsDataReady] = useState(false)
  const [originSearchValue, setOriginSearchValue] = useState<string>("")
  const [destinationSearchValues, setDestinationSearchValues] = useState<
    string[]
  >([""])
  const [originQuery, setOriginQuery] = useQueryState("origin")
  const [destinationQuery, setDestinationQuery] = useQueryState("des")

  const form = useForm<z.infer<typeof PathFinderSchema>>({
    resolver: zodResolver(PathFinderSchema),
    defaultValues: {
      origin: "",
      destinations: [""],
    },
  })

  const onSubmit = async () => {
    FormData(DataOrigin, DataDestination)
    SheetOpen(false)
  }
  //get data in url and handle states
  useEffect(() => {
    if (originQuery && destinationQuery) {
      const parsedOrigin = JSON.parse(originQuery.replace(/\/$/, ""))
      const parsedDestinations = JSON.parse(destinationQuery.replace(/\/$/, ""))
      setDataOrigin(parsedOrigin)
      setOriginSearchValue(parsedOrigin?.title)
      form.setValue("origin", parsedOrigin?.title)

      setDestinationSearchValues(
        parsedDestinations.map((dest: any) => dest.title)
      )
      setDataDestination(parsedDestinations)
      parsedDestinations.forEach((dest: any, index: number) => {
        form.setValue(`destinations.${index}`, dest.title)
      })
      setNeshanDataDestinations(parsedDestinations.map(() => []))
    }
  }, [searchParams, form])
  //send data for map
  useEffect(() => {
    if (DataDestination && DataOrigin) {
      FormData(DataOrigin, DataDestination)
    }
  }, [DataOrigin, DataDestination, FormData])

  const addDestinationField = () => {
    if (form.watch("destinations").length < 4) {
      form.setValue("destinations", [...form.getValues("destinations"), ""])
      setNeshanDataDestinations((prev) => [...prev, []])
    }
  }
  //fetch data
  const fetchData = async (
    newValue: string,
    type: "origin" | "destination",
    index?: number
  ) => {
    try {
      const response = await neshanSearchAPI(newValue)
      const data = response.data.items

      if (type === "origin") {
        setNeshanDataOrigin(data.slice(0, 5))
        setLoadOrigin(false)
      } else if (type === "destination" && index !== undefined && data) {
        setNeshanDataDestinations((prev) => {
          const updatedData = [...prev]
          updatedData[index] = data.slice(0, 5)
          return updatedData
        })
        setLoadDes((prev) => {
          const updatedLoading = [...prev]
          updatedLoading[index] = false
          return updatedLoading
        })
      }
    } catch (error) {
      Sentry.captureException(error)
      if (type === "destination" && index !== undefined) {
        setLoadDes((prev) => {
          const updatedLoading = [...prev]
          updatedLoading[index] = false
          return updatedLoading
        })
      }
    }
  }
  const debouncedFetchData = useDebouncedCallback(fetchData, 1000) //debounced fetch data
  //user input handler
  const changeHandler = async (
    e: string,
    type: "origin" | "destination",
    index?: number
  ) => {
    const newValue = e
    if (type === "origin") {
      setNeshanDataOrigin([])
      setLoadOrigin(true)
    } else if (type === "destination" && index !== undefined) {
      setNeshanDataDestinations((prev) => {
        const updatedData = [...prev]
        updatedData[index] = []
        return updatedData
      })
      setLoadDes((prev) => {
        const updatedLoading = [...prev]
        updatedLoading[index] = true
        return updatedLoading
      })
    }
    debouncedFetchData(newValue, type, index)
  }
  //user select location in neshan response
  const handleItemClick = (
    item: NeshanDataItemType,
    type: "origin" | "destination",
    index?: number
  ) => {
    setLoadOrigin(false)

    if (type === "origin") {
      setDataOrigin(item)
      setNeshanDataOrigin([])
      form.setValue("origin", item.title)
      setOriginQuery(JSON.stringify(item))
      return
    }

    if (type === "destination" && index !== undefined) {
      setNeshanDataDestinations((prev) => {
        const updatedData = [...prev]
        updatedData[index] = []
        return updatedData
      })

      setDataDestination((prev) => {
        const updatedDestinations = [...prev]
        updatedDestinations[index] = item
        return updatedDestinations
      })

      setDestinationQuery((prev) => {
        const previousData = prev ? JSON.parse(prev.replace(/\/$/, "")) : []
        const updatedDestinations = [...previousData]
        updatedDestinations[index] = item
        return JSON.stringify(updatedDestinations)
      })

      form.setValue(`destinations.${index}`, item.title)
    }
  }
  //remove destinations handler
  const removeDestinationField = (index: number) => {
    const filterByIndex = (arr: any[]) => arr.filter((_, i) => i !== index)

    form.setValue("destinations", filterByIndex(form.getValues("destinations")))
    setNeshanDataDestinations((prev) => filterByIndex(prev))
    setDestinationSearchValues((prev) => filterByIndex(prev))
    setDataDestination((prev) => filterByIndex(prev))

    if (destinationQuery) {
      const parsedDes = filterByIndex(JSON.parse(destinationQuery))
      setDestinationQuery(JSON.stringify(parsedDes))
    }
  }
  //function dynamic render autoComplete
  const renderAutoComplete = (type: "origin" | "destination", index = 0) => (
    <AutoComplete
      selectedValue={form.watch(
        type === "origin" ? "origin" : `destinations.${index}`
      )}
      onSelectedValueChange={(value) =>
        form.setValue(
          type === "origin" ? "origin" : `destinations.${index}`,
          value
        )
      }
      searchValue={
        type === "origin"
          ? originSearchValue
          : destinationSearchValues[index] || ""
      }
      onSearchValueChange={(value) => {
        if (type === "origin") {
          setOriginSearchValue(value)
        } else {
          setDestinationSearchValues((prev) => {
            const updated = [...prev]
            updated[index] = value
            return updated
          })
        }
      }}
      items={
        (type === "destination"
          ? neshanDataDestinations?.[index]
          : neshanDataOrigin
        )?.map((item) => ({
          address: item?.address,
          category: item?.category,
          location: { x: item?.location?.x, y: item?.location?.y },
          region: item?.region,
          title: item?.title,
          type: item?.type,
        })) || []
      }
      isLoading={type === "origin" ? loadingOrigin : loadingDes[index]}
      placeholder={t(`${type}.placeHolder`)}
      lable={
        type === "origin"
          ? t("origin.title")
          : `${t("destination.title")} ${index + 1}`
      }
      onChangeHandler={(e) => changeHandler(e, type, index)}
      itemClickHandler={(item) => handleItemClick(item, type, index)}
    />
  )
  //check data for render autoComplete
  useEffect(() => {
    if (originSearchValue !== undefined && destinationSearchValues.length > 0) {
      setIsDataReady(true)
    }
  }, [originSearchValue, destinationSearchValues])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4">
          {isDataReady ? renderAutoComplete("origin") : "loading sideBar..."}
          {isDataReady &&
            form.watch("destinations").map((_, index) => (
              <div key={index} className="relative mb-5 mt-6 text-nowrap">
                {renderAutoComplete("destination", index)}
                {index > 0 && (
                  <Button
                    variant="outline"
                    className="absolute left-0 top-0"
                    onClick={() => removeDestinationField(index)}
                  >
                    <X />
                  </Button>
                )}
              </div>
            ))}
          <div className="mb-4 mr-10">
            {isDataReady && (
              <Button type="button" onClick={addDestinationField}>
                {t("addDestination")}
              </Button>
            )}
          </div>
        </div>
        <SubmitButton className="w-full lg:hidden">{t("submit")}</SubmitButton>
      </form>
    </Form>
  )
}
