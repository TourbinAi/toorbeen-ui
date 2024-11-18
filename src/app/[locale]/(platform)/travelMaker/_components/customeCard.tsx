"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import * as d3 from "d3"
import { ChevronLeft, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Stop = {
  name: string
  type: "start" | "end" | "middle"
  image: string
}

type RouteCardProps = {
  id: string
  title: string
  rating: number
  stops: Stop[]
}

export default function Component({
  id = "route123",
  title = "سفر یک روزه از تهران به ۳ مقصد",
  rating = 4.5,
  stops = [
    {
      name: "تهران",
      type: "start",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "چنگل سینوا",
      type: "middle",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "ساحل متل قو",
      type: "end",
      image:
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80",
    },
  ],
}: RouteCardProps) {
  const router = useRouter()
  const [selectedStop, setSelectedStop] = useState<string>(stops[0]?.name || "")
  const svgRef = useRef<SVGSVGElement | null>(null)

  const handleViewDetails = () => {
    router.push(`/route/${id}`)
  }

  const handleStopClick = (stopName: string) => {
    setSelectedStop(stopName)
  }

  const selectedStopData = stops.find((stop) => stop.name === selectedStop)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 100
    const height = 200
    const nodeRadius = 10

    svg.selectAll("*").remove()

    const yScale = d3
      .scaleLinear()
      .domain([0, stops.length - 1])
      .range([height - nodeRadius, nodeRadius])

    // Draw the dashed line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", yScale(0))
      .attr("x2", width / 2)
      .attr("y2", yScale(stops.length - 1))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")

    // Draw nodes
    stops.forEach((stop, i) => {
      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${yScale(i)})`)
        .attr("cursor", "pointer")

      g.append("circle")
        .attr("r", stop.name === selectedStop ? nodeRadius * 1.2 : nodeRadius)
        .attr(
          "fill",
          stop.type === "start" || stop.type === "end" ? "#FBBF24" : "#FFFFFF"
        )
        .attr("stroke", stop.name === selectedStop ? "white" : "none")
        .attr("stroke-width", 2)

      g.append("title").text(stop.name)

      g.on("click", () => handleStopClick(stop.name))
    })
  }, [stops, selectedStop])

  return (
    <Card className="relative aspect-[21/9] w-full max-w-7xl overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${selectedStopData?.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
      <CardContent className="relative flex h-full flex-col justify-between p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-3 text-4xl font-bold">{title}</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-6 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                />
              ))}
              <span className="ml-2 text-xl">{rating.toFixed(1)}</span>
            </div>
          </div>
          <svg
            ref={svgRef}
            width="100"
            height="200"
            className="overflow-visible"
          />
        </div>
        <div className="mt-6 self-start">
          <Button
            onClick={handleViewDetails}
            className="bg-white px-8 py-3 text-xl text-black hover:bg-gray-200"
          >
            مشاهده برنامه سفر <ChevronLeft className="ml-2 size-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
