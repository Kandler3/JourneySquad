CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telegram_id INT NOT NULL,
    is_admin BOOLEAN,
    name TEXT,
    avatar TEXT,
    profile_id INT REFERENCES profiles(id) ON DELETE SET NULL
);