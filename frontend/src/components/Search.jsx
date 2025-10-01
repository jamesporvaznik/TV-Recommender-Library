import React, { useState, useEffect } from 'react';

const Search = ({ searchTerm: controlledTerm, setSearchTerm: setControlledTerm, onSearch }) => {
    // Local state used when the parent doesn't control the search term
    const [localTerm, setLocalTerm] = useState(controlledTerm || '');
    const [genre, setGenre] = useState('All');
    const [type, setType] = useState('All');
    const [minRating, setMinRating] = useState(0);
    const [streamingOn, setStreamingOn] = useState('Any');
    const [isAiring, setIsAiring] = useState(false);

    // Keep local term in sync if parent controls it
    useEffect(() => {
        if (typeof controlledTerm === 'string') setLocalTerm(controlledTerm);
    }, [controlledTerm]);

    const term = typeof controlledTerm === 'string' ? controlledTerm : localTerm;

    function handleTermChange(e) {
        const v = e.target.value;
        if (typeof setControlledTerm === 'function') setControlledTerm(v);
        else setLocalTerm(v);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            q: term.trim(),
            genre: genre === 'All' ? null : genre,
            type: type === 'All' ? null : type,
            minRating: Number(minRating) || null,
            streamingOn: streamingOn === 'Any' ? null : streamingOn,
            isAiring: !!isAiring,
        };

        if (typeof onSearch === 'function') onSearch(payload);
        else console.log('search payload', payload);
    }

    function handleClear() {
        if (typeof setControlledTerm === 'function') setControlledTerm('');
        else setLocalTerm('');
        setGenre('All');
        setType('All');
        setMinRating(0);
        setStreamingOn('Any');
        setIsAiring(false);
    }

    const genres = ['All', 'Drama', 'Comedy', 'Sci-Fi', 'Documentary', 'Action', 'Horror', 'Romance', 'Thriller', 'Fantasy', 'Animation', 'Mystery', 'Crime', 'Adventure', 'Biography', 'Family', 'History', 'Music', 'Musical', 'Sport', 'War', 'Western'];
    const types = ['All', 'TV', 'Movie'];
    const streamingOptions = ['Any', 'Netflix', 'Hulu', 'Disney+', 'Amazon Prime', 'HBO Max', 'Apple TV+', 'Peacock', 'Paramount+', 'YouTube', 'Crunchyroll', 'Tubi', 'Vudu', 'Sling TV', 'FuboTV', 'Philo', 'Acorn TV', 'BritBox', 'Shudder', 'Starz', 'Cinemax', 'Epix', 'Mubi', 'CuriosityStream', 'Kanopy', 'Plex', 'Xumo', 'Pluto TV', 'Roku Channel'];

    return (
        <form className="w-full max-w-3xl mx-auto p-2" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="search"
                    value={term}
                    onChange={handleTermChange}
                    placeholder="Search movies and shows by title..."
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Search</button>
                <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Genre</span>
                    <select value={genre} onChange={e => setGenre(e.target.value)} className="mt-1 px-2 py-1 border rounded">
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>

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

                <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Streaming On</span>
                    <select value={streamingOn} onChange={e => setStreamingOn(e.target.value)} className="mt-1 px-2 py-1 border rounded">
                        {streamingOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </label>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isAiring} onChange={e => setIsAiring(e.target.checked)} />
                    <span className="text-xs text-gray-600">Currently airing</span>
                </label>
            </div>
        </form>
    );
};

export default Search;