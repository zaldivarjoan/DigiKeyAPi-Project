import searchByKeyword from './api.js';
import { create, find } from './db.js';

// Function to handle searching by keyword
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
    await create('./search_history', { search: keyword, resultCount: searchResults.length });
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

handleKeywordSearch('IVIEW 14" Laptop');


