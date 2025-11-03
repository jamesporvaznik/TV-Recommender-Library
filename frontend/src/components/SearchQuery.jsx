import React, { useState, useEffect } from 'react';

// Define the functional component
function SearchQuery({query, setQuery, onSearch, onSearchAdd}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localQuery, setLocalQuery] = useState(query || '');
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState(0);


    // Keep local term in sync if parent controls it
    useEffect(() => {
        if (typeof query === 'string') setLocalQuery(query);
    }, [query]);

    const term = typeof query === 'string' ? query : localQuery;
    
    // Handles text input changes
    function handleQueryChange(e) {
        const v = e.target.value;
        if (typeof setQuery=== 'function') setQuery(v);
        else setLocalQuery(v);
    }

    // clear the added show list
    function handleClear() {
        setMinReviews(0);
        setMinRating(0);
        if (typeof setQuery === 'function') setQuery('');
        else setLocalQuery('');
    }

    // Let user view the added shows list
    function handleSearchAdd() {
        if (typeof onSearchAdd === 'function'){
            onSearchAdd();
        }
        else console.log('Showing added shows list didn\'t work');
    }

    // Generate recommendations based on filters and displays them
    function getRecommendations() {

        if (typeof onSearch === 'function'){
            onSearch(term, minRating, minReviews);
            // Clear input field after submission
            setLocalQuery(''); 
        }
    }

    // Render the form
    return (
        // Entire form
        <form className="w-full max-w-3xl mx-auto p-2">
            {/* Add bar and clear button */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleQueryChange}
                    placeholder="Search shows by query..."
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="button" onClick={getRecommendations} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Search</button>
                <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-100 rounded">Clear Filters</button>
            </div>

            {/* Additional filters row */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">

                {/* Min Rating Input */}
                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Rating</span>
                    <input type="number" min="0" max="10" value={minRating} onChange={e => setMinRating(e.target.value)} className="mt-1 px-2 py-1 border rounded" />
                </label>

                {/* Min Reviews Input */}
                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Raters</span>
                    <input type="number" min="0" value={minReviews} onChange={e => setMinReviews(e.target.value)} className="mt-1 px-2 py-1 border rounded" />
                </label>

            </div>


            {/* Button to generate recommendations */}
            <div className="mt-1 text-sm text-gray-500 flex justify-center">
                <button type="button" onClick={handleSearchAdd} className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Search by Shows</button>
            </div>
        </form>
    );
}

// Export the component
export default SearchQuery;