-- Migration number: 0001 	 2025-02-13T14:30:03.999Z

CREATE TABLE researches
(
	id         TEXT PRIMARY KEY,
	query      TEXT                                NOT NULL,
	depth      TEXT                                NOT NULL,
	breadth    TEXT                                NOT NULL,
	questions  TEXT                                NOT NULL,
	status     INTEGER                             NOT NULL,
	result     TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null
);
