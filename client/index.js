const el = {}; 
const app = {};
app.usrID = 'abc'


//clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

//for each entry in app.data make a new article element to hold and display it 
function populateDiary() {
  for (const entry of app.data) {
    const article = cloneTemplate('#tplate-entry');
    article.querySelector('.entry-date').textContent = entry.date;
    article.querySelector('.entry-work').textContent = entry.work;
    article.querySelector('.entry-xp').textContent = entry.xp;
    article.querySelector('.entry-competency').textContent = entry.competencies;

    const month = document.querySelector('#month');
    month.append(article)
  }
}

/*load log entry
async function loadLogEntry() {
  const response = await fetch('/entries/${app.usrID}/all'); 
  let logEntry;
  if (response.ok) {
    logEntry = await response.json();
  } else {
    logEntry = ['failed to load log Entry :-('];
  }
  removeContentFrom(el.logList);
  showLogEntries(logEntry, el.logList);
}
*/

//gets all log entries for an ID and places them inside of app
async function getLogEntries() {
  const response = await fetch(`/entries/${app.usrID}/all`); 
  if (response.ok) {
    app.data = await response.json();
  } else {
    app.data = ['failed to load log Entries :-('];
  }
}

//creates JSON for log entry
function createLogEntry () {
  let logEntryObj = {
    usrID: app.usrID ,
    date: el.logEntry_Date.value,
    workCompleted: el.logEntry_WC.value,
    xp: el.logEntry_KG.value,
    competencies: el.logEntry_CMP.value,
  };
  sendLogEntry(logEntryObj)
}

//sends log entries to server
async function sendLogEntry(logEntryObj) {
  const payload = { msg: logEntryObj };
  console.log('Payload', payload);

  const response = await fetch('/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {

    //remove content from all text boxes
    //update the page with new entries
      //add in code
      //use removecontentfrom?
      //await getLogEntries();
      //populateDiary();

    const updatedLogEntry = await response.json();
  } else {
    console.log('failed to send log entry', response);
  }
}

//add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.showLogEntryForm.addEventListener('click', showLogEntryForm);
}

//preparing handlers for entry boxes
function prepareHandles() {
  el.submitLogEntry = document.querySelector('#submitEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.showLogEntryForm = document.querySelector('#showLogEntryForm');
  //el.logTable = document.querySelector('#logTable');
}

//prepares the page, calls handler and listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  el.logEntry_Date.valueAsDate = new Date();}
  await getLogEntries();
  populateDiary();

console.log(app.data);
pageLoaded();

