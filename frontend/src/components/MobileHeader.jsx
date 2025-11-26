import React from 'react';
import { MdTv } from 'react-icons/md';

const MobileHeader = ({ 
    currentPage, setCurrentPage, isLoggedIn, onLogout
}) => {
    const NAVIGATION_PAGES = ['Explore', 'Watched', 'Watchlist', 'Recommendations'];

    return (
        // Parent Container
        <nav className="flex flex-col gap-3 mb-6 p-4">
            
            {/* Logo + Auth/Logout Buttons */}
            <div className="flex justify-between items-center w-full">
                
                {/* Logo (Left) */}
                <div className="flex-shrink-0">
                    <button
                        aria-label="Go to home"
                        className="text-xl font-bold flex items-center gap-2 text-white"
                        onClick={() => setCurrentPage?.('Home')}
                    >
                        <MdTv size={28} className="text-white" />
                    </button>
                </div>

                {/* Auth/Logout Buttons (Right) */}
                <div className="flex-shrink-0 flex items-center gap-3">
                    {/* Logged in View */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3"> 
                            
                            <button 
                                onClick={onLogout} 
                                className="px-3 py-1 text-sm border rounded-xl bg-red-800 font-semibold shadow-sm hover:bg-red-900 border-gray-300"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        // Logged Out View: Login / Signup
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage?.('Login')}
                                className="px-4 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300" 
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setCurrentPage?.('Signup')}
                                className="px-4 py-1 text-sm border rounded-xl bg-neutral-900 font-semibold shadow-sm hover:bg-zinc-800 border-gray-300"
                            >
                                Signup
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Links */}
            <div className="w-full flex justify-center">
                <div className="flex flex-nowrap overflow-x-auto gap-4 py-2 px-2 -mx-2"> 
                    {NAVIGATION_PAGES.map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage?.(page)}
                            className={`
                                whitespace-nowrap shrink-0 
                                px-4 py-2 text-sm font-semibold rounded-lg transition 
                                bg-neutral-900 text-white hover:bg-zinc-800
                                ${
                                    currentPage === page 
                                        ? "border border-gray-300 !py-1 !px-5" 
                                        : ''
                                }
                            `}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default MobileHeader;