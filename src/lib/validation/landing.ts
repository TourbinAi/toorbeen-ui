import { z } from "zod"

export const pathFinder = z.object({
  origin: z.string(),
  destination: z.string(),
})

export const souvenirsAndFood = z.object({
  food: z.string(),
  city: z.string(),
})

export const celebrationsAndEvents = z.object({
  occasion: z.string(),
})

export const travelMaker = z.object({
  origin: z.string(),
  distance: z.number(),
  people: z.number(),
  duration: z.number(),
  vehicle: z.string(),
  style: z.string(),
  direction: z.string(),
})
