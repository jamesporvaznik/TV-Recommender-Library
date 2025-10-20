const axios = require('axios');
require('dotenv').config({ path: './.env' }); 

// Use require for the Pinecone client
const { Pinecone } = require('@pinecone-database/pinecone');

// TMDB API
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


const TV_GENRE_MAP = {
    // ID: Name
    10759: "Action & Adventure",
    16:    "Animation",
    35:    "Comedy",
    80:    "Crime",
    99:    "Documentary",
    18:    "Drama",
    10751: "Family",
    10762: "Kids",
    9648:  "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37:    "Western"
};

const getFormattedGenres = (idArray) => {
    // Safety check for null or empty input
    if (!idArray || idArray.length === 0) {
        return [];
    }

    // Use .map() to iterate over the IDs and return a new array containing the names.
    const genreNamesArray = idArray.map(id => TV_GENRE_MAP[id] || 'Unknown');
    
    return genreNamesArray;
};


// Fetching function
async function fetchShows(page) {
    try {
        if (!TMDB_API_KEY) {
            throw new Error("TMDB_API_KEY is missing. Check your .env file.");
        }
        
        // Retreive by page
        const url = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
        const response = await axios.get(url);
        const data = response.data;

        return data;
    
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



(async () => {

    const indexName = 'show-js';
    const NAMESPACE_NAME = "example-namespace"; 
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

    try {
        
        const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

        let indexExists = false;

        try {
            const indexList = await pc.listIndexes();
            indexExists = indexList.names.includes(indexName);
        } catch (e) {
            console.warn(`[WARN] Failed to list indexes. Proceeding to create index.`);
            indexExists = false;
        }

        // Create index
        if (!indexExists) {
            console.log(`Index ${indexName} not found. Creating index...`);
     
            await pc.createIndexForModel({
                name: indexName,
                cloud: 'aws', 
                region: 'us-east-1', 
                embed: {
                    model: 'llama-text-embed-v2',
                    fieldMap: { text: 'overview' },
                },
                waitUntilReady: true,
            });
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        // Upsert Data
        const index = pc.index(indexName);
        const namespace = index.namespace(NAMESPACE_NAME);


         let showResults = []; 

        for(let i = 1; i < 501; i++){

            const newData = await fetchShows(i);

            newData.results.forEach((show) => {

                if (!show.overview || show.overview.length < 10) {
                    // You might want to log this skip to know how many records were ignored
                    console.warn(`[SKIP] Skipping show ID ${show.id}: Missing or empty overview text.`);
                    return; // Jumps to the next show in the forEach loop
                }
                
                const genresArray = getFormattedGenres(show.genre_ids);
                
                const cleanRecord = {
                    id: show.id.toString(),
                    title: show.name,
                    overview: show.overview,
                    genres: genresArray,
                    rating: show.vote_average,
                    count: show.vote_count,
                    release: show.first_air_date
                };
                
                showResults.push(cleanRecord); 
            });

            if(i % 3 == 0){
                // for(const item of showResults){ 
                //     // console.log("\n");
                    
                //     // Print the details, referencing the current item from the array ('item')
                //     // console.log(JSON.stringify(item, null, 0)); 
                //     //console.log(`Title: ${item.name}`); // Access properties of 'item'
                // }
                await namespace.upsertRecords(showResults);
                showResults = [];
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Verify Success
        console.log("EXECUTION SUCCESSFUL");

    } catch (e) {
        console.error("\nEXECUTION FAILED");
        console.error(`Error Details: ${e.message}`);
    }

})();