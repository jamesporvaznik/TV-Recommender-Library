const axios = require('axios');
require('dotenv').config({ path: './.env' }); 

// TMDB API
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch by page
const TARGET_PAGE = 1;


// Fetching function
async function fetchAndPrintShowPage() {
    try {
        if (!TMDB_API_KEY) {
            throw new Error("TMDB_API_KEY is missing. Check your .env file.");
        }

        // Retreive by page
        const url = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${TARGET_PAGE}`;
        const response = await axios.get(url);
        const data = response.data;
        
        // Printing
        console.log("\nSuccessfully Retrieved Show Page:");
        console.log(`\nShowing Results from Page ${data.page} (${data.results.length} items):`);
        
        // Loop through the page and display the shows
        data.results.forEach((show, index) => {
            console.log(`\nTitle: ${show.name}`);
            console.log(`Plot: "${show.overview}"`);
            console.log(`Rating: ${show.vote_average}`);
        });
    
    // Failure to retreive results
    } catch (error) {
        console.error("\n Fetch Failed");
        if (error.response) {
            console.error(`Status Code: ${error.response.status}`);
            console.error(`TMDB Message: ${error.response.data.status_message || error.message}`);
        } else {
            console.error(`Network Error: ${error.message}`);
        }
    }
}

fetchAndPrintShowPage();