import React, { useState } from 'react';
import showsData from '../../watched.json';

// Define the functional component
function Watched() {
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
            // Creates one row (a div) for every chunk of 5 shows
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

// Export the component
export default Watched;
