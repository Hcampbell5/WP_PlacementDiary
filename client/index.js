const el = {}; // stores all of the elements on page (textboxes, buttons etc)
const app = {}; // stores the log data

// app.usrID = 'abc' //hard-coded user id

// prepares the page, calls handler and event listener functions
function pageLoaded() {
  debugger;
  prepareHandles();
  addEventListeners();
  var selectedUser = localStorage.getItem("selectedUser"); // checking local storage for which users logs to load
  el.userSelector.value = selectedUser;
  app.usrID = (el.userSelector.value);
}

// clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

// for each entry in app.data make a new article element to hold and display it
function populateDiary() {
  debugger;
  getLogEntries();
  for (const entry of app.data) {
    const article = cloneTemplate('#tplate-entry');
    article.dataset.id = entry.id;
    article.querySelector('.entry-date').textContent = entry.logdate;
    article.querySelector('.entry-work').textContent = entry.work;
    article.querySelector('.entry-xp').textContent = entry.xp;
    article.querySelector('.entry-competency').textContent = entry.competencies.replace(/\[|\]/g, '');
    article.querySelector('.entry-editLog').href = `/logEntry.html#${article.dataset.id}`;

    const month = document.querySelector('#month');
    month.append(article);
  }
}

// function for custom element allowing multiple competencies based off drop-down entries
function competencyList() {
  debugger;
  el.logEntry_CMPlist = document.querySelector('#cmptcyList');
  console.log(`${el.logEntry_CMP.value}`);
  el.logEntry_CMPlist.value += `${el.logEntry_CMP.value}, `;
}

// gets all log entries for an ID and places them inside of app
async function getLogEntries() {
  debugger;
  const response = await fetch(`/entries/${app.usrID}/all`);
  if (response.ok) {
    app.data = await response.json();
    console.log('logs loaded: ', app.data);
  } else {
    app.data = ['failed to load log Entries :-('];
  }
}

// creates JSON for log entry
function createLogEntry() {
  debugger;
  const logEntryObj = {
    usrID: app.usrID,
    logdate: el.logEntry_Date.value,
    work: el.logEntry_WC.value,
    xp: el.logEntry_KG.value,
    competencies: `[${el.logEntry_CMPlist.value.slice(0, -2)}]`,
  };
  sendLogEntry(logEntryObj);
}

// sends log entries to server
async function sendLogEntry(logEntryObj) {
  const payload = { msg: logEntryObj };
  console.log('Payload', payload);

  const response = await fetch('/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    location.reload();
    const updatedLogEntry = await response.json();
  } else {
    console.log('failed to send log entry', response);
  }
}

function changeUser() {
  localStorage.setItem("selectedUser", el.userSelector.value);
  debugger;
  location.reload();
}

// add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.showLogEntryForm.addEventListener('click', showLogEntryForm);
  el.userSelector.addEventListener('change', changeUser);
  el.logEntry_CMP.addEventListener('change', competencyList);
}

// preparing handlers for entry boxes
function prepareHandles() {
  el.submitLogEntry = document.querySelector('#submitEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.showLogEntryForm = document.querySelector('#showLogEntryForm');
  el.userSelector = document.querySelector('#userIDslct');
}

// show or hide the logs Add Entry form
function showLogEntryForm() {
  el.logEntry_Date.valueAsDate = new Date();
  const elements = document.querySelectorAll('.hide-on-button-press, .hidden');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hidden');
    // When hidden clears contents
  }
}

pageLoaded();
await getLogEntries();
populateDiary();
