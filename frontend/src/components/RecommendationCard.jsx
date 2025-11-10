import React, { useMemo, useState } from 'react';


const RecommendationCard = ({ show, watchedIds, bookmarkedIds, addedIds, onToggleList, onCardClick }) => {
    // Check the current status of the show for the current user
    const isWatched = watchedIds.includes(show.tmdb_id);
    const isBookmarked = bookmarkedIds.includes(show.tmdb_id);
    const isAdded = addedIds.includes(show.tmdb_id);

    // Handler for the Bookmark/Watchlist button
    const handleToggleBookmark = () => {
        onToggleList(show.tmdb_id, 'bookmarked');
    };

    // Handler for the Watched button
    const handleToggleWatched = () => {
        onToggleList(show.tmdb_id, 'watched');
    };

    const handleToggleAdd = () => {
        onToggleList(show.tmdb_id, 'added');
    }

    return (
        // Made the entire article clickable
        <article 
            key={show.id} 
            onClick={() => onCardClick(show)} // This triggers the modal open function
            className="border rounded overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg cursor-pointer" 
        >
            {/* Image Section */}
            <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img 
                    src={`https://placehold.co/200x280/1f2937/ffffff?text=${encodeURIComponent(show.title)}`} 
                    alt={show.title} 
                    className="object-cover h-full w-full" 
                />
            </div>
            
            {/* Text Content and Buttons */}
            <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{show.title}</h3>
                <div className="text-xs text-gray-500">
                    Rating: {show.rating_avg}
                </div>

                {/* Tracking Buttons */}
                <div className="mt-3 flex justify-center">
                    {/* Added Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAdd(); 
                        }} 
                        className={`text-xs px-2 py-1 rounded transition w-1/2 ${isAdded
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {isAdded ? 'Added' : 'Add to List'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default RecommendationCard;