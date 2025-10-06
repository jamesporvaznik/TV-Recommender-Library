import React, { useMemo, useState } from 'react';


const ShowCard = ({ show, watchedIds, bookmarkedIds, onToggleList }) => {
    // Check the current status of the show for the current user
    const isWatched = watchedIds.includes(show.id);
    const isBookmarked = bookmarkedIds.includes(show.id);

    // Handler for the Bookmark/Watchlist button
    const handleToggleBookmark = () => {
        onToggleList(show.id, 'bookmarked');
    };

    // Handler for the Watched button
    const handleToggleWatched = () => {
        onToggleList(show.id, 'watched');
    };

    return (
        <article key={show.id} className="border rounded overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
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
                    {show.type}: {show.rating}
                </div>

                {/* Tracking Buttons */}
                <div className="mt-3 flex justify-between gap-2">
                    {/* Bookmark Button */}
                    <button 
                        onClick={handleToggleBookmark} 
                        className={`text-xs px-2 py-1 rounded transition w-1/2 ${isBookmarked 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {isBookmarked ? 'Bookmarked' : 'Watch Later'}
                    </button>
                    
                    {/* Watched Button */}
                    <button 
                        onClick={handleToggleWatched} 
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