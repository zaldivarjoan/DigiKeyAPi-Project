import express from 'express';
const router = express.Router();
import db from '../db.js';


// Endpoint GET /history
router.get('/', async (req, res) => {
  try {
    let history;
    const {searchTerm} = req.query;

    if(!searchTerm)
    {
        history = await db.returnAllData("search_history");
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

export default router;
