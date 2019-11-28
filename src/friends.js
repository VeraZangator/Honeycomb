import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        state => state.users && state.users.filter(user => user.accepted)
    );
    const wannabees = useSelector(
        state =>
            state.users && state.users.filter(user => user.accepted === false)
    );
    const pending = useSelector(
        state =>
            state.pending &&
            state.pending.filter(user => user.accepted === false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!friends || !wannabees) {
        return null;
    }

    return (
        <div className="container wanna">
            <div className="wannafriends">
                <div className="friends">
                    <h2>My friends ({friends.length})</h2>
                    <div className="flex">
                        {friends.length == 0 && <p>You don´t have friends</p>}
                        {friends.length > 0 &&
                            friends.map(user => (
                                <div key={user.id} className="user">
                                    <div className="hex">
                                        <img src={user.image || "/profi.jpg"} />
                                    </div>
                                    <Link to={`/user/${user.username}`}>
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(user.id))
                                            }
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="friends wannabees">
                    <h2>My Wannabees ({wannabees.length})</h2>
                    <div className="flex">
                        {wannabees.length == 0 && (
                            <p>You don´t have pending friends requests</p>
                        )}
                        {wannabees.length > 0 &&
                            wannabees.map(user => (
                                <div key={user.id} className="user">
                                    <div className="hex">
                                        <img src={user.image || "/profi.jpg"} />
                                    </div>
                                    <Link to={`/user/${user.username}`}>
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriendRequest(user.id)
                                                )
                                            }
                                        >
                                            Accept friend request
                                        </button>{" "}
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(user.id))
                                            }
                                        >
                                            Reject friend request
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="friends pending">
                    <h2>Waiting for an answer ({pending.length})</h2>
                    <div className="flex">
                        {pending.length == 0 && (
                            <p>You don´t have pending friends requests</p>
                        )}
                        {pending.length > 0 &&
                            pending.map(user => (
                                <div key={user.id} className="user">
                                    <div className="hex">
                                        <img src={user.image || "/profi.jpg"} />
                                    </div>
                                    <Link to={`/user/${user.username}`}>
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            dispatch(unfriend(user.id))
                                        }
                                    >
                                        Cancel friend request
                                    </button>{" "}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
