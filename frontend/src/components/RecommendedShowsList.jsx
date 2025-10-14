import React from 'react';
import ShowCard from './ShowCard'; 


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
    onToggleList,
    onCardClick 
}) => {
    const groupedRows = groupIntoRows(shows);

    // Render the component
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Recommended Shows ({shows.length})</h2>

            {shows.length === 0 && (
                <p className="text-gray-500">You haven't added any shows to the list.</p>
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
                            onCardClick={onCardClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

//Export the component
export default RecommendedShowsList;