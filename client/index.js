const el = {}; 
const app = {};
app.usrID = 'abc'
// Remove all contents from a given element //
function removeContentFrom(what) {
  what.textContent = '';
}

//gets all log entries for an ID and places them inside of app
async function getLogEntries() {
  const response = await fetch(`/entries/${app.usrID}/all`); 
  if (response.ok) {
    app.data = await response.json();
  } 
}

//clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

  //for each entry in app.data make a new article element
  //to hold and display it 
function populateDiary() {
  
  for (const entry of app.data) {
    const article = cloneTemplate('#tplate-entry');
    article.querySelector('.entry-date').textContent = entry.date;
    article.querySelector('.entry-work').textContent = entry.work;
    article.querySelector('.entry-xp').textContent = entry.xp;
    article.querySelector('.entry-competency').textContent = entry.competency;
    
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

// add entry if enter pressed //
function checkKeys(e) {
  if (e.key === 'Enter') {
    sendLogEntry();
  }
}

async function sendLogEntry(logEntryObj) {
  const payload = { msg: logEntryObj };
  console.log('Payload', payload);

  const response = await fetch('logEntry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    el.logEntry_WC.value = '';
    const updatedLogEntry = await response.json();
    removeContentFrom(el.logList);
    showLogEntries(updatedLogEntry, el.logList);
  } else {
    console.log('failed to send log entry', response);
  }
}


function createLogEntry () {
  let logEntryObj = {
    date: el.logEntry_Date.value,
    workCompleted: el.logEntry_WC.value,
    knowledgeGained: el.logEntry_KG.value,
    competency: el.logEntry_CMP.value,
  };
  sendLogEntry(logEntryObj)
}


function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.logEntry_WC.addEventListener('keyup', checkKeys);
  el.showLogEntryForm.addEventListener('click', showLogEntryForm);
}

function prepareHandles() {
  el.submitLogEntry = document.querySelector('#submitEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.showLogEntryForm = document.querySelector('#showLogEntryForm');
  el.logTable = document.querySelector('#logTable');
}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  removeContentFrom(document);
}

await getLogEntries();
populateDiary();
console.log(app.data);
pageLoaded();