import React from "react";
import ProfilePic from "./profile-pic";
import { Link } from "react-router-dom";
export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className="nav">
                <Link to="/">
                    <div className="hex">
                        {" "}
                        <img src="/bee.jpg" />{" "}
                    </div>
                </Link>
                <div className="blank"></div>
                <Link to="/friends">My Honeycomb</Link>
                <Link to="/chat">Chat</Link>
                <Link to="/users">Discover</Link>
                <a href="/logout">Logout</a>
                <ProfilePic
                    image={this.props.image}
                    toggleModal={() => this.props.toggleModal()}
                />
            </div>
        );
    }
}
