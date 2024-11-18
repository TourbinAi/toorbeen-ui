import { z } from "zod"

export const TravelMakerSelectValues = {
  duration: ["1d", "2d", "3d"],
  placeNature: [
    "shadowAndGreen",
    "sunnyAndSea",
    "MountainAndDesert",
    "Entertainment",
    "HistoryAndCulture",
  ],
  distance: ["3h", "5h", "7h"],
  route: ["easy", "hard", "none"],
  disState: ["oneWay", "multiple"],
  vehicle: [
    "car",
    "off-road",
    "bus",
    "bicycle",
    "Car-offroad",
    "offroad-bicycle",
    "car-bicycle",
    "nissan-car",
  ],
  direction: ["north", "south", "west", "east"],
  accommodation: ["camp", "hotel", "visit"],
} as const

export const SidebarSchema = z.object({
  origin: z.string({ required_error: " required" }).min(2, ""),
  distance: z.enum(TravelMakerSelectValues.distance, {
    required_error: " required",
  }),
  tags: z.array(z.enum(TravelMakerSelectValues.placeNature)),
  duration: z.enum(TravelMakerSelectValues.duration, {
    required_error: " required",
  }),
  route: z.enum(TravelMakerSelectValues.route, { required_error: " required" }),
  vehicle: z.enum(TravelMakerSelectValues.vehicle, {
    required_error: " required",
  }),
  routStop: z.enum(TravelMakerSelectValues.disState, {
    required_error: " required",
  }),
  direction: z.enum(TravelMakerSelectValues.direction),
  oldPerson: z.boolean(),
  accommodation: z.enum(TravelMakerSelectValues.accommodation),
  date: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
  }),
})
