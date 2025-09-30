const NavBar = ({ 
    searchTerm, setSearchTerm, 
    currentPage, setCurrentPage 
}) => {
    // Navigation items for the multi-page feel (P1-T7)
    const NAVIGATION_PAGES = ['All Shows', 'Watched', 'Watchlist', 'Recommendations'];

    return (
        // Outer div for the navigation bar
        <nav className="flex flex-col sm:flex-row gap-2 mb-6">
            
            {/* Map over the array to create a button for each "page" */}
            {NAVIGATION_PAGES.map(page => (
                <button
                    key={page}
                    // When clicked, change the state in the parent App.jsx component
                    onClick={() => setCurrentPage(page)}
                    
                    // Use a JavaScript template literal for conditional styling
                    className={`
                        px-4 py-2 text-sm font-semibold rounded-lg transition 
                        shadow-sm whitespace-nowrap
                        ${
                            // If the current page matches the button name, apply INDIGO highlight
                            currentPage === page 
                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Default style
                        }
                    `}
                >
                    {page}
                </button>
            ))}
        </nav>
    );
};


export default NavBar;