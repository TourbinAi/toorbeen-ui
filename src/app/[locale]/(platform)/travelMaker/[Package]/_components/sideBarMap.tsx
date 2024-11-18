"use client"

import path from "path"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { env } from "@/env.mjs"

import { PackagesPlaceRes } from "@/types/api"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scrollArea"
import { Skeleton } from "@/components/ui/skeleton"

interface MapProps {
  packageId: number
  ResData: PackagesPlaceRes | undefined
}

function SideBarMap({ ResData }: MapProps) {
  const [isLoading, setLoading] = useState(true)
  const [description, setDescription] = useState("")
  const [typedDescription, setTypedDescription] = useState("")
  const [imgURL, setURL] = useState<any[]>([])
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // console.log("Travelplan received:", ResData);
    if (ResData) {
      const desc = ResData.travel_plan
      setDescription(desc)
      const urlImages = ResData.places.map((place: any) => {
        return place
      })
      // console.log(urlImages);
      setURL(urlImages)
      setLoading(false)
    }
  }, [ResData])

  useEffect(() => {
    const charsArray = description.split("")
    charsArray.forEach((char, index) => {
      setTimeout(() => {
        setTypedDescription((prev) => prev + char)
      }, 20 * index)
    })
  }, [description])

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollTop = descriptionRef.current.scrollHeight
    }
  }, [typedDescription])

  return (
    <div className="mr-5 mt-5 flex flex-col flex-wrap rounded-lg border bg-white px-4 pt-3">
      {isLoading ? (
        <>
          <div className="flex h-48 justify-center">
            <Skeleton className="m-2 w-full bg-slate-950" />
          </div>
          <div className="flex h-1/2 flex-col flex-wrap items-center justify-center lg:flex-row">
            <Skeleton className="m-2 h-32 w-2/3 bg-slate-950 lg:w-32" />
            <Skeleton className="m-2 h-32 w-2/3 bg-slate-950 lg:w-32" />
            <Skeleton className="m-2 h-32 w-2/3 bg-slate-950 lg:w-32" />
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <Card>
            <CardContent className="size-full">
              <ScrollArea ref={descriptionRef} className="mt-6 h-72 text-right">
                <p className="text-sm">
                  {typedDescription || "No description available"}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="mb-7 mt-10 flex h-min flex-col flex-wrap items-center justify-center gap-4 lg:flex-row">
            {imgURL?.map((url, index) => (
              <Card
                key={index}
                className="relative size-72 cursor-pointer overflow-hidden"
              >
                <CardContent className="relative size-full">
                  <Link
                    href={`/fa/blog/filband/?blogtype=${url.field1}&blogid=${url.field2}`}
                  >
                    <Image
                      fill
                      src={path.join(
                        env.NEXT_PUBLIC_BACKEND_URL,
                        url.first_image
                      )}
                      alt="image"
                      className="absolute inset-0 size-full object-cover"
                    />
                    <p className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-black/50 py-2 text-center text-lg text-white">
                      {url.name}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SideBarMap
