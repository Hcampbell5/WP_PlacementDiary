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

  const currentUser = (el.userSelector.options[el.userSelector.selectedIndex]).textContent;
  el.title.textContent += (` - ${currentUser}`);
}

// preparing handlers for entry boxes and buttons
function prepareHandles() {
  console.log('Handles Prepared');
  el.userSelector = document.querySelector('#userIDslct');
  el.logMonth = document.querySelector('#logMonth');
  el.logDateRange = document.querySelector('#logDateRange');
  el.printLog = document.querySelector('#printLog');
  el.title = document.querySelector('#title');
  el.viewModeBtn = document.querySelector('#viewModeBtn');
}

// add event listeners for buttons and other selectors
function addEventListeners() {
  el.userSelector.addEventListener('change', changeUser);
  el.logDateRange.addEventListener('change', logWeekChange);
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
    message.textContent = 'No Logs Created Yet For This Week!';
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

// Opens up print menu 
function printLog() {
  window.print(); // prints out using the custom print CSS
}


pageLoaded();
await getLogEntries(viewMode)
populateDiary();
