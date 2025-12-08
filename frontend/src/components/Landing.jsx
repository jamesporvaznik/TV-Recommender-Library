import React, { useMemo, useState } from 'react';
import ShowCard from './ShowCard'
import { MdSearch } from 'react-icons/md';

// Landing page component
const Landing = ({shows, watchedIds, bookmarkedIds, onToggleList, onCardClick}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter shows so better shows are displayed
  const filteredShows = shows.filter(show => {
        
        const meetsRating = show.rating_avg >= 7;
        const meetsReviewCount = show.vote_count > 500;
        
        return meetsRating && meetsReviewCount
    });
  
  return (
    <section className="py-20 text-center">

      <h1 className="text-5xl font-bold">Welcome to TV Recommender</h1>

      <div className="mt-10 max-w-5xl mx-auto">
      
        <div className="flex flex-col sm:flex-row items-center mb-8">
          {/* 1. Placeholder Div (Balances the Button's space) */}
          <div className="hidden sm:block sm:w-20"></div> 
          
          {/* 2. The Title (Centered) */}
          <h2 className="text-xl font-semibold text-gray-400 mx-auto">
              Discover shows you love
          </h2>
          
          {/* 3. The Button Wrapper */}
          <div className="mt-2 sm:mt-0 sm:ml-4 sm:w-20 text-right mr-4"> 
              <button
                  className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
                  onClick={() => setRefreshKey(k => k + 1)}
              >
                  Refresh
              </button>
          </div>
        </div>

        {/* Displaying some random shows for the users to see */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {useMemo(() => {
            // Picks random unique shows
            const arr = filteredShows.slice();
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.slice(0, Math.min(4, arr.length));
          }, [refreshKey]).map(show => (
            <ShowCard
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

      <div className="flex flex-col sm:flex-row items-center mb-8 mt-60">

        {/*  */}
        <div className="">
          {/* 1. Icon/Image Area */}
          <img src={icon} alt={title} className="" />
          
          {/* 2. Title & Description */}
          <h3 className="">Search and Discover New Shows</h3>
          <p className="">Easily search through thousands of shows with sorting and filtering.</p>
          
          {/* 3. Action Button (Optional) */}
          {buttonText && (
            <a href={link} className="">
              {buttonText}
            </a>
          )}
        </div>
        
        {/*  */}
        <div className="">
          {/* 1. Icon/Image Area */}
          <img src={icon} alt={title} className="" />
          
          {/* 2. Title & Description */}
          <h3 className="">Track Shows</h3>
          <p className="">Mark and rate shows that you've watched. Then bookmark shows you wish to watch in the future!</p>
          
          {/* 3. Action Button (Optional) */}
          {buttonText && (
            <a href={link} className="">
              {buttonText}
            </a>
          )}
        </div>
        
        {/*  */}
        <div className="">
          {/* 1. Icon/Image Area */}
          <img src={icon} alt={title} className="" />
          
          {/* 2. Title & Description */}
          <h3 className="">Get Recommendations</h3>
          <p className="">Compile lists of shows and get recommendations based on these shows.</p>
          
          {/* 3. Action Button (Optional) */}
          {buttonText && (
            <a href={link} className="">
              {buttonText}
            </a>
          )}
        </div>
      </div>

      {/* Two col features section: Track (left) and Placeholder image (right) */}
      <div className="mt-60 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* left col */}
        <div className="md:w-1/2">
          <div className="font-bold text-3xl md:text-6xl max-w-lg text-left">
            <p className="text-white">
              Track and Rate Shows You've Watched
            </p>
          </div>
          {/* <div className="mt-5 font-semibold text-gray-400 max-w-md text-left">
            <p>This feature will allow you to keep track of all the shows you have watched and rate them so you remember and can find similar shows to your favorites.</p>
          </div> */}
        </div>
        
        {/* right col */}
        <div className="md:w-1/2 flex justify-center md:justify-end items-center">
          <div className="w-48 h-64 bg-gray-200 rounded shadow-sm overflow-hidden">
            <img
              src={`https://placehold.co/320x420/94a3b8/ffffff?text=${encodeURIComponent('Library')}`}
              alt="Bookmark placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Two col features section: Image (left) and bookmark (right) */}
      <div className="mt-72 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="md:w-1/2 flex justify-center md:justify-start items-center">
          <div className="w-48 h-64 bg-gray-200 rounded shadow-sm overflow-hidden">
            <img
              src={`https://placehold.co/320x420/94a3b8/ffffff?text=${encodeURIComponent('Bookmark')}`}
              alt="Bookmark placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col items-center md:items-end md:text-right">
          <div className="font-bold text-3xl md:text-6xl max-w-lg">
            <p className="text-white">
                Bookmark Shows to Watch Later
            </p>
          </div>
          {/* <div className="mt-5 font-semibold text-gray-400 max-w-md">
            <p>This feature will allow you to keep track of the shows you want to watch next. Users will also be able to access information on the show like where they can watch it and key details</p>
          </div> */}
        </div>
      </div>

      {/* Two col features section: Search (left) and Placeholder image (right) */}
      <div className="mt-72 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="md:w-1/2">
          <div className="font-bold text-3xl md:text-6xl max-w-lg text-left">
            <p className="text-white">
              Search and Discover new Shows
            </p>
          </div>
          {/* <div className="mt-5 font-semibold text-gray-400 max-w-md text-left">
            <p>In this search feature you can filter by many key features to find new shows or search shows by name to find familiar shows</p>
          </div> */}
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end items-center">
          <div className="w-48 h-64 bg-gray-200 rounded shadow-sm overflow-hidden">
            <img
              src={`https://placehold.co/320x420/94a3b8/ffffff?text=${encodeURIComponent('Search')}`}
              alt="Bookmark placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Two col features section: Image (left) and Recommendation System (right) */}
      <div className="mt-72 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="md:w-1/2 flex justify-center md:justify-start items-center">
          <div className="w-48 h-64 bg-gray-200 rounded shadow-sm overflow-hidden">
            <img
              src={`https://placehold.co/320x420/94a3b8/ffffff?text=${encodeURIComponent('Recommendations')}`}
              alt="Bookmark placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col items-center md:items-end md:text-right">
          <div className="font-bold text-3xl md:text-6xl max-w-lg">
            <p className="text-white">
                Find New Shows with Custom Recommendations
            </p>
          </div>
          <div className="mt-5 font-semibold text-gray-400 max-w-md">
            <p>This recommendation engine takes into account key details from your favorite shows to find new shows with similarites </p>
          </div>
        </div>
      </div>
      
    </section>

  );
};

export default Landing;