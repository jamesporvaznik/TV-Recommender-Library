import { useState } from 'react'
import './App.css'
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Search from './components/Search';
import AllShows from './components/AllShows';
import Watched from './components/Watched';
import Watchlist from './components/Watchlist';
import allShowsData from '../shows.json'; 

// Pre-process data to be reactive (even if you ignore the status flags for now)
const allShows = allShowsData.map(show => ({
    ...show,
    // isWatched: false, 
    // isWatchLater: false 
}));

function App() {
    const [currentPage, setCurrentPage] = useState('Home');

    // Holds the criteria sent up by the Search component
    const [filters, setFilters] = useState(null);

    // Handler to receive the search payload from the Search component
    const handleSearch = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            
            <main className="flex-grow">
                {currentPage === 'Home' ? (
                    <Landing />
                ) : (
                    <>
                        {/* Pass the handler to receive the filters payload */}
                        <Search onSearch={handleSearch} />
                        
                        {currentPage === 'All Shows' && (
                            <AllShows 
                                allShows={allShows} 
                                filters={filters}   
                            />
                        )}
                        {currentPage === 'Watched' && (
                          <div>
                            <Search />
                            <Watched />  
                          </div>
                        )}
                        {currentPage === 'Watchlist' && (
                            <div>
                              <Search />
                              <Watchlist />  
                          </div>
                        )}
                        {currentPage === 'Recommendations' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Recommendations</h2>
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