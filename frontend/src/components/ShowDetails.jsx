import { useState, useEffect } from 'react';

import ConfirmationModal from './ConfirmationModal';

// arguments passed to ShowDetails component
const ShowDetails = ({ 
    show, 
    onClose, 
    watchedIds, 
    bookmarkedIds, 
    onToggleList,
    onRemoveFromAdded,
    setRating,
    userRating,
}) => {
    if (!show) return null;

    const [ratingValue, setRatingValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Current status of watched and bookmarked
    const isWatched = watchedIds?.includes(show.tmdb_id);
    const isBookmarked = bookmarkedIds?.includes(show.tmdb_id);

    // Handlers for the action buttons
    const handleToggleWatched = () => onToggleList(show.tmdb_id, 'watched');
    const handleToggleBookmark = () => onToggleList(show.tmdb_id, 'bookmarked');

    // Determine if the 'Remove' button should be shown
    const showRemoveButton = typeof onRemoveFromAdded === 'function';

    const handleCancel = () => {
        setIsModalOpen(false); // Close the modal
        setRatingValue(''); // Clear the input
    };
    
    const handleSave = () => {
        if (typeof setRating === 'function'){
            setRating(ratingValue, show.tmdb_id);
        }
        console.log(`Submitting rating ${ratingValue} for ${show.title}`);
        setIsModalOpen(false); // Close the modal
        setRatingValue(''); // Clear the input
    };

    const handleRatingChange = (event) => {
        let value = event.target.value;
        const numValue = parseInt(value, 10);
        
        // Only allow blank, or numbers between 1 and 10
        if (value === "" || (numValue >= 1 && numValue <= 10)) {
            setRatingValue(value);
        } else if (numValue > 10) {
            setRatingValue('10');
        }
    };

    if(ratingValue.trim().length > 0 && !isModalOpen){
        setIsModalOpen(true);
    }

    // const saveButton = ratingValue.trim().length > 0;
    // const cancelButton = ratingValue.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            {/* Pop-up Content */}
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-full" onClick={(e) => e.stopPropagation()}>
                {/* Header Section */}
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">

                    <div className="flex-1" weight="bold">
                        <h1>User Rating: {userRating}</h1>
                    </div> 

                    <h2 className="text-3xl font-bold mb-2 text-center">
                        {show.title} 
                    </h2>

                    <div className="flex-1 flex justify-end">
                        {isWatched && (
                            // <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                            //     Watched
                            // </span>
                            <div className="flex items-center gap-2">
                                <label htmlFor="show-rating" className="text-sm font-medium text-gray-700">
                                    Rate (1-10):
                                </label>
                                <input
                                    id="show-rating"
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="0"
                                    // Assuming you have a state variable to hold the rating value (e.g., 'ratingValue')
                                    value={ratingValue} 
                                    // Assuming you have a function to handle changes (e.g., 'handleRatingChange')
                                    onChange={handleRatingChange} 
                                    className="w-16 p-1 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                {/* Optional: Add a button to submit the rating */}
                                {/* <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md">Save</button> */}
                            </div>
                        )}
                    </div>
                </div>

                {/* Show Details */}
                <div className="grid grid-cols-2 gap-4 mt-10 mb-10 text-gray-700">
                    <div className="space-y-4">
                        {/* <p><strong>Type:</strong> {show.type}</p> */}
                        <p><strong>Rating:</strong> {show.rating_avg} ({show.vote_count})</p>
                        <p><strong>Genre:</strong> {show.genres || 'N/A'}</p>
                    </div>
                    <div className="space-y-4">
                        {/* <p><strong>Streaming On:</strong> {show.streaming || 'Not Found'}</p> */}
                        {/* <p><strong>Length:</strong> {show.type === 'TV Series' ? `${show.seasons} Seasons` : `${show.runtime_minutes} minutes`}</p> */}
                        <p><strong>Release Date:</strong> {show.release_date} </p>
                    </div>
                </div>

                {/* Description */}
                <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
                <p className="text-gray-600 mb-6"> {show.overview || 'N/A'} </p>

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
            </div>

            <ConfirmationModal 
                isModalOpen={isModalOpen}
                ratingValue={ratingValue}
                handleSave={handleSave}
                handleCancel={handleCancel}
                showTitle={show.title}
            />
        </div>

    );
};

export default ShowDetails;