-- Migration number: 0001 	 2025-02-13T14:30:03.999Z

CREATE TABLE educational_content
(
  id                     TEXT PRIMARY KEY,
  topic                  TEXT                                NOT NULL,
  audience               TEXT                                NOT NULL,
  format                 TEXT                                NOT NULL,
  additional_instructions TEXT,
  questions              TEXT                                NOT NULL,
  status                 INTEGER                             NOT NULL,
  result                 TEXT,
  created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  user                   TEXT      DEFAULT 'educator'        NOT NULL
);
