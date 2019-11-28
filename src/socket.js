import {
    getMessages,
    newMessage,
    online,
    getPrivateMessages,
    newPrivateMessage,
    receiveFriendsWannabes
} from "./actions";

import * as io from "socket.io-client";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("getMessages", msgs => {
            store.dispatch(getMessages(msgs));
        });

        socket.on("newMessage", msg => {
            store.dispatch(newMessage(msg));
        });
        socket.on("online", ids => {
            store.dispatch(online(ids));
        });
        socket.on("friends", () => {
            store.dispatch(receiveFriendsWannabes());
        });

        socket.on("getPrivateMessages", msg => {
            store.dispatch(getPrivateMessages(msg));
        });
        socket.on("newPrivateMessage", msg => {
            store.dispatch(newPrivateMessage(msg));
        });
    }
};
