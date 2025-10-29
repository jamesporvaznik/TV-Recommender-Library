import { useState, useEffect } from 'react';
import './App.css';

// Component Imports
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Search from './components/Search';
import AllShows from './components/AllShows';
import Watched from './components/Watched';
import Watchlist from './components/Watchlist';
import Login from './components/Login';
import Signup from './components/Signup';   
import Recommendations from './components/Recommendations';
import AddedShowsList from './components/AddedShowsList';
import RecommendedShowsList from './components/RecommendedShowsList';
import ShowDetails from './components/ShowDetails';
import Profile from './components/Profile';

// Data Imports
import initialUserData from '../users.json'; 

function App() {

    // Mock user data
    const initialUser = initialUserData[0]; 

    // Routing & Filtering State
    const [currentPage, setCurrentPage] = useState('Home');
    const [filters, setFilters] = useState(null);
    const [isAddedListVisible, setIsAddedListVisible] = useState(true);
    const [popUpShow, setPopUpShow] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allShows, setAllShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedShowIds, setAddedShowIds] = useState([]);
    const [watchedShowIds, setWatchedShowIds] = useState([]);
    const [bookmarkedShowIds, setBookmarkedShowIds] = useState([]);
    const [recommendedShowIds, setRecommendedShowIds] = useState([]);

    // User Tracking State
    const [userLists, setUserLists] = useState({
        recommended: initialUser.recommendedShows || []
    });

    // Helper function to find a full show object by TMDB ID
    const getShowById = (id) => allShows.find(show => show.tmdb_id === id);


    // Get shows from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const showsResponse = await fetch('/api/shows');
                const { data: showsData } = await showsResponse.json();
                setAllShows(showsData.map(show => ({ ...show })));

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

    // Open pop up
    const handleOpenPopUp = (showData) => {
        setPopUpShow(showData);
    };

    // Close pop up
    const handleClosePopUp = () => {
        setPopUpShow(null);
    };

    // Function to show when the user is logged out
    const handleLogout = async() => {

        // try {
        //     await fetch('/api/logout', { 
        //         method: 'POST',
        //         headers: { 
        //             'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
        //         }
        //     });
        // } catch (error) {
        //     // Log the error but continue, as the local logout is still necessary
        //     console.error("Server logout failed, but clearing local storage:", error);
        // }

        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('username'); 

        setAddedShowIds([]);
        setWatchedShowIds([]);
        setBookmarkedShowIds([]);
        
        setIsLoggedIn(false);
        setCurrentPage('Home');
    };

    // Function to show when logged in
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    // Handles login submission
    const handleSignUp = async(user) => {
        try {
            const response = await fetch('/api/signup', {
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

    // Handler to receive the search payload from the Search component
    const handleSearch = (newFilters) => {
        setFilters(newFilters);
    };

    // Function that checks usr credentials against database
    const checkUser = async (user) => {
        try {
            const response = await fetch('/api/login', {
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
    
    // Function to load the users watched and bookmarked shows
    const loadData = async () => {
        const token = localStorage.userToken;

        try{
            const response = await fetch('/api/watched', { 
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

        try {
            const response = await fetch('/api/bookmarked', { 
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
    }

    // Helper function to check if a show (by title) exists in a list of shows
    // const ifExistsInList = (showTitle, listName) => {

    //     for(let i = 0; i < listName.length; i++){
    //         const show = listName[i];
    //         if(show.title.toLowerCase() === showTitle.toLowerCase()){
    //             return show.tmdb_id;
    //         }
    //     }
    //     return -1;
    // }

    // Function to add shows to the user's addedShows list
    const addToList = async (showId) => {

        const token = localStorage.userToken;

        const payload = {
            showId: showId         
        };

        try {
            const response = await fetch('/api/added', {
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
    };

    // Function to clear the user's addedShows list
    const clearAddList = async () => {

        const token = localStorage.userToken;
        console.log(token);

        try {
            const response = await fetch('/api/added', {
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

    const filteringRecommendations = async (minRating, minReviews, recommended) => {
        console.log("Filtering recommendations with:", {minRating, minReviews, recommended});

        let filteredRecommendations = [];
        for(let i = 0; i < recommended.length; ++i){

            const show = await getShowById(recommended[i]); 

            if(show && show.rating_avg !== undefined && show.vote_count !== undefined){
                if(show.rating_avg >= minRating && show.vote_count >= minReviews){
                    filteredRecommendations.push(show.tmdb_id);
                }
            }
            
            if(filteredRecommendations.length >= 10){
                break;
            }
        }

        return filteredRecommendations;

    }

    // Function to generate a recommendation list based on current filters and user lists (placeholder logic)
    const getRecommendationList = async (minRating, minReviews, isWatched) => {
        console.log("Generating recommendations with filters:", {minRating, minReviews, isWatched});

        const token = localStorage.userToken;

        try {
            const response = await fetch('/api/recommendations', {
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
                const recommended = await filteringRecommendations(minRating, minReviews, data.recommended);
                setRecommendedShowIds(recommended);
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


        // let newRecommendationIds; 
        // let updatedRecommendationIds = [];

        // if(isWatched){
        //     // Make algorithm from watched list
        //     alert("Generating recommendations based on your watched shows.");
        //     newRecommendationIds = [1, 7, 9];
            
        //     // min rating functionality
        //     for(let i = 0; i < newRecommendationIds.length; ++i){
        //         if(getShowById(newRecommendationIds[i]).rating_avg >= minRating){
        //             updatedRecommendationIds.push(newRecommendationIds[i])
        //         }
        //     }
        // }
        // else{
        //     // Make algorithm from added shows list
        //     alert("Generating recommendations based on your added shows.");
        //     newRecommendationIds = [13, 15, 29];

        //     //min rating functionality
        //     for(let i = 0; i < newRecommendationIds.length; ++i){
        //         if(getShowById(newRecommendationIds[i]).rating_avg >= minRating){
        //             updatedRecommendationIds.push(newRecommendationIds[i])
        //         }
        //     }
        // }
        // setUserLists(prevLists => ({
        //     ...prevLists,
        //     recommended: updatedRecommendationIds // Updates the userLists.recommended array
        // }));
    }

    // Function to hide the added shows list view
    const hideAddedListView = () => {
        setIsAddedListVisible(false);
    };

    // Function to show the added shows list view and get it from the database
    const toggleAddedListView = async () => {

        const token = localStorage.userToken;
        console.log(token);

        try {
            const response = await fetch('/api/added', {
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
                setIsAddedListVisible(true);
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

    // Toggle function to add/remove show IDs from watched/bookmarked lists
    const updateShowList = async (showId, listName) => {


        const token = localStorage.userToken;

        const payload = {
            showId: showId            
        };

        try {
            if(listName === 'watched'){
                const response = await fetch('/api/watched', {
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
                const response = await fetch('/api/bookmarked', {
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

    // Render the component
    return (
        <div className="flex flex-col min-h-screen">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            
            <main className="flex-grow">
                {currentPage === 'Home' ? (
                    <Landing
                        shows = {allShows}
                        watchedIds={watchedShowIds}
                        bookmarkedIds={bookmarkedShowIds}
                        onToggleList={updateShowList}
                        onCardClick={handleOpenPopUp}
                    />
                ) : (
                    <>  
                        {/* Search bar is hidden on Login/Signup & Recommendations pages */}
                        {currentPage !== 'Login' && currentPage !== 'Signup' && currentPage !== 'Recommendations' && currentPage != 'Profile' && (
                                <Search onSearch={handleSearch} />
                            )}
                        
                        {/* Page Rendering based on currentPage state */}
                        
                        {currentPage === 'All Shows' && (
                            <AllShows 
                                allShows={allShows} 
                                filters={filters} 
                                watchedIds={watchedShowIds}
                                bookmarkedIds={bookmarkedShowIds}
                                onToggleList={updateShowList}
                                onCardClick={handleOpenPopUp}
                            />
                        )}

                        {currentPage === 'Watched' && (
                            isLoggedIn ? (
                                <Watched 
                                    // Pass arguments to Watched component
                                    shows={watchedShows} 
                                    filters={filters} 
                                    watchedIds={watchedShowIds}
                                    bookmarkedIds={bookmarkedShowIds}
                                    onToggleList={updateShowList}
                                    onCardClick={handleOpenPopUp}
                                /> 
                            ) : (
                                setCurrentPage('Login')                        
                            )
                        )}

                        {currentPage === 'Watchlist' && (
                            isLoggedIn ? (
                                <Watchlist 
                                    // Pass arguments to Watched component
                                    shows={bookmarkedShows} 
                                    filters={filters} 
                                    watchedIds={watchedShowIds}
                                    bookmarkedIds={bookmarkedShowIds}
                                    onToggleList={updateShowList}
                                    onCardClick={handleOpenPopUp}
                                /> 
                            ) : (
                                setCurrentPage('Login')
                            )
                        )}
                        
                        {currentPage === 'Recommendations' && (

                            isLoggedIn ? (
                                <>
                                    <Recommendations 
                                        shows={allShows}
                                        watchedIds={watchedShowIds}
                                        onAdd={addToList}
                                        onClear={clearAddList}
                                        onView={toggleAddedListView}
                                        onHide={hideAddedListView}
                                        onGenerate={getRecommendationList}
                                    />
                                    
                                    {/* Conditional Rendering of the sub-content area */}
                                    {isAddedListVisible ? (
                                        <AddedShowsList 
                                            shows={addedShows} 
                                            watchedIds={watchedShowIds}
                                            bookmarkedIds={bookmarkedShowIds}
                                            onToggleList={updateShowList}
                                            onCardClick={handleOpenPopUp}
                                        /> 
                                    ) : (
                                        // placeholder for recommendations shows list
                                        <RecommendedShowsList 
                                            shows={recommendedShows} 
                                            watchedIds={watchedShowIds}
                                            bookmarkedIds={bookmarkedShowIds}
                                            onToggleList={updateShowList}
                                            onCardClick={handleOpenPopUp}
                                        /> 
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
                />
            )}
            
        </div>
    );
}

// Export the App component
export default App;