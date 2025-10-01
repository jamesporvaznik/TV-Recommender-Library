import { useState } from 'react'
import './App.css'
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Search from './components/Search';
import AllShows from './components/AllShows';
import Watched from './components/Watched';
import Watchlist from './components/Watchlist';

function App() {

  // track the current page for Header (default to Home)
  const [currentPage, setCurrentPage] = useState('Home')

  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      {/* render the landing page for Home, All Shows -> Search, otherwise placeholder pages */}
      {currentPage === 'Home' ? (
        <div>
          <Landing />
        </div>
      ) : currentPage === 'All Shows' ? (
        <div>
          <Search />
          <AllShows />
        </div>
      ) : currentPage === 'Watched' ? (
        <div>
          <Search />
          <Watched />
        </div>
      ) : currentPage === 'Watchlist' ? (
        <div>
          <Search />
          <Watchlist />
        </div>
      ) :(
        <main className="p-6">
          <h2 className="text-xl font-semibold">{currentPage}</h2>
          <p className="mt-2 text-gray-600">Placeholder content for {currentPage}.</p>
        </main>
      )}
      <Footer />
    </>
  )
}

export default App
