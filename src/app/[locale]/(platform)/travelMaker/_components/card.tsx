"use client"

import path from "path"

import { useEffect, useRef, useState } from "react"
import Image, { StaticImageData } from "next/image"
import { env } from "@/env.mjs"
import * as d3 from "d3"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { useRouter } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type City = {
  id: number
  name: string
  image_url: string
}

type RouteCardProps = {
  latitude: string
  longitude: string
  id: number
  name: string
  description: string
  cities: City[]
}

export default function RouteCard({ id, name, cities }: RouteCardProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<City>(
    cities.length > 0 && cities
      ? (cities[cities.length - 1] as City)
      : ({ id: 0, name: "", image_url: "" } as City)
  )
  const [images, setImages] = useState<{ [key: string]: StaticImageData }>({})
  const svgRef = useRef<SVGSVGElement | null>(null)
  const t = useTranslations("travelMaker.card")

  useEffect(() => {
    const preloadImages = async () => {
      const newImages: { [key: string]: StaticImageData } = {}
      try {
        await Promise.all(
          cities.map(async (city) => {
            const imageUrl = path.join(
              env.NEXT_PUBLIC_BACKEND_URL,
              city.image_url
            )
            const response = await fetch(imageUrl)
            if (!response.ok) {
              throw new Error(`Failed to fetch image for city: ${city.name}`)
            }

            const blob = await response.blob()
            const objectUrl = URL.createObjectURL(blob)
            newImages[city.name] = {
              src: objectUrl,
              height: 300,
              width: 500,
              blurDataURL: objectUrl,
            }
          })
        )
      } catch (error) {
        console.error("Error preloading images:", error)
      } finally {
        setImages(newImages)
      }
    }

    preloadImages()

    return () => {
      Object.values(images).forEach((image) => {
        if (image.src) {
          URL.revokeObjectURL(image.src)
        }
      })
    }
  }, [cities, images])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 100
    const height = 200
    const nodeRadius = 10

    svg.selectAll("*").remove()

    const yScale = d3
      .scaleLinear()
      .domain([0, cities.length - 1])
      .range([height - nodeRadius, nodeRadius])

    // Draw the dashed line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", yScale(0))
      .attr("x2", width / 2)
      .attr("y2", yScale(cities.length - 1))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")

    // Draw nodes
    cities.forEach((city, i) => {
      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${yScale(i)})`)
        .attr("cursor", "pointer")

      const circle = g
        .append("circle")
        .attr(
          "r",
          city.name === selectedCity.name ? nodeRadius * 1.2 : nodeRadius
        )
        .attr("stroke-width", 2)

      // Apply Tailwind primary color if selected, otherwise white
      circle
        .classed("fill-primary", city.name === selectedCity.name)
        .classed("fill-white", city.name !== selectedCity.name)

      g.append("title").text(city.name)

      g.on("click", () => setSelectedCity(city))
    })
  }, [cities, selectedCity.name])

  const handleViewDetails = () => {
    router.push(`/travelMaker/${id}/map`)
  }

  return (
    <Card className="relative h-[250px] w-full max-w-7xl overflow-hidden">
      <Image
        fill
        src={path.join(env.NEXT_PUBLIC_BACKEND_URL, selectedCity.image_url)}
        alt={selectedCity.name}
        className="absolute inset-0 w-full object-cover lg:h-auto lg:max-h-none lg:w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
      <CardContent className="relative flex h-full flex-col justify-between p-8 text-white">
        <span className="text-md absolute left-2 top-2 cursor-default rounded-full bg-black/60 px-4 py-2">
          {selectedCity.name}
        </span>
        <div className="flex size-full items-center justify-between">
          <svg
            ref={svgRef}
            width="100"
            height="200"
            className="overflow-visible"
          />
          <div className="flex w-full items-center justify-between lg:w-1/2">
            <div className="relative flex size-full flex-col items-center justify-center gap-2">
              <h2 className="text-gl text-wrap text-center align-middle font-bold lg:text-xl">
                {name}
              </h2>
              <Button
                onClick={handleViewDetails}
                className="bg-white px-2 py-3 text-sm text-black hover:bg-gray-200 lg:text-xl"
              >
                {t("seeMore")} <ChevronLeft className="size-6" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
