import { useState, useEffect } from 'react';
import React from 'react';
import ShowCard from './ShowCard'; 

const filterShows = (allShows, filters) => {
    // Filtering logic 
    return allShows.filter(show => {
        if (!filters) return true;
        const { q, genre, minRating, minReviews } = filters;
        if (q && !show.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (genre && show.genres !== genre) return false;
        if (minRating && show.rating_avg < minRating) return false;
        if (minReviews && show.vote_count < minReviews) return false;

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

// AddedShowsList component now receives the new user tracking props
const RecommendedShowsList = ({ 
    shows, 
    watchedIds, 
    bookmarkedIds, 
    filters,
    onToggleList,
    onCardClick 
}) => {

    const filteredShows = filterShows(shows, filters);
    const groupedRows = groupIntoRows(filteredShows);

    const [visibleRows, setVisibleRows] = useState(3); 
    const ROWS_TO_LOAD = 3;


    //checks if there are more shows to load
    const hasMoreToLoad = visibleRows < groupedRows.length;

    // Function to increase the number of rows loaded
    const loadMore = () => {
        setVisibleRows(prevCount => prevCount + ROWS_TO_LOAD);
    };

    React.useEffect(() => {
        setVisibleRows(3);
    }, [filters]);

    // Render the component
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Recommended Shows ({filteredShows.length})</h2>

            {filteredShows.length === 0 && (
                <p className="text-gray-500">You haven't added any shows to the list.</p>
            )}

            {groupedRows.slice(0, visibleRows).map((row, rowIndex) => (
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
            {/* Load more shows button if there are more shows possible */}
            {hasMoreToLoad && (
                <div className="text-center mt-4">
                    <button
                        onClick={loadMore}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Load More Shows 
                    </button>
                </div>
            )}
        </div>
    );
};

//Export the component
export default RecommendedShowsList;