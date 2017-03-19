import * as React from "react";

export default class Example {
    render() {
        return (
            <div className="landing">
                <h1>
                    Landing page
                </h1>
                <p>
                    Here we can show anything as a landing screen.
                </p>
                <p>
                    {this.props.message}
                </p>
            </div>
        );
    }
}
