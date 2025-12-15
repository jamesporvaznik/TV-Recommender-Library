import { useState, useEffect } from 'react';
import './App.css';

// Component Imports
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";
import AllShows from './components/AllShows';
import Watched from './components/Watched';
import Watchlist from './components/Watchlist';
import Login from './components/Login';
import Signup from './components/Signup';   
import AddedShowsList from './components/AddedShowsList';
import RecommendedShowsList from './components/RecommendedShowsList';
import ShowDetails from './components/ShowDetails';
import Profile from './components/Profile';
import SearchQuery from './components/SearchQuery';
import Drawer from './components/Drawer';
import AddShows from './components/AddShows';
import SourceDetails from './components/SourceDetails';
import MobileHeader from './components/MobileHeader'
import useScreenSize from './hooks/useScreenSize';

// Recommendation modes on the sidebar
export const RECOMMENDATION_MODES = {
    SEARCH: 'Get Recommendations by Search',
    LIST: 'Get Recommendations by List',
    ADD: 'Create List',
    WATCHED: 'Get Recommendations from Watched',
};

function App() {

    // Routing & Filtering State
    const [currentPage, setCurrentPage] = useState('Home');
    const [filters, setFilters] = useState(null);
    const [isAddedListVisible, setIsAddedListVisible] = useState(false);
    const [popUpShow, setPopUpShow] = useState(null);
    const [recommendedPopUp ,setRecommendedPopUp] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allShows, setAllShows] = useState([]);
    const [showsMap, setShowsMap] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [addedShowIds, setAddedShowIds] = useState([]);
    const [watchedShowIds, setWatchedShowIds] = useState([]);
    const [bookmarkedShowIds, setBookmarkedShowIds] = useState([]);
    const [recommendedShowIds, setRecommendedShowIds] = useState([]);
    const [sourceShowIds, setSourceShowIds] = useState([]);
    const [sortedShowIds, setSortedShowIds] = useState([]);
    const [isAddSearch, setIsAddSearch] = useState(true);
    const [ratedShowsMap, setRatedShowsMap] = useState(new Map());
    const [currentMode, setCurrentMode] = useState(RECOMMENDATION_MODES.ADD);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [isSearhQuery, setIsSearchQuery] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const isMobile = useScreenSize(768);
    // const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const API_BASE_URL = 'http://localhost:5173';
    
    //Function called when you click on a mode in the sidebar
    const changeMode = async (newMode) => { 
        setCurrentMode(newMode);
        setIsSearchQuery(false);
        console.log(`Mode changed to: ${newMode}`);
        setIsWatched(false);

        // Changes made depending on what page you go to
        if(newMode === RECOMMENDATION_MODES.LIST){
            if(addedShowIds.length == 0){
                alert("Need to add at least 1 show to your list to get recommendations!");
                setCurrentMode(RECOMMENDATION_MODES.ADD);
                return;
            }
            setFilters(null);
            getRecommendationList(false);
        } 
        else if(newMode === RECOMMENDATION_MODES.WATCHED){
            setFilters(null);
            getRecommendationList(true);
            setIsWatched(true);
        }
        else if(newMode === RECOMMENDATION_MODES.SEARCH){ 
            setFilters(null);
            setIsSearchQuery(true);
            setShowRecommendations(false);
        }
        else if(newMode === RECOMMENDATION_MODES.ADD){
            setFilters(null);
        }
    };

    // Helper function to find a full show object by TMDB ID
    const getShowById = (id) => {
        const key = String(id);
        
        return showsMap.get(key);
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
    
    // Temporary component if loading
    if (loading) {
        return <div className="text-center p-10">Loading show data...</div>;
    }

    // Open pop up / show modal
    const handleOpenPopUp = (showData) => {
        setPopUpShow(showData);
    };

    // Close pop up / show modal
    const handleClosePopUp = () => {
        setPopUpShow(null);
    };

    const handleOpenRecommendedPopUp = (showData, sourceIds) => {
        console.log("hello")
        console.log(sourceIds.get(String(showData.tmdb_id)));
        setRecommendedPopUp(showData);
    };

    const handleCloseRecommendedPopUp = () => {
        setRecommendedPopUp(null);
    };

    // Function for when the user logs out
    const handleLogout = async() => {

        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('username'); 

        setAddedShowIds([]);
        setWatchedShowIds([]);
        setBookmarkedShowIds([]);
        
        setIsLoggedIn(false);
        setCurrentPage('Home');
    };

    // Function for when the user logs in
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    // Handles login submission
    const handleSignUp = async(user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Signup API success:", data.message);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Signup failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("Network error during login:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    }

    // Handler to receive the filters/search from the Filters component
    const handleSearch = (newFilters) => {
        setFilters(newFilters);
    };

    // Function that checks user credentials against database
    const checkUser = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.ok && data.success) {

                // holds user credentials in localStorage
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('currentUserId', data.userId);
                localStorage.setItem('username', data.username);

                console.log(localStorage.userToken, localStorage.currentUserId, localStorage.username);
                
                // loads the users watched and bookmarked shows upon login
                loadData();

                console.log("Login API success:", data.message);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Login failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during login:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    }
    
    // Function to load the users watched,bookmarked and added shows upon login
    const loadData = async () => {
        const token = localStorage.userToken;

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
        //get ratings of watched shows
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
        //get added shows of user
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
    }

    // Function to clear the user's addedShows list
    const clearAddList = async () => {

        const token = localStorage.userToken;
        console.log(token);

        try {
            const response = await fetch(`${API_BASE_URL}/api/added`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },

            });
            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Delete Added API success:", data.added);
                setAddedShowIds(data.added);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("deleting added shows failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during login:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    }


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
    }

    // Function to generate show recommendations based on the users created list
    const getRecommendationList = async (isWatched) => {
        console.log("Generating recommendations with filters:", {isWatched});

        const token = localStorage.userToken;

        try {
            const response = await fetch(`${API_BASE_URL}/api/recommendations/shows`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({isWatched: isWatched})
            });
            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Got recommended successgully:", data.message);
                console.log('Contents of data.recommended:', data.recommended);
                setRecommendedShowIds(data.recommended);

                const recommendationMap = new Map(Object.entries(data.sources));
                setSourceShowIds(recommendationMap);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Inserting added failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during insert added:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    }

    // Lets user make a search query rather than viewing the recommended shows
    const hideRecommendations = () => {
        setShowRecommendations(false);
    }

    const getRecommendationsBySearchQuery = async (query) => {

        console.log("Generating recommendations with filters:", {query});

        const token = localStorage.userToken;

        if(query === '' || query === null){
            alert("Please enter a search query.");
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/recommendations/search`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({query: query})
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Got recommended successfully:", data.message);
                console.log('Contents of data.recommended:', data.recommended);
                setRecommendedShowIds(data.recommended);
                setShowRecommendations(true);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Inserting added failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during insert added:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }

    };

    // Function to set rating for watched shows
    const setRating = async (rating, showId) => {

        console.log("Setting rating to:", rating);
        const token = localStorage.userToken;

        try {
            const response = await fetch(`${API_BASE_URL}/api/rating`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ratingValue: rating, showId: showId})
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Set rating successfully:", data.message);

                const newMap = new Map(ratedShowsMap);
                newMap.set(String(showId), rating); 
                setRatedShowsMap(newMap);

                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Inserting added failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Network error during insert added:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    };

    // Function to hide the added shows list view and go back to the view to search for shows to add
    const hideAddedListView = () => {
        setIsAddedListVisible(false);
    };

    // Function to hide the added shows list view
    const showAddSearch = () => {
        setIsAddSearch(true);
    };

    // Function to show the added shows list view
    const toggleAddedListView = async () => {

        console.log("Toggling added list view");

        const token = localStorage.userToken;
        console.log(token);
        setIsAddedListVisible(true);
    };

    // Toggle function to add/remove show IDs from watched/bookmarked/added lists
    const updateShowList = async (showId, listName) => {

        const token = localStorage.userToken;

        const payload = {
            showId: showId            
        };

        try {
            if(listName === 'watched'){
                const response = await fetch(`${API_BASE_URL}/api/watched`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log("Watched API success:", data.message);
                    setWatchedShowIds(data.watched);
                    return true; 
                } else {
                    // Failure: Invalid credentials
                    alert("Must be logged in to update watched list.");
                    console.error("Inserting wacthed failed:", data.message);
                    return false;
                }
            }
            else if(listName === 'bookmarked'){
                const response = await fetch(`${API_BASE_URL}/api/bookmarked`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log("Bookmarked API success:", data.message);
                    setBookmarkedShowIds(data.bookmarked);
                    return true; 
                } else {
                    // Failure: Invalid credentials
                    alert("Must be logged in to update bookmarked list.");
                    console.error("Inserting bookmarked failed:", data.message);
                    return false;
                }
            }
            else if(listName === 'added'){

                try {
                    const response = await fetch(`${API_BASE_URL}/api/added`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();

                    if (response.ok && data.success) {
                        console.log("Insert Added API success:", data.message);
                        setAddedShowIds(data.added);
                        return true; 
                    } else {
                        // Failure: Invalid credentials
                        console.error("Inserting added failed:", data.message);
                        return false;
                    }

                } catch (error) {
                    console.error("Network error during insert added:", error);
                    alert("A network error occurred. Could not connect to the server.");
                    return false;
                }


            }
        } catch (error) {
            console.error("Network error during insert watched:", error);
            alert("A network error occurred. Could not connect to the server.");
            return false;
        }
    }

    // Data for Watched/Watchlist/Added Pages
    const watchedShows = watchedShowIds.map(getShowById).filter(Boolean);
    const bookmarkedShows = bookmarkedShowIds.map(getShowById).filter(Boolean);
    const addedShows = addedShowIds.map(getShowById).filter(Boolean);
    const recommendedShows = recommendedShowIds.map(getShowById).filter(Boolean);
    const sortedShows = sortedShowIds.map(getShowById).filter(Boolean);

    // Render the component
    return (
        <div className="flex flex-col min-h-screen bg-neutral-900">

            {isMobile ? (
                <MobileHeader currentPage={currentPage} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            ) : (
                <Header currentPage={currentPage} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />                  
            )}
            
            
            <main className="flex-grow">
                {currentPage === 'Home' ? (
                    <Landing
                        shows = {allShows}
                        watchedIds={watchedShowIds}
                        bookmarkedIds={bookmarkedShowIds}
                        isLoggedIn={isLoggedIn}
                        username={localStorage.getItem('username')}
                        onToggleList={updateShowList}
                        onCardClick={handleOpenPopUp}
                        setCurrentPage={setCurrentPage}
                    />
                ) : (
                    <>     

                        {/* Page Rendering based on currentPage state */}
                        {currentPage === 'Explore' && (
                            <AllShows 
                                allShows={allShows} 
                                sortedShows={sortedShows}
                                filters={filters} 
                                watchedIds={watchedShowIds}
                                bookmarkedIds={bookmarkedShowIds}
                                onToggleList={updateShowList}
                                onCardClick={handleOpenPopUp}
                                onSearch={handleSearch}
                                onSort={sortShows}
                            />
                        )}

                        {currentPage === 'Watched' && (
                            isLoggedIn ? (
                                <Watched 
                                    shows={watchedShows}
                                    sortedShows={sortedShows} 
                                    filters={filters} 
                                    watchedIds={watchedShowIds}
                                    bookmarkedIds={bookmarkedShowIds}
                                    onToggleList={updateShowList}
                                    onCardClick={handleOpenPopUp}
                                    onSearch={handleSearch}
                                    onSort={sortShows}
                                /> 
                            ) : (
                                setCurrentPage('Login')                        
                            )
                        )}

                        {currentPage === 'Watchlist' && (
                            isLoggedIn ? (
                                <Watchlist 
                                    shows={bookmarkedShows} 
                                    sortedShows={sortedShows}
                                    filters={filters} 
                                    watchedIds={watchedShowIds}
                                    bookmarkedIds={bookmarkedShowIds}
                                    onToggleList={updateShowList}
                                    onCardClick={handleOpenPopUp}
                                    onSearch={handleSearch}
                                    onSort={sortShows}
                                /> 
                            ) : (
                                setCurrentPage('Login')
                            )
                        )}
                        
                        {currentPage === 'Recommendations' && (

                            isLoggedIn ? (
                                <>
                                    <Drawer 
                                        changeMode={changeMode} 
                                        currentMode={currentMode}
                                    />

                                    {currentMode === RECOMMENDATION_MODES.ADD ? (
                                        <>
                                        {isAddedListVisible ? (
                                            <AddedShowsList 
                                                shows={addedShows} 
                                                watchedIds={watchedShowIds}
                                                bookmarkedIds={bookmarkedShowIds}
                                                addedIds={addedShowIds}
                                                onToggleList={updateShowList}
                                                onCardClick={handleOpenPopUp}
                                                onHide={hideAddedListView}
                                                onClear={clearAddList}
                                            /> 
                                        ) : (
                                            <div className="main-content-wrapper">
                                                <AddShows 
                                                    shows={allShows} 
                                                    sortedShows={sortedShows}
                                                    filters={filters} 
                                                    watchedIds={watchedShowIds}
                                                    bookmarkedIds={bookmarkedShowIds}
                                                    addedIds={addedShowIds}
                                                    onToggleList={updateShowList}
                                                    onCardClick={handleOpenPopUp}
                                                    onSearch={handleSearch}
                                                    onSort={sortShows}
                                                    onView={toggleAddedListView}
                                                />
                                            </div>
                                        )}
                                        </>
                                    ) : currentMode === RECOMMENDATION_MODES.SEARCH ? (
                                        <>
                                            {!showRecommendations && (
                                                <SearchQuery
                                                    onSearch={getRecommendationsBySearchQuery}
                                                    onSearchAdd={showAddSearch}
                                                />
                                            )}
                                            {showRecommendations && (
                                                <RecommendedShowsList 
                                                    shows={recommendedShows} 
                                                    sortedShows={sortedShows}
                                                    watchedIds={watchedShowIds}
                                                    bookmarkedIds={bookmarkedShowIds}
                                                    filters={filters}
                                                    isSearch={isSearhQuery}
                                                    sourceIds={sourceShowIds}
                                                    onToggleList={updateShowList}
                                                    onCardClick={handleOpenRecommendedPopUp}
                                                    onSearch={handleSearch}
                                                    onSort={sortShows}
                                                    onRefresh={hideRecommendations}
                                                /> 
                                            )}
                                        </>
                                    ) : currentMode === RECOMMENDATION_MODES.LIST ? (
                                        <>
                                            <RecommendedShowsList 
                                                shows={recommendedShows} 
                                                sortedShows={sortedShows}
                                                watchedIds={watchedShowIds}
                                                bookmarkedIds={bookmarkedShowIds}
                                                filters={filters} 
                                                isSearch={isSearhQuery}
                                                sourceIds={sourceShowIds}
                                                onToggleList={updateShowList}
                                                onCardClick={handleOpenRecommendedPopUp}
                                                onSearch={handleSearch}
                                                onSort={sortShows}
                                                onRefresh={hideRecommendations}
                                            /> 
                                        </>
                                    ) : currentMode === RECOMMENDATION_MODES.WATCHED ? (
                                        <>
                                            <RecommendedShowsList 
                                                shows={recommendedShows} 
                                                sortedShows={sortedShows}
                                                watchedIds={watchedShowIds}
                                                bookmarkedIds={bookmarkedShowIds}
                                                filters={filters} 
                                                isSearch={isSearhQuery}
                                                sourceIds={sourceShowIds}
                                                onToggleList={updateShowList}
                                                onCardClick={handleOpenRecommendedPopUp}
                                                onSearch={handleSearch}
                                                onSort={sortShows}
                                                onRefresh={hideRecommendations}
                                            /> 
                                        </>
                                    ) : (
                                        // Default output
                                        <p>Select a recommendation mode from the sidebar.</p>
                                    )}
                                </>
                            ) : (
                                setCurrentPage('Login')
                            )
                        )}
                        {currentPage === 'Login' && (
                            <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} onLogin={checkUser} />
                        )}
                        
                        {currentPage === 'Signup' && (
                            <div>
                                <Signup setCurrentPage={setCurrentPage} onSubmit={handleSignUp}/>
                            </div>
                        )}

                        {currentPage === 'Profile' && (
                            <div>
                                <Profile 
                                    user = {localStorage.username}
                                    watchedShows = {watchedShows}
                                    bookmarkedShows = {bookmarkedShows}
                                    watchedIds={watchedShowIds}
                                    bookmarkedIds={bookmarkedShowIds}
                                    onToggleList={updateShowList}
                                    onCardClick={handleOpenPopUp}
                                    onLogout={handleLogout}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
            
            {/* Render popup */}
            {popUpShow && (
                <ShowDetails 
                    show={popUpShow}
                    onClose={handleClosePopUp}
                    watchedIds={watchedShowIds}
                    bookmarkedIds={bookmarkedShowIds}
                    onToggleList={updateShowList}
                    setRating={setRating}
                    userRating={ratedShowsMap.get(String(popUpShow.tmdb_id))}
                />
            )}

            {recommendedPopUp && (
                <SourceDetails 
                    show={recommendedPopUp}
                    showsMap={showsMap}
                    onClose={handleCloseRecommendedPopUp}
                    watchedIds={watchedShowIds}
                    bookmarkedIds={bookmarkedShowIds}
                    sourceIds={sourceShowIds}
                    isWatchedList={isWatched}
                    onToggleList={updateShowList}
                    setRating={setRating}
                    userRating={ratedShowsMap.get(String(recommendedPopUp.tmdb_id))}
                    currentMode={currentMode}
                />
            )}
            
        </div>
    );
}

// Export the App component
export default App;