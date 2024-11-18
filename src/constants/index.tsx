import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { StaticImageData } from "next/image"
import { icons } from "lucide-react"
import iconEvent from "public/assets/images/iconEvent.png"
import iconFood from "public/assets/images/iconFood.png"
import iconLocation from "public/assets/images/iconLocation.png"
import iconRoute from "public/assets/images/iconRoute.png"
import iconTravelMaker from "public/assets/images/iconTravelMaker.png"
import jungleMountain from "public/assets/images/jungleMountan.jpg"
import mountain from "public/assets/images/mountan.jpg"
import rockyBeach from "public/assets/images/rockyBeach.jpg"
import waterfall from "public/assets/images/waterfall.jpg"

export type MenuItemsType = "pathFinder" | "travelMaker" | "news" | "aboutUs"

export type FeatureDetailsType =
  | "souvenirsAndFood"
  | "celebrationsAndEvents"
  | "travelMaker"
  | "routeFinder"

interface NavbarMenuItemProps {
  name: MenuItemsType
  href: string
}

export const navbarMenuItems: NavbarMenuItemProps[] = [
  {
    name: "aboutUs",
    href: "/blog",
  },
  {
    name: "news",
    href: "/blog",
  },
  {
    name: "travelMaker",
    href: "/travelMaker",
  },
  {
    name: "pathFinder",
    href: "/pathFinder",
  },
]

export type PrimaryFuturesType =
  | "souvenirsAndFood"
  | "tourismPlaces"
  | "celebrationsAndEvents"
  | "travelMaker"
  | "routeFinder"

interface PrimaryFeatureProps {
  icon: StaticImport
  name: PrimaryFuturesType
  href: string
}

export const primaryFeatures: PrimaryFeatureProps[] = [
  {
    icon: iconRoute,
    name: "routeFinder",
    href: "routeFinder",
  },
  {
    icon: iconTravelMaker,
    name: "travelMaker",
    href: "travelMaker",
  },
  {
    icon: iconEvent,
    name: "celebrationsAndEvents",
    href: "celebrationsAndEvents",
  },
  {
    icon: iconLocation,
    name: "tourismPlaces",
    href: "tourismPlaces",
  },
  {
    icon: iconFood,
    name: "souvenirsAndFood",
    href: "souvenirsAndFood",
  },
]

export type VehiclesName = "car" | "train" | "plane"
export const Vehicles: {
  name: VehiclesName
  icon: keyof typeof icons
}[] = [
  {
    name: "car",
    icon: "Car",
  },
  {
    name: "train",
    icon: "TrainFront",
  },
  {
    name: "plane",
    icon: "Plane",
  },
]

export type DirectionsName = "north" | "east" | "south" | "west"
export const Directions: {
  name: DirectionsName
  icon: keyof typeof icons
}[] = [
  {
    name: "north",
    icon: "CircleArrowUp",
  },
  {
    name: "east",
    icon: "CircleArrowRight",
  },
  {
    name: "west",
    icon: "CircleArrowLeft",
  },
  {
    name: "south",
    icon: "CircleArrowDown",
  },
]

export const attractions: {
  name: string
  image: StaticImageData
  like: number
}[] = [
  { name: "آبشار اسرار‌آمیز در دلی کویر", image: waterfall, like: 18 },
  { name: "مسیر صعود آسان به دماوند", image: mountain, like: 31 },
  { name: "سواحل پارسیان، نگین دریای جنوبی", image: rockyBeach, like: 20 },
  { name: "سبزی بی‌پایان در جنگل‌های غرب", image: jungleMountain, like: 47 },
]
