import React from "react";
import ProfilePic from "./profile-pic";
import Bioedit from "./bioedit";

export default class Profile extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {}

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="profile">
                        <div className="me">
                            <ProfilePic
                                toggleModal={() => this.props.toggleModal()}
                                first={this.props.first}
                                last={this.props.last}
                                image={this.props.image}
                            />
                        </div>
                        <Bioedit
                            first={this.props.first}
                            last={this.props.last}
                            bio={this.props.bio}
                            setBio={this.props.setBio}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
