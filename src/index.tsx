import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as hot from "react-hot-loader";

import { Hello } from "./components/Hello";
import { World } from "./components/World";

function rootElement() {
    const element = document.createElement("div");
    element.id = "root";
    return element;
}

document.body.appendChild(rootElement());

const App = <div>
        <Hello compiler="TypeScript" framework="React" />
        <World />
    </div>;

const render = () => {
    ReactDOM.render(
        <hot.AppContainer>
            <div>
                <Hello compiler="TypeScript" framework="React" />
                <World />
            </div>
        </hot.AppContainer>,
        document.getElementById("root"),
    );
};

render();

// Webpack Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept("./components/Hello", () => { render(); });
}
