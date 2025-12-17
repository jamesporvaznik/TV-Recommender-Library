import React, { createContext, useContext, useState, useEffect } from 'react';
import { useShow } from './ShowContext.jsx';
import { useAuth } from './AuthContext.jsx';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    // const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const API_BASE_URL = 'http://localhost:5000';

    const { token } = useAuth();
    const {getShowById} = useShow();
    const [addedShowIds, setAddedShowIds] = useState([]);
    const [watchedShowIds, setWatchedShowIds] = useState([]);
    const [bookmarkedShowIds, setBookmarkedShowIds] = useState([]);
    const [ratedShowsMap, setRatedShowsMap] = useState(new Map());


    const loadWatched = async () => {

        //get watched shows
        try{
            const response = await fetch(`${API_BASE_URL}/api/watched`, { 
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {             
                setWatchedShowIds(data.watched || []);
            } else {
                console.error("Failed to synchronize lists:", data.message);
            }
        } catch (error) {
            console.error("Network error during retrieving watched:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    };

    const loadBookmarked = async () => {

        //get bookmarked shows
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookmarked`, { 
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {             
                setBookmarkedShowIds(data.bookmarked || []);
            } else {
                console.error("Failed to synchronize lists:", data.message);
            }
        } catch (error) {
            console.error("Network error during retrieving bookmarked:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    };

    const loadRated = async () => {

        try{
            const response = await fetch(`${API_BASE_URL}/api/rating`, { 
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {          
                setRatedShowsMap(new Map(Object.entries(data.ratings || {})));
            } else {
                console.error("Failed to synchronize lists:", data.message);
            }
        } catch (error) {
            console.error("Network error during retrieving rated shows:", error);
            return false;
        }
    };

    const loadAdded = async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/api/added`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },

            });
            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Added API success:", data.added);
                setAddedShowIds(data.added);
                console.log("Toggling added list view to visible");
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("getting added shows failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during login:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    };

    useEffect(() => {
        if (!token) {
            // Clear data on logout
            setWatchedShowIds([]);
            setBookmarkedShowIds([]);
            setAddedShowIds([]);
            setRatedShowsMap(new Map());
            return;
        }
        if(token){
            // loadWatched(); 
            // loadBookmarked();
            // loadRated();
            // loadAdded();

            Promise.all([loadWatched(), loadBookmarked(), loadRated(), loadAdded()])
                .then(() => {
                    console.log("User data loaded successfully.");
                })
                .catch((error) => {
                    console.error("Error loading user data:", error);
                }); 
        }
    }, [token]);

    const watchedShows = watchedShowIds.map(getShowById).filter(Boolean);
    const bookmarkedShows = bookmarkedShowIds.map(getShowById).filter(Boolean);
    const addedShows = addedShowIds.map(getShowById).filter(Boolean);

    // --- 2. Memoized Object Mapping ---
    // This prevents expensive .map() operations on every render
    // const watchedShows = useMemo(() => 
    //     watchedShowIds.map(getShowById).filter(Boolean), 
    // [watchedShowIds, showsLoading]); // Re-run if IDs change OR global shows load

    // const bookmarkedShows = useMemo(() => 
    //     bookmarkedShowIds.map(getShowById).filter(Boolean), 
    // [bookmarkedShowIds, showsLoading]);

    // const addedShows = useMemo(() => 
    //     addedShowIds.map(getShowById).filter(Boolean), 
    // [addedShowIds, showsLoading]);

    return (
        <UserContext.Provider value={{ 
            watchedShowIds,
            bookmarkedShowIds,
            addedShowIds,
            ratedShowsMap,
            watchedShows,
            bookmarkedShows,
            addedShows
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useUser = () => useContext(UserContext);