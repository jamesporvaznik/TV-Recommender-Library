import { useState, useEffect } from 'react';
import React from 'react';
import RecommendedCard from './RecommendedCard'; 
import Filters from './Filters'
import RefreshSearchQuery from './RefreshSearchQuery';
import { useShow } from '../context/ShowContext.jsx';
import { useUser } from '../context/UserContext.jsx';

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
const groupIntoRows = (shows, chunkSize = 4) => {
    const groupedRows = [];
    for (let i = 0; i < shows.length; i += chunkSize) {
        groupedRows.push(shows.slice(i, i + chunkSize));
    }
    return groupedRows;
};

// AddedShowsList component now receives the new user tracking props
const RecommendedShowsList = ({ 
    shows, 
    filters,
    isSearch,
    sourceIds,
    onToggleList,
    onCardClick,
    onSearch,
    onRefresh
}) => {

    const { sortedShows, sortShows } = useShow();
    const { watchedShowIds, bookmarkedShowIds } = useUser();

    let filteredShows = [];

    if(sortedShows.length === 0 || sortedShows.length != shows.length){
        filteredShows = filterShows(shows, filters);
    }
    else{
        filteredShows = filterShows(sortedShows, filters);
    }
    
    const groupedRows = groupIntoRows(filteredShows);

    const [visibleRows, setVisibleRows] = useState(3); 
    const ROWS_TO_LOAD = 3;

    function handleSearch(payload) {
        if (typeof onSearch === 'function'){
            onSearch(payload);
        }
    }

    function handleSort(mode){
        if (typeof onSort === 'function'){
            sortShows(shows, mode);
        }
    }
    function handleRefresh(){
        if (typeof onRefresh === 'function') {
            console.log('Refreshes Search Query');
            onRefresh();
        } else {
            console.log('Refresh Button doesn\'t work!');
        }
    }


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
        <div className="container mx-auto px-4 ">
            <Filters 
                onSearch={handleSearch}
                onSort={handleSort}
                length = {filteredShows.length}
            />
            {isSearch && (
                <RefreshSearchQuery 
                    onRefresh={handleRefresh}
                /> 
            )}

            {groupedRows.slice(0, visibleRows).map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8 mt-10">
                    {/* Iterate over the row chunk */}
                    {row.map((show) => (
                        <RecommendedCard 
                            key={show.id} 
                            show={show} 
                            watchedIds={watchedShowIds}
                            bookmarkedIds={bookmarkedShowIds}
                            sourceIds={sourceIds}
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

//Export the component
export default RecommendedShowsList;