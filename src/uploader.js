import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("uploader mounted");
        console.log(this.props);
    }

    upload() {
        var fd = new FormData();
        fd.append("image", this.state.file);
        axios
            .post("/upload", fd)
            .then(res => {
                this.props.setImage(res.data.image);
                console.log(this.props.toggleModal);
                this.props.toggleModal();
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="uploader">
                <div>
                    <p onClick={this.props.toggleModal}>X</p>
                    <input
                        type="file"
                        accept="image/*"
                        className="inputfile"
                        onChange={e => {
                            this.setState({ file: e.target.files[0] });
                        }}
                    />
                    <button onClick={() => this.upload()}>Upload</button>
                </div>
            </div>
        );
    }
}
