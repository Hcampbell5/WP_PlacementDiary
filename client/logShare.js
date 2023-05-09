const el = {}; // stores all of the elements on page (textboxes, buttons etc)
const app = {}; // stores the log data

// prepares the page, calls handler and event listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  const selectedWeek = localStorage.getItem('selectedWeek');

  if (selectedWeek !== null) {
    el.logDateRange.valueAsDate = new Date(selectedWeek);
  } else {
    el.logDateRange.valueAsDate = new Date();
  }

  getLogWeek();
  const selectedUser = localStorage.getItem('selectedUser'); // checking local storage for which users logs to load
  el.userSelector.value = selectedUser;
  app.usrID = (el.userSelector.value);
}

// assigning the new date range for the logs to be shown
function logWeekChange() {
  console.log(el.logDateRange.value);
  localStorage.setItem('selectedWeek', el.logDateRange.value);
  location.reload();
}

// assigning the new date range for the logs to be shown
function getLogWeek() {
  const date = new Date(el.logDateRange.value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  const weekStartDate = new Date(date.setDate(diff));
  const weekEndDate = new Date(date.setDate(date.getDate() + 6));
  const month = weekStartDate.toLocaleString('default', { month: 'long' });
  const weekRangeString = `${month} ${weekStartDate.getDate()} - ${weekEndDate.getDate()}`;
  el.logMonth.textContent = weekRangeString;
  return weekStartDate.toISOString().slice(0, 10) + ',' + weekEndDate.toISOString().slice(0, 10);
}

// clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

// for each entry in app.data make a new article element to hold and display it
function populateDiary() {
  getLogEntries();
  for (const entry of app.data) {
    const article = cloneTemplate('#tplate-entry');
    article.dataset.id = entry.id;
    article.querySelector('.entry-date').textContent = entry.logdate;
    article.querySelector('.entry-work').textContent = entry.work;
    article.querySelector('.entry-xp').textContent = entry.xp;
    article.querySelector('.entry-competency').textContent = entry.competencies.replace(/\[|\]/g, '');

    const display = document.querySelector('#logDisplay');
    display.append(article);
  }
}


// gets all log entries for an ID and places them inside of app
async function getLogEntries() {
  const logDateRange = getLogWeek();
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

// changes the user whos logs are shown
function changeUser() {
  localStorage.setItem('selectedUser', el.userSelector.value);
  location.reload();
}

// formats a printable copy of the log
function printLog() {
  window.print();
}

// add event listeners for buttons
function addEventListeners() {
  el.userSelector.addEventListener('change', changeUser);
  el.logDateRange.addEventListener('change', logWeekChange);
  el.printLog.addEventListener('click', printLog);
}

// preparing handlers for entry boxes
function prepareHandles() {
  el.userSelector = document.querySelector('#userIDslct');
  el.logMonth = document.querySelector('#logMonth');
  el.logDateRange = document.querySelector('#logDateRange');
  el.printLog = document.querySelector('#printLog');
}

pageLoaded();
await getLogEntries();
populateDiary();
