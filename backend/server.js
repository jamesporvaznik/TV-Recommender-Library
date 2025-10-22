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

const { getAllShows, findUserByUsername, createAccount, findUserById, insertWatched } = require('./dbQueries.js');


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
        let userId = -1;
        userId = await createAccount(db, username, password); 

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
        if(user.password != password){
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

// //getting watched show ids
// app.get('/api/watched', async (req, res) => {
//     const userId = req.userId;
//     try {
//         const user = await findUserById(db, userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found in DB.' });
//         }

//         const watchedIds = JSON.parse(user.watched_ids || '[]');

//         return res.json({
//             success: true,
//             watchedIds: watchedIds
//         });

//     } catch (e) {
//         console.error("Watched error:", e.message);
//         res.status(500).json({ success: false, message: 'Server error during fetching watched ids.' });
//     }
// });

// //adding a watched show to the users account data
// app.post('/api/watched'), async (req, res) => {
//     const { userId, showId } = req.body;
//     try {
//         await insertWatched(db, userId, showId); 

//     } catch (e) {
//         console.error("Insert error:", e.message);
//         res.status(500).json({ success: false, message: 'Server error during inserting watched id.' });
//     } 
// }

//getting watched show ids
app.get('/api/added', authenticateToken, async (req, res) => {

    const userId = req.userId;
    try {
        const user = await findUserById(db, userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in DB.' });
        }

        const addedIds = JSON.parse(user.added || '[]');

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

// //adding a added show to the users account data
// app.post('/api/added'), async (req, res) => {

// }

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