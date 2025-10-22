async function getAllShows(db) {

    return db.all('SELECT * FROM shows'); 
}

async function findUserByUsername(db, username) {
    // This query fetches the user record based on the provided username
    return db.get('SELECT id, username, password, watched, bookmarked, added, recommended FROM users WHERE username = ?', username);
}

async function createAccount(db, username, password){

    const sql = `
        INSERT INTO users 
        (username, password, watched, bookmarked, added, recommended) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(sql, 
        username,
        password,
        '[]',
        '[]',
        '[]',
        '[]'
    );

    return result.lastID;
}

async function findUserById(db, userId){
    // This query fetches the user record based on the provided id
    return db.get('SELECT id, username, password, watched, bookmarked, added, recommended FROM users WHERE id = ?', userId);
}

async function insertWatched(db, userId, showId){
    // Fetch only the necessary column
    const userRecord = await db.get(`SELECT watched FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const sql = `
        INSERT INTO users 
        (username, password, watched, bookmarked, added, recommended) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
}

module.exports = { getAllShows, findUserByUsername, createAccount, findUserById, insertWatched };