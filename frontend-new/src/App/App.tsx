import React, { Suspense, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"
import Grid from "@material-ui/core/Grid"
import Header from "./Header"
import ReactTooltip from "react-tooltip"
import FeedCards from "./FeedCards/FeedCards"
import Alert from "@material-ui/lab/Alert"
import { login, logout } from "../utils/firebase"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: `url(${process.env.PUBLIC_URL}/bg.jpg)`
  },
  tooltip: {
    maxWidth: "400px"
  }
}))

function App() {
  const classes = useStyles()
  const [isAuth, setAuth] = useState(false)
  const [showAlert, setShowAlert] = useState<string | null>(null)

  const handleLogin = async (user: firebase.User | null) => {
    try {
      if (!!showAlert) {
        setShowAlert(null)
      }
      if (!isAuth) {
        setAuth(!!user || (await login()))
      }
    } catch (error) {
      console.error(error)
      setShowAlert("Login failed")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setAuth(false)
    } catch (error) {
      console.error(error)
      setShowAlert("Logout failed")
    }
  }

  return (
    <div className={classes.root}>
      <Suspense
        fallback={
          <Grid container className={classes.root} justify="center" alignItems="center">
            <CircularProgress />
          </Grid>
        }
      >
        <Header onLogin={handleLogin} onLogout={handleLogout} />
        <Suspense
          fallback={
            <Grid container className={classes.root} justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          }
        >
          {isAuth && <FeedCards />}
          <ReactTooltip className={classes.tooltip} multiline={true} scrollHide={true} />
          {showAlert && <Alert severity="error">{showAlert}</Alert>}
        </Suspense>
      </Suspense>
    </div>
  )
}

export default App
