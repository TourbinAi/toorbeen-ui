"use client"

import path from "path"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { env } from "@/env.mjs"
import polyline from "@mapbox/polyline"
import * as Sentry from "@sentry/nextjs"
import axios from "axios"

import { PackagesPlaceRes } from "@/types/api"

import { postData } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import StarRating from "@/components/ui/starRating"

// Dynamic import for MapContainer with SSR disabled
const MapWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
)

const TileLayerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
)

const MarkerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
)

const PolylineWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  {
    ssr: false,
  }
)

const PopupWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  {
    ssr: false,
  }
)

let L: any = null
if (typeof window !== "undefined") {
  L = require("leaflet")
  require("leaflet/dist/leaflet.css")
}

interface Info {
  type: string
  originLat: number
  originLong: number
  destinationLat: number
  destinationLong: number
  traffic: boolean
  oddeven: boolean
  alternative: boolean
  bearing: number
}

interface Waypoint {
  latitude: number
  longitude: number
}

interface Leg {
  steps: Array<{ polyline: string }>
}

interface FullData {
  legs: Leg[]
}

interface MapProps {
  packageId: number
  setPlan: Dispatch<SetStateAction<PackagesPlaceRes | undefined>>
}

function Map({ packageId, setPlan }: MapProps) {
  const [route, setRoute] = useState<any[]>([])
  const [fulldata, setData] = useState<FullData>({ legs: [] })
  const [waypoint, setWaypoint] = useState<any[]>([])
  const [info, setinfo] = useState<Info>({
    type: "car",
    originLat: 35.69524140795555, // Tehran
    originLong: 51.40891271972657,
    destinationLat: 35.534802198378785,
    destinationLong: 57.126487269498455,
    traffic: false,
    oddeven: false,
    alternative: false,
    bearing: 170,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await postData(packageId)
        // console.log(responseData);
        setPlan(responseData.data)
        const waypointInfo = responseData.data.places.map((place) => ({
          longitude: place.latitude,
          latitude: place.longitude,
          namePlace: place.name,
          imagePlace: place.first_image,
          rateStar: place.rating,
        }))

        setWaypoint(waypointInfo)
      } catch (error) {
        Sentry.captureException(error)
        console.error(error)
      }
    }
    fetchData()
  }, [packageId, setPlan])

  useEffect(() => {
    async function apiReq() {
      let waypointparams = waypoint
        .map((p) => `${p.longitude},${p.latitude}%7C`)
        .join("")
      let waypointreq = waypointparams.slice(0, -3) // Remove last "%7C"

      try {
        const response = await axios.get(
          `https://api.neshan.org/v4/direction?type=${info.type}&origin=${info.originLat},${info.originLong}&destination=${info.originLat},${info.originLong}&waypoints=${waypointreq}&avoidTrafficZone=${info.traffic}&avoidOddEvenZone=${info.oddeven}&alternative=${info.alternative}&bearing=${info.bearing}`,
          {
            headers: { "api-key": env.NEXT_PUBLIC_NESHAN_KEY },
          }
        )
        const data = response.data.routes[0]
        setData(data)
        const decodedPolyline = decodeLegsPolylines(data.legs)
        setRoute(decodedPolyline)
      } catch (error) {
        console.error("Error fetching directions:", error)
      }
    }

    if (waypoint.length > 0) {
      apiReq()
    }
  }, [waypoint, info])

  const decodeLegsPolylines = (legs: Leg[]) => {
    return legs.flatMap((leg) =>
      leg.steps.flatMap((step) => polyline.decode(step.polyline))
    )
  }

  const center: [number, number] = [info.originLat, info.originLong]

  let customIcon = null
  if (L) {
    customIcon = new L.Icon({
      iconUrl: "/assets/icons/markerMap.png",
      iconSize: [15, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    })

    L.Marker.prototype.options.icon = customIcon
  }

  return (
    <div>
      <MapWithNoSSR
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        className="h-screen w-full"
      >
        <TileLayerWithNoSSR
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        {route.length > 0 && (
          <>
            {waypoint.map((position, idx) => (
              <MarkerWithNoSSR
                key={idx}
                position={
                  [position.longitude, position.latitude] as [number, number]
                }
              >
                <PopupWithNoSSR>
                  <Card className="relative size-72 cursor-pointer overflow-hidden">
                    <CardContent className="relative size-full">
                      <Image
                        fill
                        src={path.join(
                          env.NEXT_PUBLIC_BACKEND_URL,
                          position.imagePlace
                        )}
                        alt="image"
                        className="absolute inset-0 size-full object-cover"
                      />
                      <span className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-black/50 py-2 text-center text-white">
                        {position.namePlace}
                      </span>
                      <StarRating rating={position.rateStar} />
                    </CardContent>
                  </Card>
                </PopupWithNoSSR>
              </MarkerWithNoSSR>
            ))}

            <MarkerWithNoSSR position={[info.originLat, info.originLong]}>
              <PopupWithNoSSR>Your starting point</PopupWithNoSSR>
            </MarkerWithNoSSR>

            <PolylineWithNoSSR positions={route} color="red" />
          </>
        )}
      </MapWithNoSSR>
    </div>
  )
}

export default Map
