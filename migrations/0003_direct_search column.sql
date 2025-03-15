-- Migration number: 0003 	 2025-03-17T12:00:00.000Z

alter table researches
	add direct_search boolean not null default false;