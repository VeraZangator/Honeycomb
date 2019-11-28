export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users,
            pending: action.pending
        };
    }

    if (action.type == "ACCEPT_REQ") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.filter(user => user.id != action.id),
            pending: state.pending.filter(user => user.id != action.id)
        };
    }

    if (action.type == "CHAT") {
        console.log("i am in chat reducer");
        state = {
            ...state,
            messages: action.messages.reverse()
        };
    }

    if (action.type == "NEW") {
        state = {
            ...state,
            messages: state.messages.concat(action.message)
        };
    }

    if (action.type == "ONLINE") {
        state = {
            ...state,
            online: action.ids
        };
    }

    if (action.type == "FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type == "PRIVATE_CHAT") {
        console.log("i am in chat reducer");
        state = {
            ...state,
            privates: action.privates.reverse()
        };
    }

    if (action.type == "NEW_PRIVATE") {
        state = {
            ...state,
            privates: state.privates.concat(action.private)
        };
    }

    return state;
}
