import React, { useMemo, useState } from 'react';
import showsData from '../../shows.json';

// Landing page component
const Landing = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold">Welcome to TV Recommender</h1>

      <div className="mt-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-500 mx-auto">Discover shows you love</h2>
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <button
              className="px-3 py-1 text-sm font-semibold bg-gray-100 rounded"
              onClick={() => setRefreshKey(k => k + 1)}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {useMemo(() => {
            // Fisher-Yates shuffle to pick random unique shows
            const arr = showsData.slice();
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.slice(0, Math.min(5, arr.length));
          }, [refreshKey]).map(show => (
            <article key={show.id} className="border rounded overflow-hidden bg-white shadow-sm">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img src={`https://placehold.co/200x280/1f2937/ffffff?text=${encodeURIComponent(show.title)}`} alt={show.title} className="object-cover h-full w-full" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">{show.title}</h3>
                <div className="text-xs text-gray-500">Rating: {show.rating}</div>
              </div>
            </article>
          ))}
        </div>
      </div>



  {/* Two-column features section: Track (left) and Placeholder image that will be an image or infographic */}
  <div className="mt-60 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
    <div className="md:w-1/2">
      <div className="font-bold text-3xl md:text-6xl max-w-lg text-left">
        <p className="text-gray-700">
          Track and Rate Your Watchlist
        </p>
      </div>
      <div className="mt-5 font-semibold text-gray-600 max-w-md text-left">
        <p>This feature will allow you to keep track of all the shows you have watched and rate them so you remember and can find similar shows to your favorites.</p>
      </div>
    </div>

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



  {/* Two-column features section: Bookmark with image on left and text on right */}
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
        <p className="text-gray-700">
            Bookmark Shows to Watch Later
        </p>
      </div>
      <div className="mt-5 font-semibold text-gray-600 max-w-md">
        <p>This feature will allow you to keep track of the shows you want to watch next. Users will also be able to access information on the show like where they can watch it and key details</p>
      </div>
    </div>
  </div>


  {/* Two-column features section: Search (left) and Placeholder image that will be an image or infographic */}
  <div className="mt-72 max-w-5xl mx-auto px-4 md:px-0 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
    <div className="md:w-1/2">
      <div className="font-bold text-3xl md:text-6xl max-w-lg text-left">
        <p className="text-gray-700">
          Search and Discover new Shows
        </p>
      </div>
      <div className="mt-5 font-semibold text-gray-600 max-w-md text-left">
        <p>In this search feature you can filter by many key features to find new shows or search shows by name to find familiar shows</p>
      </div>
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



  {/* Two-column features section: Bookmark with image on left and text on right */}
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
        <p className="text-gray-700">
            Find New Shows with Custom Recommendations
        </p>
      </div>
      <div className="mt-5 font-semibold text-gray-600 max-w-md">
        <p>This recommendation engine takes into account key details from your favorite shows to find new shows with similarites </p>
      </div>
    </div>
  </div>
      
    </section>


  );
};

export default Landing;