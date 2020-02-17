import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as hot from "react-hot-loader";
import { Provider } from "react-redux";

import * as style from "./styles/index.styl";
import { store } from "./store";

import { Rainfeeds } from "./containers/rainfeeds/rainfeeds";

// Add the root div to the body
function rootElement() {
    const element = document.createElement("div");
    element.id = "root";
    return element;
}

document.body.appendChild(rootElement());
document.body.className = style.bg;

let root: any;
if (BUILD === "development") {
    root = <hot.AppContainer>
                <Provider store={store}>
                    <Rainfeeds />
                </Provider>
            </hot.AppContainer>;
} else {
    root = <Provider store={store}>
               <Rainfeeds />
           </Provider>;
}

const render = () => {
    ReactDOM.render(root, document.getElementById("root"));
};

render();

if (BUILD === "development") {
    // Webpack Hot Module Replacement API
    if ((module as any).hot) {
        (module as any).hot.accept("./containers/rainfeeds/rainfeeds", () => { render(); });
    }
}
