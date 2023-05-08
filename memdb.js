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

// gets all entries belonging specific usrID within a range
export async function getUserEntries(usrID, startDate, endDate) {
  const db = await dbConn;
  return db.all('SELECT * FROM logEntries WHERE usrID = ? AND logDate BETWEEN ? AND ?', [usrID, startDate, endDate]); // Modify SQL query to filter by date range
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
export async function editEntry(updatedLogEntry) {
  const db = await dbConn;
  // const usrID = updatedLogEntry.msg.usrID;
  const id = updatedLogEntry.msg.id;
  const logdate = updatedLogEntry.msg.logdate;
  const work = updatedLogEntry.msg.work;
  const xp = updatedLogEntry.msg.xp;
  const competencies = updatedLogEntry.msg.competencies;

  const statement = await db.run('UPDATE logEntries SET logdate = ?, work = ? , xp = ? , competencies = ?  WHERE id = ?', [logdate, work, xp, competencies, id]);
  console.log(statement);

  if (statement.changes === 0) throw new Error('message not found');
  return getEntry(id);
}

// deletes log entries
export async function deleteEntry(id) {
  const db = await dbConn;
  await db.run('DELETE FROM logEntries WHERE id = ?', [id]);
}
