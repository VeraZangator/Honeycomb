import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function PrivateChat(info) {
    // console.log("this is the userId", info.id);
    const privateMessages = useSelector(state => state && state.privates);
    // const online = useSelector(state => state && state.online);
    console.log("este es el receiver id?", info.id);
    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            const data = { id: info.id, msg: e.target.value };
            socket.emit("newPrivateMessage", data);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(() => {
        socket.emit("getPrivateMessages", info.id);
        console.log("lets see if it works");
    }, []);

    useEffect(() => {
        console.log(info.id);
        if (!elemRef.current) {
            return;
        }
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateMessages]);

    if (!privateMessages) {
        return null;
    }

    return (
        <div className="chatin prichat">
            <div className="chat-container" ref={elemRef}>
                {privateMessages.length == 0 && (
                    <p>Start a private conversation</p>
                )}
                {privateMessages.length > 0 &&
                    privateMessages.map(msg => (
                        <div key={msg.chatid} className="msg">
                            <div id="user">
                                <Link to={`/user/${msg.username}`}>
                                    <img src={msg.image} />
                                    <span>
                                        {msg.first} {msg.last}:
                                    </span>
                                </Link>
                            </div>
                            <div className="pmsg">
                                <p>{msg.message}</p>
                            </div>
                            <p className="date">{msg.date}</p>
                        </div>
                    ))}
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="Add your message here"
            ></textarea>
        </div>
    );
}
