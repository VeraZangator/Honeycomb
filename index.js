const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bcrypt");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 myherokuapp.herokuapp.com:*"
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());
app.use(express.static("./public"));
app.use(csurf());

app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    let { first, last, username, email, password } = req.body;
    hash(password)
        .then(result => {
            password = result;
            return password;
        })
        .then(password => {
            db.addUser(first, last, username, email, password)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    req.session.username = rows[0].username;
                    res.json();
                })
                .catch(error => {
                    console.log(error);
                    res.sendStatus(500);
                });
        });
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let id;
    let username;
    db.getHashPass(email)
        .then(({ rows }) => {
            id = rows[0].id;
            username = rows[0].username;
            return compare(req.body.password, rows[0].password);
        })
        .then(isMatch => {
            if (isMatch) {
                req.session.userId = id;
                req.session.username = username;
                res.json();
            } else {
                res.sendStatus(500);
            }
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.get("/user", (req, res) => {
    db.getUser(req.session.username)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const image = `${s3Url}${req.file.filename}`;
    db.addImage(req.session.userId, image)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/editbio", (req, res) => {
    db.editBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
            console.log("dsp de agregar bio", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/api/user/:username", (req, res) => {
    console.log("im heree");
    console.log(req.query);
    console.log(req.params.id);
    db.getUser(req.params.username)
        .then(({ rows }) => {
            if (!rows[0]) {
                console.log("ID NOT FOUND");
                res.json({ notfound: true });
            } else if (rows[0].id === req.session.userId) {
                console.log("SAME ID");
                res.json({ notfound: true });
            } else {
                res.json(rows[0]);
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/api/users", (req, res) => {
    db.getLastUsers(req.session.userId)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/api/users/:input", (req, res) => {
    db.findPeople(req.params.input)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/get-initial-status/:id", (req, res) => {
    db.getStatus(req.session.userId, Number(req.params.id))
        .then(({ rows }) => {
            if (!rows[0]) {
                res.json({ relation: false });
            } else {
                if (rows[0].accepted) {
                    res.json({ relation: true, friends: true });
                } else {
                    res.json({ rows, relation: true, friends: false });
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/send-request/:id", (req, res) => {
    db.makeReq(req.session.userId, Number(req.params.id))
        .then(() => res.json({ relation: true }))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/accept-request/:id", (req, res) => {
    db.acceptReq(req.session.userId, Number(req.params.id))
        .then(() => res.json({ friend: true }))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/unfriend/:id", (req, res) => {
    db.unfriend(req.session.userId, Number(req.params.id))
        .then(() => res.json({ relation: false }))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/friends-wannabes", (req, res) => {
    db.getRelations(req.session.userId)
        .then(({ rows }) => {
            const relations = rows;
            return relations;
        })
        .then(relations => {
            db.getPending(req.session.userId)
                .then(({ rows }) => {
                    console.log("this is relations:", relations);
                    console.log("this is rows", rows);
                    res.json({ relations, rows });
                })
                .catch(err => {
                    console.log(err);
                    res.sendStatus(500);
                });
        });
});
app.get("/friends-pending", (req, res) => {
    db.getPending(req.session.userId)
        .then(({ rows }) => {
            // console.log("this is rows", rows);
            res.json(rows);
        })
        .catch(err => console.log(err));
});

app.get("/get-friends/:id", (req, res) => {
    db.getFriends(req.session.userId, Number(req.params.id))
        .then(({ rows }) => {
            if (!rows[0]) {
                res.json({ friends: false });
            }
            console.log("THIS IS THE FRIENDS", rows);
            res.json({ friends: true });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

//**NEVER DELETE**NEVER DELETE**NEVER DELETE
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//**NEVER DELETE**NEVER DELETE**NEVER DELETE

server.listen(8080, function() {
    console.log("I'm listening.");
});

//socket-->connection between server and client that just connected

const usersOnline = {};

io.on("connection", function(socket) {
    console.log("this is the socket.id that just connected", socket.id);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;
    usersOnline[socket.id] = userId;
    const checkOnline = () => {
        // db.getFriends(userId).then(({ rows }) => {
        //     io.sockets.emit("friends");
        // });
        const online = Object.values(usersOnline);
        db.getOnline(online).then(({ rows }) => {
            console.log("this is the friends online users", rows);
            io.sockets.emit("online", rows);
        });
    };

    checkOnline();
    socket.on("getPrivateMessages", async function(id) {
        db.getPrivateMessages(userId, id).then(({ rows }) => {
            io.sockets.emit("getPrivateMessages", rows);
        });
    });

    socket.on("newPrivateMessage", async function(newMessage) {
        await db.addPrivateMessage(userId, newMessage.msg, newMessage.id);
        const { rows } = await db.getSenderInfo(userId);
        io.sockets.emit("newPrivateMessage", rows);
    });

    db.getMessages().then(({ rows }) => {
        io.sockets.emit("getMessages", rows);
    });

    socket.on("newMessage", async function(newMessage) {
        await db.addGroupMessage(newMessage, userId);
        const { rows } = await db.getSenderInfo(userId);
        io.sockets.emit("newMessage", rows);
    });

    socket.on("disconnect", () => {
        delete usersOnline[socket.id];
        checkOnline();
    });
});
