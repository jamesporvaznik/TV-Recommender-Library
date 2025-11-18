import { useState, useEffect } from 'react';

import ConfirmationModal from './ConfirmationModal';

// arguments passed to ShowDetails component
const ShowDetails = ({ 
    show, 
    onClose, 
    watchedIds, 
    bookmarkedIds, 
    onToggleList,
    setRating,
    userRating,
}) => {
    if (!show) return null;

    const [ratingValue, setRatingValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Current status of watched and bookmarked
    const isWatched = watchedIds?.includes(show.tmdb_id);
    const isBookmarked = bookmarkedIds?.includes(show.tmdb_id);

    const BASE_URL_ROOT = 'https://image.tmdb.org/t/p/';
    const IMAGE_SIZE = 'w1280';
    const PATH = show.backdrop_path;

    const correctUrl = `${BASE_URL_ROOT}${IMAGE_SIZE}${PATH}`;

    // Handlers for the action buttons
    const handleToggleWatched = () => onToggleList(show.tmdb_id, 'watched');
    const handleToggleBookmark = () => onToggleList(show.tmdb_id, 'bookmarked');

    const handleCancel = () => {
        setIsModalOpen(false); 
        setRatingValue(''); 
    };
    
    const handleSave = () => {
        if (typeof setRating === 'function'){
            setRating(ratingValue, show.tmdb_id);
        }
        console.log(`Submitting rating ${ratingValue} for ${show.title}`);
        setIsModalOpen(false); 
        setRatingValue(''); 
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            {/* Pop-up Content */}
            <div className="bg-zinc-800 rounded-lg p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-full" onClick={(e) => e.stopPropagation()}>
                {/* Header Section */}
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">

                    {isWatched ? (
                        <div className="flex-1 font-bold "> {/* Note: 'font-bold' should be in className, not 'weight' */}
                            <h1>User Rating: {userRating}</h1>
                        </div> 
                    ) : (
                        <div className="flex-1 font-bold"> {/* Note: 'font-bold' should be in className, not 'weight' */}
                            <h1>User Rating: N/A</h1>
                        </div> 
                    )}

                    <h2 className="text-3xl font-bold mb-2 text-center ">
                        {show.title} 
                    </h2>

                    <div className="flex-1 flex justify-end">
                        {isWatched && (
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
                                    value={ratingValue} 
                                    onChange={handleRatingChange} 
                                    className="w-16 p-1 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative h-60 overflow-hidden">
                    <img 
                        src={`${correctUrl}`} 
                        alt={show.title} 
                        className="object-cover h-full w-full transition-opacity duration-300 rounded-lg" 
                        style={{ display: 'block' }}
                    />
                </div>

                {/* Show Details */}
                <div className="grid grid-cols-1 gap-4 mt-10 mb-4 text-gray-400 px-6 text-lg">
                    <div className="space-y-4">
                        {/* Rating: Use flex and justify-between for space */}
                        <p className="flex justify-between">
                            <strong className="text-gray-400">Rating:</strong> 
                            <span className="text-white">{show.rating_avg} ({show.vote_count})</span>
                        </p>
                        
                        {/* Genre: Use flex and justify-between for space */}
                        <p className="flex justify-between">
                            <strong className="text-gray-400">Genre:</strong> 
                            <span className="text-white">{show.genres || 'N/A'}</span>
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Release Date: Use flex and justify-between for space */}
                        <p className="flex justify-between">
                            <strong className="text-gray-400">Release Date:</strong> 
                            <span className="text-white">{show.release_date}</span>
                        </p>
                    </div>
                </div>

                {/* Description */}
                <h3 className="text-xl text-white font-semibold mt-8 mb-4">Description</h3>
                <p className="text-gray-400 mb-6"> {show.overview || 'N/A'} </p>

                {/* Buttons */}
                <div className="flex space-x-3 justify-between border-t pt-4">

                    {/* Left: Watched and Watchlist Buttons */}
                    <div className="flex space-x-3">
                        {/* Toggle Watched Button */}
                        <button 
                            onClick={handleToggleWatched} 
                            className={`px-4 py-2 text-sm rounded transition ${isWatched ? 'bg-neutral-700 text-gray-400 hover:bg-neutral-700' : 'bg-zinc-800 text-gray-400 hover:bg-neutral-700'}`}
                        >
                            {isWatched ? 'Unmark Watched' : 'Mark Watched'}
                        </button>

                        {/* Toggle Watchlist Button */}
                        <button 
                            onClick={handleToggleBookmark} 
                            className={`px-4 py-2 text-sm rounded transition ${isBookmarked ? 'bg-neutral-700 text-gray-400 hover:bg-neutral-700' : 'bg-zinc-800 text-gray-400 hover:bg-neutral-700'}`}
                        >
                            {isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                    
                    {/* Right: Optional Remove and Close Buttons */}
                    <div className="flex space-x-3">
                        {/* Close Button */}
                        <button onClick={onClose} className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300">
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