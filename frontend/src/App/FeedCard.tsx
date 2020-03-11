import React, { Suspense, useState, useRef } from "react"
import { CardData } from "../utils/firebase"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import FeedList from "./FeedList"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import TimeAgo from "react-timeago"
import CardMenu from "./CardMenu"
import { useDrag, useDrop } from "react-dnd"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles(theme => ({
  card: {
    fontSize: "90%",
    flex: "1 0 25rem",
    boxSizing: "border-box",
    margin: "1rem",
    maxWidth: "calc(33.33333% - 2rem)",
    [theme.breakpoints.down("md")]: {
      maxWidth: "calc(50% - 2rem)"
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "calc(100% - 2rem)"
    }
  },
  grid: {
    display: "flex",
    minHeight: "400px",
    maxHeight: "400px"
  },
  content: {
    padding: "0 !important"
  },
  title: {
    padding: "0 16px",
    background: "#eeeeee",
    display: "flex",
    alignItems: "center"
  },
  date: {
    color: "#888888",
    marginLeft: "8px",
    flex: 1
  },
  menu: {
    justifySelf: "right"
  }
}))

function FeedCard({
  card,
  updateCard,
  removeCard
}: {
  card: CardData
  updateCard: (updated: CardData) => Promise<void>
  removeCard: (removed: CardData) => Promise<void>
}) {
  const classes = useStyles()
  const [date, setDate] = useState("")
  const [url, setUrl] = useState("")
  const ref = useRef(null)

  const [, connectDrag] = useDrag({
    item: { title: card.title, type: "CARD" }
  })

  const [, connectDrop] = useDrop({
    accept: "CARD",
    hover(hoveredOverItem: any) {
      if (hoveredOverItem.title === card.title) {
        return
      }
      console.log("Hovering", hoveredOverItem, card.title)
    }
  })

  connectDrag(ref)
  connectDrop(ref)

  return (
    <Card ref={ref} className={classes.card}>
      <CardContent className={classes.content}>
        <div className={classes.title}>
          <Typography variant="h6">
            {url ? (
              <Link href={url} target="_blank">
                {card.title}
              </Link>
            ) : (
              card.title
            )}
          </Typography>
          <span className={classes.date}>{date && <TimeAgo date={date} />}</span>
          <span className={classes.menu}>
            <CardMenu card={card} updateCard={updateCard} removeCard={removeCard} />
          </span>
        </div>
        <Suspense
          fallback={
            <Grid container className={classes.grid} justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          }
        >
          <FeedList card={card} setDate={setDate} setUrl={setUrl} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export default FeedCard
