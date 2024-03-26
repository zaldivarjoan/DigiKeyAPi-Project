import searchByKeyword from './api.js';
import fs from "fs";


// const { getSearchHistory, displaySearchHistory } = require('./api');

// Function to handle the logic for when a user searches by keyword
const handleKeywordSearch = async (keyword, cacheOption = false) => {
  try {
    // Search the selected API by keyword
    const searchResults = await searchByKeyword(keyword);

    // Save data in the mock database (search_history.json)
    fs.writeFile(".\mock_database\search_history.json",JSON.stringify(searchResults));
    //await saveSearchHistory(keyword, searchResults.length);

    // Prompt the user to select an item from the search results (implement your logic here)

    // Retrieve detailed data for the selected item based on the cache option
    //const detailedData = await getDetailedData(searchResults[0], cacheOption); // Example: retrieving details for the first item

    // Display the detailed data to the user in a user-friendly format
    //console.log('Detailed data:', detailedData);
  } catch (error) {
    console.error('Error handling keyword search:', error);
  }
};

// Function to retrieve detailed data for the selected item based on the cache option
// const getDetailedData = async (item, cacheOption) => {
//   if (!cacheOption) {
//     // Get the selected item by unique identifier from the API
//     const detailedData = await fetchDetailedDataFromAPI(item);
    
//     // Save an entry in search_cache.json
//     await saveSearchCache(detailedData);

//     return detailedData;
//   } else {
//     // Check if the selected item exists in search_cache.json
//     const cachedItem = await findInSearchCache(item);

//     if (cachedItem) {
//       console.log('Item found in cache.');
//       return cachedItem;
//     } else {
//       // Get the selected item by unique identifier from the API
//       const detailedData = await fetchDetailedDataFromAPI(item);
      
//       // Save an entry in search_cache.json
//       await saveSearchCache(detailedData);

//       return detailedData;
//     }
//   }
// };

// // Function to handle logic for displaying the search history
// const handleDisplaySearchHistory = async () => {
//   try {
//     // Retrieve the search history from the mock database
//     const searchHistory = await getSearchHistory();

//     // Display the search history to the user in a user-friendly format
//     console.log('Search history:');
//     searchHistory.forEach((entry, index) => {
//       console.log(`${index + 1}. Keyword: ${entry.keyword}, Result Count: ${entry.resultCount}`);
//     });
//   } catch (error) {
//     console.error('Error displaying search history:', error);
//   }
// };

handleKeywordSearch('IVIEW 14" Laptop');

// module.exports = {
//   handleKeywordSearch,
//   handleDisplaySearchHistory
// };