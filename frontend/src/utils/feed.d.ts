export interface FeedContainer {
  title?: string
  date: string
  entries: FeedEntry[]
}

export interface FeedEntry {
  title: string
  summary: string
  time: string
  link?: string
  image?: string
  imageLink?: string
  id?: string
}
