-- Up

CREATE TABLE logEntries (
  usrID         CHAR(36)   NOT NULL,
  id            CHAR(36)   PRIMARY KEY,
  logdate       DATE       NOT NULL,
  work          TEXT       NOT NULL,
  xp            TEXT       NOT NULL,
  competencies  TEXT[]       NOT NULL              
);

INSERT INTO logEntries (usrID, id, logdate, work, xp, competencies) VALUES
( 'abc',
  'f71d5f6c-9741-464a-9930-ad1d039884bf',
  '2023-05-01',
  'First day of work, Im becoming familiar with the office and colleagues. Got issued a work laptop & given access to company systems. Started company training.',
  'Use of Linux in a work environment. Learned to set up Linux dev env. Brief introduction to GDPR. Completed course: Cyber Essentials',
  '[B3, B4, E1, E2, E5]' ),
( 'def',
  'f71d5f6c-9741-464a-9930-ad1d039684bf',
  '2023-05-02',
  'Added a 2nd user',
  'How to setup database tables',
  '[C2, B3, D1]' ),
( 'abc',
  'f71d5f6c-9741-464a-9930-ad1d039885ag',
  '2023-05-08',
  'Use of Linux in a work environment. Learned to set up Linux dev env. Brief introduction to GDPR. Completed course: Cyber Essentials',
  'First cases enabled me to personalise my dev env a little and get familiarise with new tools like Banjax Ultracloot. First interactions with support and learning to better communicate requirements.',
  '[A1, A2, B3, B4]' );  

-- Down

DROP TABLE logEntries;


