import axios from "./axios";
// import { socket } from "./socket";

//friends
export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    return {
        type: "RECEIVE_USERS",
        users: data.relations,
        pending: data.rows
    };
}

export async function acceptFriendRequest(id) {
    await axios.post(`/accept-request/${id}`);
    return {
        type: "ACCEPT_REQ",
        id
    };
}

export async function unfriend(id) {
    await axios.post(`/unfriend/${id}`);
    return {
        type: "UNFRIEND",
        id
    };
}

//chat
export async function getMessages(msgs) {
    return {
        type: "CHAT",
        messages: msgs
    };
}

export async function newMessage(msg) {
    console.log("this is in action", msg);
    return {
        type: "NEW",
        message: msg
    };
}

//online
export async function online(ids) {
    console.log("this is in action", ids);
    return {
        type: "ONLINE",
        ids: ids
    };
}

export async function friends(ids) {
    console.log("this is in action", ids);
    return {
        type: "FRIENDS",
        friends: ids
    };
}
export async function getPrivateMessages(msgs) {
    return {
        type: "PRIVATE_CHAT",
        privates: msgs
    };
}

export async function newPrivateMessage(msg) {
    console.log("this is in action", msg);
    return {
        type: "NEW_PRIVATE",
        private: msg
    };
}
