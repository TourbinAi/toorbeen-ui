export interface NeshanSearchType {
  count: number
  items: {
    address: string
    category: string
    location: { x: number; y: number; z: any }
    region: string
    title: string
    type: string
  }[]
}
