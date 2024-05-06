import express from 'express';
import mongo from './db.js';

import search from './router/search.js';
import history from './router/history.js';

const PORT = 8080;

// creating Express application instance
const app = express();

// GET route to handle requests to the root URL (localhost:8888)
app.get('/', (req, res) => {
    res.send('Welcome to the Search Engine');
});

//app.use(express.json());

app.use('/search', search);
app.use('/history', history);


// starting the server and connecting to MongoDB
const server = app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connect();
});

// this event fires on ctrl+c (for mac)
process.on('SIGINT', async () => {
    console.log('SIGINT detected');
    await mongo.close();
    server.close(() => {
        console.log('Server closed.');
    });
});
