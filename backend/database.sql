DROP TABLE request;
DROP TABLE requestbin;

CREATE TABLE requestbin (
  id serial PRIMARY KEY,
  uuid text NOT NULL
);

CREATE TABLE request (
  id serial PRIMARY KEY,
  requestbin_id integer NOT NULL,
  request_body jsonb NOT NULL,
  FOREIGN KEY (requestbin_id)
    REFERENCES requestbin(id)
    ON DELETE CASCADE
);

INSERT INTO requestbin (uuid) VALUES ('testuuidone');
INSERT INTO requestbin (uuid) VALUES ('testuuidtwo');
INSERT INTO requestbin (uuid) VALUES ('testuuidthree');
INSERT INTO request (requestbin_id, request_body) VALUES (1, '{"header": "test", "content-type": "test"}');
INSERT INTO request (requestbin_id, request_body) VALUES (2, '{"header": "test", "content-type": "test"}');
INSERT INTO request (requestbin_id, request_body) VALUES (3, '{"header": "test", "content-type": "test"}');
