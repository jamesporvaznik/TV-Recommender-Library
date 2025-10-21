import React from 'react';
import ShowCard from './ShowCard'; 

// Filtering logic
const filterShows = (shows, filters) => { 
    // Filtering logic 
    return shows.filter(show => {
        if (!filters) return true;
        const { q, genre, minRating, minReviews } = filters;
        if (q && !show.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (genre && show.genres !== genre) return false;
        // const targetType = type === 'TV' ? 'TV Series' : type;
        // if (targetType && show.type !== targetType) return false;
        if (minRating && show.rating_avg < minRating) return false;
        if (minReviews && show.vote_count < minReviews) return false;
        // if (isAiring && !show.is_airing) return false;
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

// Watchlist component now receives the new user tracking props
const Watchlist = ({ 
    shows, 
    filters, 
    watchedIds, 
    bookmarkedIds, 
    onToggleList, 
    onCardClick 
}) => {
    const filteredShows = filterShows(shows, filters);
    const groupedRows = groupIntoRows(filteredShows);

    // Render the component
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Watchlist ({filteredShows.length})</h2>

            {shows.length === 0 && (
                <p className="text-gray-500">Your watchlist is empty. Go to 'All Shows' to add some!</p>
            )}

            {groupedRows.slice(0, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {/* Iterate over the row chunk */}
                    {row.map((show) => (
                        <ShowCard 
                            key={show.id} 
                            show={show} 
                            watchedIds={watchedIds}
                            bookmarkedIds={bookmarkedIds}
                            onToggleList={onToggleList}
                            onCardClick={onCardClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};
//Export the component
export default Watchlist;