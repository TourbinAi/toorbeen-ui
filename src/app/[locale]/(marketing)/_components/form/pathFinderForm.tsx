"use client"

import { useRef, useState } from "react"
import { env } from "@/env.mjs"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "@/lib/navigation"
import { PathFinderSchemaLanding } from "@/lib/validation/pathFinder"
import SubmitButton from "@/components/forms/SubmitButton"
import { AutoComplete } from "@/components/ui/autoComplete"
import { Form } from "@/components/ui/form"

export const PathFinderForm = () => {
  const t = useTranslations("PathFinder")
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const [neshanDataOrigin, setNeshanDataOrigin] = useState<any[]>([])
  const [neshanDataDestinations, setNeshanDataDestinations] = useState<any[]>(
    []
  )
  const [DataOrigin, setDataOrigin] = useState<any>()
  const [DataDestination, setDataDestination] = useState<any[]>([])
  const [loadingOrigin, setLoadOrigin] = useState<boolean>(false)
  const [loadingDes, setLoadDes] = useState<boolean>(false)
  const router = useRouter()
  const [originSearchValue, setOriginSearchValue] = useState<string>("")
  const [selectedOrigin, setSelectedOrigin] = useState<string>("")
  const [destinationSearchValues, setDestinationSearchValues] =
    useState<string>("")
  const [selectedDestinations, setSelectedDestinations] = useState<string>("")
  const handleOriginSelect = (value: string) => {
    setSelectedOrigin(value)
    form.setValue("origin", value)
  }

  const handleDestinationSelect = (value: string) => {
    setSelectedDestinations(value)
    form.setValue(`destinations`, value)
  }

  const form = useForm<z.infer<typeof PathFinderSchemaLanding>>({
    resolver: zodResolver(PathFinderSchemaLanding),
    defaultValues: {
      origin: "",
      destinations: "",
    },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      const serializedDataOrigin = encodeURIComponent(
        JSON.stringify(DataOrigin)
      )
      const serializedDataDes = encodeURIComponent(
        JSON.stringify(DataDestination)
      )
      router.push(
        `/pathFinder?origin=${serializedDataOrigin}&des=${serializedDataDes}`
      )
    } catch (err) {
      // console.log(err);
    }
  }
  const changeHandler = async (e: string, type: "origin" | "destination") => {
    const newValue = e
    if (type === "origin") {
      setNeshanDataOrigin([])
      setLoadOrigin(true)
    } else if (type === "destination") {
      setNeshanDataDestinations([])
      setLoadDes(true)
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://api.neshan.org/v1/search?term=${newValue}&lat=36.6875447&lng=51.3054564`,
          {
            headers: { "api-key": env.NEXT_PUBLIC_NESHAN_KEY },
          }
        )

        const data = response.data.items

        if (type === "origin") {
          setNeshanDataOrigin(data.slice(0, 5))
        } else if (type === "destination") {
          setNeshanDataDestinations(data.slice(0, 5))
        }

        setIsLoading(false)
        setLoadOrigin(false)
        if (type === "destination") {
          setLoadDes(false)
        }
      } catch (error) {
        console.error("Form submission failed:", error)
        setIsLoading(false)
        if (type === "destination") {
          setLoadDes(false)
        }
      }
    }, 1000)
  }
  const handleItemClick = (item: any, type: "origin" | "destination") => {
    setLoadOrigin(false)
    if (type === "origin") {
      setDataOrigin(item)
      setNeshanDataOrigin([])
      form.setValue("origin", item.title)
    } else if (type === "destination") {
      setDataDestination([item])
      setNeshanDataDestinations([])
      form.setValue(`destinations`, item.title)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-1/2 flex-col flex-wrap text-center">
          <AutoComplete
            selectedValue={selectedOrigin}
            onSelectedValueChange={handleOriginSelect}
            searchValue={originSearchValue}
            onSearchValueChange={setOriginSearchValue}
            items={neshanDataOrigin?.map((item) => ({
              address: item?.address,
              category: item?.category,
              location: {
                x: item?.location.x,
                y: item?.location.y,
              },
              region: item?.region,
              title: item?.title,
              type: item?.type,
            }))}
            isLoading={loadingOrigin}
            placeholder={t("origin.placeHolder")}
            lable={t("origin.title")}
            onChangeHandler={(e) => changeHandler(e, "origin")}
            itemClickHandler={(item) => handleItemClick(item, "origin")}
          />
        </div>
        <div className="relative mb-6 mt-8">
          <AutoComplete
            selectedValue={selectedDestinations}
            onSelectedValueChange={handleDestinationSelect}
            searchValue={destinationSearchValues}
            onSearchValueChange={setDestinationSearchValues}
            items={neshanDataDestinations?.map((item) => ({
              address: item?.address,
              category: item?.category,
              location: {
                x: item?.location.x,
                y: item?.location.y,
              },
              region: item?.region,
              title: item?.title,
              type: item?.type,
            }))}
            isLoading={loadingDes}
            placeholder={t("destination.placeHolder")}
            lable={t("destination.title")}
            onChangeHandler={(e) => changeHandler(e, "destination")}
            itemClickHandler={(item) => handleItemClick(item, "destination")}
          />
        </div>
        <SubmitButton isLoading={isLoading}>{t("submit")}</SubmitButton>
      </form>
    </Form>
  )
}
