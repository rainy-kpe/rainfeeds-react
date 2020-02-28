import React, { Suspense, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import Alert from "@material-ui/lab/Alert"
import Auth from "./Auth"
import FeedCards from "./FeedCards"
import ReactTooltip from "react-tooltip"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: `url(${process.env.PUBLIC_URL}/bg.jpg)`
  },
  appBar: {
    backgroundColor: "black"
  },
  title: {
    flexGrow: 1
  },
  tooltip: {
    maxWidth: "400px"
  }
}))

function App() {
  const classes = useStyles()
  const [showAlert, setShowAlert] = useState(false)
  return (
    <div className={classes.root}>
      <Suspense
        fallback={
          <Grid container className={classes.root} justify="center" alignItems="center">
            <CircularProgress />
          </Grid>
        }
      >
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              Rainfeeds 3.0
            </Typography>
            <Auth setShowAlert={setShowAlert} />
          </Toolbar>
        </AppBar>
        <FeedCards />
        <ReactTooltip className={classes.tooltip} multiline={true} scrollHide={true} />
        {showAlert && <Alert severity="error">Login failed!</Alert>}
      </Suspense>
    </div>
  )
}

export default App
