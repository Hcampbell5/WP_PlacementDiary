import express from 'express';
import * as db from './memdb.js';
const app = express();
app.use(express.static('client'));


function safeSend(data, res, msg) {
  if (data) {
      res.json(data);
  } else {
    res.status(404).send(msg)
  }      
}

function getUserEntries(req, res) {
  const result = db.getUserEntries(req.params.usrID);
  safeSend(result, res, 'no user entries found')
}

function  getEntry(req, res) {
  const result = db.getEntry(req.params.id);
  safeSend(result, res, 'no user entries found')
}

function postLogEntry(req, res) {
      logEntry = [req.body.msg, ...logEntry.slice(0, 9)];
      res.json(logEntry); //fix this 
}

app.get('/entries/:usrID/all', getUserEntries);
app.get('/entries/:id', getEntry)
app.post('/entries', express.json(), postLogEntry); //fix this 

app.listen(8080);
