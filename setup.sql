DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first VARCHAR NOT NULL CHECK (first != ''),
last VARCHAR NOT NULL CHECK (last != ''),
email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
password VARCHAR NOT NULL CHECK (password != ''),
username VARCHAR NOT NULL CHECK (username != ''),
image VARCHAR,
bio VARCHAR,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS friends;

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS chat;

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    message VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
