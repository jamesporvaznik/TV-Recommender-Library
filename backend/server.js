const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: './.env' }); 

const jwt = require('jsonwebtoken'); 
const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRY = '1h'; // Token expires in 1 hour (standard practice)

app.use(cors()); 
app.use(express.json());

const initializeDatabase = require('./db.js');
let db;

const { getAllShows, findUserByUsername, createAccount, findUserById, getShowByTitle, insertAdded, clearAdded, toggleWatched, toggleBookmarked, getWatched, getBookmarked} = require('./dbQueries.js');


function authenticateToken(req, res, next) {
    // Check for the 'Authorization' header (e.g., "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // No token provided (user not logged in)
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        // Success: Attach the decoded user ID to the request object
        req.userId = user.id; 
        next(); // Proceed to the final route handler
    });
}

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

app.get('/api/watched', authenticateToken, async (req, res) => {
    const userId = req.userId;
    try {
        const watchedList = await getWatched(db, userId);

        return res.status(200).json({ 
            success: true, 
            message: 'Fetched watched list successfully.',
            watched: watchedList
        });
    } catch (e) {
        console.error("Watched error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during retrieving watched ids.' });
    }
});

app.get('/api/bookmarked', authenticateToken, async (req, res) => {
    const userId = req.userId;
    try {
        const bookmarkedList = await getBookmarked(db, userId);

        return res.status(200).json({ 
            success: true, 
            message: 'Fetched bookmarked list successfully.',
            bookmarked: bookmarkedList
        });
    } catch (e) {
        console.error("Bookmarked error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during retrieving bookmarked ids.' });
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

        let SALT_ROUNDS = 10;

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        let userId = -1;
        userId = await createAccount(db, username, passwordHash); 

        if(userId == -1){
            return res.status(401).json({ success: false, message: 'Failed to create account' });
        }

        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully. Please log in.',
            // Optionally include userId for debugging/tracking
            userId: userId 
        });

    } catch (e) {
        if (e.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ success: false, message: 'Username already taken.' });
        }
        console.error("Signup error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during signup.' });
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
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            // Use generic message for failed password too
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // 1. Define the payload (the data inside the token)
        const payload = { 
            id: user.id, 
            username: user.username 
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        return res.json({ 
            success: true, 
            message: 'Login successful.',
            userId: user.id,
            username: user.username,
            token: token
        });

        // Compare the submitted password to the stored hash
        // const match = await bcrypt.compare(password, user.password_hash);

    } catch (e) {
        console.error("Login error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

//adding a watched show to the users account data
app.post('/api/watched', authenticateToken, async (req, res) => {

    const { showId } = req.body;
    const userId = req.userId;

    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {
        
        const watchedList = await toggleWatched(db, userId, showId);

        return res.status(200).json({ 
            success: true, 
            message: 'Show added to your list successfully.',
            watched: watchedList
        });

    } catch (e) {
        console.error("Insert added error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during inserted added ids.' });
    }
});

//adding a bookmarked show to the users account data
app.post('/api/bookmarked', authenticateToken, async (req, res) => {

    const { showId } = req.body;
    const userId = req.userId;

    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {
        
        const bookmarkedList = await toggleBookmarked(db, userId, showId);

        return res.status(200).json({ 
            success: true, 
            message: 'Show added to your list successfully.',
            bookmarked: bookmarkedList
        });

    } catch (e) {
        console.error("Insert added error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during inserted added ids.' });
    }
});


//getting watched show ids
app.get('/api/added', authenticateToken, async (req, res) => {

    const userId = req.userId;
    try {
        const user = await findUserById(db, userId);
        const rawJSON = user.added || '[]';

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        const addedIds = JSON.parse(rawJSON);

        return res.json({
            success: true,
            added: addedIds 
        });

    } catch (e) {
        console.error("Added error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during fetching added ids.' });
    }
});

// //adding a bookmarked show to the users account data
// app.post('/api/bookmarked'), async (req, res) => {

// }

//adding a added show to the users account data
app.post('/api/added', authenticateToken, async (req, res) => {

    const { showId } = req.body;
    const userId = req.userId;

    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {

        const titleId = await getShowByTitle(db, showId);

        if(titleId === undefined || titleId === null){
            return res.status(404).json({ success: false, message: 'Show not found in DB.' });
        }
        
        const addedList = await insertAdded(db, userId, titleId.tmdb_id);

        return res.status(200).json({ 
            success: true, 
            message: 'Show added to your list successfully.',
            added: addedList
        });

    } catch (e) {
        console.error("Insert added error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during inserted added ids.' });
    }
});

app.delete('/api/added', authenticateToken, async (req, res) => {

    const userId = req.userId;
    try {
        const user = await findUserById(db, userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        await clearAdded(db, userId);

        return res.json({
            success: true,
            added: [] 
        });

    } catch (e) {
        console.error("Deleting Added error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during deleted added ids.' });
    }

});

// //adding a recommended show to the users account data
// app.post('/api/recommended'), async (req, res) => {

// }

async function startServer() {
    // Initialize db
    db = await initializeDatabase(); 
    
    // Start listening after the db is ready
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} with DB ready!`));
}

startServer();