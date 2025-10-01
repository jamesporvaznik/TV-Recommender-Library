import React, { useState } from 'react';
import showsData from '../../shows.json';

// Define the functional component
function AllShows() {
  // The component's 
  // logic goes here (state, effects, handlers, etc.)
  // Return the JSX (the component's UI)

    const chunkSize = 5;
    const groupedRows = [];

    for (let i = 0; i < showsData.length; i += chunkSize) {
        // Use Array.prototype.slice() to get the chunk of 5 shows
        const chunk = showsData.slice(i, i + chunkSize);
        groupedRows.push(chunk);
    }

    return (

        <div className="all-shows-grid-container mt-10">
            {/* Produce these rows maxing out at 3 rows */}
            {groupedRows.slice(0, 3).map((row, rowIndex) => (
            // 1. Outer map: Creates one row (a div) for every chunk of 5 shows
            // Use a className that supports a 5-column grid or flex layout
            <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-8" >
            {row.map((show) => (
                // 2. Inner map: Renders a show card (article) inside the row
                <article key={show.id} className="border rounded overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                        <img src={`https://placehold.co/200x280/1f2937/ffffff?text=${encodeURIComponent(show.title)}`} alt={show.title} className="object-cover h-full w-full" />
                </div>
                <div className="p-3">
                    <h3 className="text-sm font-semibold truncate">{show.title}</h3>
                    <div className="text-xs text-gray-500">
                    {show.type}: {show.rating}
                    </div>
                </div>
                </article>
            ))}
            </div>
        ))}
        </div>
    );
}

// Export the footer
export default AllShows;


// Brainplanning on how to use  watched and bookmark logic

// have buttons for watched and bookmark for each movie/show
// on click it adds to the json file
// It will also need to change the state of the button to show that it has been added

// Another thing to remember is when i add users it will need to be added to a specific usrs watched or bookmark list
// This means that the json file or in a db will need to be structured differently
// Maybe have a users array and each user has a watched and bookmark array
// Then when a user logs in it will load their specific watched and bookmark list
