import React from 'react';

// arguments passed to ShowDetails component
const ShowDetails = ({ 
    show, 
    onClose, 
    watchedIds, 
    bookmarkedIds, 
    onToggleList,
    onRemoveFromAdded
}) => {
    if (!show) return null; 

    // Current status of watched and bookmarked
    const isWatched = watchedIds?.includes(show.id);
    const isBookmarked = bookmarkedIds?.includes(show.id);

    // Handlers for the action buttons
    const handleToggleWatched = () => onToggleList(show.id, 'watched');
    const handleToggleBookmark = () => onToggleList(show.id, 'bookmarked');
    
    // Determine if the 'Remove' button should be shown
    const showRemoveButton = typeof onRemoveFromAdded === 'function';

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
            onClick={onClose}
        >
            {/* Pop-up Content */}
            <div 
                className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-full"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-3xl font-bold mb-2">{show.title} ({show.year_started || 'N/A'})</h2>

                {/* Show Details */}
                <div className="grid grid-cols-2 gap-4 mt-10 mb-10 text-gray-700">
                    <div className="space-y-4">
                        <p><strong>Type:</strong> {show.type}</p>
                        <p><strong>Rating:</strong> {show.rating}</p>
                        <p><strong>Genre:</strong> {show.genre || 'N/A'}</p>
                    </div>
                    <div className="space-y-4">
                        <p><strong>Streaming On:</strong> {show.streamingService || 'Not Found'}</p>
                        <p><strong>Length:</strong> {show.type === 'TV Series' ? `${show.seasons} Seasons` : `${show.runtime_minutes} minutes`}</p>
                        <p><strong>Rating:</strong> PG </p>
                    </div>
                </div>

                {/* Description */}
                <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
                <p className="text-gray-600 mb-6"> A structural engineer installs himself in a prison he helped design, in order to save his falsely accused brother from a death sentence by breaking themselves out from the inside. </p>

                {/* Buttons */}
                <div className="flex space-x-3 justify-between border-t pt-4">

                    {/* Left: Watched and Watchlist Buttons */}
                    <div className="flex space-x-3">
                        {/* Toggle Watched Button */}
                        <button 
                            onClick={handleToggleWatched} 
                            className={`px-4 py-2 text-sm rounded transition ${isWatched ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-green-100'}`}
                        >
                            {isWatched ? 'Unmark Watched' : 'Mark Watched'}
                        </button>

                        {/* Toggle Watchlist Button */}
                        <button 
                            onClick={handleToggleBookmark} 
                            className={`px-4 py-2 text-sm rounded transition ${isBookmarked ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}`}
                        >
                            {isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                    
                    {/* Right: Optional Remove and Close Buttons */}
                    <div className="flex space-x-3">
                        {/* Optional: Remove from Added List Button */}
                        {showRemoveButton && (
                            <button 
                                onClick={() => onRemoveFromAdded(show.id)} 
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Remove from Added List
                            </button>
                        )}

                        {/* Close Button */}
                        <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                            Close
                        </button>
                    </div>
                </div>
        </div></div>
    );
};

export default ShowDetails;