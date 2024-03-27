import searchByKeyword from './api.js';
import { create, find } from './db.js';
import fs from 'fs';

//Function to handle searching by keyword
const handleKeywordSearch = async (keyword, useCache = false) => {
  try {
    // Perform search based on the keyword
    const searchResults = await searchByKeyword(keyword);
    // Save search results to search_history.json
    await saveToSearchHistory(keyword, searchResults);


    // // Prompt the user to select an item from the search results
    // const selectedItemId = await promptUserToSelectItem(searchResults);
    // // Retrieve detailed data for the selected item based on the cache option
    // let itemDetails;
    // if (!useCache) {
    //   // If cache option is false, get detailed data from the API
    //   itemDetails = await getDetailsById(selectedItemId);
    //   // Save entry in search_cache.json
    //   await saveToSearchCache(selectedItemId, itemDetails);
    // } else {
    //   // If cache option is true, attempt to find the selected item in search_cache.json
    //   itemDetails = await getCachedItemDetails(selectedItemId);
    //   if (!itemDetails) {
    //     // If not found in the search_cache.json, get detailed data from the API
    //     itemDetails = await getDetailsById(selectedItemId);
    //     // Save entry in search_cache.json
    //     await saveToSearchCache(selectedItemId, itemDetails);
    //   }
    // }
    // // Display detailed data to the user
    // displayItemDetails(itemDetails);
  } catch (error) {
    console.error('Error during keyword search:', error.message);
  }
};

//       //Getting the search results from API based on keyword
//       const searchResults = await searchByKeyword(keyword);

//       //Saving the results to the search_history file
//       let resultCount = searchResults.Products.length;
//       const searchData = {
//           search: keyword,
//           resultCount: resultCount 
//       };
      
//       const previousSearches = await fs.readFile('./mock_database/search_history.json', {encoding: 'utf-8'}, (err) =>{
//           if(err){
//               console.error('Error when reading file: ', err);
//           }
//       });
//       const previousSearchesArray = previousSearches ? JSON.parse(previousSearches) : [];
//       console.log(`The array after reading file:\n ${previousSearchesArray}`);
//       //Incase the search is already logged in the history
//       const duplicateIndex = previousSearchesArray.findIndex(current => current.search === searchData.search && current.resultCount === searchData.resultCount);
//       console.log(`If duplicateIndex = -1: NO duplicate \n If duplicateIndex > -1: Yes duplicate \n ${duplicateIndex}`)
//       if(duplicateIndex < 0){
//           previousSearchesArray.push(searchData);
//           console.log(`The array after pushing to array:\n ${previousSearchesArray}`);
//           await fs.writeFile('./mock_database/search_history.json', JSON.stringify(previousSearchesArray, null, 2), (err) =>{
//               if(err){
//                   console.error('Error when writing to file: ', err);
//               }
//           });
//       }

//       console.log(`The new search object: ${searchData.search} & ${searchData.resultCount}`);

//       //Displaying the results to the user
//       console.log(`Result list for: ${keyword}`);
//       for(let i = 0; i < searchResults.Products.length; i++){
//           console.log(`${i + 1}. ${searchResults.Products[i].ManufacturerProductNumber}`)
//       }

//   } catch (error) {
//       console.error('Error handling keyword search:', error);
//   }

// }


// Function to handle displaying search history
const displaySearchHistory = async () => {
  try {
    // Retrieve search history from the database
    const searchHistory = await find('search_history');
    // Display search history
    console.log('Previous searches history:', searchHistory);
  } catch (error) {
    console.error('Error getting search history:', error.message);
  }
};

// Function to save search history
const saveToSearchHistory = async (keyword, searchResults) => {
  try {
    // Create a new entry in the search history with the keyword and result count
    await create('./search_history', { search: keyword, resultCount: searchResults.Products.length });
  } catch (error) {
    console.error('Error saving search history:', error.message);
  }
};

// Placeholder functions for retrieving cached item details and prompting user to select an item
const getCachedItemDetails = async (itemId) => {
  // Implement logic to retrieve cached item details by ID
};

const promptUserToSelectItem = async (searchResults) => {
  const choices = searchResults.map((result) => ({
    name: `${result.name} (${result.id})`, // Assuming each result has a name and an id
    value: result.id // Assuming the id uniquely identifies each item
  }));

  const questions = [
    {
      type: 'list',
      name: 'selectedItemId',
      message: 'Select an item:',
      choices: choices
    }
  ];

  const answers = await inquirer.prompt(questions);
  return answers.selectedItemId;
};

//export { searchByKeywordApp, displaySearchHistory };

handleKeywordSearch('History');


