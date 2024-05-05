const express = require('express');
const router = express.Router();
const { searchByKeyword, getDetailsById } = require('../services/api');
//const { find } = require('../services/db');
import MongoDB from '../db.js';


// Endpoint GET /search
router.get('/', async (req, res) => {
  try {
    const searchTerm = req.query;
    // Display all the search result //
    const searchResults = await searchByKeyword(searchTerm);
    let idList = [];
    for(let i = 0; i < searchResults.Products.length; i++)
    {
      idList[i] = await getDetailsById(searchResults.Products[i].ManufacturerProductNumber);      
    }

    // Break downinto json readable file //
    let results = []
    for(let i = 0; i < idList.length; i++)
    {
      results[i] = {id: idList[0].Product.ManufacturerProductNumber, displayText: idList[0].Product.Description.ProductDescription }  
    }

    try {
      const db = MongoDB;
      await db.connect();

      const collection = await db.checkCollection("search_history");
      
      if(!collection)
      {
          db.create("search_history",  {searchTerm, searchCount: results.length, lastSearched: new Date() });
      }
      else
      {
        const check = await db.findData("search_history",searchTerm);
            if(check)
            {
                db.update(check, {searchTerm, searchCount: results.length, lastSearched: new Date() });
            }
            else
            {
                db.create("search_history",  {searchTerm, searchCount: results.length, lastSearched: new Date() });
            }
      }

    } catch (err) {
      console.error("Main function error:", err);
    } finally {
      await db.close();
    }

    res.json(results);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


// GET /search/:id/details
router.get('/:id/details', async (req, res) => {
  const { id } = req.params;
  const { cache = true } = req.query;

  try {
    let detailedData;

    const db = MongoDB;
    await db.connect();

    if (cache === 'true') {
      // Check if the item exists in the cache
      const searchResult = await db.findID("search_cache",id);
      if(searchResult)
      {
        detailedData = searchResult;
      }
      else
      {
        let a = await getDetailsById(id);
        detailedData = {id: a.Product.ManufacturerProductNumber, displayText: a.Product.Description.ProductDescription } 
      }
    } else {
      let a = await getDetailsById(id);
      detailedData = {id: a.Product.ManufacturerProductNumber, displayText: a.Product.Description.ProductDescription } 
    }

    db.create("search_cache", detailedData);
    res.json({ detailedData });
  } catch (error) {
    console.error('Error retrieving detailed data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  finally {
    await db.close();
  }
});