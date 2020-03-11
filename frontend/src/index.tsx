import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App/App"
import * as serviceWorker from "./serviceWorker"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"

const root = document.getElementById("root") as HTMLElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
    ,
  </React.StrictMode>
)
serviceWorker.register()
