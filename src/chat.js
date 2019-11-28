import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Chat(info) {
    const chatMessages = useSelector(state => state && state.messages);
    const online = useSelector(state => state && state.online);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(() => {
        if (!elemRef.current) {
            return;
        }
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        socket.emit("getMessages", info.id);
    }, [chatMessages]);

    useEffect(() => {
        socket.emit("online");
    }, [online]);

    if (!chatMessages || !online) {
        return null;
    }
    const arr = online.filter(id => id.id != info.id);

    return (
        <div className="container">
            <div className="chat">
                <div className="chatin">
                    <h1>PUBLIC ROOM</h1>
                    <div className="chat-container" ref={elemRef}>
                        {chatMessages.length == 0 && (
                            <p>There are no messages</p>
                        )}
                        {chatMessages.length > 0 &&
                            chatMessages.map(msg => (
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
            </div>
            <div className="online">
                <h3>FRIENDS ONLINE ({arr.length})</h3>
                <div className="online2">
                    <div className="online-container">
                        {arr.length == 0 && <p>You are the only user online</p>}
                        {arr.length > 0 &&
                            arr.map(user => (
                                <div key={user.id} className="useronline">
                                    <Link to={`/user/${user.username}`}>
                                        <img width="20px" src={user.image} />
                                        <span>
                                            {user.first} {user.last}{" "}
                                            <span className="on">◉</span>
                                        </span>
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
