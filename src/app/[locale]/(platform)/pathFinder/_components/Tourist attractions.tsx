import path from "path"

import * as React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { env } from "@/env.mjs"

import { AttractionsAPI } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSpacing({ destination }: { destination: any[] }) {
  const [destinationInfo, setInfo] = useState<any[]>([])
  const [responseData, setData] = useState<any[]>([])
  const [regionID, setId] = useState([
    { region: "مازندران", id: 1 },
    { region: "گیلان", id: 2 },
    { region: "البرز", id: 3 },
    { region: "تهران", id: 4 },
    { region: "همدان", id: 5 },
    { region: "قزوین", id: 6 },
    { region: "اصفهان", id: 7 },
    { region: "سمنان", id: 8 },
    { region: "آذربایجان شرقی", id: 9 },
    { region: "آذربایجان غربی", id: 10 },
    { region: "اردبیل", id: 11 },
    { region: "بوشهر", id: 12 },
    { region: "ایلام", id: 13 },
    { region: "چهارمحال و بختیاری", id: 14 },
    { region: "خراسان رضوی", id: 15 },
    { region: "خراسان جنوبی", id: 16 },
    { region: "خراسان شمالی", id: 17 },
    { region: "خوزستان", id: 18 },
    { region: "زنجان", id: 19 },
    { region: "سیستان و بلوچستان", id: 20 },
    { region: "فارس", id: 21 },
    { region: "قم", id: 22 },
    { region: "کردستان", id: 23 },
    { region: "کهگیلویه و بویراحمد", id: 24 },
    { region: "کرمان", id: 25 },
    { region: "گلستان", id: 26 },
    { region: "لرستان", id: 27 },
    { region: "مرکزی", id: 28 },
    { region: "یزد", id: 29 },
    { region: "هرمزگان", id: 30 },
    { region: "کرمانشاه", id: 31 },
  ])
  const [filterRegionState, setFilter] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!destination || destination.length === 0) return

      setInfo(destination)
      // console.log(destination.at(-1));

      const filterRegion = regionID.find((regionItem) =>
        destination?.at(-1)?.region?.includes(regionItem.region)
      )
      if (!filterRegion) return
      setFilter(filterRegion)
      // console.log(filterRegion);

      try {
        const response = await AttractionsAPI(filterRegion.id)
        // console.log(response);
        setData(response.data)
      } catch (err) {
        // console.log(err);
      }
    }

    fetchData()
  }, [destination])

  const filteredData = responseData.filter((item: any) => item.tag_id)

  if (!filteredData.length) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {filteredData.map((item: any, index: number) => (
        <div key={index} className="w-full">
          <h1 className="mb-2 mt-3 w-2/3 rounded-md bg-white text-sm md:w-1/5">
            {item.tag_id === 8
              ? `جاذبه‌های طبیعی ${filterRegionState?.region} `
              : item.tag_id === 9
                ? `جاذبه‌های تاریخی فرهنگی ${filterRegionState?.region} `
                : `جاذبه‌های گردشگری ${filterRegionState?.region}`}
          </h1>
          <Carousel
            dir="ltr"
            className="flex w-full items-center justify-center"
          >
            <CarouselContent className="flex gap-1">
              {item.blogs.map((blog: any, blogIndex: number) => {
                return (
                  <CarouselItem
                    key={blogIndex}
                    className="flex shrink-0 basis-80 flex-col items-center rounded-2xl"
                  >
                    <Card className="relative h-52 w-72 cursor-pointer overflow-hidden">
                      <CardContent className="relative size-full">
                        <Image
                          fill
                          src={path.join(
                            env.NEXT_PUBLIC_BACKEND_URL,
                            blog.card_image
                          )}
                          alt={blog.place_name}
                          className="absolute inset-0 size-full object-cover"
                        />
                        <span className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-black/50 py-2 text-center text-white">
                          {blog.place_name || "NAME PLACE"}
                        </span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-1" />
            <CarouselNext className="absolute right-1" />
          </Carousel>
        </div>
      ))}
    </div>
  )
}
