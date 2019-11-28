import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [button, setButton] = useState("");
    const [friends, setFriends] = useState(false);
    const [unfriends, setUnfriends] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/get-initial-status/${props.id}`);
            if (!data.relation) {
                setButton("I wanna beefriend you");
            } else {
                if (data.friends) {
                    setButton("Unfriend");
                } else {
                    if (props.id == data.rows[0].receiver_id) {
                        setButton("Cancel friend request");
                    } else {
                        setButton("Accept friend request");
                    }
                }
            }
        })();
    }, [props]);

    function handleClick() {
        if (button === "I wanna beefriend you") {
            (async () => {
                await axios.post(`/send-request/${props.id}`);
                setButton("Cancel friend request");
            })();
        } else if (button === "Accept friend request") {
            (async () => {
                await axios.post(`/accept-request/${props.id}`);
                setButton("Unfriend");
                setFriends(true);
                setTimeout(() => {
                    document
                        .querySelector(".friendsmsg")
                        .setAttribute("class", "nofriendsmsg");
                }, 1000);
            })();
        } else if (
            button === "Unfriend" ||
            button === "Cancel friend request"
        ) {
            (async () => {
                await axios.post(`/unfriend/${props.id}`);
                setButton("I wanna beefriend you");
                setUnfriends(true);
                setTimeout(() => {
                    document
                        .querySelector(".friendsmsg")
                        .setAttribute("class", "nofriendsmsg");
                }, 3000);
            })();
        }
    }

    return (
        <div className="friendbuttoncontainer">
            <button onClick={handleClick}>{button}</button>
            {friends && <p className="friendsmsg">You are now friends♥</p>}
            {unfriends && (
                <p className="friendsmsg">You are not friends anymore :(</p>
            )}
        </div>
    );
}
