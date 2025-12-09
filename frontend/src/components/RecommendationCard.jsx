import React, { useMemo, useState } from 'react';


const RecommendationCard = ({ show, watchedIds, bookmarkedIds, addedIds, onToggleList, onCardClick }) => {
    // Check the current status of the show for the current user
    const isAdded = addedIds.includes(show.tmdb_id);

    const BASE_URL_ROOT = 'https://image.tmdb.org/t/p/';
    const IMAGE_SIZE = 'w1280';
    const PATH = show.backdrop_path;

    const correctUrl = `${BASE_URL_ROOT}${IMAGE_SIZE}${PATH}`;

    const handleToggleAdd = () => {
        onToggleList(show.tmdb_id, 'added');
    }

    return (
        // Made the entire article clickable
        <article 
            key={show.id} 
            onClick={() => onCardClick(show)} // This triggers the modal open function
            className="border rounded-lg overflow-hidden bg-zinc-800 shadow-md transition-shadow hover:shadow-lg cursor-pointer border-zinc-800"
        >
            {/* Image Section */}
            <div className="h-60 bg-gray-200 flex items-center justify-center">
                <img 
                    src={`${correctUrl}`} 
                    alt={show.title} 
                    className="object-cover h-full w-full" 
                />
            </div>
            
            {/* Text Content and Buttons */}
            <div className="p-3">
                <h3 className="text-sm text-white font-semibold truncate">{show.title}</h3>
                <div className="text-xs text-white">
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
                            ? 'bg-green-700 text-white hover:bg-green-700 border border-bg-white' : 'bg-zinc-800 text-gray-400 hover:bg-green-700 hover:text-white border border-bg-white'}`}
                    >
                        {isAdded ? 'Added' : 'Add to List'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default RecommendationCard;