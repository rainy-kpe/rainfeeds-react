import React from "react"
import { FeedEntry } from "../../../../../utils/rssFeed"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles(theme => ({
  entry: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  title: {
    fontWeight: 600
  }
}))

function Entry({ entry }: { entry: FeedEntry }) {
  const classes = useStyles()
  const tooltip = `${entry.title} - ${entry.summary}`

  return (
    <Tooltip title={tooltip}>
      <div className={classes.entry}>
        <Typography className={classes.title} variant="subtitle2" component="span">
          {entry.title}
        </Typography>
        <br />
        <Typography variant="body2" component="span" color="secondary">
          {entry.summary}
        </Typography>
      </div>
    </Tooltip>
  )
}

export default Entry
