// // Brainplanning on how to use  watched and bookmark logic

// // have buttons for watched and bookmark for each movie/show
// // on click it adds to the json file
// // It will also need to change the state of the button to show that it has been added

// // Another thing to remember is when i add users it will need to be added to a specific usrs watched or bookmark list
// // This means that the json file or in a db will need to be structured differently
// // Maybe have a users array and each user has a watched and bookmark array
// // Then when a user logs in it will load their specific watched and bookmark list

import React from 'react';
import ShowCard from './ShowCard';

const filterShows = (allShows, filters) => {
    // Filtering logic 
    return allShows.filter(show => {
        if (!filters) return true;
        const { q, genre, type, minRating, isAiring } = filters;
        if (q && !show.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (genre && show.genre !== genre) return false;
        const targetType = type === 'TV' ? 'TV Series' : type;
        if (targetType && show.type !== targetType) return false;
        if (minRating && show.rating < minRating) return false;
        if (isAiring && !show.is_airing) return false;
        return true; 
    });
};

// Function to group shows into rows of 5
const groupIntoRows = (shows, chunkSize = 5) => {
    const groupedRows = [];
    for (let i = 0; i < shows.length; i += chunkSize) {
        groupedRows.push(shows.slice(i, i + chunkSize));
    }
    return groupedRows;
};

// AllShows component now receives the new user tracking props
const AllShows = ({ 
    allShows, 
    filters,
    watchedIds,
    bookmarkedIds,
    onToggleList
}) => {
    const filteredShows = filterShows(allShows, filters);
    const groupedRows = groupIntoRows(filteredShows);

    // Render the component
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">All Shows ({filteredShows.length})</h2>

            {groupedRows.length === 0 && (
                <p className="text-gray-500">No shows match your current filters.</p>
            )}
        
            {groupedRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {/* Iterate over the row chunk */}
                    {row.map((show) => (
                        <ShowCard 
                            key={show.id} 
                            show={show} 
                            watchedIds={watchedIds}
                            bookmarkedIds={bookmarkedIds}
                            onToggleList={onToggleList}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AllShows;