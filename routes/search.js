import express from 'express';
import searchByKeyword from '../services/api.js';
import {getDetailsById} from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();
// Endpoint GET /search
router.get('/', async (req, res) => {
  try {
    const {searchTerm} = req.query;

    //console.log(searchTerm);
    // // Display all the search result //
    const searchResults = await searchByKeyword(searchTerm);

    let idList = [];
    for(let i = 0; i < searchResults.Products.length; i++)
    {
      idList[i] = await getDetailsById(searchResults.Products[i].ManufacturerProductNumber);      
    }

    console.log("Done1");

    // // Break downinto json readable file //
    let results = []
    for(let i = 0; i < idList.length; i++)
    {
        results[i] = {id: idList[i].Product.ManufacturerProductNumber, displayText: idList[i].Product.Description.ProductDescription }  
    }

    console.log(idList.length);


    try {
      // const db = MongoDB;
      // await db.connect();

      const collection = await db.checkCollection("search_history");
      
      if(!collection)
      {
        let data = {
          searchTerm: searchTerm,
          searchCount: results.length,
          lastSearched: new Date()
        };
        db.create("search_history",  data);
      }
      else
      {
        const check = await db.findData("search_history",searchTerm);
        //console.log(check);
            if(check)
            {
              let data = {
                searchTerm: searchTerm,
                searchCount: results.length,
                lastSearched: new Date()
              };
                db.update("search_history", check, data);
            }
            else
            {
                db.create("search_history",  {searchTerm: searchTerm, searchCount: results.length, lastSearched: new Date() });
            }
      }

    } catch (err) {
      console.error("Main function error:", err);
    } 

    res.json(results);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//endpoint /search/:id/details
router.get('/:id/details', async (req, res) => {
  const { id } = req.params;
  const { cache = true } = req.query;

  try {
    let detailedData;

    // const db = MongoDB;
    // await db.connect();
    console.log("Done1");

    if (cache === 'true') {
      // Check if the item exists in the cache
      const searchResult = await db.findID("search_cache",id);
      if(searchResult)
      {
        console.log("Done2");
        detailedData = searchResult;
      }
      else
      {
        console.log("Done3");

        let a = await getDetailsById(id);
        detailedData = {id: a.Product.ManufacturerProductNumber, displayText: a.Product.Description.ProductDescription } 
        db.create("search_cache", detailedData);

      }
    } else {
      console.log("Done4");

      let a = await getDetailsById(id);
      detailedData = {id: a.Product.ManufacturerProductNumber, displayText: a.Product.Description.ProductDescription } 
      db.create("search_cache", detailedData);

    }
    // Returns requested information
    res.json({ detailedData });
  } catch (error) {
    console.error('Error retrieving detailed data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

export default router;
