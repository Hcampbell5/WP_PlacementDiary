const el = {}; 
const app = {};
app.usrID = 'abc'


//for each entry in app.data make a new article element to hold and display it 
function populateDiary() {
console.log(app.data);
//el.logEntry_Date.value = app.data.date;
el.logEntry_WC.value = app.data.work;
el.logEntry_KG.value = app.data.xp;
el.logEntry_CMP.value = app.data.competencies;
}

//function to get log entry ID
function getEntryId() {
   return '27f7b86c-0a70-489c-93bb-3255256fc650';
   //return app.data.find(entry => entry.id === logId);
}

//gets all log entries for a single ID and places them inside of app
async function getLogEntry() {
    const id = getEntryId();
    const response = await fetch(`/entries/${id}`); 
    if (response.ok) {
        app.data = await response.json();
        console.log(app.data);
    } else {
        app.data = ['failed to load log Entry :-('];
    }
}

//creates JSON for log entry
function createLogEntry () {
  const id = getEntryId();
  let logEntryObj = {
    id: id,
    usrID: app.usrID ,
    //date: el.logEntry_Date.value.slice(5),
    date: app.data.date,
    work: el.logEntry_WC.value,
    xp: el.logEntry_KG.value,
    competencies: el.logEntry_CMP.value,
  };
  sendLogEntry(logEntryObj);
  window.location.href = "index.html";
  //sendLogEntry(logEntryObj);
}

//sends log entries to server
async function sendLogEntry(logEntryObj) {
  
  const payload = {msg: logEntryObj };
  console.log('Payload', payload);
  
try{
  const response = await fetch(`/entries/${logEntryObj.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const updatedLog = await response.json();
  } else {
    console.log('failed to send log entry', response);
  }
} catch (error) {
  console.log('error sending log entry:', error);
}
}

//preparing handlers for entry boxes
function prepareHandles() {
    console.log('Handles Prepared');
    el.submitLogEntry = document.querySelector('#submitLogEntry');
   // el.logEntry_Date = document.querySelector('#logDate');
    el.logEntry_WC = document.querySelector('#workCmp');
    el.logEntry_KG = document.querySelector('#knGain');
    el.logEntry_CMP = document.querySelector('#cmptcy');
}

//add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);

//  el.submitLogEntry.addEventListener('click', () => {
 //   window.location.href = "index.html"; 
//  });
}



//prepares the page, calls handler and listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
}

pageLoaded();

await getLogEntry();
populateDiary();



