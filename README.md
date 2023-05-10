# Placement Diary Web Application

The Placement Diary Web Application is a web-based platform designed to help users track and document their placement experiences during internships or job placements and share their progress with both their manager and the university. It provides a convenient way to log daily activities, work completed, knowledge and skills gained as well as integrating the ICTtech Engineering Competency standards, allowing users to maintain a comprehensive diary of their placement journey.

## Core Features
- Creation and Management of Log entries: Users can create new diary entries, providing details such as date, work completed, knowledge gained and competencies. They can also edit existing entries as needed. 
- Server-Side Development: The application is built using Node.js, allowing for server-side rendering, handling user requests, and interacting with the database.
- Responsive Design: The application is designed to be responsive, ensuring optimal viewing and usage experience across various devices, including desktops, tablets, and mobile phones.
- Sharing Read-Only Links: Users can generate a read-only link for a specific entry, which can be shared with others. This allows users to share their diary entries with their placement supervisor and the university.
- Print Logs: Users have the ability to print their diary logs for physical copies or easy reference. [removes user interface components]

## Additional Features
- Database Integration: The application uses a SQLite3 database to store diary entries, ensuring data persistence and efficient retrieval.
- Deletion of Logs: Users have the ability to delete specific diary entries when they are no longer needed. [on edit, press delete]
- Date Range Selection: The application allows users to view and filter entries based on specific weeks, making it easy to navigate and review past entries. [Select date within the dateselector and it will use that week Mon-Sun]
- Viewing Modes: The application allows users to toggle between an infinite scroll or a more precise weekly view. [Toggled via the view button]
- Multi-User : The application supports multiple user accounts, allowing different individuals to create their own separate placement diaries. [Change user using the drop down menu in the top right]
- Dark Theme Based on User Preference: The application supports a dark theme option that can be automatically set based on the user's preference. If the user has a dark mode preference enabled on their device, the application will display the dark theme by default. [changes based on users system pref]
- Competency Selector: To enable multiple competencies the drop down box fills out a text-box to its right which can be cleared using the red x if a mistake is made, trailing spaces and commas are removed behind the scenes.

## Installation
To install, Extract the Zip file and then run these commands: 
 - npm install
 - npm start

## Technologies Used
- HTML, CSS, Javascript
- Node.js
- SQLite3
- Express.js


## TO DO
- [x] create basic UI with entry forms and a ul for messages.
- [x] Create a form and layout which can be used with templates.
- [x] Create a data model. 
- [x] Give the JSON/Data object unique IDs.
- [x] Get data to be sent to client from server in a JSON.
- [x] Get data to be sent from client to server as JSON.
- [x] Create drop down for competencies.
- [x] Add in the edit entry page. 
- [x] Add edit button to log entries.
- [x] Add app.PUT for editing messages.
- [x] Add in logEntry.js and .html.
- [x] Write function to get entry ID for edit page.
- [x] Edited entries need to send to where the ID is and change it using.
- [x] Make date entry have no year.
- [x] Hide Entry boxes with the Add Entry button.
- [x] Make getEntryID work for ALL messages.
- [x] Build database using sql.
- [x] Swap data over from in memory array to database.
- [x] Fix the date formatting.
- [x] Find solution for having multiple competencies listed on an entry.
- [ x] Change the competencies to accept arrays.
- [ x] When editing competencies make it add to an array once selected and show it next to the drop down box (essentially you have to use the drop down 3 times and it adds them one by one).
- [x] Add more users.
- [x] Option to delete logs.
- [x] Work on having more weeks shown via template.
- [x] Split the data into weeks and have a backwards and forwards button.
    - [x] Add in datePicker to choose week of logs.
- [x] Show a message when the week has no log entries, urge user to update logs.
- [x] Add in print option.
- [x] Add in export options like PDF to manager.
- [x] Add in different view modes.
- [ ] Finalise css for good styling.
    - [x] Add in media-selectors to format the site for web vs mobile.
    - [x] Add in custom font Arial Rounded MT Bold.
    - [x] Build Dark mode.
    - [x] Add border colours etc to beautify.
- [x] Write a readme.
