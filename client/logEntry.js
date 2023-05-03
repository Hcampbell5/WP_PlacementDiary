const el = {}; 
const app = {};

//for each entry in app.data make a new article element to hold and display it 
function populateDiary() {
el.logEntry_Date.value = app.data.logdate;
el.logEntry_WC.value = app.data.work;
el.logEntry_KG.value = app.data.xp;
el.logEntry_CMPlist.value = app.data.competencies.replace(/\[|\]/g, '');
}

// function for custom element allowing multiple competencies based off drop-down entries
function competencyList() {
  el.logEntry_CMPlist = document.querySelector('#cmptcyList')

  if (el.logEntry_CMPlist.value === "") { //adds a comma before only when its the 2nd competency selected
    el.logEntry_CMPlist.value += `${el.logEntry_CMP.value}`;
  } else {
    el.logEntry_CMPlist.value += `, ${el.logEntry_CMP.value}`;
  }
}

// clears the contents of the textbox containing the array of competencies
function clearCompetencyList(){
  el.logEntry_CMPlist.value = "" ;
}

// function to get log entry ID
function getEntryId(id) {
  app.id = window.location.hash.substring(1);
  return app.id;
}

// gets all log entries for a single ID and places them inside of app
async function getLogEntry() {
    const response = await fetch(`/entries/${app.id}`); 
    if (response.ok) {
        app.data = await response.json();
        console.log('fetched log', app.data);
    } else {
        app.data = ['failed to load log Entry :-('];
    }
}

//creates JSON for log entry
function createLogEntry () {
  debugger;
  let logEntryObj = {
    id: app.id,
    usrID: app.data.usrID ,
    logdate: el.logEntry_Date.value,
    logdate: app.data.logdate,
    work: el.logEntry_WC.value,
    xp: el.logEntry_KG.value,
    competencies: `[${el.logEntry_CMPlist.value}]`,
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
    console.log('log sent!');
  } else {
    console.log('failed to send log entry', response);
  }
} catch (error) {
  console.log('error sending log entry:', error);
}
}

// delete unwanted logs
async function deleteLogEntry(){
  const id = getEntryId()
  const payload = {id: id};
try{
  const response = await fetch(`/entries/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log('log deleted!');
  } else {
    console.log('failed to delete log entry', response);
  }
} catch (error) {
  console.log('error deleting log entry:', error);
}
window.location.href = "index.html";
}


// preparing handlers for entry boxes
function prepareHandles() {
    console.log('Handles Prepared');
    el.submitLogEntry = document.querySelector('#submitLogEntry');
    el.deleteLogEntry = document.querySelector('#deleteLogEntry');
    el.logEntry_Date = document.querySelector('#logDate');
    el.logEntry_WC = document.querySelector('#workCmp');
    el.logEntry_KG = document.querySelector('#knGain');
    el.logEntry_CMP = document.querySelector('#cmptcy');
    el.logEntry_CMPlist = document.querySelector('#cmptcyList');
    el.logEntry_clearCMPlist = document.querySelector('#clearCmptcyList');

}

// add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.deleteLogEntry.addEventListener('click', deleteLogEntry);
  el.logEntry_CMP.addEventListener('change', competencyList);
  el.logEntry_clearCMPlist.addEventListener('click', clearCompetencyList);
}



// prepares the page, calls handler and listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  getEntryId();
}

pageLoaded();
await getLogEntry();
populateDiary();



