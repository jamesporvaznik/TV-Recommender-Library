import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Search from './components/Search';

function App() {

  // track the current page for Header (default to Home)
  const [currentPage, setCurrentPage] = useState('Home')

  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      {/* render the landing page for Home, All Shows -> Search, otherwise placeholder pages */}
      {currentPage === 'Home' ? (
        <Landing />
      ) : currentPage === 'All Shows' ? (
        <Search />
      ) : currentPage === 'Watched' ? (
        <Search />
      ) : (
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
