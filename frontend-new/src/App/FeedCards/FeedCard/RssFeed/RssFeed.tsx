import React, { useReducer } from "react"
import { createRSSResource, Feed, FeedEntry } from "../../../../utils/rssFeed"
import { makeStyles } from "@material-ui/core/styles"
import Alert from "@material-ui/lab/Alert"
import Button from "@material-ui/core/Button"
import Entry from "./Entry/Entry"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import ListItem from "@material-ui/core/ListItem"
import Measure from "react-measure"

const rssResource = createRSSResource()

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
      <Entry entry={entry} />
    </ListItem>
  )
}

function RssFeed({ urls }: { urls: string[] }) {
  const classes = useStyles()
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const feeds = urls.map(url => rssResource.getFeed(url))

  const fails = feeds.filter(feed => !feed)
  const entries = mergeFeedEntries(feeds.filter(feed => !!feed) as Feed[])

  const handleRetry = () => {
    urls.forEach(url => rssResource.invalidate(url))
    forceUpdate()
  }

  return (
    <div className={classes.feed}>
      {fails.length > 0 || entries.length === 0 ? (
        <Alert
          className={classes.alert}
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              RETRY
            </Button>
          }
        >
          Failed to read the feeds
        </Alert>
      ) : (
        <Measure>
          {({ contentRect, measureRef }) => (
            <div ref={measureRef}>
              <FixedSizeList
                itemData={entries}
                height={400}
                width={contentRect.entry.width}
                itemSize={50}
                itemCount={entries.length}
              >
                {renderRow}
              </FixedSizeList>
            </div>
          )}
        </Measure>
      )}
    </div>
  )
}

export default RssFeed
