const el = {}; // stores all of the elements on page (textboxes, buttons etc)
const app = {}; // stores the log data

// prepares the page, calls handler and event listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  var selectedWeek = localStorage.getItem("selectedWeek");
  if (selectedWeek !== null) { el.logDateRange.valueAsDate = new Date(selectedWeek);} 
  else { el.logDateRange.valueAsDate = new Date();}
  getLogWeek();
  var selectedUser = localStorage.getItem("selectedUser"); // checking local storage for which users logs to load
  el.userSelector.value = selectedUser;
  app.usrID = (el.userSelector.value);
}

// assigning the new date range for the logs to be shown
function logWeekChange() {
  debugger;
  console.log(el.logDateRange.value);
  localStorage.setItem("selectedWeek", el.logDateRange.value);
  location.reload();
  // store the existing value+reload?
  // load in new logs for the right date
}

// assigning the new date range for the logs to be shown
function getLogWeek(){
  const date = new Date(el.logDateRange.value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is Sunday
  const weekStartDate = new Date(date.setDate(diff));
  const weekEndDate = new Date(date.setDate(date.getDate() + 6));
  const month = weekStartDate.toLocaleString('default', { month: 'long' });
  const weekRangeString = `${month} ${weekStartDate.getDate()} - ${weekEndDate.getDate()}`;
  el.logMonth.textContent = weekRangeString;
  //return weekStartDate.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}) + '-' + weekEndDate.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'});
  //return weekStartDate.toLocaleDateString('en-GB').replace(/\//g,'/') + '-' + weekEndDate.toLocaleDateString('en-GB').replace(/\//g,'/');
  //return weekStartDate.getFullYear() + '/' + ('0' + (weekStartDate.getMonth()+1)).slice(-2) + '/' + ('0' + weekStartDate.getDate()).slice(-2) + '-' + weekEndDate.getFullYear() + '/' + ('0' + (weekEndDate.getMonth()+1)).slice(-2) + '/' + ('0' + weekEndDate.getDate()).slice(-2);
  return weekStartDate.toISOString().slice(0,10) + ',' + weekEndDate.toISOString().slice(0,10);

}
// clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

// for each entry in app.data make a new article element to hold and display it
function populateDiary() {
  getLogEntries();
  debugger;
  if (app.data.length === 0) { 
    const message = document.createElement('p');
    message.textContent = "No Logs Created Yet For This Week! Click Add Entry To Create One.";
    message.classList.add('no-logs-message');
    const display = document.querySelector('#logDisplay');
    display.appendChild(message);
  } else {
    for (const entry of app.data) {
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



// function for custom element allowing multiple competencies based off drop-down entries
function competencyList() {
  el.logEntry_CMPlist = document.querySelector('#cmptcyList');
  console.log(`${el.logEntry_CMP.value}`);
  el.logEntry_CMPlist.value += `${el.logEntry_CMP.value}, `;
}

// gets all log entries for an ID and places them inside of app
async function getLogEntries() {
  let logDateRange = getLogWeek();
  const [LogStartDate, LogEndDate] = logDateRange.split(',');
  // Use query parameters to specify the start and end date for the week
  const response = await fetch(`/entries/${app.usrID}/week?startDate=${LogStartDate}&endDate=${LogEndDate}`);
if (response.ok) {
    app.data = await response.json();
    console.log('logs loaded: ', app.data);
  } else {
    app.data = ['failed to load log Entries :-('];
  }
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
  } else {
    console.log('failed to send log entry', response);
  }
}

// allows the changing of which users logs are showing
function changeUser() {
  localStorage.setItem("selectedUser", el.userSelector.value);
  location.reload();
}

// clears the contents of the textbox containing the array of competencies
function clearCompetencyList(){
  el.logEntry_CMPlist.value = "" ;
}

// copies to clipboard a link to read-only mode of the log
function shareLogClipboard() {
  const link ='http://127.0.0.1:8080/logShare.html';
  const input = document.createElement('input');
  input.value = link;
  document.body.appendChild(input);

  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  console.log('Link copied to clipboard: ', link);
  el.shareLogClipboard.value = ("Copied!");
}

// formats a printable copy of the log
function printLog() {
  window.print()
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
