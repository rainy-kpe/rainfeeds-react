import React, { useEffect } from "react"
import Entry from "./Entry"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import ListItem from "@material-ui/core/ListItem"
import Measure from "react-measure"
import { FeedContainer, FeedEntry, FeedResource } from "../utils/feed"
import { CardData } from "../utils/firebase"

const mergeFeedEntries = (feeds: FeedContainer[]) => {
  const entries = ([] as FeedEntry[]).concat.apply(
    [],
    feeds.map((feed) => feed.entries.map((entry) => (feeds.length > 1 ? { ...entry, origin: feed.title } : entry)))
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
  resource,
  card,
  setDate,
  setUrl,
  setShowAlert,
}: {
  resource: FeedResource<FeedContainer>
  card: CardData
  setDate: (date: string) => void
  setUrl: (url: string) => void
  setShowAlert: (showAlert: boolean) => void
}) {
  const { urls } = card
  const feeds = resource.getFeeds(urls || [])
  const fails = feeds.filter((feed) => !feed)
  const succeeded = feeds.filter((feed) => !!feed) as FeedContainer[]
  const entries = mergeFeedEntries(succeeded)

  useEffect(() => {
    if (fails.length > 0) {
      setShowAlert(true)
    }
  }, [setShowAlert, fails])

  const date = succeeded
    .map((feed) => (feed.date ? new Date(feed.date) : null))
    .filter((date) => !!date)
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

  return (
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
  )
}

export default FeedList
