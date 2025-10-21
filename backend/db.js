const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function initializeDatabase() {
    const dbConnection = await sqlite.open({
        filename: './shows_data.db', // Path to your database file
        driver: sqlite3.Database
    });
    return dbConnection;
}

module.exports = initializeDatabase;