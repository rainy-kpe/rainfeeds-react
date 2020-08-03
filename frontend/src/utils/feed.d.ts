export interface FeedContainer {
  title?: string
  link?: string
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
  origin?: string
}

export interface FeedResource<T> {
  getFeeds: (urls: string[]) => (T | null | undefined)[]
  invalidate: (urls: string[]) => void
  update: (urls: string[]) => Promise<void>
}
