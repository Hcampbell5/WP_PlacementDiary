const el = {};
const app = {};

// prepares the page, calls handler and listener functions
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  getEntryId();
}

// preparing handlers for entry boxes
function prepareHandles() {
  console.log('Handles Prepared');
  el.submitLogEntry = document.querySelector('#submitLogEntry');
  el.cancelLogEdit = document.querySelector('#CancelLogEdit');
  el.deleteLogEntry = document.querySelector('#deleteLogEntry');
  el.logEntry_Date = document.querySelector('#logDate');
  el.logEntry_WC = document.querySelector('#workCmp');
  el.logEntry_KG = document.querySelector('#knGain');
  el.logEntry_CMP = document.querySelector('#cmptcy');
  el.competenciesContainer = document.querySelector('#competenciesContainer');

}

// add event listeners for buttons
function addEventListeners() {
  el.submitLogEntry.addEventListener('click', createLogEntry);
  el.cancelLogEdit.addEventListener('click', () => {
    window.location.href = 'index.html'; 
  });
  el.deleteLogEntry.addEventListener('click', deleteLogEntry);
  el.logEntry_CMP.addEventListener('change', competencyList);
}

// function to get log entry ID
function getEntryId() {
  app.id = window.location.hash.substring(1);
  return app.id;
}

// gets all log entries for a single ID and places them inside of app
async function getLogEntry() {
  const response = await fetch(`/entries/${app.id}`);
  if (response.ok) {
    app.data = await response.json();
    console.log('fetched log', app.data);
  } else {
    app.data = ['failed to load log Entry :-('];
  }
}

// for each entry in app.data make a new article element to hold and display it
function populateDiary() {
  el.logEntry_Date.value = app.data.logdate;
  el.logEntry_WC.value = app.data.work;
  el.logEntry_KG.value = app.data.xp;
  loadCompetencies(app.data.competencies);
}

// creates JSON for log entry
function createLogEntry() {
  const logEntryObj = {
    id: app.id,
    usrID: app.data.usrID,
    logdate: el.logEntry_Date.value,
    work: el.logEntry_WC.value,
    xp: el.logEntry_KG.value,
    competencies: getSelectedCompetencies()
  };
  sendLogEntry(logEntryObj);
  window.location.href = 'index.html';
  // sendLogEntry(logEntryObj);
}

// sends log entries to server
async function sendLogEntry(logEntryObj) {
  const payload = { msg: logEntryObj };
  console.log('Payload', payload);

  try {
    const response = await fetch(`/entries/${logEntryObj.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedLog = await response.json();
      console.log('log updated!', updatedLog);
    } else {
      console.log('failed to send log entry', response);
    }
  } catch (error) {
    console.log('error sending log entry:', error);
  }
}

// delete unwanted logs
async function deleteLogEntry() {
  const id = getEntryId();
  const payload = { id };
  try {
    const response = await fetch(`/entries/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('log deleted!');
    } else {
      console.log('failed to delete log entry', response);
    }
  } catch (error) {
    console.log('error deleting log entry:', error);
  }
  window.location.href = 'index.html';
}

// function to fetch all of the competencies already selected and pass into the create element function
function loadCompetencies(competenciesString) {
  // Remove the square brackets from the string
  const cleanedString = competenciesString.replace(/\[|\]/g, '');
  // Split the string by commas to get individual competencies
  const competencies = cleanedString.split(',').map(competency => competency.trim());
  competencies.forEach((competency) => {
    const competencyElement = createCompetencyElement(competency);
    el.competenciesContainer.appendChild(competencyElement);
  });
}

// function to create Competency elements (tags) for the already selected competencies
function createCompetencyElement(competency) {
  const competencyElement = document.createElement('div');
  competencyElement.classList.add('selected-item');

  const labelElement = document.createElement('span');
  labelElement.textContent = competency;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'x';
  removeButton.addEventListener('click', () => {
    competencyElement.remove();
  });

  competencyElement.appendChild(labelElement);
  competencyElement.appendChild(removeButton);

  return competencyElement;
}

// function for adding more custom elements allowing multiple competencies based off drop-down entries
function competencyList() {
  const selectedOption = el.logEntry_CMP.options[el.logEntry_CMP.selectedIndex];
  const selectedText = selectedOption.text;
  
  const competencies = Array.from(el.competenciesContainer.getElementsByClassName('selected-item')); // Check if the competency is already selected

  const isAlreadySelected = competencies.some(item => item.querySelector('span').textContent === selectedText);
  
  if (!isAlreadySelected) {
    const selectedCMP = document.createElement('div');
    selectedCMP.className = 'selected-item';
    selectedCMP.innerHTML = `<span>${selectedText}</span><button>x</button>`;
    el.competenciesContainer.appendChild(selectedCMP);
  
    const removeButton = selectedCMP.querySelector('button'); // Add event listener to the remove button

    removeButton.addEventListener('click', function() {
      selectedCMP.remove();
    });
  }
}

// function to fetch and stringify the contents of all selected items to send to database
function getSelectedCompetencies() {
   const selectedItems = Array.from(el.competenciesContainer.getElementsByClassName('selected-item'));
   const values = selectedItems.map(item => item.querySelector('span').textContent);
   const competencyString = '[' + values.join(', ') + ']';
   return competencyString;
 }

pageLoaded();
await getLogEntry();
populateDiary();
