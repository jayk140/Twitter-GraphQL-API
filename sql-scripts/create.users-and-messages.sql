CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    city TEXT
);


CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    content TEXT NOT NULL,
    message_date DATE DEFAULT now(),
    user INTEGER REFERENCES user(id) NOT NULL
);