import React from 'react';
import ShowCard from './ShowCard';
import { useState, useEffect } from 'react';
import RecommendationCard from './RecommendationCard';
import Filters from './Filters';

const filterShows = (shows, filters) => {
    // Filtering logic 
    return shows.filter(show => {
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

// AllShows component now receives the new user tracking props
const AddShows = ({ 
    shows, 
    sortedShows,
    filters,
    watchedIds,
    bookmarkedIds,
    addedIds,
    onToggleList,
    onCardClick,
    onSearch,
    onSort,
    onView
}) => {

    const [visibleRows, setVisibleRows] = useState(3); 
    const ROWS_TO_LOAD = 3;

    let filteredShows = [];

    if(sortedShows.length === 0 || sortedShows.length != shows.length){
        filteredShows = filterShows(shows, filters);
    }
    else{
        filteredShows = filterShows(sortedShows, filters);
    }

    const groupedRows = groupIntoRows(filteredShows);

    //checks if there are more shows to load
    const hasMoreToLoad = visibleRows < groupedRows.length;

    function handleSearch(payload) {
        if (typeof onSearch === 'function'){
            onSearch(payload);
        }
    }

    function handleSort(mode){
        if (typeof onSort === 'function'){
            onSort(shows, mode);
        }
    }

    function handleViewAdded() {
        if (typeof onView === 'function'){
            onView();
        }
        else console.log('Showing added shows list');
    }

    // Function to increase the number of rows loaded
    const loadMore = () => {
        setVisibleRows(prevCount => prevCount + ROWS_TO_LOAD);
    };

    React.useEffect(() => {
        setVisibleRows(3);
    }, [filters]);

    // Render the component
    return (
        <div className="container mx-auto px-4">

            <Filters 
                onSearch={handleSearch}
                onSort={handleSort}
                length = {filteredShows.length}
            />
            <div className="flex justify-end w-full mt-4 pr-4">
                <button className="px-3 py-2 bg-gray-100 rounded" onClick={handleViewAdded}>
                    View Full List
                </button>
            </div>

            {/* <h2 className="text-2xl font-bold mb-6">All Shows ({filteredShows.length})</h2> */}

            {/* {groupedRows.length === 0 && (
                <p className="text-gray-500">No shows match your current filters.</p>
            )} */}
        
            {groupedRows.slice(0, visibleRows).map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 mt-10">
                    {/* Iterate over the row chunk */}
                    {row.map((show) => (
                        <RecommendationCard
                            key={show.id} 
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

// Export the component
export default AddShows;