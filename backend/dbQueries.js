async function getAllShows(db) {

    return db.all('SELECT * FROM shows'); 
}

module.exports = { getAllShows };