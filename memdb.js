import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

// gets all entries belonging specific usrID
export async function getUserEntries(usrID) {
  // return data.filter(entry => entry.usrID === usrID);
  const db = await dbConn;
  return db.all('SELECT * FROM logEntries WHERE usrID = ?', [usrID]);
}

// gets entry by specific entry id
export async function getEntry(id) {
  // return data.find(entry => entry.id === id);
  const db = await dbConn;
  return db.get('SELECT * FROM logEntries WHERE id = ?', [id]);
}

// adds messages to the data array for a specific usrID
export async function addEntry(msg) {
  const db = await dbConn;
  const usrID = msg.usrID;
  const id = uuid();
  const date = msg.logdate;
  const work = msg.work;
  const xp = msg.xp;
  const competencies = msg.competencies;

  await db.run('INSERT INTO logEntries VALUES (?, ?, ?, ?, ?, ?)', [usrID, id, date, work, xp, competencies]);
}

// replaces entries with edited entry
export async function editEntry(updatedMessage) {
  const db = await dbConn;
  // const usrID = updatedMessage.msg.usrID;
  const id = updatedMessage.msg.id;
  const logdate = updatedMessage.msg.logdate;
  const work = updatedMessage.msg.work;
  const xp = updatedMessage.msg.xp;
  const competencies = updatedMessage.msg.competencies;

  const statement = await db.run('UPDATE logEntries SET logdate = ?, work = ? , xp = ? , competencies = ?  WHERE id = ?', [logdate, work, xp, competencies, id]);
  console.log(statement);

  if (statement.changes === 0) throw new Error('message not found');
  return getEntry(id);
}
