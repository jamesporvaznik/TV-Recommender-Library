// Brainplanning on how to use  watched and bookmark logic

// have buttons for watched and bookmark for each movie/show
// on click it adds to the json file
// It will also need to change the state of the button to show that it has been added

// Another thing to remember is when i add users it will need to be added to a specific usrs watched or bookmark list
// This means that the json file or in a db will need to be structured differently
// Maybe have a users array and each user has a watched and bookmark array
// Then when a user logs in it will load their specific watched and bookmark list

import React from 'react';

// Recieve list of shows and filters
function AllShows({ allShows, filters }) {

    // Filtering logic
    const filteredShows = allShows.filter(show => {
        // If filters object is null/empty, show everything
        if (!filters) return true;

        const { q, genre, type, minRating, isAiring } = filters;
        
        // Apply each filter conditionally
        if (q && !show.title.toLowerCase().includes(q.toLowerCase())) return false;

        if (genre && show.genre !== genre) return false;

        const targetType = type === 'TV' ? 'TV Series' : type;
        if (targetType && show.type !== targetType) return false;

        if (minRating && show.rating < minRating) return false;

        if (isAiring && !show.is_airing) return false;
        
        return true; 
    });


    // Place the shows in rows of 5
    const chunkSize = 5;
    const groupedRows = [];
    
    // Use the result of the filter: 'filteredShows'
    for (let i = 0; i < filteredShows.length; i += chunkSize) {
        const chunk = filteredShows.slice(i, i + chunkSize);
        groupedRows.push(chunk);
    }
    
    // Rendering logic
    return (
        <div className="all-shows-grid-container mt-10">
            {/* Display message if filtered list is empty */}
            {filteredShows.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No shows match your current search and filters.
                </div>
            )}

            {/* Render max 3 rows of the grouped data */}
            {groupedRows.slice(0, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-8" >
                    {row.map((show) => (
                        <article key={show.id} className="border rounded overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
                            <div className="h-40 bg-gray-200 flex items-center justify-center">
                                <img 
                                    src={`https://placehold.co/200x280/1f2937/ffffff?text=${encodeURIComponent(show.title)}`} 
                                    alt={show.title} 
                                    className="object-cover h-full w-full" 
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-semibold truncate">{show.title}</h3>
                                <div className="text-xs text-gray-500">
                                    {show.type}: {show.rating}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default AllShows;