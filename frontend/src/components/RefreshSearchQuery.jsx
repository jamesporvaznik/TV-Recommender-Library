import React from 'react';
import { useState, useEffect } from 'react';


// AllShows component now receives the new user tracking props
const RefreshSearchQuery = ({onRefresh}) => {

    function Refresh(){
        if (typeof onRefresh === 'function') {
            console.log('Refreshes Search Query');
            onRefresh();
        } else {
            console.log('Refresh Button doesn\'t work!');
        }
    }

    // Render the component
    return (
        <div className="flex justify-end w-full mt-4 pr-4">
            <button className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300" onClick={Refresh}>
                Refresh Search Query
            </button>
        </div>
    );
};

// Export the component
export default RefreshSearchQuery;