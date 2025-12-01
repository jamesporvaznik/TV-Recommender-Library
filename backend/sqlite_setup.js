const axios = require('axios');
const { createClient } = require('@libsql/client'); // --- CHANGE 1: Use Turso/libSQL Client
require('dotenv').config({ path: './.env' }); 

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// --- TURSO CREDENTIALS ---
const TURSO_DATABASE_URL = process.env.TURSO_PATH;
const TURSO_AUTH_TOKEN = process.env.TURSO_KEY;
// -------------------------

const TV_GENRE_MAP = {
    // ... (Genre map remains the same)
    10759: "Action & Adventure",
    16:    "Animation",
    35:    "Comedy",
    80:    "Crime",
    99:    "Documentary",
    18:    "Drama",
    10751: "Family",
    10762: "Kids",
    9648:  "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37:    "Western"
};

// Converts tmdbs numberical ids for genres to the actual genre
const getFormattedGenres = (idArray) => {
    if (!idArray || idArray.length === 0) return [];
    return idArray.map(id => TV_GENRE_MAP[id] || 'Unknown');
};


// Opens the Turso database connection and ensures the schema.
async function getDbConnection() {
    if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
        throw new Error("Turso URL or Auth Token is missing. Check .env.");
    }
    
    // --- CHANGE 2: Connect via @libsql/client ---
    const db = createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
    });

    // Use db.execute() for schema setup
    await db.execute(`
        CREATE TABLE IF NOT EXISTS shows (
            tmdb_id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            overview TEXT,
            genres TEXT,
            rating_avg REAL,
            vote_count INTEGER,
            release_date TEXT,
            poster_path TEXT,
            backdrop_path TEXT
        );
    `);
    
    // NOTE: ALTER TABLE logic is commented out/removed.
    // Ensure the above CREATE TABLE statement already includes all necessary columns.

    return db;
}


// --- CHANGE 3: Function now returns a statement object for batch processing ---
// Inserts a single, pre-formatted record into the Turso batch array.
function prepareInsertStatement(record) {
    const sql = `
        INSERT OR REPLACE INTO shows 
        (tmdb_id, title, overview, genres, rating_avg, vote_count, release_date, poster_path, backdrop_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const args = [
        parseInt(record.id, 10),
        record.title,
        record.overview,
        record.genres.join(', '),
        record.rating,
        record.count,
        record.release,
        record.poster,
        record.backdrop
    ];

    return { sql, args };
}


// TMDB Fetch (Unchanged)
async function fetchShows(page) {
    try {
        const url = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`TMDB Fetch Failed on Page ${page}: ${error.message}`);
        return null; 
    }
}


// Main loop for inserting all of tmdb shows
(async () => {

    let db;
    let totalUpserted = 0;
    const batchSize = 100; // Optimal batch size for Turso/remote DB
    let batchStatements = []; // --- CHANGE 4A: Array to hold batch statements
    
    try {
        if (!TMDB_API_KEY) {
            throw new Error("API Key is missing. Cannot fetch data.");
        }
        
        // 1. Initialize DB Connection
        db = await getDbConnection();
        console.log("Database connection established and schema is ready.");
        
        let currentPage = 1;
        const MAX_PAGES = 501;
        
        // Loop through the pages
        for(let i = 0; i < MAX_PAGES; ++i) {
            
            const newData = await fetchShows(currentPage);

            if (!newData || !newData.results || newData.results.length === 0) {
                console.log(`Finished ingestion after page ${currentPage - 1}.`);
                break;
            }

            let pageRecordCount = 0;
            
            // Insert records into the batch
            for (const show of newData.results) {
                
                if (!show.overview || show.overview.length < 10) {
                    continue; 
                }
                
                // A. Data Transformation (Cleaning & Formatting)
                const genresArray = getFormattedGenres(show.genre_ids);
                
                const cleanRecord = {
                    id: show.id.toString(),
                    title: show.name || 'N/A',
                    overview: show.overview,
                    genres: genresArray,
                    rating: show.vote_average || 0.0,
                    count: show.vote_count || 0,
                    release: show.first_air_date || 'Unknown',
                    poster: show.poster_path || null,
                    backdrop: show.backdrop_path || null 
                };
                
                // B. Prepare statement and add to batch
                const statement = prepareInsertStatement(cleanRecord);
                batchStatements.push(statement);
                
                pageRecordCount++;
                totalUpserted++;

                // --- CHANGE 4B: Execute batch when size limit is reached ---
                if (batchStatements.length >= batchSize) {
                    console.log(`Executing batch of ${batchStatements.length} statements...`);
                    await db.batch(batchStatements);
                    batchStatements = []; // Clear the batch
                }
            }

            console.log(`Page ${currentPage} processed.`);
            currentPage++;
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit TMDB requests
        }

        // 5. Insert any remaining items after the loop finishes
        if (batchStatements.length > 0) {
            console.log(`Executing final batch of ${batchStatements.length} statements...`);
            await db.batch(batchStatements);
        }

    } catch (e) {
        console.error("\nError:");
        console.error(e.message);
    } finally {
        // --- CHANGE 6: No need to explicitly close the Turso client ---
        // The Turso/libSQL client manages connections through HTTP/WebSockets and does not require explicit closing
        console.log(`\n`);
        console.log(`Finished. Total Records Indexed: ${totalUpserted}`);
    }
})();