import React, { useMemo, useState } from 'react';


const ShowCard = ({ show, watchedIds, bookmarkedIds, onToggleList, onCardClick }) => {
    // Check the current status of the show for the current user
    const isWatched = watchedIds.includes(show.tmdb_id);
    const isBookmarked = bookmarkedIds.includes(show.tmdb_id);

    // Handler for the Bookmark/Watchlist button
    const handleToggleBookmark = () => {
        onToggleList(show.tmdb_id, 'bookmarked');
    };

    // Handler for the Watched button
    const handleToggleWatched = () => {
        onToggleList(show.tmdb_id, 'watched');
    };

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
                <div className="mt-3 flex justify-between gap-2">
                    {/* Bookmark Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); //  Stops modal pop up when pressing buttons
                            handleToggleBookmark();
                        }} 
                        className={`text-xs px-2 py-1 rounded transition w-1/2 ${isBookmarked 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {isBookmarked ? 'Bookmarked' : 'Watch Later'}
                    </button>
                    
                    {/* Watched Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWatched(); 
                        }} 
                        className={`text-xs px-2 py-1 rounded transition w-1/2 ${isWatched 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {isWatched ? 'Watched' : 'Mark Watched'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ShowCard;