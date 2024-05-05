import express from 'express';
import mongo from './services/db.js';

import poker from './routes/poker.js';
import results from './routes/results.js';

const PORT = 8888;

// creating Express application instance
const app = express();

// GET route to handle requests to the root URL (localhost:8888)
app.get('/', (req, res) => {
    res.send('Welcome to the Search Engine');
});

// mounting the 'poker' router to handle requests starting with '/poker'
app.use('/poker', poker);

// mounting the 'results' router to handle requests starting with '/results'
app.use('/results', results);

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
