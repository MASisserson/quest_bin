DROP TABLE request;
DROP TABLE endpoint;

CREATE TABLE endpoint (
  id serial PRIMARY KEY,
  uuid text NOT NULL
);

CREATE TABLE request (
  id serial PRIMARY KEY,
  endpoint_id integer NOT NULL,
  time_stamp timestamp NOT NULL DEFAULT NOW(),
  request_data jsonb NOT NULL,
  FOREIGN KEY (endpoint_id)
    REFERENCES endpoint(id)
    ON DELETE CASCADE
);

INSERT INTO endpoint (uuid) VALUES ('testuuidone');
INSERT INTO endpoint (uuid) VALUES ('testuuidtwo');
INSERT INTO endpoint (uuid) VALUES ('testuuidthree');
INSERT INTO request (endpoint_id, request_data) VALUES (1, '{"header": "test", "content-type": "test"}');
INSERT INTO request (endpoint_id, request_data) VALUES (2, '{"header": "test", "content-type": "test"}');
INSERT INTO request (endpoint_id, request_data) VALUES (3, '{"header": "test", "content-type": "test"}');
