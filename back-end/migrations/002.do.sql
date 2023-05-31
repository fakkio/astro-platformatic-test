CREATE TABLE quotes
(
    id         INTEGER PRIMARY KEY,
    quote      TEXT         NOT NULL,
    said_by    VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quotes ADD COLUMN movie_id INTEGER REFERENCES movies(id);
