import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./header";
import Profile from "./profile";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            image: "",
            bio: "",
            uploaderIsVisible: false,
            hover: false
        };
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState(data);
    }

    toggleModal() {
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }

    setImage(image) {
        this.setState({ image: image });
    }

    setBio(bio) {
        this.setState({ bio: bio });
    }
    render() {
        if (!this.state.first) {
            return null;
        }

        const id = this.state.id;
        return (
            <React.Fragment>
                <div className="flier">
                    <img width="200px" src="/bee2.png" />
                </div>

                <BrowserRouter>
                    <Header
                        image={this.state.image}
                        toggleModal={() => this.toggleModal()}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                                onClick={this.uploaderIsVisible}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                toggleModal={this.toggleModal}
                            />
                        )}
                    />
                    <Route
                        path="/user/:username"
                        render={props => (
                            <OtherProfile
                                image={this.state.image}
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route exact path="/users" component={FindPeople} />
                    <Route exact path="/friends" component={Friends} />
                    <Route path="/chat" render={() => <Chat id={id} />} />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={this.setImage}
                            toggleModal={this.toggleModal}
                        />
                    )}
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
