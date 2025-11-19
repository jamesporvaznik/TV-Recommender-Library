import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import ShowCard from './ShowCard';

// Function to group shows into rows of 5
const groupIntoRows = (shows, chunkSize = 5) => {
    const groupedRows = [];
    for (let i = 0; i < shows.length; i += chunkSize) {
        groupedRows.push(shows.slice(i, i + chunkSize));
    }
    return groupedRows;
};

// Define the login component
function Profile({user, watchedShows, bookmarkedShows, watchedIds, bookmarkedIds, onToggleList, onCardClick, onLogout}) {
    // The component's logic goes here (state, effects, handlers, etc.)
    const groupedRowsWatched = groupIntoRows(watchedShows);
    const groupedRowsBookmarked = groupIntoRows(bookmarkedShows);
    const [activeList, setActiveList] = useState('WATCHED');

    // Local state used when the parent doesn't control the search term
    
    // Renders the component's UI
    return (
        <>
            <div className = "flex justify-center items-center w-full h-full mt-14">
                <FaUserCircle
                    className="w-[15rem] h-[15rem] cursor-pointer"
                />
            </div>



            <div className="flex items-center justify-between gap-3 mt-2 mb-2 flex-wrap">

                <div><p></p></div>

                <p className="text-3xl font-bold">{user}</p>

                <button onClick={onLogout} className="ml-4 px-5 py-1 text-sm border rounded-xl bg-red-800 font-semibold shadow-sm hover:bg-red-900 border-gray-300">
                    Logout
                </button>
            </div>




            {/* <div className ="flex justify-center text-3xl font-bold mt-5">
                <p>{user}</p>
                <button onClick={onLogout} className="ml-4 px-5 py-1 text-sm border rounded-xl bg-red-800 font-semibold shadow-sm hover:bg-red-900 border-gray-300">
                    Logout
                </button>
            </div> */}

            {/* Toggle buttons to show watched or bookmarked shows */}
            <div className="space-x-4 mt-20 mb-12 mx-0 text-left">
                <button
                    onClick={() => setActiveList('WATCHED')}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                        activeList === 'WATCHED' 
                            ? "px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-neutral-900 border-gray-300" 
                            : 'bg-neutral-900 text-white hover:bg-zinc-800'
                    }`}
                >
                    Watched Shows
                </button>
                <button
                    onClick={() => setActiveList('BOOKMARKED')}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                        activeList === 'BOOKMARKED' 
                            ? "px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-neutral-900 border-gray-300" 
                            : 'bg-neutral-900 text-white hover:bg-zinc-800'
                    }`}
                >
                    Bookmarked Shows
                </button>
            </div>

            {/* Show Watched Shows */}
            {activeList === 'WATCHED' && (
                <div className="show-list-wrapper">

                    {watchedShows.length === 0 && (
                        <p className="text-gray-500">You haven't marked any shows as watched yet.</p>
                    )}

                    {groupedRowsWatched.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {row.map((show) => (
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
                    ))}
                </div>
            )}

            {/* Show bookmarked shows */}
            {activeList === 'BOOKMARKED' && (
                <div className="show-list-wrapper mt-8 mb-16">

                    {bookmarkedShows.length === 0 && (
                        <p className="text-gray-500">You haven't bookmarked any shows yet.</p>
                    )}

                    {groupedRowsBookmarked.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                            {row.map((show) => (
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
                    ))}
                </div>
            )}
        </>
    );
}

// Export the component
export default Profile;