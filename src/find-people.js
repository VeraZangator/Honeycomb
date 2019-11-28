import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [userInput, setUserInput] = useState();
    const [users, setUser] = useState([]);

    useEffect(() => {
        let abort;
        if (!userInput) {
            (async () => {
                const { data } = await axios.get(`/api/users`);
                console.log("this is data", data);
                setUser(data);
            })();
        } else {
            (async () => {
                const { data } = await axios.get(`/api/users/${userInput}`);
                if (!abort) {
                    console.log("this is the dat i need", data);
                    setUser(data);
                }
            })();
        }

        return () => {
            abort = true;
        };
    }, [userInput]);

    return (
        <div className="container">
            <div className="peoplecontainer">
                <div className="find">
                    <h1>Check who recently joined our Honeycomb</h1>
                    <p>Find people</p>
                    <input
                        name="user-input"
                        type="text"
                        onChange={e => setUserInput(e.target.value)}
                    />
                    {!users[0] && <p>No results found</p>}
                </div>
                <div className="pipcontainer">
                    {users.map(user => (
                        <div className="people" key={user.id}>
                            <div className="hex">
                                <img src={user.image || "/profi.jpg"} />
                            </div>
                            <h3>
                                {user.first} {user.last}
                            </h3>
                            <Link to={`/user/${user.username}`}>
                                <button>Visit profile </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
