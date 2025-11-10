import React, { useState, useEffect } from 'react';

const Filters = ({ onSearch }) => {
    // Local state used when the parent doesn't control the search term
    const [genre, setGenre] = useState('All');
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState(0);

    // Options for dropdowns
    const genres = ['All', 'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'];

    // Use useEffect to auto-submit filters on change
    useEffect(() => {
        const handler = setTimeout(() => {
            const payload = {
                search: null,
                genre: genre === 'All' ? null : genre,
                minRating: Number(minRating) || null,
                minReviews: Number(minReviews) || null,
            };

            if (typeof onSearch === 'function') {
                console.log('Auto-submitting filters:', payload);
                onSearch(payload);
            } else {
                console.log('Search function not provided. Payload:', payload);
            }
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
        
    }, [genre, minRating, minReviews, onSearch]); 
    


    //Handles clearing the form (Still useful for resetting state)
    function handleClear() {
        setGenre('All');
        setMinReviews(0);
        setMinRating(0);
    }

    // Render the form
    return (
        // *** 4. Removed onSubmit={handleSubmit} from the form ***
        <form className="w-full max-w-3xl mx-auto p-2"> 
            
            {/* Dropdown filters */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                
                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Genre</span>
                    <select value={genre} onChange={e => setGenre(e.target.value)} className="mt-1 px-2 py-1 border rounded">
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Rating</span>
                    <input type="number" min="0" max="10" value={minRating} onChange={e => setMinRating(e.target.value)} className="mt-1 px-2 py-1 border rounded" />
                </label>

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Raters</span>
                    <input type="number" min="0" value={minReviews} onChange={e => setMinReviews(e.target.value)} className="mt-1 px-2 py-1 border rounded" />
                </label>
                
                {/* Add a Clear button back since you still need the handleClear function */}
                <div className="mt-auto">
                    <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-100 rounded w-full">Clear Filters</button>
                </div>
            </div>
        </form>
    );
};

export default Filters;