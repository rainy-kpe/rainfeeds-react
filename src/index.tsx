import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";

import { Hello } from "./components/Hello";
import { World } from "./components/World";

function rootElement() {
    const element = document.createElement('div');
    element.id = "root";
    return element;
}
  
document.body.appendChild(rootElement());

ReactDOM.render(
    <div>
        <Hello compiler="TypeScript" framework="React" />
        <World />
    </div>,
    document.getElementById("root")
);