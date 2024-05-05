const express = require('express');
const router = express.Router();
import MongoDB from '../router/db.js';


// Endpoint GET /history
router.get('/', async (req, res) => {
  try {
    const db = MongoDB;
    await db.connect();

    let history;
    const searchTerm = req.query;

    if(!searchTerm)
    {
        history = await db.returnAllData();
    }
    else
    {
        history = await db.findData("search_history",searchTerm);
    }

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;