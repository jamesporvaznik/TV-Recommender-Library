import React, { useState, useEffect } from 'react';

const Search = ({ searchTerm: controlledTerm, setSearchTerm: setControlledTerm, onSearch }) => {
    // Local state used when the parent doesn't control the search term
    const [localTerm, setLocalTerm] = useState(controlledTerm || '');
    const [genre, setGenre] = useState('All');
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState(0);

    // Keep local term in sync if parent controls it
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


    //Handles clearing the form
    function handleClear() {
        if (typeof setControlledTerm === 'function') setControlledTerm('');
        else setLocalTerm('');
        setGenre('All');
        setMinReviews(0);
        setMinRating(0);
    }

    // Options for dropdowns
    const genres = ['All', 'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'];
    const types = ['All', 'TV', 'Movie'];
    const streamingOptions = ['Any', 'Netflix', 'Hulu', 'Disney+', 'Amazon Prime', 'HBO Max', 'Apple TV+', 'Peacock', 'Paramount+', 'YouTube', 'Crunchyroll', 'Tubi', 'Vudu', 'Sling TV', 'FuboTV', 'Philo', 'Acorn TV', 'BritBox', 'Shudder', 'Starz', 'Cinemax', 'Epix', 'Mubi', 'CuriosityStream', 'Kanopy', 'Plex', 'Xumo', 'Pluto TV', 'Roku Channel'];

    // Render the form
    return (
        // Entire form
        <form className="w-full max-w-3xl mx-auto p-2" onSubmit={handleSubmit}>

            {/* Search bar and clear burton */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleTermChange}
                    placeholder="Search shows by title..."
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Search</button>
                <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
            </div>

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

            </div>
        </form>
    );
};

// Export the component
export default Search;