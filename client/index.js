const el = {}; // stores all of the elements on page (textboxes, buttons etc)
const app = {}; // stores the log data
let viewMode;

// prepares the page, calls handler and event listener functions, fetches local storage items
function pageLoaded() {
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

// preparing handlers for entry boxes and buttons
function prepareHandles() {
  console.log('Handles Prepared');
  el.submitLogEntry = document.querySelector('#submitEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.selected_CMP_Container = document.querySelector('#selectedItems')
  el.showLogEntryForm = document.querySelector('#showLogEntryForm');
  el.userSelector = document.querySelector('#userIDslct');
  el.logMonth = document.querySelector('#logMonth');
  el.logDateRange = document.querySelector('#logDateRange');
  el.shareLogClipboard = document.querySelector('#shareLog');
  el.printLog = document.querySelector('#printLog');
  el.viewModeBtn = document.querySelector('#viewModeBtn');
}

// add event listeners for buttons and other selectors
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.showLogEntryForm.addEventListener('click', showLogEntryForm);
  el.userSelector.addEventListener('change', changeUser);
  el.logEntry_CMP.addEventListener('change', competencyList);
  el.logDateRange.addEventListener('change', logWeekChange);
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
  localStorage.setItem('selectedWeek', el.logDateRange.value);
  location.reload();
}

// gets all log entries for an ID and places them inside of app
async function getLogEntries(viewMode) {
  const logDateRange = getLogWeek();
  const [LogStartDate, LogEndDate] = logDateRange.split(',');
  let response;
  // Use query parameters to specify the start and end date for the week

  if (viewMode === 0) { // 0 = weekly view
    response = await fetch(`/entries/${app.usrID}/week?startDate=${LogStartDate}&endDate=${LogEndDate}`);
  } else if (viewMode === 1){ // 1 = monthly view
    response = await fetch(`/entries/${app.usrID}/all`);
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
    competencies: getSelectedCompetencies()
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

// allows you to change which users logs are showing
function changeUser() {
  localStorage.setItem('selectedUser', el.userSelector.value);
  location.reload();
}

// changes the buttons text and stores the value 
function changeViewMode() {
  if  (el.viewModeBtn.value === "Infinite View") {
    el.viewModeBtn.value = "Weekly View";
  } else {
    el.viewModeBtn.value = "Infinite View";
  }
  localStorage.setItem('viewModeValue', el.viewModeBtn.value); //stored locally so its not lost on refresh
  location.reload();
}

// function used to determine the view mode based off the buttons value
function getViewMode() {
  if  (el.viewModeBtn.value === "Infinite View") {
    viewMode = 1; // infinite view 
    el.logDateRange.style.display = 'none';
    el.logMonth.style.display = 'none'; // hides unnecessary info in this view mode 
  } else {
    viewMode = 0; // weekly view
  }
  return viewMode;
}

// function for custom element allowing multiple competencies based off drop-down entries
function competencyList() {
 const selectedOption = el.logEntry_CMP.options[el.logEntry_CMP.selectedIndex];
    const selectedCMP = document.createElement('div');
    selectedCMP.className = 'selected-item';
    selectedCMP.innerHTML = `<span>${selectedOption.text}</span><button>X</button>`;
    el.selected_CMP_Container.appendChild(selectedCMP);

    // Add event listener to the remove button
    const removeButton = selectedCMP.querySelector('button');
    removeButton.addEventListener('click', function() {
      selectedCMP.remove();
    });
}

// function to fetch and stringify the contents of all selected items
function getSelectedCompetencies() {
  const selectedItems = Array.from(el.selected_CMP_Container.getElementsByClassName('selected-item'));
  const values = selectedItems.map(item => item.querySelector('span').textContent);
  const competencyString = '[' + values.join(', ') + ']';
  return competencyString;
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
