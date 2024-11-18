export interface NeshanDataItemType {
  address: string
  category: string
  location: { x: number; y: number; z: any }
  region: string
  title: string
  type: string
}

export interface NeshanSearchType {
  count: number
  items: NeshanDataItemType[]
}
