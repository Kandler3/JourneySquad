CREATE TABLE tp_participants (
    participant_id SERIAL PRIMARY KEY,
    id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    travel_plan_id INT NOT NULL,
    user_id INT NOT NULL
);