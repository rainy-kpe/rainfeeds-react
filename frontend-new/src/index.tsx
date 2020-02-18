import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App/App"
import * as serviceWorker from "./serviceWorker"

const root = document.getElementById("root") as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
serviceWorker.register()
