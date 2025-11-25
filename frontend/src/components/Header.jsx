import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; 

const Header = ({ 
    currentPage, setCurrentPage, isLoggedIn, onLogout
}) => {
    // Navigation items for the multi-page feel
    const NAVIGATION_PAGES = ['Explore', 'Watched', 'Watchlist', 'Recommendations'];

     const handleProfileClick = () => {
        setCurrentPage?.('Profile'); // Navigate to the placeholder Profile page
    };

    return (
        // Outer div for the navigation bar: three columns (logo | nav | auth)
        <nav className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            {/* Left: logo that navigates home - pushed to far left */}
            <div className="w-full md:w-1/6 text-left pl-4 md:pl-0">
                <button
                    aria-label="Go to home"
                    className="text-xl font-bold"
                    onClick={() => setCurrentPage?.('Home')}
                >
                    TV Recommender
                </button>
            </div>

            {/* Center: navigation buttons */}
            <div className="w-full md:w-3/5 flex justify-center">
                <div className="flex flex-wrap gap-6">
                    {NAVIGATION_PAGES.map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage?.(page)}
                            className={`
                                px-4 py-2 text-sm font-semibold rounded-lg transition 
                                shadow-sm whitespace-nowrap
                                ${
                                    currentPage === page 
                                        ? "px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-neutral-900 border-gray-300" 
                                        : 'bg-neutral-900 text-white hover:bg-zinc-800'
                                }
                            `}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: profile / login / signup */}
            <div className="w-full md:w-1/5 flex justify-end gap-2 pr-4 md:pr-0">
                {isLoggedIn ? (
                    // Profile View
                    <>
                        <button onClick={onLogout} className="ml-4 px-5 py-1 text-sm border rounded-xl bg-red-800 font-semibold shadow-sm hover:bg-red-900 border-gray-300">
                            Logout
                        </button>
                    </>
                ) : (
                    // Signup / Login Button View
                    <div className="w-full md:w-1/5 flex justify-end gap-2 pr-4 md:pr-0">
                <button
                    onClick={() => setCurrentPage?.('Login')}
                    className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"  
                >
                    Login
                </button>
                <button
                    onClick={() => setCurrentPage?.('Signup')}
                    className="px-5 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
                >
                    Signup
                </button>
            </div>
                )}
            </div>

        </nav>
    );
};

export default Header;