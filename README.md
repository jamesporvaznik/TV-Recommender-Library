# tv-library-recommender

Public website: https://tv-recommender-library-opb9.vercel.app/

Project Overview:

    TV Recommender is a full-stack platform for discovering and tracking shows, featuring
    a semantic recommendation engine powered by vector search to provide highly personalized 
    suggestions.

Key Features:

    1. Turso database with shows, users and user ratings
    2. Explore and search through shows in my database
    3. Sorting and filtering to find shows quicker
    4. Mark shows as watched and rate them
    5. Mark shows as bookmarked to keep track of shows you want to watch next
    6. Recommendations
        a. By List - Create a list of shows and get recommendations based off them
        b. By Watched - Use your list of watched shows to get recommendations based off them with ratings to weigh them
        c. By Search - Make a query and get recommendations based off of it
    7. Auth functionality - Signup, Login & Logout functionality

Deep Dive on Recommendations:

    Stores shows in pinecone, a vector database. Pinecone not only gives the ability
    to store the shows, but to get semantic similarity through the vector embeddings. Therefore
    I use the show descriptions to find semantic similarities of shows. Since the user
    has a list of shows it compares each show in the list to all shows in the database, then
    sums up the scores to get the most relevant recommendations. For the watched list, specifically
    it uses users ratings to weigh the score. If you haven't rated a show, it defaults to 5.
    Recommendation by Search works much the same except it compares your search query to 
    the show descriptions.

Technologies:

    Frontend: React, vite, tailwind.
    Backend: Node, express, turso(db), pinecone(vector db)
    Packages / Dependencies: Can all be found in the package.json files in both the frontend and backend folder.

Deployment / Infrastructure:

    Vercel: Host the frontend of my web app through vercel
    Render: Host the backend of my web app through render
    Cron Job: Prevents cold starts

Instructions to run locally:

    1. Clone the Repository
        a. Press green "Code" button in the github repository
        b. Copy the HTTPS repository url
        c. Navigate to the directory you wish to put the repository in using cd
        d. git clone [URL_YOU_COPIED]
    
    2. Install packages / dependencies
        a. Navigate to the TV-Recommender-Library directory
        b. cd frontend
        c. npm install
        d. cd ../backend
        e. npm install

    3. Change configuration to run locally instead of globally
        a. App.jsx - comment line 57, uncomment line 58
        b. vite.config.js - comment line 11, uncomment line 10
        c. server.js - uncomment line 6
    
    4. Create environment variables
        a. Create .env in backend folder
        b. Go to pinecone and get your api key and environment.
        c. Go to turso and get your api key and database url
        d. Go to TMDB and get your api key and read access token
        e. Make a JWT_SECRET which is a just a random string that noone can guess

        Names for Environment Variables:
            Pinecone: PINECONE_API_KEY, PINECONE_ENVIRONMENT
            Turso: TURSO_KEY, TURSO_PATH
            JWT: JWT_SECRET
            TMDB: TMDB_READ_ACCESS_TOKEN, TMDB_API_KEY
        
    5. Import data and create databases
        a. Use scripts to 
        b. Use upload_tmdb.js to upload shows to pinecone

    6. Start the frontend and backend
        Start 
        In terminal 1:
            a. Start from TV-Recommender-Library directory
            b. cd frontend
            c. npm install
            d. npm run dev

        In terminal 2:
            a. a. Start from TV-Recommender-Library directory
            b. cd backend
            c. npm install
            d. node server

Public website: https://tv-recommender-library-opb9.vercel.app/