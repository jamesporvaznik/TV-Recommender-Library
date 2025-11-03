import React, { useState, useEffect } from 'react';

// Define the functional component
function Recommendations({addTerm, setAddTerm, onAdd, onClear, onView, onHide, onGenerate, onSearchQuery}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localAddTerm, setLocalAddTerm] = useState(addTerm || '');
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState(0);
    const [isWatched, setIsWatched] = useState(false);


    // Keep local term in sync if parent controls it
    useEffect(() => {
        if (typeof addTerm === 'string') setLocalAddTerm(addTerm);
    }, [addTerm]);

    const term = typeof addTerm === 'string' ? addTerm : localAddTerm;
    
    // Handles text input changes
    function handleAddTermChange(e) {
        const v = e.target.value;
        if (typeof setAddTerm === 'function') setAddTerm(v);
        else setLocalAddTerm(v);
    }

    // Handles adding a show to the list
    function handleAddShow(e) {
        e.preventDefault();

        // Clear input field after submission
        setLocalAddTerm(''); 

        // Call the onAdd prop with the searched term
        if (typeof onAdd === 'function') onAdd(term.trim());
        else console.log('search payload', term.trim());
    }


    // clear the added show list
    function handleClear() {
        // Clear the temporary added list
        if (typeof onClear === 'function'){
            onClear();
        }
        else console.log('Cleared recommendation list');
        
    }

    function handleSearchQuery() {
        if (typeof onSearchQuery === 'function'){
            onSearchQuery();
        }
        else console.log('Searching shows with query is not working');
    }

    // Let user view the added shows list
    function handleViewAdded() {
        if (typeof onView === 'function'){
            onView();
        }
        else console.log('Showing added shows list');
    }

    // Generate recommendations based on filters and displays them
    function getRecommendations() {
        if (typeof onHide === 'function'){
            onHide();
        }
        if (typeof onGenerate === 'function'){
            onGenerate(minRating, minReviews, isWatched);
        }
    }

    // Render the form
    return (
        // Entire form
        <form className="w-full max-w-3xl mx-auto p-2" onSubmit={handleAddShow}>
            {/* Add bar and clear button */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleAddTermChange}
                    placeholder="Add shows by title..."
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Add</button>
                <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-100 rounded">Clear List</button>
            </div>

            {/* Additional filters row */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">

                {/* Watched checkbox */}
                <div className="mt-3 flex items-center gap-3 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isWatched} onChange={e => setIsWatched(e.target.checked)} />
                        <span className="text-xs text-gray-600">Use Watched List</span>
                    </label>
                </div>

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

                {/* View Added Shows Button */}
                <div className="flex flex-col mt-3 border rounded flex">
                    <button type="button" onClick={handleViewAdded} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">View Added Shows</button>
                </div>

            </div>

            {/* Message to users */}
            <div className="mt-3 text-sm text-gray-500 flex justify-center">
                <span>Note if you check "Use Watched List", the shows you've added manually will not determined. </span>
            </div>

            {/* Button to generate recommendations */}
            <div className="mt-1 text-sm text-gray-500 flex justify-center">
                <button type="button" onClick={getRecommendations} className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Get Recommendations</button>
            </div>

            <div className="mt-3 text-sm text-gray-500 flex justify-center">
                <button type="button" onClick={handleSearchQuery} className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Search by Query</button>
            </div>
        </form>
    );
}

// Export the component
export default Recommendations;