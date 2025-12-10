# tv-library-recommender

Description:

    TV Recommender is a web application that makes discovering and tracking shows easy. 
    The first feature is the ability to go through all the shows in the database. The shows
    are from the TMDB API, in which I moved all the shows in to a turso database. I have a
    search, filter and sort functionality that allows navigating to shows easily. Another
    feature is the ability to mark watched in which you can rate and keep track of the shows
    you've watched. Next, is the bookmark feature which is much the same as marking watched
    without ratings. Both watched and bookmarked shows have their own page where you can view
    only those shows. Now, the main functionality is recommendations based off a list of shows 
    you create, your list of watched shows, or a search. The way the recommendations work is I 
    store the shows in pinecone, a vector database. Then when a user attempts to get recommendations
    with a list of shows, it iterates through each shows description in the list and uses pinecone to 
    semantically search for similar shows in the entire database. If multiple shows in your list have
    the same show, they get summed together. Also if it's based off of your watched shows, it weights
    the semantic score based on your rating and initialized the rating to 5 if empty. After completion
    it puts all of the shows that got any score in a list that the user can view. For recommendations
    from search, it just compares your search to the descriptions of the shows in the database.
    That is basically the web app, I didn't mention but I have a landing page and auth functionality.

Technologies:

    Frontend: React, vite, tailwind.
    Backend: Node, express, turso, pinecone
    Hosting: Vercel (frontend), Render (backend), Cron Job (Prevents cold starts)
    Packages / Dependencies: Can all be found in the package.json files in both the frontend and backend folder.

Instructions to run locally:

    Public website if you don't want to run locally: https://tv-recommender-library-opb9.vercel.app/

    Clone repository locally

    cd frontend
    npm install
    cd ../backend
    npm install

    Environment Variables:
        Pinecone: PINECONE_API_KEY, PINECONE_ENVIRONMENT
        Turso: TURSO_KEY, TURSO_PATH
        JWT: JWT_SECRET
        TMDB: Shouldn't need unless you want to upload shows to database.

Public website: https://tv-recommender-library-opb9.vercel.app/
    




