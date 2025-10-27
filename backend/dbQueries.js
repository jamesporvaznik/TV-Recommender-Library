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

async function getShowByTitle(db, addTerm){
    return db.get('SELECT tmdb_id, title, overview, genres, rating_avg, vote_count, release_date FROM shows WHERE title = ?', addTerm);
}

async function insertAdded(db, userId, showId){

    // Fetch only the necessary column
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

}

async function clearAdded(db, userId){

    const emptyListJSON = '[]';

    const userRecord = await db.get(`SELECT added FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }   

    await db.run(`UPDATE users SET added = ? WHERE id = ?`, emptyListJSON, userId);
}

// async function insertWatched(db, userId, showId){
//     // Fetch only the necessary column
//     const userRecord = await db.get(`SELECT watched FROM users WHERE id = ?`, userId);

//     if (!userRecord) {
//         throw new Error("User not found.");
//     }

//     const sql = `
//         INSERT INTO users 
//         (username, password, watched, bookmarked, added, recommended) 
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;
    
// }

module.exports = { getAllShows, findUserByUsername, createAccount, findUserById, getShowByTitle, insertAdded, clearAdded };