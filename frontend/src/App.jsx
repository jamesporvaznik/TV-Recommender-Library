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

    // User Tracking State (The Source of Truth)
    const [userLists, setUserLists] = useState({
        watched: initialUser.watched,
        bookmarked: initialUser.bookmarked,
    });

    // Handler to receive the search payload from the Search component
    const handleSearch = (newFilters) => {
        setFilters(newFilters);
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
    
    // Data for Watched/Watchlist Pages
    const watchedShows = userLists.watched.map(getShowById).filter(Boolean);
    const bookmarkedShows = userLists.bookmarked.map(getShowById).filter(Boolean);

    // Render the component
    return (
        <div className="flex flex-col min-h-screen">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            
            <main className="flex-grow">
                {currentPage === 'Home' ? (
                    <Landing />
                ) : (
                    <>
                        {/* Search component appears on all content pages (except Home) */}
                        <Search onSearch={handleSearch} />
                        
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
                                // Pass the filtered list of watched shows
                                shows={watchedShows} 
                                filters={filters} 
                                watchedIds={userLists.watched}
                                bookmarkedIds={userLists.bookmarked}
                                onToggleList={updateShowList}
                            /> 
                        )}
                        
                        {currentPage === 'Watchlist' && (
                            <Watchlist 
                                // Pass the filtered list of bookmarked shows
                                shows={bookmarkedShows} 
                                filters={filters} 
                                watchedIds={userLists.watched}
                                bookmarkedIds={userLists.bookmarked}
                                onToggleList={updateShowList}
                            /> 
                        )}
                        
                        {currentPage === 'Recommendations' && (
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold">Recommendations</h2>
                                <p className="mt-2 text-gray-600">Placeholder content for Recommendations.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
            
            <Footer />
        </div>
    );
}

export default App;