require('dotenv').config({ path: './.env' }); 

const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('show-js').namespace("example-namespace");; 

async function textSearch(queryText, topK = 20) {
  try {
    const results = await index.searchRecords({
      query: {
        topK: topK,
        inputs: {text: queryText},
        },
    });

    return results.result.hits;

  } catch (error) {
    console.error('Error during Pinecone search:', error);
    throw error; 
  }
}

// Example usage
// textSearch('Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and icy horrors beyond.', 10);


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
    return db.get('SELECT tmdb_id, title, overview, genres, rating_avg, vote_count, release_date FROM shows WHERE LOWER(title) = LOWER(?)', addTerm);
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

//Takes in the added shows and returns recommendations from pinecone
async function getRecommendations(db, userId, addedIds, watchedIds, isWatched = false){

    let showRecord;
    let excludedIdsSet

    // get the overview of the first show in the watched list
    if (isWatched) {
        showRecord = await db.get(`SELECT overview FROM shows WHERE tmdb_id = ?`, watchedIds[0]);
        excludedIdsSet = new Set([
            ...addedIds.map(String)
        ]);
    }
    // get the overview of the first show in the added list
    else{
         if (!addedIds || addedIds.length === 0) {
            throw new Error("No added IDs provided for recommendation.");
        }

        // create a set of excluded ids (added list) so you wont get that show as a recommendation
        excludedIdsSet = new Set([
            ...addedIds.map(String)
        ]);

        showRecord = await db.get(`SELECT overview FROM shows WHERE tmdb_id = ?`, addedIds[0]);
    }

    if (!showRecord) {
        throw new Error("Show not found.");
    }

    //get the 50 most similar shows to the selected show
    const recommendedIds = await textSearch(showRecord.overview, 50);

    //put those shows into a list excluding any shows already in the added list
    const recommendations = recommendedIds.filter(hit => !excludedIdsSet.has(hit._id)).map(hit => parseInt(hit._id, 10));

    const newListString = JSON.stringify(recommendations); 

    // update the database
    await db.run(`UPDATE users SET recommended = ? WHERE id = ?`, newListString, userId);

    return recommendations;  
}

module.exports = { getAllShows, findUserByUsername, createAccount, findUserById, getShowByTitle, insertAdded, clearAdded, toggleWatched, toggleBookmarked, getWatched, getBookmarked, getRecommendations };