import React from "react"
import { createDataResource } from "../../utils/firebase"
import FeedCard from "./FeedCard/FeedCard"
import { makeStyles } from "@material-ui/core/styles"

const dataResource = createDataResource()

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    margin: "0 2rem"
  }
}))

function FeedCards() {
  const classes = useStyles()
  const cards = dataResource.getCards()
  // TODO: Error handling
  return (
    <div className={classes.container}>
      {cards === undefined
        ? null
        : cards == null
        ? "Reading cards failed"
        : cards.map((card, index) => <FeedCard key={index} card={card} />)}
    </div>
  )
}

export default FeedCards
