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
            <button className="px-3 py-2 bg-gray-100 rounded" onClick={Refresh}>
                Refresh Search Query
            </button>
        </div>
    );
};

// Export the component
export default RefreshSearchQuery;