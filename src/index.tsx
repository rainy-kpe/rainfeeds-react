import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as hot from "react-hot-loader";
import { createStore } from "redux";
import { Provider } from "react-redux";

import * as bg from "./images/bg.jpg";
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

const render = () => {
    ReactDOM.render(
        <hot.AppContainer>
            <Provider store={store}>
                <Rainfeeds />
            </Provider>
        </hot.AppContainer>,
        document.getElementById("root"),
    );
};

render();

// Webpack Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept("./containers/rainfeeds/rainfeeds", () => { render(); });
}
