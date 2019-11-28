import React from "react";
import axios from "./axios";

export default class Bioedit extends React.Component {
    constructor() {
        super();
        this.state = {
            bioEditorIsVisible: false,
            bio: ""
        };
    }

    componentDidMount() {
        this.setState({ bio: this.props.bio });
    }

    editBio() {
        console.log("this is bio now", this.state.bio);
        axios
            .post("/editbio", { bio: this.state.bio })
            .then(res => {
                this.props.setBio(res.data.bio);
                this.setState({ bioEditorIsVisible: false });
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="bioedit">
                <h1>
                    {" "}
                    Hello, {this.props.first} {""}
                </h1>
                <div className="ifbio">
                    {this.props.bio && <p>&quot;{this.props.bio}&quot;</p>}
                </div>

                <div className="edit">
                    {this.state.bioEditorIsVisible && (
                        <div className="ifedit">
                            <textarea
                                defaultValue={this.props.bio}
                                name="bio"
                                onChange={e => {
                                    this.setState({ bio: e.target.value });
                                }}
                            />
                            <button
                                className="save"
                                onClick={() => this.editBio()}
                            >
                                Save
                            </button>{" "}
                        </div>
                    )}
                </div>
                {!this.props.bio && !this.state.bioEditorIsVisible && (
                    <button
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: !this.state
                                    .bioEditorIsVisible
                            })
                        }
                    >
                        Add bio now!
                    </button>
                )}
                {this.props.bio && !this.state.bioEditorIsVisible && (
                    <button
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: !this.state
                                    .bioEditorIsVisible
                            })
                        }
                    >
                        Edit Bio
                    </button>
                )}
            </div>
        );
    }
}
