import React, { createContext, useContext, useState, useEffect } from 'react';

const ShowContext = createContext();

export const ShowProvider = ({ children }) => {
    const [allShows, setAllShows] = useState([]);
    const [sortedShowIds, setSortedShowIds] = useState([]);
    const [showsMap, setShowsMap] = useState(new Map());
    const [loading, setLoading] = useState(true);

    // const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const API_BASE_URL = 'http://localhost:5000';

    // Helper function to find a full show object by TMDB ID
    const getShowById = (id) => {
        const key = String(id);
        
        return showsMap.get(key);
    };

    // Sorting shows by a few different ways
    const sortShows = (shows, mode) => {

        const dateToTimestamp = (dateString) => new Date(dateString).getTime();

        // Sorting
        if(mode === 'Relevance'){
            setSortedShowIds(recommendedShowIds);
        }
        else if(mode === 'By Rating (↓)'){
            const sorted = [...shows].sort((a, b) => b.rating_avg - a.rating_avg).map(show => show.tmdb_id);
            setSortedShowIds(sorted);
        }
        else if(mode === 'By Rating (↑)'){
            const sorted = [...shows].sort((a, b) => a.rating_avg - b.rating_avg).map(show => show.tmdb_id);
            setSortedShowIds(sorted);
        }
        else if (mode === 'By Reviews (↓)'){
            const sorted = [...shows].sort((a, b) => b.vote_count - a.vote_count).map(show => show.tmdb_id);
            setSortedShowIds(sorted);
        }
        else if(mode === 'By Reviews (↑)'){
            const sorted = [...shows].sort((a, b) => a.vote_count - b.vote_count).map(show => show.tmdb_id);
            setSortedShowIds(sorted);
        }
        else if (mode === 'By Date (↓)') {
            const sorted = [...shows].sort((a, b) => 
                dateToTimestamp(b.release_date) - dateToTimestamp(a.release_date)
            ).map(show => show.tmdb_id);
            
            setSortedShowIds(sorted); 
        }
        else if (mode === 'By Date (↑)') {
            const sorted = [...shows].sort((a, b) => 
                dateToTimestamp(a.release_date) - dateToTimestamp(b.release_date)
            ).map(show => show.tmdb_id);
            
            setSortedShowIds(sorted); 
        }
    };

    // Get shows from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const showsResponse = await fetch(`${API_BASE_URL}/api/shows`);
                const { data: showsData } = await showsResponse.json();
                setAllShows(showsData.map(show => ({ ...show })));
                
                if (Array.isArray(showsData)) {
    
                    const showsMap = showsData.reduce((map, show) => {

                        const key = String(show.tmdb_id); 
                        
                        map.set(key, { ...show });
                        
                        return map;
                    }, new Map()); 

                    setShowsMap(showsMap);
                    console.log("Shows data loaded:", showsMap);

                } else {
                    console.error("API returned non-array data:", showsData);
                    setShowsMap(new Map());
                }

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedShows = sortedShowIds.map(getShowById).filter(Boolean);

    return (
        <ShowContext.Provider value={{ 
            getShowById,
            sortShows,
            sortedShows,
            allShows,
            showsMap,
            loading
        }}>
            {children}
        </ShowContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useShow = () => useContext(ShowContext);