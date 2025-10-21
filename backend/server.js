const cors = require('cors');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const initializeDatabase = require('./db.js');
let db;

const { getAllShows } = require('./dbQueries.js');

// return all shows to the frontend
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

// handling a user signing up
app.post('/api/signup', async (req, res) => {
    const { username, password, confirm } = req.body;

    if (!username || !password || !confirm) {
        return res.status(400).json({ success: false, message: 'Credentials are required.' });
    }

    if(password != confirm){
        return res.status(400).json({ success: false, message: 'Passwords don\' match.' });
    }
    
    try {

    } catch (e) {

    }
});

// handling a user logging in
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Credentials are required.' });
    }

    try {
        const user = await findUserByUsername(db, username);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
        if(user.password != password){
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // Compare the submitted password to the stored hash
        // const match = await bcrypt.compare(password, user.password_hash);

    } catch (e) {
        console.error("Login error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

//adding a bookmark to the users account data
app.post('/api/bookmark'), async (req, res) => {

}

//adding a bookmark to the users account data
app.post('/api/wacthed'), async (req, res) => {

}

//adding a bookmark to the users account data
app.post('/api/recommended'), async (req, res) => {

}

//adding a bookmark to the users account data
app.post('/api/added'), async (req, res) => {

}

async function startServer() {
    // Initialize db
    db = await initializeDatabase(); 
    
    // Start listening after the db is ready
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} with DB ready!`));
}

startServer();