import { useState } from 'react';
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

// Data Imports
import allShowsData from '../shows.json'; 
import initialUserData from '../users.json'; 

// Get the single fake user object from the array
const initialUser = initialUserData[0]; 

// Create the final, non-reactive list of all shows
const allShows = allShowsData.map(show => ({ ...show }));

// Helper function to find a full show object by ID
const getShowById = (id) => allShows.find(show => show.id === id);


function App() {
    // Routing & Filtering State
    const [currentPage, setCurrentPage] = useState('Home');
    const [filters, setFilters] = useState(null);
    const [isAddedListVisible, setIsAddedListVisible] = useState(true);

    // User Tracking State
    const [userLists, setUserLists] = useState({
        watched: initialUser.watched,
        bookmarked: initialUser.bookmarked,
        added: initialUser.addedShows || []
    });

    // Handler to receive the search payload from the Search component
    const handleSearch = (newFilters) => {
        setFilters(newFilters);
    };

    // Placeholder function that checks usr credentials against a single mock user
    const checkUser = (user) => {
        return user.username === initialUser.user && user.password === initialUser.password;
    }

    // Helper function to check if a show (by title) exists in a list of shows
    const ifExistsInList = (showTitle, listName) => {

        for(let i = 0; i < listName.length; i++){
            const show = listName[i];
            if(show.title.toLowerCase() === showTitle.toLowerCase()){
                return show.id;
            }
        }
        return -1;
    }

    // Function to add shows to the user's addedShows list
    const addToList =  (showId) => {
        setUserLists(prevLists => {
            const currentList = prevLists.added;   
            let updatedList;
            let showExistsId = -1;

            showExistsId = ifExistsInList(showId, allShows);

            if(showExistsId === -1){
                alert("Show not found in the all shows database.");
                return prevLists; // No changes
            }
            else{
                //checks if show is already in the added list
                if (currentList.includes(showExistsId)) {
                    // If ID exists, the added list remains unchanged
                    updatedList = currentList;
                    alert("Show already added to your list.");
                } else {
                    // If ID doesn't exist, add it to the list (mark)
                    updatedList = [...currentList, showExistsId];
                    alert("Show added to your list.");
                }
                console.log(updatedList);

                return { ...prevLists, ['added']: updatedList };
            }     
        });
    };

    // Function to clear the user's addedShows list
    const clearAddList = () => {
        setUserLists(prevLists => ({
            ...prevLists,
            added: []
        }));
        alert("Cleared your added shows list.");
    }

    // Function to generate a recommendation list based on current filters and user lists (placeholder logic)
    const getRecommendationList = (type, minRating, isWatched) => {
        console.log("Generating recommendations with filters:", {type, minRating, isWatched});
        if(isWatched){
            // Make algorithm from watched list
            const recommendations = userLists.watched
            alert("Generating recommendations based on your watched shows.");
        }
        else{
            // Make algorithm from added shows list
            const recommendations = userLists.added
            alert("Generating recommendations based on your added shows.");
        }
    }

    // Function to hide the added shows list view
    const hideAddedListView = () => {
        setIsAddedListVisible(false);
    };

    // Function to show the added shows list view
    const toggleAddedListView = () => {
        setIsAddedListVisible(true);
    };

    // Toggle function to add/remove show IDs from watched/bookmarked lists
    const updateShowList = (showId, listName) => {
        setUserLists(prevLists => {
            const currentList = prevLists[listName];
            const showExists = currentList.includes(showId);
            let updatedList;

            if (showExists) {
                // If ID exists, filter it out (remove/unmark)
                updatedList = currentList.filter(id => id !== showId);
            } else {
                // If ID doesn't exist, add it to the list (mark)
                updatedList = [...currentList, showId];
            }

            return { ...prevLists, [listName]: updatedList };
        });
    };
    
    // Data for Watched/Watchlist/Added Pages
    const watchedShows = userLists.watched.map(getShowById).filter(Boolean);
    const bookmarkedShows = userLists.bookmarked.map(getShowById).filter(Boolean);
    const addedShows = userLists.added.map(getShowById).filter(Boolean);

    // Render the component
    return (
        <div className="flex flex-col min-h-screen">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            
            <main className="flex-grow">
                {currentPage === 'Home' ? (
                    <Landing />
                ) : (
                    <>  
                        {/* Search bar is hidden on Login/Signup & Recommendations pages */}
                        {currentPage !== 'Login' && currentPage !== 'Signup' && currentPage !== 'Recommendations' && (
                                <Search onSearch={handleSearch} />
                            )}
                        
                        {/* Page Rendering based on currentPage state */}
                        
                        {currentPage === 'All Shows' && (
                            <AllShows 
                                allShows={allShows} 
                                filters={filters} 
                                watchedIds={userLists.watched}
                                bookmarkedIds={userLists.bookmarked}
                                onToggleList={updateShowList}
                            />
                        )}
                        
                        {currentPage === 'Watched' && (
                            <Watched 
                                // Pass arguments to Watched component
                                shows={watchedShows} 
                                filters={filters} 
                                watchedIds={userLists.watched}
                                bookmarkedIds={userLists.bookmarked}
                                onToggleList={updateShowList}
                            /> 
                        )}
                        
                        {currentPage === 'Watchlist' && (
                            <Watchlist 
                                // Pass arguments to Watchlist component
                                shows={bookmarkedShows} 
                                filters={filters} 
                                watchedIds={userLists.watched}
                                bookmarkedIds={userLists.bookmarked}
                                onToggleList={updateShowList}
                            /> 
                        )}
                        
                        {currentPage === 'Recommendations' && (
                            // Render Recommendations component and conditionally render AddedShowsList or a placeholder for recommendations shows list
                            <>
                                <Recommendations 
                                    shows={allShows}
                                    watchedIds={userLists.watched}
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
                                        watchedIds={userLists.watched}
                                        bookmarkedIds={userLists.bookmarked}
                                        onToggleList={updateShowList}
                                    /> 
                                ) : (
                                    // placeholder for recommendations shows list
                                    <div className="p-4 text-center text-gray-500">
                                        <p>Use the filters above and click "Get Recommendations" to see suggestions.</p>
                                        <p>Or click "View Added Shows" to see your list.</p>
                                    </div>
                                )}
                            </>
                        )}
                        {currentPage === 'Login' && (
                            <Login setCurrentPage={setCurrentPage} onLogin={checkUser} />
                        )}
                        
                        {currentPage === 'Signup' && (
                            <div>
                                <Signup setCurrentPage={setCurrentPage}/>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

// Export the App component
export default App;