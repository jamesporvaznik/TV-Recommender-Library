// const sqlite = require('sqlite');
// const sqlite3 = require('sqlite3');
const { createClient } = require('@libsql/client');

async function initializeDatabase() {
    
    // Get environment variables 
    // Assuming you updated your .env file to use the names below:
    const url = process.env.TURSO_PATH;
    const authToken = process.env.TURSO_KEY;

    if (!url || !authToken) {
        // Log a fatal error if connection details are missing
        console.error("FATAL: Turso connection details (URL or Token) are missing from environment.");
        process.exit(1); 
    }
    
    try {
        // Establish the remote connection using the libSQL client
        const dbConnection = createClient({
            url: url,
            authToken: authToken,
        });

        console.log("Successfully connected to Turso database.");
        
        return dbConnection;
    } catch (e) {
        console.error("TURSO CONNECTION ERROR:", e.message);
        process.exit(1);
    }
}

module.exports = initializeDatabase;