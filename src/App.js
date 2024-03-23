//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
import React, { useState, useEffect } from 'react';
import './App.css';
import CalorieForm from './CalorieForm';
import CalorieReport from './CalorieReport';

//Our main component
function App() {
  //Stores the report entries
   const [reportData, setReportData] = useState([]);
  //Stores the db instance
  const [db, setDb] = useState(null);

  
  // Initialize our db
  useEffect(() => {
    async function initializeDB() {
      try {
        const dbInstance = await window.idb.openCaloriesDB(`caloriesdb`, 1); 
        setDb(dbInstance);
      } catch (error) {
        console.error(`Database initialization failed:`, error);
      }
    }

    initializeDB();
  }, []); // Empty dependency array to ensure this runs only once



  //Handle form submission and add the calorie item to the db
  const handleFormSubmit = async (formData) => {
    try {
      //Checks if the db is initialized properly
      if (!db) {
        throw new Error(`Database not initialized`);
      }
      //Wait for writing the calorie item to the db
      const result = await db.addCalories(formData);
      console.log(result);
    } catch (error) {
      //Enters upon Promise rejection
      console.error(`Failed to add data:`, error);
    }
  };

  //Function to handle fetching report data based on the selected month and year
  const handleGetReportData = async (month, year) => {
    try {
      //Checks if the db is initialized properly
      if (!db) {
        throw new Error(`Database not initialized`);
      }
      ////Wait for fetching the report data for the selected month and year
      const data = await db.getReport(month, year);
      //Update the report data UseState with the fetched data
      setReportData(data);
      //return data;
    } catch (error) {
      //Enters upon Promise rejection
      console.error(`Failed to get report data:`, error);
    }
  };

  //
  return (
    <div className='App'>
      <header className='App-header'>
        {/* CalorieForm component for inputting data */}
        <CalorieForm onSubmit={handleFormSubmit} />
        {/* CalorieReport component for displaying report */}
        <CalorieReport getReportData={handleGetReportData} reportData={reportData} />
      </header>
    </div>
  );
}

export default App;
