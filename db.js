const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/social"
);

module.exports.addUser = (first, last, username, email, password) => {
    return db.query(
        `
    INSERT INTO users (first, last, username, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username
    `,
        [first, last, username, email, password]
    );
};

module.exports.getLoginId = email => {
    return db.query("SELECT id, username FROM users WHERE email = $1", [email]);
};

module.exports.getHashPass = email => {
    return db.query(
        "SELECT password, id, username FROM users WHERE email = $1",
        [email]
    );
};

module.exports.getUser = username => {
    return db.query(
        `
        SELECT first, last, id, bio, image, username, email FROM users
        WHERE username= $1`,
        [username]
    );
};

module.exports.addImage = (id, image) => {
    return db.query(
        `
        UPDATE users SET image=$2
        WHERE id =$1
        RETURNING image
        `,
        [id, image]
    );
};

module.exports.editBio = (id, bio) => {
    return db.query(
        `
        UPDATE users SET bio=$2
        WHERE id =$1
        RETURNING bio
        `,
        [id, bio]
    );
};

module.exports.getLastUsers = id => {
    return db.query(
        `
        SELECT first, last, image, username, id FROM users
        WHERE id != $1
        ORDER BY id DESC
        LIMIT 4
    `,
        [id]
    );
};

module.exports.findPeople = input => {
    return db.query(
        `
        SELECT first, last, image, username, id FROM users
        WHERE first ILIKE $1
        OR last ILIKE $1`,
        [input + "%"]
    );
};

module.exports.getStatus = (sender_id, receiver_id) => {
    return db.query(
        `
        SELECT * FROM friends
        WHERE (receiver_id=$1 AND sender_id=$2)
        OR (receiver_id=$2 AND sender_id=$1)
        `,
        [sender_id, receiver_id]
    );
};

module.exports.makeReq = (sender_id, receiver_id) => {
    return db.query(
        `
        INSERT INTO friends (receiver_id, sender_id)
        VALUES ($2, $1)
        `,
        [sender_id, receiver_id]
    );
};

module.exports.acceptReq = (sender_id, receiver_id) => {
    return db.query(
        `
        UPDATE friends SET accepted=true
        WHERE (receiver_id=$1 AND sender_id=$2)
        OR (receiver_id=$2 AND sender_id=$1)
        `,
        [sender_id, receiver_id]
    );
};

module.exports.unfriend = (sender_id, receiver_id) => {
    return db.query(
        `
        DELETE from friends
        WHERE (receiver_id=$2 AND sender_id=$1)
        OR (receiver_id=$1 AND sender_id=$2)
        `,
        [sender_id, receiver_id]
    );
};

module.exports.getRelations = receiver_id => {
    return db.query(
        `
        SELECT users.id, first, last, image, accepted, username
        FROM friends
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
        [receiver_id]
    );
};

module.exports.getPending = id => {
    return db.query(
        `
        SELECT users.id, first, last, image, accepted, username
        FROM friends
        JOIN users
        ON (accepted = false AND sender_id = $1 AND receiver_id = users.id)
        `,
        [id]
    );
};

module.exports.getMessages = () => {
    return db.query(
        `
        SELECT users.id, first, last, image, username, message, chat.created_at AS date, chat.id AS chatid
        FROM chat
        JOIN users
        ON (sender_id = users.id)
        WHERE (receiver_id IS NULL)
        ORDER BY chat.id DESC LIMIT 10
        `
    );
};

module.exports.addGroupMessage = (msg, id) => {
    return db.query(
        `
        INSERT INTO chat (message, sender_id, receiver_id)
        VALUES ($1, $2, null)
        `,
        [msg, id]
    );
};

module.exports.getPrivateMessages = (id, receiver_id) => {
    return db.query(
        `
        SELECT users.id, first, last, image, username, message, chat.created_at AS date, chat.id AS chatid
        FROM chat
        JOIN users
        ON (sender_id = $1 AND sender_id = users.id AND receiver_id=$2)
        OR (receiver_id = $1 AND sender_id = users.id AND sender_id=$2)
        ORDER BY chat.id DESC LIMIT 10
        `,
        [id, receiver_id]
    );
};

module.exports.addPrivateMessage = (sender_id, msg, receiver_id) => {
    return db.query(
        `
        INSERT INTO chat ( sender_id, message, receiver_id)
        VALUES ($1, $2, $3)
        `,
        [sender_id, msg, receiver_id]
    );
};

module.exports.getSenderInfo = id => {
    return db.query(
        `
        SELECT first, last, image, username, message, chat.created_at AS date, chat.id AS chatid
        FROM chat
        JOIN users
        ON (sender_id = $1 AND sender_id = users.id)
        ORDER BY chat.id DESC
        LIMIT 1
        `,
        [id]
    );
};

module.exports.getFriends = (sender_id, receiver_id) => {
    return db.query(
        `
        SELECT id
        FROM friends
        WHERE (accepted = true AND receiver_id = $1 AND sender_id = $2)
        OR (accepted = true AND sender_id = $1 AND receiver_id = $2)
        `,
        [sender_id, receiver_id]
    );
};

module.exports.getOnline = id => {
    return db.query(
        `
        SELECT first, last, id, bio, image, username, email FROM users
        WHERE id= ANY ($1)`,
        [id]
    );
};
