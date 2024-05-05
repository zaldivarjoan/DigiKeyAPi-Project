import searchByKeyword from './api.js';
import {getDetailsById} from './api.js';
import { create, find } from './db.js';
import inquirer from 'inquirer';

//Function to handle searching by keyword
export const handleKeywordSearch = async (keyword, useCache = false) => {
  try {
    // Perform search based on the keyword
    const searchResults = await searchByKeyword(keyword);

    // Save search results to search_history.json
    await saveToSearchHistory(keyword, searchResults);
    // Prompt the user to select an item from the search results
    const selectedItemId = await promptUserToSelectItem(searchResults);

    //Retrieve detailed data for the selected item based on the cache option
    let itemDetails;
    if (!useCache) {
      // If cache option is false, get detailed data from the API
      itemDetails = await getDetailsById(selectedItemId);
      // Save entry in search_cache.json
      await saveToSearchCache(selectedItemId, itemDetails);
    } else {
      // If cache option is true, attempt to find the selected item in search_cache.json

      const cacheItem = await getCachedItemDetails(selectedItemId);
      if (!cacheItem) {
        console.log('NotFound!');
        // If not found in the search_cache.json, get detailed data from the API
        itemDetails = await getDetailsById(selectedItemId);
        // Save entry in search_cache.json
        await saveToSearchCache(selectedItemId, itemDetails);
      }
      else
      {
        console.log("Found");
        itemDetails = cacheItem.Detail;
      }
    }
    //Display detailed data to the user
    displayItemDetails(itemDetails);
  } catch (error) {
    console.error('Error during keyword search:', error.message);
  }
};


// Function to handle displaying search history
const displayItemDetails = (itemDetails) => {
  console.log(`Item :  ${itemDetails.Product.Description.ProductDescription}`);
  console.log(`Manufacturer Product ID :  ${itemDetails.Product.Manufacturer.Id}`);
  console.log(`Manufacturer Product Number :  ${itemDetails.Product.ManufacturerProductNumber}`);
  console.log(`Price :  ${itemDetails.Product.UnitPrice}`);
  console.log(`QuantityAvailable :  ${itemDetails.Product.QuantityAvailable}`);
};



// Function to save search history
const saveToSearchCache = async (selectItem, itemDetail) => {
  try {
    await create('./search_cache', { id: selectItem, Detail : itemDetail  });
  } catch (error) {
    console.error('Error saving search history:', error.message);
  }
}

const saveToSearchHistory = async (keyword, searchResults) => {

  let idList = [];
  for(let i = 0; i < searchResults.Products.length; i++){
    idList[i] = searchResults.Products[i].ManufacturerProductNumber;
}
  
  const entry = {
    search: keyword,
    id: JSON.stringify(idList)
};

try {
  // Create a new entry in the search history with the keyword and result count
  await create('./search_history', entry);
} catch (error) {
  console.error('Error saving search history:', error.message);
}
}
// Placeholder functions for retrieving cached item details and prompting user to select an item
const getCachedItemDetails = async (itemId) => {
  // Implement logic to retrieve cached item details by ID
  try {
    // Create a new entry in the search history with the keyword and result count
    const itemDetail = await find('./search_cache', itemId);
    return itemDetail;
  } catch (error) {
    console.error('Error saving search history:', error.message);
  }
};

const promptUserToSelectItem = async (searchResults) => {
  const choices = searchResults.Products.map((result) => ({
    name: `${result.ManufacturerProductNumber}`
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

export const displaySearchHistory = async () => {
  try {
    const searchHistory = await find('./search_history');
    if (searchHistory.length === 0) {
      console.log('No search history available.');
    } else {
      console.log('Previous searches history:');
      searchHistory.forEach((entry, index) => {
        console.log(`Search ${index + 1}:`);
        console.log(`  Keyword: ${entry.search}`);
      });
    }
  } catch (error) {
    console.error('Error getting search history:', error.message);
  }
};



