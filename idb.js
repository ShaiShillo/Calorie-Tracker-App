//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
let idb = {};
idb.openCaloriesDB = openCaloriesDB;
window.idb = idb;
//DB initialization function
async function openCaloriesDB(dbName, dbVersion) {
    return new Promise((resolve, reject) => {
        //Try to open the DB
        const request = window.indexedDB.open(dbName, dbVersion);
        let db;

        //Failed to open the DB, reject with an error
        request.onerror = function(event) {
            reject(`Error opening database`);
        };

        //Succeeded to open the DB, assign it into the global var, assign the methods to this var and resolve with it
        request.onsuccess = function(event) {
            db = event.target.result;
            IDBDatabase.prototype.addCalories = addCalories.bind(db);
            IDBDatabase.prototype.getReport = getReport.bind(db);
            resolve(db);
        };

        //Update the DB
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            db.createObjectStore(`caloriesdb`, { keyPath: `id`, autoIncrement: true });
        };
    });
}

//Add calories item function
async function addCalories(caloriesItem) {
    return new Promise((resolve, reject) => {
        //Get the current date to use for report generation, split and store the relevant values as numbers
        const currentDate = new Date()
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1; //Adding 1 to get month in range 1-12
        const currentYear = currentDate.getFullYear();

        //Add the current date to the calorie item
        caloriesItem.day = currentDay;
        caloriesItem.month = currentMonth;
        caloriesItem.year = currentYear;

        //Try writing
        const transaction = this.transaction([`caloriesdb`], `readwrite`);
        const store = transaction.objectStore(`caloriesdb`);
        const request = store.add(caloriesItem);

        //Failed to write, reject with an error
        request.onerror = function(event) {
            reject(`Error adding calorie item`);
        };

        //Succeeded, resolve and put a message to the console
        request.onsuccess = function(event) {
            resolve(`Calorie item added successfully`);
        };
    });
}

//Get report function, returns the report as an array with the relevant items
async function getReport(month, year) {
    return new Promise((resolve, reject) => {
        //Try to get all the items stored in our DB
        const transaction = this.transaction([`caloriesdb`], `readonly`);
        const store = transaction.objectStore(`caloriesdb`);
        const request = store.getAll();
        

        //Failed, reject with an error
        request.onerror = function(event) {
            console.error(`Error occurred while fetching report data:`, event.target.error);
            reject(`Error getting report`);
        };

        //Succeeded, filter them for the relevant items only, resolve with those in an array
        request.onsuccess = function(event) {
            const allCalories = event.target.result;
            const relevantCalories = allCalories.filter((item) =>
                item.month === month && item.year === year);
        
            resolve(relevantCalories);
        };
    });
}