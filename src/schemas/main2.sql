CREATE TABLE IF NOT EXISTS test (id PRIMARY KEY NOT NULL, name TEXT);
SELECT crsql_as_crr('test');
