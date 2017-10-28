import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import { World } from "./components/World";

ReactDOM.render(
    <div>
        <Hello compiler="TypeScript" framework="React" />
        <World />
    </div>,
    document.getElementById("root")
);