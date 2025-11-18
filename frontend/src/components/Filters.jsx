import React, { useState, useEffect } from 'react';

const Filters = ({ onSearch, onSort, length, searchTerm: controlledTerm, setSearchTerm: setControlledTerm }) => {
    // Local state used when the parent doesn't control the search term
    const [localTerm, setLocalTerm] = useState(controlledTerm || '');
    const [genre, setGenre] = useState('All');
    const [minRating, setMinRating] = useState('');
    const [minReviews, setMinReviews] = useState('');
    const [sortOption, setSortOption] = useState('Default');


    // Options for dropdowns
    const genres = ['All', 'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'];
    const sortOptions = ['Relevance','By Rating (High to Low)','By Rating (Low to High)','By Reviews (High to Low)','By Reviews (Low to High)','By Release Date (New to Old)','By Release Date (Old to New)',];

    useEffect(() => {
        if (typeof controlledTerm === 'string') setLocalTerm(controlledTerm);
    }, [controlledTerm]);

    const term = typeof controlledTerm === 'string' ? controlledTerm : localTerm;

    // Handles text input changes
    function handleTermChange(e) {
        const v = e.target.value;
        if (typeof setControlledTerm === 'function') setControlledTerm(v);
        else setLocalTerm(v);
    }

    //Handles form submission
    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            q: term.trim(),
            genre: genre === 'All' ? null : genre,
            minRating: Number(minRating) || null,
            minReviews: Number(minReviews) || null,
        };

        if (typeof onSearch === 'function') onSearch(payload);
        else console.log('search payload', payload);
    }

    // Handle changes in filters
    const handleFilterChange = (field, value) => {
    
        const newFilterState = {
            genre: genre,
            minRating: minRating,
            minReviews: minReviews,
        };

        newFilterState[field] = value; 

        switch (field) {
            case 'genre':
                setGenre(value);
                break;
            case 'minRating':
                setMinRating(value);
                break;
            case 'minReviews':
                setMinReviews(value);
                break;
            default:
                console.error(`Attempted to set unknown field: ${field}`);
        }

        const payload = {
            q: term.trim(),
            genre: newFilterState.genre === 'All' ? null : newFilterState.genre,
            minRating: newFilterState.minRating === '' ? null : Number(newFilterState.minRating),
            minReviews: newFilterState.minReviews === '' ? null : Number(newFilterState.minReviews),
        };

        if (typeof onSearch === 'function') {
            console.log('Instant submitting filters (Synchronous fix):', payload);
            onSearch(payload);
        }
    };

    // Gives the sort mode to the component that calls it
    function handleSort(mode){

        if (typeof onSort === 'function') {
            
            console.log('Sort function:', mode);
            onSort(mode);
            setSortOption(mode);
        }
        
    }

    //Handles clearing the form (Still useful for resetting state)
    function handleClear() {
        setGenre('All');
        setMinReviews('');
        setMinRating('');

        const payload = {
            q: null,
            genre: genre === 'All' ? null : genre,
            minRating: null,
            minReviews: null,
        };


        if (typeof onSearch === 'function') {
            console.log('Auto-submitting filters:', payload);
            onSearch(payload);
        } else {
            console.log('Search function not provided. Payload:', payload);
        }
    }


    // Render the form
    return (
        <>
        <form className="w-full max-w-3xl mx-auto p-2 mb-4" onSubmit={handleSubmit}> 

            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleTermChange}
                    placeholder="Search shows by title..."
                    className="bg-neutral-900 flex-1 px-3 py-2 border-b border-gray-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300">Search</button>
            </div>
            
            {/* Dropdown filters */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm mt-6">
                
                <label className="flex flex-col">
                    <span className="text-xs text-gray-500 ">Genre</span>
                    <select value={genre} onChange={e => handleFilterChange('genre', e.target.value)} className="mt-1 px-2 py-1 border-zinc-800 rounded-lg bg-zinc-800 text-gray-400 w-full">
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Rating</span>
                    <input type="number" min="0" max="10" value={minRating} placeholder="e.g., 7" onChange={e => handleFilterChange('minRating', e.target.value)} className="placeholder:italic mt-1 px-2 py-1 border-zinc-800 rounded-lg bg-zinc-800 text-gray-400 w-full" />
                </label>

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Min Raters</span>
                    <input type="number" min="0" value={minReviews} placeholder="e.g., 500" onChange={e => handleFilterChange('minReviews', e.target.value)} className="placeholder:italic mt-1 px-2 py-1 border-zinc-800 rounded-lg bg-zinc-800 text-gray-400 w-full" />
                </label>

                <div className="mt-auto flex justify-end items-end w-full">
                    <button 
                        type="button" 
                        onClick={handleClear} 
                        className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </form>
        {/* Sorting */}
        <form className="flex justify-between w-full px-4 border-t mt-2">
            <h2 className="text-lg font-semibold mt-4">{length} Shows</h2>
            <label className="flex flex-col">
                <span className="text-xs text-gray-500 mt-1">Sort By</span>
                <select value={sortOption} onChange={e => handleSort(e.target.value)} className="px-5  mt-1 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300">
                    {sortOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </label>
        </form>
        </>
    );
};

export default Filters;