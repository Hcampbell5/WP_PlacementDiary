const el = {}; // stores all of the elements on page (textboxes, buttons etc)
const app = {}; // stores the log data
let viewMode;

// prepares the page, calls handler and event listener functions
function pageLoaded() {
  debugger;
  prepareHandles();
  addEventListeners();

  el.viewModeBtn.value = localStorage.getItem('viewModeValue');
  viewMode = getViewMode();

  const selectedWeek = localStorage.getItem('selectedWeek');
  if (selectedWeek !== null) { el.logDateRange.valueAsDate = new Date(selectedWeek); } else { el.logDateRange.valueAsDate = new Date(); }
  getLogWeek();

  el.userSelector.value = localStorage.getItem('selectedUser'); // checking local storage for which users logs to load
  app.usrID = (el.userSelector.value);
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
  el.logMonth = document.querySelector('#logMonth');
  el.logDateRange = document.querySelector('#logDateRange');
  el.logEntry_clearCMPlist = document.querySelector('#clearCmptcyList');
  el.shareLogClipboard = document.querySelector('#shareLog');
  el.printLog = document.querySelector('#printLog');
  el.viewModeBtn = document.querySelector('#viewModeBtn');
}

// add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.showLogEntryForm.addEventListener('click', showLogEntryForm);
  el.userSelector.addEventListener('change', changeUser);
  el.logEntry_CMP.addEventListener('change', competencyList);
  el.logDateRange.addEventListener('change', logWeekChange);
  el.logEntry_clearCMPlist.addEventListener('click', clearCompetencyList);
  el.shareLogClipboard.addEventListener('click', shareLogClipboard);
  el.printLog.addEventListener('click', printLog);
  el.viewModeBtn.addEventListener('click', changeViewMode);
}

// assigning the new date range for the logs to be shown
function getLogWeek() {
  const date = new Date(el.logDateRange.value);
  const day = date.getDay(); // figure out how many days into the week and - that to get to monday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  const weekStartDate = new Date(date.setDate(diff));
  const weekEndDate = new Date(date.setDate(date.getDate() + 6));
  const month = weekStartDate.toLocaleString('default', { month: 'long' });
  const weekRangeString = `${month} ${weekStartDate.getDate()} - ${weekEndDate.getDate()}`;
  el.logMonth.textContent = weekRangeString;
  return weekStartDate.toISOString().slice(0, 10) + ',' + weekEndDate.toISOString().slice(0, 10);
}

// assigning the new date range for the logs to be shown
function logWeekChange() {
  console.log(el.logDateRange.value);
  localStorage.setItem('selectedWeek', el.logDateRange.value);
  location.reload();
}

// gets all log entries for an ID and places them inside of app
async function getLogEntries(viewMode) {
  const logDateRange = getLogWeek();
  const [LogStartDate, LogEndDate] = logDateRange.split(',');
  let response;
  // Use query parameters to specify the start and end date for the week
  debugger;
  if (viewMode === 0) {
    response = await fetch(`/entries/${app.usrID}/week?startDate=${LogStartDate}&endDate=${LogEndDate}`);
  } else if (viewMode === 1){
    response = await fetch(`/entries/${app.usrID}`);
  }

  if (response.ok) {
    app.data = await response.json();
    console.log('logs loaded: ', app.data);
  } else {
    app.data = ['failed to load log Entries :-('];
  }
}

// for each entry in app.data make a new article element to hold and display it
function populateDiary() {
  if (app.data.length === 0) { // if no logs are fetched 
    const message = document.createElement('p');
    message.textContent = 'No Logs Created Yet For This Week! Click Add Entry To Create One.';
    message.classList.add('no-logs-message');
    const display = document.querySelector('#logDisplay');
    display.appendChild(message);
  } else {
    for (const entry of app.data) { // for every log that was fetched
      const article = cloneTemplate('#tplate-entry');
      article.dataset.id = entry.id;
      article.querySelector('.entry-date').textContent = entry.logdate;
      article.querySelector('.entry-work').textContent = entry.work;
      article.querySelector('.entry-xp').textContent = entry.xp;
      article.querySelector('.entry-competency').textContent = entry.competencies.replace(/\[|\]/g, '');
      article.querySelector('.entry-editLog').href = `/logEntry.html#${article.dataset.id}`;

      const display = document.querySelector('#logDisplay');
      display.append(article);
    }
  }
}

// clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

// creates JSON for log entry
function createLogEntry() {
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
    console.log('new log entry sent', updatedLogEntry);
  } else {
    console.log('failed to send log entry', response);
  }
}

// allows the changing of which users logs are showing
function changeUser() {
  localStorage.setItem('selectedUser', el.userSelector.value);
  location.reload();
}

// allows to change view mode from weekly to infinite
function changeViewMode() {
  if  (el.viewModeBtn.value === "Infinite View") {
    el.viewModeBtn.value = "Weekly View";
  } else {
    el.viewModeBtn.value = "Infinite View";
  }
  localStorage.setItem('viewModeValue', el.viewModeBtn.value);
  location.reload();
}

function getViewMode() {
  if  (el.viewModeBtn.value === "Infinite View") {
    viewMode = 1;
    el.logDateRange.style.display = 'none';
    el.logMonth.style.display = 'none';
  } else {
    viewMode = 0;
  }
  return viewMode;
}

// function for custom element allowing multiple competencies based off drop-down entries
function competencyList() {
  el.logEntry_CMPlist = document.querySelector('#cmptcyList');
  console.log(`${el.logEntry_CMP.value}`);
  el.logEntry_CMPlist.value += `${el.logEntry_CMP.value}, `;
}

// clears the contents of the textbox containing the array of competencies
function clearCompetencyList() {
  el.logEntry_CMPlist.value = null;
}

// copies to clipboard a link to read-only mode of the log
function shareLogClipboard() {
  const link = 'http://127.0.0.1:8080/logShare.html'; // link to the read-only version
  const input = document.createElement('input');
  input.value = link;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy'); // copies the input value to clipboard
  document.body.removeChild(input);
  console.log('Link copied to clipboard: ', link);
  el.shareLogClipboard.value = ('Copied!');
}

// Opens up print menu 
function printLog() {
  window.print(); // prints out using the custom print CSS
}

// show or hide the logs Add Entry form
function showLogEntryForm() {
  el.logEntry_Date.valueAsDate = new Date();
  const elements = document.querySelectorAll('.hide-on-button-press, .hidden');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hidden');
  }
}

pageLoaded();
await getLogEntries(viewMode)
populateDiary();
