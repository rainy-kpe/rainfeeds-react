import React, { useRef } from "react"
import { FeedEntry } from "../../../../../utils/rssFeed"
import { makeStyles } from "@material-ui/core/styles"
import ReactTooltip from "react-tooltip"

const useStyles = makeStyles(theme => ({
  entry: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  title: {
    fontWeight: 600
  },
  summary: {
    fontSize: "80%",
    color: "#888"
  },
  image: {
    float: "left",
    marginRight: "8px"
  }
}))

function Entry({ entry, index }: { entry: FeedEntry; index: number }) {
  const classes = useStyles()
  const element = useRef(null)
  let tooltip = `${entry.title}<br>${entry.summary}`.substr(0, 500)
  if (tooltip.length === 500) {
    tooltip += "..."
  }

  return (
    <div
      ref={element}
      data-tip={tooltip}
      data-place={index < 3 ? "bottom" : "top"}
      className={classes.entry}
      onMouseEnter={() => ReactTooltip.show(element.current!)}
      onMouseLeave={() => ReactTooltip.hide(element.current!)}
      onClick={() => window.open(entry.link, "_blank")}
    >
      {entry.image && (
        <img
          onClick={() => window.open(entry.imageLink || entry.link, "_blank")}
          className={classes.image}
          alt={entry.imageLink}
          src={entry.image}
          width="48px"
          height="48px"
        />
      )}
      <span className={classes.title}>{entry.title}</span>
      <br />
      <span className={classes.summary}>{entry.summary}</span>
    </div>
  )
}

export default Entry
