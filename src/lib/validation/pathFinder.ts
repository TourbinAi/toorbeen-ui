import { z } from "zod"

export const PathFinderSchemaLanding = z.object({
  origin: z.string().min(1, { message: "Origin is required" }),
  destinations: z.union([
    z.string().min(1, { message: "Destination is required" }),
    z.array(z.string().min(1, { message: "Destination is required" })),
  ]),
})

export const PathFinderSchema = z.object({
  origin: z.string().min(1, { message: "Origin is required" }),
  destinations: z.array(
    z.string().min(1, { message: "Destination is required" })
  ),
})
