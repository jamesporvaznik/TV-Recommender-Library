import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from "./components/navbar";
import NavBar from "./components/Search";

// const DUMMY_SHOWS = [
//   { id: 's101', title: 'Mind Hunters', description: 'A psychological thriller following two FBI agents as they interview convicted serial killers to understand their motives.', rating: 8.6, genres: ['Crime', 'Drama', 'Thriller'], seasons: 2, posterUrl: 'https://placehold.co/300x450/1f2937/ffffff?text=Mind+Hunters', whereToWatch: 'Netflix', year: 2017 },
//   { id: 's102', title: 'The Great Game', description: 'A historical drama about the Cold War espionage that took place in Berlin during the 1970s.', rating: 7.9, genres: ['Drama', 'History', 'Thriller'], seasons: 3, posterUrl: 'https://placehold.co/300x450/1f2937/ffffff?text=The+Great+Game', whereToWatch: 'Hulu', year: 2018 },
//   { id: 's103', title: 'Cosmic Drift', description: 'An epic space opera following the last surviving humans searching for a new home after Earth\'s collapse.', rating: 9.1, genres: ['Sci-Fi', 'Action', 'Adventure'], seasons: 4, posterUrl: 'https://placehold.co/300x450/1f2937/ffffff?text=Cosmic+Drift', whereToWatch: 'Max', year: 2022 },
//   { id: 's104', title: 'Midnight Diner', description: 'A heartwarming slice-of-life series set in a late-night diner in Tokyo, focusing on the stories of its patrons.', rating: 8.8, genres: ['Drama', 'Slice of Life', 'Food'], seasons: 5, posterUrl: 'https://placehold.co/300x450/1f2937/ffffff?text=Midnight+Diner', whereToWatch: 'Netflix', year: 2016 },
// ];

// const ALL_GENRES = [...new Set(DUMMY_SHOWS.flatMap(show => show.genres))].sort();

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
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />

    </>
  )
}

export default App
