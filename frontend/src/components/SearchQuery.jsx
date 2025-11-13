import React, { useState, useEffect } from 'react';

// Define the functional component
function SearchQuery({query, setQuery, onSearch, onSearchAdd}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localQuery, setLocalQuery] = useState(query || '');


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

    function getRecommendations(e) {
        // 1. Prevent the browser from performing a hard page reload
        e.preventDefault(); 
        
        // 2. Use the current state value ('term')
        const queryToSubmit = term.trim();

        if (queryToSubmit && typeof onSearch === 'function'){
            onSearch(queryToSubmit);
        } else {
             console.log('Submission blocked: Query is empty or onSearch not provided.');
        }
    }

    // Render the form
    return (
        // Entire form
        <form className="w-full max-w-3xl mx-auto p-2 " onSubmit={getRecommendations}>
            {/* Add bar and clear button */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleQueryChange}
                    placeholder="Generate recommendations by search query..."
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Get Recommendations</button>

            </div>
        </form>
    );
}

// Export the component
export default SearchQuery;