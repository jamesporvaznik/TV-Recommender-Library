const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
require('dotenv').config({ path: './.env' }); 

// Opens the database connection and creates the shows table schema.
async function getDbConnection() {
    const db = await sqlite.open({
        filename: './shows_data.db', 
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            watched TEXT,
            bookmarked TEXT,
            added TEXT,
            recommended TEXT
        );
    `);
    
    return db;
}

// Inserts a single, pre-formatted record into the SQLite database.
async function insertShowRecord(db, record) {
    const sql = `
        INSERT OR REPLACE INTO shows 
        (id, username, password, watched, bookmarked, added, recommended) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.run(sql, 
        parseInt(record.id, 10),
        record.username,
        record.password,
        record.watched,
        record.bookmarked,
        record.added,
        record.recommendations
    );
}

(async () => {

    let db;
    
    try {
        // Create the file and table
        db = await getDbConnection(); 

    } catch (error) {
        console.error("Failed to initialize database:", error);
    } finally {
        // Close connection
        if (db) {
            await db.close();
            console.log("Database connection closed.");
        }
    }
})();