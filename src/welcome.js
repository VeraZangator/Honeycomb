import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="welcomecontainer">
                <div id="welcome">
                    <HashRouter>
                        <img width="650px" height="432px" src="/honey.png" />
                        <Route path="/login" component={Login} />
                        <Route exact path="/" component={Register} />
                    </HashRouter>
                </div>
            </div>
        );
    }
}
