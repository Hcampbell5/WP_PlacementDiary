-- Up

CREATE TABLE logEntries (
  usrID         TEXT       NOT NULL,
  id            CHAR(36)   PRIMARY KEY,
  logdate       TEXT       NOT NULL,
  work          TEXT       NOT NULL,
  xp            TEXT       NOT NULL,
  competencies  TEXT       NOT NULL
);

INSERT INTO logEntries (usrID, id, logdate, work, xp, competencies) VALUES
( 'abc',
  'f71d5f6c-9741-464a-9930-ad1d039884bf',
  '03-29',
  'Created a web application',
  'How to use HTML and JS',
  'A1' ),

-- Down

DROP TABLE logEntries;


