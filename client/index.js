const el = {}; //change to app
/* Remove all contents from a given element */
function removeContentFrom(what) {
  what.textContent = '';
}


/* Add an array of logEntry to the page */
function showLogEntries(logEntry, where) {
  for (const entry of logEntry) {
    const li = document.createElement('li');
    li.textContent = (entry.date +" |  "+ entry.workCompleted +" |  "+ entry.knowledgeGained +"  | "+ entry.competency);
    where.appendChild(li);
  }
}

function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

function populateDiary() {
  //for each entry in el.data make a new article element
  //to hold and display it 
  for (const entry of el.data) {
    const article = cloneTemplate('#tplate-entry');
    article.querySelector('.entry-date').textContent = entry.date;
    article.querySelector('.entry-work').textContent = entry.date;
    article.querySelector('.entry-xp').textContent = entry.date;
    article.querySelector('.entry-competency').textContent = entry.date;
    const month = document.querySelector('#month');
    month.append(article)
  }
}

async function loadLogEntry() {
  const response = await fetch('/entries/${el.usrID}/all'); 
  let logEntry;
  if (response.ok) {
    logEntry = await response.json();
  } else {
    logEntry = ['failed to load log Entry :-('];
  }

  removeContentFrom(el.logList);
  showLogEntries(logEntry, el.logList);
}

/* add a message if enter pressed */
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
  el.logList = document.querySelector('#logList')
  el.submitLogEntry = document.querySelector('#submitEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.showLogEntryForm = document.querySelector('#showLogEntryForm');
  el.logTable = document.querySelector('#logTable');
}

function pageLoaded() {
  loadLogEntry();
  prepareHandles();
  addEventListeners();
  removeContentFrom(document);
  el.logEntry_Date.valueAsDate = new Date();
}
// deprecated in favour of using defer in the script tag
// window.addEventListener('load', pageLoaded);
pageLoaded();