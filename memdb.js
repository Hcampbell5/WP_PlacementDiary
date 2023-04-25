import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';
// const data = [];


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
// data.push({
//     usrID: 'abc',
//     id: '27f7b86c-0a70-489c-93bb-3255256fc650',
//     date: '03-28',
//     work: 'Created a web application',
//     xp: 'Basic javascript and html',
//     //competencies: ['B3', 'B4', 'E1' ],
//     competencies: 'A1',
// });

// data.push({
//     usrID: 'abc',
//     id: 'f71d5f6c-9741-464a-9930-ad1d039884bf',
//     date: '03-29',
//     work: 'Created edit log page',
//     xp: 'HTML Put and POST',
//     //competencies: ['B3', 'B4', 'E1' ],
//     competencies: 'B2',
// });


// gets all entries belonging specific usrID
export async function getUserEntries(usrID) {
  // return data.filter(entry => entry.usrID === usrID);
  const db = await dbConn;
  return db.get('SELECT * FROM logEntries WHERE usrID = ?', [usrID]);
}

// gets entry by specific entry id
export async function getEntry(id) {
  // return data.find(entry => entry.id === id);
  const db = await dbConn;
  return db.get('SELECT * FROM logEntries WHERE id = ?', [id]);
}

// adds messages to the data array for a specific usrID
export async function addEntry(msg) {
  // const newEntry = {
  //     usrID: msg.usrID,
  //     id: uuid(),
  //     date: msg.date,
  //     work: msg.work,
  //     xp: msg.xp,
  //     competencies: msg.competencies,
  // };

  // data.push(newEntry);
  // console.log("data contents" , data);
  // return data;
  const db = await dbConn;
  const usrID = msg.usrID;
  const id = uuid();
  const date = msg.date;
  const work = msg.work;
  const xp = msg.xp;
  const competencies = msg.competencies;

  await db.run('INSERT INTO logEntries VALUES (?, ?, ?, ?, ?, ?)', [usrID, id, date, work, xp, competencies]);
}

// replaces entries with edited entry
export async function editEntry(updatedMessage) {
// const storedEntry = getEntry(updatedMessage.msg.id);
// if (storedEntry == null) throw new Error('Log Entry not found');

  // // update old message in place
  // storedEntry.usrID = updatedMessage.msg.usrID;
  // storedEntry.id = updatedMessage.msg.id;
  // storedEntry.date = updatedMessage.msg.date;
  // storedEntry.work = updatedMessage.msg.work;
  // storedEntry.xp = updatedMessage.msg.xp;
  // storedEntry.competencies = updatedMessage.msg.competencies;

  // console.log('updated entry: ', storedEntry);
  // return storedEntry;
  const db = await dbConn;
  const usrID = updatedMessage.msg.usrID;
  const id = updatedMessage.msg.id;
  const date = updatedMessage.msg.date;
  const work = updatedMessage.msg.work;
  const xp = updatedMessage.msg.xp;
  const competencies = updatedMessage.msg.competencies;

  const statement = await db.run('UPDATE logEntries SET id = ? , logdate = ?, work = ? , xp = ? , competencies = ?  WHERE usrID = ?', [id, date, work, xp, competencies, usrID]);

  if (statement.changes === 0) throw new Error('message not found');
  return getEntry(id);
}
