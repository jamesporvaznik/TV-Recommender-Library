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

    // Calls the search function to make a search based on filters and a search query
    function handleSearch(payload) {
        if (typeof onSearch === 'function'){
            onSearch(payload);
        }
    }

    //Calls the sort function to sort the shows remaining from filters
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
                <button className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300" onClick={handleViewAdded}>
                    View Full List
                </button>
            </div>
        
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
                        className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
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