// Function to return all shows in the database
async function getAllShows(db) {
    return db.all('SELECT * FROM shows'); 
}

//Function to return a user record by username if it is valid
async function findUserByUsername(db, username) {
    // This query fetches the user record based on the provided username
    const user = await db.get('SELECT id, username, password, watched, bookmarked, added, recommended FROM users WHERE username = ?', username);

    if (user && user.id) {
        return user;
    }

    return null;
}

// Creates a user in the database
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

//Function to return a user record by id if it is valid
async function findUserById(db, userId){
    return db.get('SELECT id, username, password, watched, bookmarked, added, recommended FROM users WHERE id = ?', userId);
}

// Get a shows record from the database by title (May want to add functionality to search by lowercase)
async function getShowByTitle(db, addTerm){
    return db.get('SELECT tmdb_id, title, overview, genres, rating_avg, vote_count, release_date FROM shows WHERE title = ?', addTerm);
}

// insert a show into a users added list
async function insertAdded(db, userId, showId){

    // Fetch only the added list from the user
    const userRecord = await db.get(`SELECT added FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }   

    const currentJSON = userRecord.added || '[]';

    // Get the current list of added id's
    let currentList = JSON.parse(currentJSON);

    // add the show id to the list if its not currently in there
    if (!currentList.includes(showId)) {
        currentList.push(showId);
    }

    // turn the list into a string to insert into the database
    const newListString = JSON.stringify(currentList);
    
    // update the database
    await db.run(`UPDATE users SET added = ? WHERE id = ?`, newListString, userId);
    
    console.log(`Successfully added show ID ${showId} to user ${userId}'s list.`);

    return currentList;

}

// Clears the added list 
async function clearAdded(db, userId){

    const emptyListJSON = '[]';

    const userRecord = await db.get(`SELECT added FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }   

    await db.run(`UPDATE users SET added = ? WHERE id = ?`, emptyListJSON, userId);
}

// adds or removes a watched show from the users list
async function toggleWatched(db, userId, showId){
    // Fetch only the watched list from the user
    const userRecord = await db.get(`SELECT watched FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const currentJSON = userRecord.watched || '[]';

    // Get the current list of watched id's
    let currentList = JSON.parse(currentJSON);

    // add the show id to the list if its not currently in there
    if (!currentList.includes(showId)) {
        currentList.push(showId);
    }
    else{
        currentList = currentList.filter(id => id !== showId);
    }

    // turn the list into a string to insert into the database
    const newListString = JSON.stringify(currentList); 
    
    // update the database
    await db.run(`UPDATE users SET watched = ? WHERE id = ?`, newListString, userId);
    
    console.log(`Successfully added show ID ${showId} to user ${userId}'s list.`);

    return currentList;  
}

// adds or removes a bookmarked show from the users list
async function toggleBookmarked(db, userId, showId){
    // Fetch only the bookmarked list from the user
    const userRecord = await db.get(`SELECT bookmarked FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const currentJSON = userRecord.bookmarked || '[]';

    // Get the current list of bookmarked id's
    let currentList = JSON.parse(currentJSON);

    // add the show id to the list if its not currently in there
    if (!currentList.includes(showId)) {
        currentList.push(showId);
    }
    else{
        currentList = currentList.filter(id => id !== showId);
    }

    // turn the list into a string to insert into the database
    const newListString = JSON.stringify(currentList); 
    
    // update the database
    await db.run(`UPDATE users SET bookmarked = ? WHERE id = ?`, newListString, userId);
    
    console.log(`Successfully added show ID ${showId} to user ${userId}'s list.`);

    return currentList;  
}

//Gets the users list of watched shows
async function getWatched(db, userId){

    // Fetch only the necessary column
    const userRecord = await db.get(`SELECT watched FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const currentJSON = userRecord.watched || '[]';

    // Get the current list of watched id's
    let currentList = JSON.parse(currentJSON);

    return currentList;
}

//Gets the users list of bookmarked shows
async function getBookmarked(db, userId){

    // Fetch only the necessary column
    const userRecord = await db.get(`SELECT bookmarked FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const currentJSON = userRecord.bookmarked || '[]';

    // Get the current list of bookmarked id's
    let currentList = JSON.parse(currentJSON);

    return currentList;
}

module.exports = { getAllShows, findUserByUsername, createAccount, findUserById, getShowByTitle, insertAdded, clearAdded, toggleWatched, toggleBookmarked, getWatched, getBookmarked };