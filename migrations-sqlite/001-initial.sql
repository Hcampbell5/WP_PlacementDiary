-- Up

CREATE TABLE logEntries (
  usrID         CHAR(36)   NOT NULL,
  id            CHAR(36)   PRIMARY KEY,
  logdate       DATE       NOT NULL,
  work          TEXT       NOT NULL,
  xp            TEXT       NOT NULL,
  competencies  TEXT       NOT NULL
);

INSERT INTO logEntries (usrID, id, logdate, work, xp, competencies) VALUES
( 'abc',
  'f71d5f6c-9741-464a-9930-ad1d039884bf',
  '2023-03-29',
  'Created a web application',
  'How to use HTML and JS',
  'A1' ),
( 'def',
  'f71d5f6c-9741-464a-9930-ad1d039684bf',
  '2023-03-29',
  'Added a 2nd user',
  'How to setup database tables',
  'C1' ),
( 'abc',
  'f71d5f6c-9741-464a-9930-ad1d039885ag',
  '2023-03-30',
  'Editied my web application',
  'Not sure',
  'B1' );  

-- Down

DROP TABLE logEntries;


