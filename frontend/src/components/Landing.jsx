import React, { useMemo, useState } from 'react';
import TitleCard from './TitleCard'
import { MdSearch } from 'react-icons/md';

// Landing page component
const Landing = ({shows, watchedIds, bookmarkedIds, onToggleList, onCardClick, setCurrentPage}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter shows so better shows are displayed
  const filteredShows = shows.filter(show => {
        
        const meetsRating = show.rating_avg >= 7;
        const meetsReviewCount = show.vote_count > 500;
        
        return meetsRating && meetsReviewCount
    });

  
  async function setPageToAll(){
    setCurrentPage?.('Explore');
    window.scrollTo(0, 0);
  }
  
  return (
    <section className="py-10 text-center">

      {/* <img src='/images/person-watching.jpg' alt='TV Recommender Logo' className='w-full h-1/2 mx-auto mb-6'/> */}

      {/* <h1 className="text-5xl font-bold">Welcome to TV Recommender</h1> */}

      {/* <h1 className='font-sans text-6xl font-bold mb-4 text-white'>
          Welcome to TV Recommender
      </h1> */}

      <h1 className='text-2xl font-bold mb-6 text-neutral-200'> TV Recommender</h1>
      <h2 className='text-4xl font-sans font-thin mb-6 text-stone-400'>
          Stop Scrolling. Start Watching.
      </h2>

      <div className="flex flex-col sm:flex-row items-start justify-between mb-40 mt-10 max-w-7xl mx-auto bg-neutral-800 py-10 px-10 shadow-lg">
        {/* 1. Search and Discover New Shows */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          {/* NOTE: You need to pass 'icon' and 'title' as props to the component where this is rendered */}
          <img src="/images/undraw_searching.svg" alt="Search" className="w-40 h-40 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Discover New Shows</h3>
          <p className="text-neutral-200 mb-4 font-sans">Easily search through thousands of shows with sorting and filtering.</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      
        {/* 2. Track Shows */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          <img src="/images/undraw_check.svg" alt="Track" className="w-40 h-40 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Track Shows</h3>
          <p className="text-neutral-200 font-sans">Mark and rate shows that you've watched.</p>
          <p className="text-neutral-200 mb-4 font-sans">Bookmark shows you wish to watch in the future!</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      
        {/* 3. Get Recommendations */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          <img src="/images/undraw_idea.svg" alt="Track" className="w-40 h-40 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Get Recommendations</h3>
          <p className="text-neutral-200 mb-4 font-sans">Compile lists of shows and get recommendations based on these shows.</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      </div>

      <div className='mb-10 max-w-5xl mx-auto px-4 md:px-0 text-center font-thin'>
        <h1 className='font-sans text-4xl mb-6 text-stone-400'> 
          What Shows Are Availble to You?
        </h1>
        <h2 className='font-sans font-normal text-lg text-neutral-200'>
          The data from this application comes from the TMDB API. The shows are categorized from various genres, ratings and years.
        </h2>
        {/* <h2 className='font-sans font-normal text-2xl text-neutral-200 mt-1'>
          The shows are categorized from various genres, ratings and years
        </h2> */}
      </div>

      <div className='mb-40 text-center mx-auto max-w-5xl px-4 md:px-0 bg-neutral-800 py-12 shadow-lg grid grid-cols-3 gap-8'>
  
        <div>
          <h1 className='font-sans text-4xl font-bold mb-2'> 
              7349
          </h1>
          <h2 className='font-sans text-xl font-normal text-gray-400'>
              Shows
            </h2>
        </div>

        <div>
          <h1 className='font-sans text-4xl font-bold mb-2'> 
              16
          </h1>
          <h2 className='font-sans text-xl font-normal text-gray-400 '>
              Genres of Shows
            </h2>
        </div>

        <div>
          <h1 className='font-sans text-4xl font-bold mb-2'> 
              82
          </h1>
          <h2 className='font-sans text-xl font-normal text-gray-400'>
              Years of Shows
            </h2>
        </div>

        {/* <div>
          <h1 className='font-sans text-4xl font-bold mb-1'> 
              7349
          </h1>
          <h2 className='font-sans text-xl font-normal text-gray-400'>
              Shows
          </h2>
        </div> */}
      </div>

      <div className="mt-10 max-w-5xl mx-auto">

        {/* <div className='mb-8 text-left'>
          <h1 className='font-sans-serif text-3xl font-thin'>Discover Shows</h1>
          <h1 className='font-sans-serif text-xl'>View Shows that have a minimum rating of 7 and at least 500 reviews</h1>
        </div> */}

        <div className='mb-10 text-left text-white'> 
          {/* Added text-white for explicit color */}

          {/* 1. Main Title - Big, Bold, and Attention-Grabbing */}
          <h1 className='font-sans text-2xl font-thin mb-1 text-stone-400'> 
              Find a Show
          </h1>
          
          {/* 2. Subtitle - Smaller, Lighter, and Informational */}
          
          <div className="mt-3 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <h2 className='font-sans text-3xl font-normal text-neutral-200'>
              Shows Rated 7+ with 500 or more Reviews
            </h2>
            <div className="mt-2 sm:mt-0 sm:ml-4 sm:w-20 text-right mr-4"> 
              <button
                  className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
                  onClick={() => setRefreshKey(k => k + 1)}
              >
                  Refresh
              </button>
            </div> 
          </div>
        </div>

        {/* Displaying some random shows for the users to see */}
        <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
          {useMemo(() => {
            // Picks random unique shows
            const arr = filteredShows.slice();
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.slice(0, Math.min(6, arr.length));
          }, [refreshKey]).map(show => (
            <TitleCard
              key={show.id}
              show={show}
              watchedIds={watchedIds}
              bookmarkedIds={bookmarkedIds}
              onToggleList={onToggleList}
              onCardClick={onCardClick} 
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-6 pb-6">
        <button
            onClick={setPageToAll}
            className="px-36 py-2 text-md border rounded-md bg-neutral-900 font-thin shadow-sm hover:bg-zinc-800 border-gray-300"
        >
            View All Shows 
        </button>
      </div>



      <div className="flex flex-col sm:flex-row items-start justify-between mb-8 mt-60 max-w-7xl mx-auto bg-neutral-800 py-10 px-10 shadow-lg">

        {/* 1. Search and Discover New Shows */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          {/* NOTE: You need to pass 'icon' and 'title' as props to the component where this is rendered */}
          <img src="/images/undraw_searching.svg" alt="Search" className="w-60 h-60 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Discover New Shows</h3>
          <p className="text-neutral-200 mb-4 font-sans">Easily search through thousands of shows with sorting and filtering.</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      
        {/* 2. Track Shows */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          <img src="/images/undraw_check.svg" alt="Track" className="w-60 h-60 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Track Shows</h3>
          <p className="text-neutral-200 font-sans">Mark and rate shows that you've watched.</p>
          <p className="text-neutral-200 mb-4 font-sans">Bookmark shows you wish to watch in the future!</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      
        {/* 3. Get Recommendations */}
        <div className="w-full sm:w-1/3 p-4 text-center">
          {/* 1. Icon/Image Area */}
          <img src="/images/undraw_idea.svg" alt="Track" className="w-60 h-60 mx-auto mb-8" />
          
          {/* 2. Title & Description */}
          <h3 className="text-2xl font-sans font-bold mb-6 text-white">Get Recommendations</h3>
          <p className="text-neutral-200 mb-4 font-sans">Compile lists of shows and get recommendations based on these shows.</p>
          
          {/* 3. Action Button (Optional) */}
          {/* {buttonText && (
              <a href={link} className="inline-block px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200">
                  {buttonText}
              </a>
          )} */}
        </div>
      </div>
    </section>

  );
};

export default Landing;