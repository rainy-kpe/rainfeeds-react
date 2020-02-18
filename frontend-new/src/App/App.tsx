import React, { Suspense, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import Alert from "@material-ui/lab/Alert"

import Auth from "./Auth/Auth"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  appBar: {
    backgroundColor: "black"
  },
  title: {
    flexGrow: 1
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
        <Typography variant="h4" className={classes.title}>
          Hello WOrld
        </Typography>
        {showAlert && <Alert severity="error">Login failed!</Alert>}
      </Suspense>
    </div>
  )
}

export default App
