import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
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
        console.log(this.state);
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                username: this.state.username,
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
                    {this.state.error && <p> Oops! Something went wrong</p>}
                </div>
                <input
                    placeholder="Name..."
                    name="first"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    placeholder="Last name..."
                    name="last"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    placeholder="Username..."
                    name="username"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    placeholder="Email..."
                    type="mail"
                    name="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    placeholder="Password..."
                    type="password"
                    name="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>register</button>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}
