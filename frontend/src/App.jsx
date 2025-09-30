import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Landing from "./components/Landing";


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

function App() {

  // track the current page for Header (default to Home)
  const [currentPage, setCurrentPage] = useState('Home')

  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      {/* render the landing page for Home, otherwise placeholder pages */}
      {currentPage === 'Home' ? (
        <Landing />
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
