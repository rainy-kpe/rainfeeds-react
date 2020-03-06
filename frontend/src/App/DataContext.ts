import React from "react"
import { createRSSResource } from "../utils/rssFeed"
import { createHNResource } from "../utils/hnFeed"
import { createCardResource } from "../utils/firebase"

export interface Data {
  cards: ReturnType<typeof createCardResource>
  rss: ReturnType<typeof createRSSResource>
  hackernews: ReturnType<typeof createHNResource>
}

const cards = createCardResource()
const rss = createRSSResource()
const hackernews = createHNResource()

const DataContext = React.createContext<Data>({ cards, rss, hackernews })

export default DataContext
