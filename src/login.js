import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(() => {
                location.replace("/");
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div className="form">
                <div className="error">
                    {this.state.error && <div> Oops! Something went wrong</div>}
                </div>
                <input
                    placeholder="Email..."
                    name="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    placeholder="Password..."
                    type="password"
                    name="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>login</button>
                <Link to="/">Click here to Register!</Link>
            </div>
        );
    }
}
