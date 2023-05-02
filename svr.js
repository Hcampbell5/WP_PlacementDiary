import express from 'express';
import * as db from './memdb.js';

const app = express();
app.use(express.static('client', { extensions: ['html'] }));


function safeSend(data, res, msg) {
  if (data) {
    res.json(data);
  } else {
    res.status(404).send(msg);
  }
}

async function getUserEntries(req, res) {
  const result = await db.getUserEntries(req.params.usrID);
  safeSend(result, res, 'no user entries found');
}

async function getEntry(req, res) {
  const result = await db.getEntry(req.params.id);
  safeSend(result, res, 'no user entries found');
}

async function postLogEntry(req, res) {
  // logEntry = [req.body.msg, ...logEntry.slice(0, 9)];
  const logEntry = await db.addEntry(req.body.msg);
  res.json(logEntry);
}

async function putLogEntry(req, res) {
  const logEntry = await db.editEntry(req.body);
  res.json(logEntry);
}

async function deleteLogEntry(req, res) {
  const logEntry = await db.deleteEntry(req.body);
  res.json(logEntry);
}

// wrap async function for express.js error handling
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

app.get('/entries/:usrID/all', asyncWrap(getUserEntries));
app.get('/entries/:id', asyncWrap(getEntry));
app.put('/entries/:id', express.json(), asyncWrap(putLogEntry));
app.delete('/entries/:id', asyncWrap(deleteLogEntry));
app.post('/entries', express.json(), asyncWrap(postLogEntry));


app.listen(8080);
