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

// async function textSearchAgainstShow(queryText, topK = 1, filterId) {
//   try {

//     let filter = {};
//     if (filterId) {
//         // Use the Pinecone filter syntax for equality: { fieldName: { $eq: value } }
//         filter = { 
//             tmdb_id: { '$eq': filterId } 
//         };
//     }

//     const results = await index.searchRecords({
//       query: {
//         topK: topK,
//         inputs: {text: queryText},
//         filter: filter
//         },
//     });

//     return results.result.hits;
//     } catch (error) {
//         console.error('Error during Pinecone search:', error);
//         throw error; 
//     } 
// }


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

// adds or removes a added show from the users list
async function toggleAdded(db, userId, showId){
    // Fetch only the bookmarked list from the user
    const userRecord = await db.get(`SELECT added FROM users WHERE id = ?`, userId);

    if (!userRecord) {
        throw new Error("User not found.");
    }

    const currentJSON = userRecord.added || '[]';

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
    await db.run(`UPDATE users SET added = ? WHERE id = ?`, newListString, userId);
    
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
async function getRecommendations(db, userId, addedIds, watchedIds, isWatched = false, ratingsMap){

    let showRecord;
    let excludedIdsSet

    // Recommend based on the watched list
    if (isWatched) {

        if (!watchedIds || watchedIds.length === 0) {
            throw new Error("No added IDs provided for recommendation.");
        }

        // create a set of excluded ids (watched list) so you wont get that show as a recommendation
        excludedIdsSet = new Set([
            ...watchedIds.map(String)
        ]);

        let myMap = new Map();

        // Iterate through each watched show
        for(let i = 0; i < watchedIds.length; i++){
            
            // Get the overview of the current show
            showRecord = await db.get(`SELECT overview FROM shows WHERE tmdb_id = ?`, watchedIds[i]);

            if (!showRecord) {
                throw new Error("Show not found.");
            }

            const ratingScore = ratingsMap.get(String(watchedIds[i])) || 0;

            //console.log(`Show ID: ${watchedIds[i]}, Rating Score: ${ratingScore}`);

            //get the 50 most similar shows to the selected show
            const recommendedIds = await textSearch(showRecord.overview, 50);

            recommendedIds.forEach(hit => {
                // Get the current accumulated score for this recommended ID, or 0 if it's new
                const currentScore = myMap.get(hit._id) || 0;

                // console.log(`Recommended ID: ${hit._id}, Current Score: ${currentScore}, Hit Score: ${hit._score}`);

                // Add the new score to the current total
                myMap.set(hit._id, currentScore + (ratingScore * hit._score));
                //myMap.set(hit._id, currentScore + hit._score);
            });
        }

        // Sort the recommendations by their accumulated scores and convert to an array
        const combinedRecommendations = Array.from(myMap.entries())
            .map(([id, score]) => ({ id, score }))
            .sort((a, b) => b.score - a.score);

        //put those shows into a list excluding any shows already in the watched list
        const recommendations = combinedRecommendations.filter(item => !excludedIdsSet.has(item.id)).map(item => parseInt(item.id, 10));
        const newListString = JSON.stringify(recommendations); 

        // update the database
        await db.run(`UPDATE users SET recommended = ? WHERE id = ?`, newListString, userId);

        return recommendations;  

    }
    // recommend based on the added list
    else{
         if (!addedIds || addedIds.length === 0) {
            throw new Error("No added IDs provided for recommendation.");
        }

        // create a set of excluded ids (added list) so you wont get that show as a recommendation
        excludedIdsSet = new Set([
            ...addedIds.map(String)
        ]);

        let myMap = new Map();

        // Iterate through each added show
        for(let i = 0; i < addedIds.length; i++){
            
            // Get the overview of the current show
            showRecord = await db.get(`SELECT overview FROM shows WHERE tmdb_id = ?`, addedIds[i]);

            if (!showRecord) {
                throw new Error("Show not found.");
            }

            // for(let j = 0; j < 1; j++){
            //     //watchedRecord = await db.get(`SELECT overview FROM shows WHERE tmdb_id = ?`, watchedIds[j]);
            //     const similarityResult = await textSearchAgainstShow(showRecord.overview, 1, watchedIds[j]);
            //     console.log(similarityResult);
            // }

            // const similarityResult = await textSearchAgainstShow(showRecord.overview, 1, watchedIds[i]);
            // console.log(similarityResult);

            //get the 50 most similar shows to the selected show
            const recommendedIds = await textSearch(showRecord.overview, 50);

            console.log(addedIds[i]);

            recommendedIds.forEach(hit => {
                // Get the current accumulated score for this recommended ID, or 0 if it's new
                const currentScore = myMap.get(hit._id) || 0;
                
                console.log(`Recommended ID: ${hit._id}, Current Score: ${currentScore}, Hit Score: ${hit._score}`);

                // Add the new score to the current total
                myMap.set(hit._id, currentScore + hit._score);
            });
        }

        // Sort the recommendations by their accumulated scores and convert to an array
        const combinedRecommendations = Array.from(myMap.entries())
            .map(([id, score]) => ({ id, score }))
            .sort((a, b) => b.score - a.score);
    
        //console.log(combinedRecommendations.slice(0, 10)); // Print just the top 10 for a cleaner look

        //put those shows into a list excluding any shows already in the added list
        const recommendations = combinedRecommendations.filter(item => !excludedIdsSet.has(item.id)).map(item => parseInt(item.id, 10));
        const newListString = JSON.stringify(recommendations); 

        //console.log(recommendations.slice(0, 10));

        // update the database
        await db.run(`UPDATE users SET recommended = ? WHERE id = ?`, newListString, userId);

        return recommendations; 
    }
}

async function getRecommendationsBySearch(db, userId, query){

    //get the 50 most similar shows to the search query
    const recommendedIds = await textSearch(query, 50);

    //put those shows into a list excluding any shows already in the added list
    const recommendations = recommendedIds.map(hit => parseInt(hit._id, 10));

    const newListString = JSON.stringify(recommendations); 

    // update the database
    await db.run(`UPDATE users SET recommended = ? WHERE id = ?`, newListString, userId);

    return recommendations;
}

// clears the recommendation list
async function clearRecommendations(db, userId){

    const emptyListJSON = '[]';

    // update the database to clear recommendations
    await db.run(`UPDATE users SET recommended = ? WHERE id = ?`, emptyListJSON, userId);
}

// sets a rating for a show by a user
async function setRating(db, userId, showId, rating){

    const sql = `
        INSERT INTO user_ratings 
        (user_id, tmdb_id, rating) 
        VALUES (?, ?, ?)


        ON CONFLICT(user_id, tmdb_id) 
        DO UPDATE SET 
        rating = excluded.rating
    `;

    await db.run(sql, userId, showId, rating);

}

// Gets all the ratings for a specific user
async function getRating(db, userId){

    const ratingRecords = await db.all('SELECT tmdb_id, rating FROM user_ratings WHERE user_id = ?', userId);

    const ratingsMap = new Map();

    // Iterate over the array and populate the Map
    ratingRecords.forEach(record => {
        ratingsMap.set(String(record.tmdb_id), record.rating);
    });

    return ratingsMap;

}


module.exports = { getAllShows, findUserByUsername, createAccount, findUserById, getShowByTitle, clearAdded, toggleWatched, toggleBookmarked, toggleAdded, getWatched, getBookmarked, getRecommendations, getRecommendationsBySearch, clearRecommendations, setRating, getRating };