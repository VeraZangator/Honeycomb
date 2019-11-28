import React from "react";

export default function ProfilePic({ first, last, image, toggleModal }) {
    image = image || "/profi.jpg";
    return (
        <div className="pic">
            <div className="hex">
                <img
                    onClick={toggleModal}
                    className="profilepic"
                    src={image}
                    alt={`${first} ${last}`}
                />
            </div>
            <div className="middle">
                <div className="text">Click to update your profile pic</div>
            </div>
        </div>
    );
}
