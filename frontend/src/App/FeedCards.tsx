import React, { useReducer, useState, useContext } from "react"
import FeedCard from "./FeedCard"
import AddCardDialog from "./AddCardDialog"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import Fab from "@material-ui/core/Fab"
import DataContext from "./DataContext"

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    margin: "0 2rem"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

function FeedCards() {
  const classes = useStyles()
  const data = useContext(DataContext)
  const cards = data.cards.getCards()
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [addCardOpen, setAddCardOpen] = useState(false)

  const handleAddCardClose = (accepted: boolean) => {
    setAddCardOpen(false)
    if (accepted) {
      forceUpdate()
    }
  }

  return (
    <div className={classes.container}>
      {cards === undefined
        ? null
        : cards == null
        ? "Reading cards failed"
        : cards.map((card, index) => <FeedCard key={index} card={card} forceUpdate={forceUpdate} />)}
      <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => setAddCardOpen(true)}>
        <AddIcon />
      </Fab>
      <AddCardDialog
        open={addCardOpen}
        onClose={handleAddCardClose}
        allCardTitles={cards?.map(card => card.title.toLowerCase()) || []}
      />
    </div>
  )
}

export default FeedCards
