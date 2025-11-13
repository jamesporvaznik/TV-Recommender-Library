import React from 'react';
import RecommendationCard from './RecommendationCard';


// Function to group shows into rows of 5
const groupIntoRows = (shows, chunkSize = 5) => {
    const groupedRows = [];
    for (let i = 0; i < shows.length; i += chunkSize) {
        groupedRows.push(shows.slice(i, i + chunkSize));
    }
    return groupedRows;
};

// AddedShowsList component now receives the new user tracking props
const AddedShowsList = ({ 
    shows, 
    watchedIds, 
    bookmarkedIds, 
    addedIds,
    onToggleList,
    onCardClick,
    onHide,
    onClear 
}) => {
    const groupedRows = groupIntoRows(shows);

    const hideAddedListView = () => {
        if (typeof onHide === 'function'){
            onHide();
        }
        else console.log('Hiding added shows list');
    };

    const clearAddList = () => {
        if (typeof onClear === 'function'){
            onClear();
        }
        else console.log('Cleared added shows list');
    };

    // Render the component
    return (
        <div className="container mx-auto px-4">

            <div className="flex justify-between w-full">
                <button onClick={hideAddedListView} className="px-5 py-1 text-sm border rounded bg-gray-200 font-semibold shadow-sm hover:bg-gray-300">Go Back</button>
                <button onClick={clearAddList} className="px-5 py-1 text-sm border rounded bg-red-800 font-semibold shadow-sm hover:bg-red-900">Clear List</button>
            </div>

            <h2 className="text-2xl font-bold mt-4 mb-6">Added Shows ({shows.length})</h2>

            {shows.length === 0 && (
                <p className="text-gray-500">You haven't added any shows to the list.</p>
            )}

            {groupedRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {/* Iterate over the row chunk */}
                    {row.map((show) => (
                        <RecommendationCard
                            show={show} 
                            watchedIds={watchedIds}
                            bookmarkedIds={bookmarkedIds}
                            addedIds={addedIds}
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
export default AddedShowsList;