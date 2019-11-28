import React, { useEffect } from "react";
import axios from "./axios";
// import { useDispatch, useSelector } from "react-redux";
// import { receiveFriendsWannabes } from "./actions";
import ProfilePic from "./profile-pic";
import FriendButton from "./friend-button";
import PrivateChat from "./private-chat";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios
            .get(`/api/user/${this.props.match.params.username}`)
            .then(res => {
                if (res.data.notfound) {
                    this.props.history.push("/");
                } else {
                    this.setState(res.data);
                    axios.get(`/get-friends/${this.state.id}`).then(data => {
                        console.log("this is data complete", data);
                        console.log("this is data.friends", data.data.friends);
                        this.setState({
                            friends: data.data.friends,
                            chatVisible: false
                        });
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/");
            });
    }

    render() {
        console.log("all the DATAAAA!", this.state);
        console.log("does this work?", this.state.relation);
        return (
            <div className="container">
                <div className="other profile">
                    {" "}
                    <ProfilePic image={this.state.image} />
                    <div className="bio">
                        <h1>
                            {this.state.first} {this.state.last}
                        </h1>
                        <p>&quot;{this.state.bio}&quot;</p>
                        {this.state.id && <FriendButton id={this.state.id} />}
                        {this.state.friends && (
                            <button
                                onClick={() =>
                                    this.setState({
                                        chatVisible: !this.state.chatVisible
                                    })
                                }
                            >
                                Chat!
                            </button>
                        )}
                    </div>
                </div>
                {this.state.chatVisible && <PrivateChat id={this.state.id} />}
            </div>
        );
    }
}
