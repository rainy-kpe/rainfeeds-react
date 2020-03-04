import React, { useReducer, useEffect } from "react"
import { createRSSResource } from "../utils/rssFeed"
import { createHNResource } from "../utils/hnFeed"
import { makeStyles } from "@material-ui/core/styles"
import Alert from "@material-ui/lab/Alert"
import Button from "@material-ui/core/Button"
import Entry from "./Entry"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import ListItem from "@material-ui/core/ListItem"
import Measure from "react-measure"
import { Feed, FeedEntry } from "../utils/feed"

const rssResource = createRSSResource()
const hnResource = createHNResource()

const useStyles = makeStyles(theme => ({
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  feed: {},
  alert: {
    margin: "1rem"
  }
}))

const mergeFeedEntries = (feeds: Feed[]) => {
  const entries = ([] as FeedEntry[]).concat.apply(
    [],
    feeds.map(feed => feed.entries)
  )
  if (entries.length > 0) {
    entries.sort((a: FeedEntry, b: FeedEntry) => {
      const dtA: Date = new Date(a.time)
      const dtB: Date = new Date(b.time)
      return dtB.getTime() - dtA.getTime()
    })
  }
  return entries
}

function renderRow(props: ListChildComponentProps) {
  const { index, style, data } = props

  const entry = data[index] as FeedEntry
  return (
    <ListItem button style={style} key={index}>
      <Entry entry={entry} index={index} />
    </ListItem>
  )
}

function RssFeed({
  urls,
  setDate,
  type,
  updateRate
}: {
  urls: string[]
  setDate: (date: string) => void
  type: "rss" | "hackernews"
  updateRate: number
}) {
  const classes = useStyles()
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const feeds = type === "rss" ? urls.map(url => rssResource.getFeed(url)) : [hnResource.getFeed()]

  useEffect(() => {
    const interval = setInterval(async () => {
      if (type !== "rss") {
        await hnResource.update()
      } else {
        for (const url in urls) {
          await rssResource.update(url)
        }
      }
      forceUpdate()
    }, updateRate * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [updateRate, urls, type])

  const handleVisibilityChange = () => {
    console.log(document.visibilityState)
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange, false)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const fails = feeds.filter(feed => !feed)
  const succeeded = feeds.filter(feed => !!feed) as Feed[]
  const entries = mergeFeedEntries(succeeded)

  const date = succeeded
    .map(feed => (feed.date ? new Date(feed.date) : null))
    .filter(date => !!date)
    .reduce<Date | null>((acc, current) => {
      return acc === null || current! < acc ? current : acc
    }, null)

  if (date) {
    setDate(date.toISOString())
  }

  const handleRetry = () => {
    urls.forEach(url => rssResource.invalidate(url))
    forceUpdate()
  }

  return (
    <div className={classes.feed}>
      {fails.length > 0 && (
        <Alert
          className={classes.alert}
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              RETRY
            </Button>
          }
        >
          Failed to read some of the feeds
        </Alert>
      )}
      <Measure>
        {({ contentRect, measureRef }) => (
          <div ref={measureRef}>
            <FixedSizeList
              itemData={entries}
              height={fails.length > 0 ? 350 : 400}
              width={contentRect.entry.width}
              itemSize={50}
              itemCount={entries.length}
            >
              {renderRow}
            </FixedSizeList>
          </div>
        )}
      </Measure>
    </div>
  )
}

export default RssFeed
