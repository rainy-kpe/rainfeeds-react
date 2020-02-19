import React from "react"
import { createRSSResource } from "../../../../utils/rssFeed"

const rssResource = createRSSResource()

function RssFeed({ urls }: { urls: string[] }) {
  console.log("Rendering RSSFeed")
  throw new Error("Err")
  const feed = rssResource.getFeed(
    "http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1"
  )
  return (
    <div>
      {feed?.entries?.map(entry => (
        <div>{entry.title}</div>
      ))}
    </div>
  )
}

export default RssFeed
