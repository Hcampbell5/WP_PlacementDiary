const el = {}; 
const app = {};
app.usrID = 'abc'

//prepares the page, calls handler and listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  el.logEntry_Date.valueAsDate = new Date();
  populateDiary();
  console.log(app.data);
  getLogEntries();
}


//clones template
function cloneTemplate(selector) {
  const tplate = document.querySelector(selector);
  return tplate.content.firstElementChild.cloneNode(true);
}

//for each entry in app.data make a new article element to hold and display it 
function populateDiary() {
  for (const entry of app.data) {
    const article = cloneTemplate('#tplate-entry');
    article.dataset.id = entry.id;
    article.querySelector('.entry-date').textContent = entry.date;
    article.querySelector('.entry-work').textContent = entry.work;
    article.querySelector('.entry-xp').textContent = entry.xp;
    article.querySelector('.entry-competency').textContent = entry.competencies;
    


    const month = document.querySelector('#month');
    month.append(article)
  }
}



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
    date: el.logEntry_Date.value.slice(5),
    work: el.logEntry_WC.value,
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

    //update the page with new entries
      //add in code
      //await getLogEntries();
      //populateDiary();
      location.reload();

    const updatedLogEntry = await response.json();
  } else {
    console.log('failed to send log entry', response);
  }
}

function editLog(){
  debugger;
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
}

//show or hide the logs Add Entry form 
function showLogEntryForm() {
  var elements = document.querySelectorAll(".hide-on-button-press, .hidden");
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.toggle("hidden");
    //When hidden clear contents?
  }
}

await getLogEntries();
pageLoaded();

