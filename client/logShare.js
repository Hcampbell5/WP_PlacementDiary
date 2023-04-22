const app = {};
app.usrID = 'abc'
//prepares the page, calls handler and listener functions
function pageLoaded() {
 // prepareHandles();
 // addEventListeners();
  populateDiary();
 //getLogEntries();
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








await getLogEntries();
pageLoaded();

