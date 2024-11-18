import { env } from "@/env.mjs"
import axios, { AxiosResponse } from "axios"

import type { NeshanSearchType } from "@/types/api"

const api = axios.create({
  headers: {
    "api-key": env.NEXT_PUBLIC_NESHAN_KEY,
  },
  baseURL: "https://api.neshan.org",
  timeout: 300000,
})

export function neshanSearchAPI(
  value: string
): Promise<AxiosResponse<NeshanSearchType, any>> {
  // console.log("/api/packages/places/");

  return api.get(`/v1/search?term=${value}&lat=36.6875447&lng=51.3054564`)
}
