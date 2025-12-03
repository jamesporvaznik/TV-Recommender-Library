const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: '../.env' }); 

const jwt = require('jsonwebtoken'); 
const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRY = '1h'; 

app.use(cors());

// const corsOptions = {
//     // You can use '*' here for local development ease, or list 'http://localhost:3000', etc.
//     origin: '*', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Authorization', 'Content-Type'],
//     credentials: true
// };

app.use(cors(corsOptions));

app.use(express.json());

const initializeDatabase = require('../db.js');
let db;

const { getAllShows, findUserByUsername, createAccount, findUserById, clearAdded, toggleWatched, toggleBookmarked, toggleAdded, getWatched, getBookmarked, getRecommendations, getRecommendationsBySearch, clearRecommendations, setRating, getRating} = require('../dbQueries.js');

// checks that user is logged in
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
        next();
    });
}

// app.get('/', (req, res) => {
//     res.status(200).json({ 
//         success: true, 
//         message: 'TV Recommender API is running successfully.' 
//     });
// });

// return all shows to the frontend
app.get('/api/shows', async (req, res) => {
    try {

        // gets shows from database
        const shows = await getAllShows(db); 

        res.json({
            data: shows
        });

    } catch (e) {
        console.error("CRASH ERROR:", e.message, e.stack);
        res.status(500).json({ error: "Failed to load show data from database." });
    }
});

// get watched shows and returns them to the frontend
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

// get bookmarked shows and returns them to the frontend
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

    // basic checks
    if (!username || !password || !confirm) {
        return res.status(400).json({ success: false, message: 'Credentials are required.' });
    }

    if(password != confirm){
        return res.status(400).json({ success: false, message: 'Passwords don\' match.' });
    }
    
    try {
        let SALT_ROUNDS = 10;

        //hashing the password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        let userId = -1;
        userId = await createAccount(db, username, passwordHash); 

        if(userId == -1){
            return res.status(401).json({ success: false, message: 'Failed to create account' });
        }

        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully. Please log in.',
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

    // basic checks
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Credentials are required.' });
    }

    try {
        //finds user from the db
        const user = await findUserByUsername(db, username);

        // user not found in db
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // checks password against hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // payload
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

    } catch (e) {
        console.error("Login error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

//adding a watched show to the users account data
app.post('/api/watched', authenticateToken, async (req, res) => {

    const { showId } = req.body;
    const userId = req.userId;

    // makes sure the showId variables is defined
    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {
        // adds the show to the watched list and returns the new list
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

    // makes sure the showId variables is defined
    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {
        // adds the show to the bookmarked list and returns the new list
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

//getting added show ids
app.get('/api/added', authenticateToken, async (req, res) => {

    const userId = req.userId;

    try {
        // gets user by id
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

//adding a bookmarked show to the users account data
app.post('/api/added', authenticateToken, async (req, res) => {

    const { showId } = req.body;
    const userId = req.userId;

    // makes sure the showId variables is defined
    if (!showId) {
        return res.status(400).json({ success: false, message: 'Show title is required.' });
    }

    try {
        // adds the show to the bookmarked list and returns the new list
        const addedList = await toggleAdded(db, userId, showId);

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

// Function to clear the added show ids from the user in the db
app.delete('/api/added', authenticateToken, async (req, res) => {

    const userId = req.userId;

    try {
        //gets the user by id
        const user = await findUserById(db, userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        // clears the entire added list from the user
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

// getting recommendations based on single added show
app.post('/api/recommendations/shows', authenticateToken, async (req, res) => {
    
    const {isWatched} = req.body;
    const userId = req.userId;

    try {
        // gets user by id
        const user = await findUserById(db, userId);
        const rawAdded = user.added || '[]';
        const rawWatched = user.watched || '[]';

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        ratingsMap = await getRating(db, userId);

        const addedIds = JSON.parse(rawAdded);
        const watchedIds = JSON.parse(rawWatched);

        excludedAddedIdsSet = new Set([
            ...addedIds.map(String)
        ]);

        excludedWatchedIdsSet = new Set([
            ...watchedIds.map(String)
        ]);

        const recommendations = await getRecommendations(db, userId, addedIds, watchedIds, isWatched, ratingsMap);

        console.log(recommendations);

        if(!isWatched){
            const sortedRecommendations = Array.from(recommendations.entries())
            .map(([id, record]) => ({
                id: id,
                score: record.totalScore,
                sources: record.contributors 
            }))
            .sort((a, b) => b.score - a.score);
            const newRecommendations = sortedRecommendations.filter(item => !excludedAddedIdsSet.has(item.id)).map(item => parseInt(item.id, 10));
            const sourcesObject = Object.fromEntries(recommendations);
            return res.status(200).json({ 
                success: true, 
                message: 'recommendations added successfully.',
                recommended: newRecommendations,
                sources: sourcesObject
            });
        }
        else{
            const sortedRecommendations = Array.from(recommendations.entries())
            .map(([id, record]) => ({
                id: id,
                score: record.totalScore,
                sources: record.contributors
            }))
            .sort((a, b) => b.score - a.score);
            const newRecommendations = sortedRecommendations.filter(item => !excludedWatchedIdsSet.has(item.id)).map(item => parseInt(item.id, 10));
            const sourcesObject = Object.fromEntries(recommendations);
            return res.status(200).json({ 
                success: true, 
                message: 'recommendations added successfully.',
                recommended: newRecommendations,
                sources: sourcesObject
            });
        }

    } catch (e) {
        console.error("Recommended error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during fetching added ids.' });
    }
});

// getting recommendations based on a search query
app.post('/api/recommendations/search', authenticateToken, async (req, res) => {
    
    const {query} = req.body;
    const userId = req.userId;

    try {
        // gets user by id
        const user = await findUserById(db, userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        const recommendations = await getRecommendationsBySearch(db, userId, query);

        return res.status(200).json({ 
            success: true, 
            message: 'recommendations added successfully.',
            recommended: recommendations
        });
        

    } catch (e) {
        console.error("Recommended error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during fetching added ids.' });
    }
});

app.delete(`/api/recommendations`, authenticateToken, async (req, res) => {

    const userId = req.userId;

    try {
        // gets user by id
        const user = await findUserById(db, userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        await clearRecommendations(db, userId);

        return res.status(200).json({ 
            success: true, 
            message: 'recommendations added successfully.',
        });
        

    } catch (e) {
        console.error("Recommended error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during fetching added ids.' });
    }

});

// endpoint to get ratings for the user
app.get('/api/rating', authenticateToken, async (req, res) => {

    const userId = req.userId;  

    try {

        ratingsMap = await getRating(db, userId);

        const ratingsObject = Object.fromEntries(ratingsMap);

        return res.status(200).json({ 
            success: true, 
            message: 'ratings fetched successfully.',
            ratings: ratingsObject
        });
         
    } catch (e) {
        console.error("Rating fetch error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during fetching ratings.' });
    }
});

// endpoint to set a rating for a show
app.post('/api/rating', authenticateToken, async (req, res) => {

    const { ratingValue, showId } = req.body;
    const userId = req.userId;

    try {
        await setRating(db, userId, showId, ratingValue);

        return res.status(200).json({ 
            success: true, 
            message: 'Rating submitted successfully.'
        });

    } catch (e) {
        console.error("Rating error:", e.message);
        res.status(500).json({ success: false, message: 'Server error during submitting rating.' });
    }

});

//handles some initializations when starting the server.
async function startServer() {
    // Initialize db
    db = await initializeDatabase(); 
    
    // Start listening after the db is ready
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} with DB ready!`));
}

startServer();
// module.exports = app;

// initializeDatabase().then(initializedDb => {
//     // 2. Set the global 'db' variable for all routes to use once it's ready.
//     db = initializedDb;
//     console.log('Database initialized successfully for serverless.');
// }).catch(e => {
//     // Catch fatal errors during DB initialization
//     console.error('FATAL: Database initialization failed:', e.message);
// });

// // 3. Import the serverless wrapper
// const serverless = require('serverless-http'); 

// // 4. Export the app instance wrapped as the handler
// module.exports.handler = serverless(app);