import * as React from "react";
import * as ReactDOM from "react-dom";
import Example from "./component/Example"
import * as helper from "./helper"

export function bootstrap() {
    let message = "Hello world! " + helper.sayHi();
    ReactDOM.render(<Example message={message}/>, document.getElementById("application"));
}
