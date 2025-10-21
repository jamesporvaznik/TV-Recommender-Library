const cors = require('cors');
const express = require('express');
const app = express();
const initializeDatabase = require('./db.js');
let db;

const { getAllShows } = require('./dbQueries.js');

app.get('/api/shows', async (req, res) => {
    try {

        // connect to the db
        const shows = await getAllShows(db); 
        res.json({
            data: shows
        });

    } catch (e) {
        console.error("CRASH ERROR:", e.message, e.stack);
        res.status(500).json({ error: "Failed to load show data from database." });
    }
});

async function startServer() {
    // Initialize db
    db = await initializeDatabase(); 
    
    // Start listening after the db is ready
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} with DB ready!`));
}

startServer();