export interface TravelMakerListReq {
  time_limit: 1 | 2 | 3
  tags: number[]
  origin_of_trip: string
  distance_from_origin: 3 | 5 | 7
  route_type: 1 | 2
  stop_and_quit: 1 | 2
  means_of_travel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  direction_of_movement?: 1 | 2 | 3 | 4
  count_of_elder_people?: number
  overnight_stay?: 1 | 2 | 3
}

export type TravelMakerListRes = Array<{
  id: number
  name: string
  description: string
  places: {
    id: number
    name: string
    image_url: string
  }[]
  longitude: string
  latitude: string
}>

export interface PackagesPlaceReq {
  package_id: number
}

export type PackagesPlaceRes = {
  description: string
  travel_plan: string
  places: {
    id: number
    name: string
    longitude: string
    latitude: string
    first_image: string
    field1: string
    field2: string
    field3: string
    field4: string
    rating: number
  }[]
}

export type AttractionsCarouselRes = {
  tag_id: number
  blogs: {
    id: number
    title: string
    body: string
    place_name: string
    card_image: string
    link: string
  }[]
}[]

export type AttractionsLandingRes = {
  id: number
  title: string
  body: string
  place_name: string
  card_image: string
  link: string
}[]

export interface BlogRes {
  coverImageUrl: string
  title: string
  createdDate: Date
  content: string
  weather: {
    temp: number // in celsius
    precipitation: number
    humidity: number
    wind: number
  }
  options: string[]
  tags: string[]
}
