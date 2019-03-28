CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  content TEXT NOT NULL,
  date_added TIMESTAMP DEFAULT now() NOT NULL
);