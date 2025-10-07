import React, { useState, useEffect } from 'react';

// Define the functional component
function Recommendations({addTerm, setAddTerm, onAdd}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localAddTerm, setLocalAddTerm] = useState(addTerm || '');
    const [type, setType] = useState('TV');
    const [minRating, setMinRating] = useState(0);
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

    // Handles form submission
    function handleAddShow(e) {
        e.preventDefault();
        const payload = {
            q: term.trim(),
            type: type === 'TV' ? null : type,
            minRating: Number(minRating) || null,
            isWatched: !!isWatched,
        };

        if (typeof onAdd === 'function') onAdd(payload);
        else console.log('search payload', payload);
    }


    // handleClear
    function handleClear() {
        // Clear the temporary recommendation list
        if (typeof setRecommendationList === 'function') {
            setRecommendationList([]);
        }
        
        // Reset filters
        setLocalAddTerm(''); 
        setType('TV');
        setMinRating(0);
    }

    // Handles view button click
    function handleView() {
        console.log("Current Recommendation List IDs:", recommendationList);
    }

    function getRecommendationList() {
        // This function would ideally fetch or compute the recommendation list based on current filters and your custom list
        return [];
    }

    const types = ['TV', 'Movie'];

    // Return the JSX (the component's UI)
    return (
        // Entire form
        <form className="w-full max-w-3xl mx-auto p-2" onSubmit={handleAddShow}>
            {/* Add bar and clear burton */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleAddTermChange}
                    placeholder="Search movies and shows by title..."
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

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Type</span>
                    <select value={type} onChange={e => setType(e.target.value)} className="mt-1 px-2 py-1 border rounded">
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Rating</span>
                    <input type="number" min="0" max="10" value={minRating} onChange={e => setMinRating(e.target.value)} className="mt-1 px-2 py-1 border rounded" />
                </label>

                <div className="flex flex-col mt-3 border rounded flex">
                    <button type="button" onClick={handleView} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">View Added Shows</button>
                </div>

            </div>

            <div className="mt-3 text-sm text-gray-500 flex justify-center">
                <button type="button" onClick={getRecommendationList} className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Get Recommendations</button>
            </div>

        </form>
    );
}

// Export the component
export default Recommendations;