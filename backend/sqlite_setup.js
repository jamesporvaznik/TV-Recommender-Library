const axios = require('axios');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
require('dotenv').config({ path: './.env' }); 

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const TV_GENRE_MAP = {
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

// Converts tmdbs numberical ids for genres to the actual genre
const getFormattedGenres = (idArray) => {
    if (!idArray || idArray.length === 0) return [];
    return idArray.map(id => TV_GENRE_MAP[id] || 'Unknown');
};


// Opens the database connection and creates the shows table schema.
async function getDbConnection() {
    const db = await sqlite.open({
        filename: './shows_data.db', 
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS shows (
            tmdb_id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            overview TEXT,
            genres TEXT,
            rating_avg REAL,
            vote_count INTEGER,
            release_date TEXT
        );
    `);

    try {
        await db.exec(`ALTER TABLE shows ADD COLUMN poster_path TEXT`);
        console.log("Added column: poster_path");
    } catch (e) {
        // Expected error if the column already exists (ignore it)
    }

    try {
        await db.exec(`ALTER TABLE shows ADD COLUMN backdrop_path TEXT`);
        console.log("Added column: backdrop_path");
    } catch (e) {
        // Expected error if the column already exists (ignore it)
    }
    
    return db;
}


// Inserts a single, pre-formatted record into the SQLite database.
async function insertShowRecord(db, record) {
    const sql = `
        INSERT OR REPLACE INTO shows 
        (tmdb_id, title, overview, genres, rating_avg, vote_count, release_date, poster_path, backdrop_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.run(sql, 
        parseInt(record.id, 10),
        record.title,
        record.overview,
        record.genres.join(', '),
        record.rating,
        record.count,
        record.release,
        record.poster,
        record.backdrop
    );
}


// TMDB Fetch
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
    
    try {
        if (!TMDB_API_KEY) {
            throw new Error("API Key is missing. Cannot fetch data.");
        }
        
        // 1. Initialize DB Connection
        db = await getDbConnection();
        console.log("Database connection established and schema is ready.");
        
        let currentPage = 1;
        
        // Loop through the pages
        for(let i = 0; i < 501; ++i) {
            
            const newData = await fetchShows(currentPage);

            if (!newData || !newData.results || newData.results.length === 0) {
                console.log(`Finished ingestion after page ${currentPage - 1}.`);
                break;
            }

            let pageRecordCount = 0;
            
            // Insert batch
            for (const show of newData.results) {
                
                // Check for the plot, because embedding vectors are based on the plot
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
                
                // B. Insert into SQLite
                await insertShowRecord(db, cleanRecord);
                
                pageRecordCount++;
                totalUpserted++;
            }

            console.log(`Page ${currentPage} processed.`);
            currentPage++;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (e) {
        console.error("\nError:");
        console.error(e.message);
    } finally {
        // Close DB Connection
        if (db) {
            await db.close();
        }
        console.log(`\n`);
        console.log(`Finished. Total Records Indexed: ${totalUpserted}`);
    }
})();