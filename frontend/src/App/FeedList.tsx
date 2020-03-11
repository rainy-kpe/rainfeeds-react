import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Alert from "@material-ui/lab/Alert"
import Button from "@material-ui/core/Button"
import Entry from "./Entry"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import ListItem from "@material-ui/core/ListItem"
import Measure from "react-measure"
import { FeedContainer, FeedEntry } from "../utils/feed"
import { CardData } from "../utils/firebase"
import { createRSSResource } from "../utils/rssFeed"
import { createHNResource } from "../utils/hnFeed"

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

const rss = createRSSResource()
const hackernews = createHNResource()

const mergeFeedEntries = (feeds: FeedContainer[]) => {
  const entries = ([] as FeedEntry[]).concat.apply(
    [],
    feeds.map(feed => feed.entries.map(entry => (feeds.length > 1 ? { ...entry, origin: feed.title } : entry)))
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

function FeedList({
  card,
  setDate,
  setUrl
}: {
  card: CardData
  setDate: (date: string) => void
  setUrl: (url: string) => void
}) {
  const { type, updateRate, urls } = card
  const classes = useStyles()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const resource = type === "rss" ? rss : hackernews
  const feeds = resource.getFeeds(urls || [])

  useEffect(() => {
    const interval = setInterval(async () => {
      resource.update(urls || [])
      setLastUpdate(new Date())
    }, (updateRate || 60) * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [updateRate, urls, resource])

  useEffect(() => {
    const handleFocusChange = () => {
      const nextUpdate = new Date(lastUpdate.getTime() + (updateRate || 60) * 60000)
      console.log("Focused", nextUpdate)
      if (new Date().getTime() > nextUpdate.getTime()) {
        resource.invalidate(urls || [])
        setLastUpdate(new Date())
      }
    }

    window.addEventListener("focus", handleFocusChange)
    return () => {
      window.removeEventListener("focus", handleFocusChange)
    }
  }, [updateRate, lastUpdate, urls, resource])

  const fails = feeds.filter(feed => !feed)
  const succeeded = feeds.filter(feed => !!feed) as FeedContainer[]
  const entries = mergeFeedEntries(succeeded)

  const date = succeeded
    .map(feed => (feed.date ? new Date(feed.date) : null))
    .filter(date => !!date)
    .reduce<Date | null>((acc, current) => {
      return acc === null || current! < acc ? current : acc
    }, null)

  useEffect(() => {
    if (date) {
      setDate(date.toISOString())
    }
  }, [setDate, date])

  useEffect(() => {
    if (feeds?.length === 1) {
      setUrl(feeds[0]?.link || "")
    }
  }, [setUrl, feeds])

  const handleRetry = () => {
    resource.invalidate(urls || [])
    setLastUpdate(new Date())
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

export default FeedList
