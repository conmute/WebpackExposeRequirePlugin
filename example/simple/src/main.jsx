import * as React from "react";
import Example from "./exampleComponent"
import helper from "./helper"

export default function bootstrap() {
    let message = "Hello world!" + helper.sayHi();
    ReactDOM.render(<Example message={message}/>, document.getElementById("application"));
}
