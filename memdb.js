let data = [];
import uuid from 'uuid-random';

data.push({
    usrID: 'abc',
    id: '27f7b86c-0a70-489c-93bb-3255256fc650',
    date: '03-28',
    work: 'Created a web application',
    xp: 'Basic javascript and html',
    //competencies: ['B3', 'B4', 'E1' ],
    competencies: 'A1',
});

data.push({
    usrID: 'abc',
    id: 'f71d5f6c-9741-464a-9930-ad1d039884bf',
    date: '03-29',
    work: 'Created edit log page',
    xp: 'HTML Put and POST',
    //competencies: ['B3', 'B4', 'E1' ],
    competencies: 'B2',
});

//gets entry by specific entry id
export function getEntry(id) {
    return data.find(entry => entry.id === id);
}



//gets all entries belonging specific usrID
export function getUserEntries(usrID) {
    return data.filter(entry => entry.usrID === usrID);
}

//adds messages to the data array for a specific usrID
export function addEntry(msg) {
    const newEntry = {
        usrID: msg.usrID,
        id: uuid(),
        date: msg.date,
        work: msg.work,
        xp: msg.xp,
        competencies: msg.competencies,
    };

    data.push(newEntry);
    console.log("data contents" , data);
    return data;
  }

//replaces entries with edited entry 
export function editEntry(updatedMessage) {
const storedEntry = getEntry(updatedMessage.msg.id);
if (storedEntry == null) throw new Error('Log Entry not found');

// update old message in place
storedEntry.usrID = updatedMessage.msg.usrID;
storedEntry.id = updatedMessage.msg.id;
storedEntry.date = updatedMessage.msg.date;
storedEntry.work = updatedMessage.msg.work;
storedEntry.xp = updatedMessage.msg.xp;
storedEntry.competencies = updatedMessage.msg.competencies;

console.log('updated entry: ', storedEntry);
return storedEntry;
}