import React, { useState, useEffect } from 'react';
import { use } from 'react';


// Define the Signup component
function Signup({user, password, confirm, setUser, setPassword, setConfirm, onSubmit, setCurrentPage}) {
    // The component's logic goes here (state, effects, handlers, etc.)
    
    // Local state used when the parent doesn't control the search term
    const [localUser, setLocalUser] = useState(user || '');
    const [localPassword, setLocalPassword] = useState(password || '');
    const [localConfirm, setLocalConfirm] = useState(confirm || '');


    // Handles username input changes
    function handleUserChange(e) {
        const v = e.target.value;
        if (typeof setUser === 'function') setUser(v);
        else setLocalUser(v);
    }
    const userTerm = typeof user === 'string' ?user : localUser;

    // Handles password input changes
    function handlePasswordChange(e) {
        const v = e.target.value;
        if (typeof setUser === 'function') setPassword(v);
        else setLocalPassword(v);
    }
    const passwordTerm = typeof password === 'string' ?password : localPassword;

     // Handles confirmed password input changes
    function handleConfirmChange(e) {
        const v = e.target.value;
        if (typeof setConfirm === 'function') setConfirm(v);
        else setLocalConfirm(v);
    }
    const confirmTerm = typeof confirm === 'string' ?confirm : localConfirm;

    //Handles form submission
    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            username: userTerm.trim(), 
            password: passwordTerm,
            confirm: confirmTerm,
        };

        if (typeof onSubmit === 'function') onSubmit(payload);
        else console.log('search payload', payload);

        // clear fields
        setLocalPassword('');
        setLocalUser('');
        setLocalConfirm('');

        setCurrentPage?.('Login'); 
    }
  

  // Render the component's UI
  return (
     <form className="w-full max-w-2xl mx-auto p-2 mt-[11vh]" onSubmit={handleSubmit}>
        {/* Title/subtitle text */}
        <div className="flex justify-between items-center px-20">
            <h1 className="text-4xl font-bold mb-6 ">Welcome</h1>
        </div>
        <div className="flex justify-between items-center px-20">
            <h2 className="text-2xl font-bold mb-6 ">Create an Account</h2>
        </div>
        {/* Username field */}
        <div className="flex sm:flex-row px-20 mt-2">
            <input
                type="text"
                value={userTerm}
                onChange={handleUserChange}
                placeholder="Enter username"
                className="bg-zinc-800 flex-1 px-3 py-3 border border-zinc-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
        </div> 
        {/* Password field */}
        <div className="flex sm:flex-row mt-8 px-20">
            <input
                type="password"
                value={passwordTerm}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className="bg-zinc-800 flex-1 px-3 py-3 border border-zinc-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
        </div>
        {/* Confirm password field */}
        <div className="flex sm:flex-row mt-8 px-20">
            <input
                type="password"
                value={confirmTerm}
                onChange={handleConfirmChange}
                placeholder="Confirm your password"
                className="bg-zinc-800 flex-1 px-3 py-3 border border-zinc-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
        </div>
        {/* Signup button */}
        <div className="flex justify-center items-center px-20 mt-8">
            <button type="submit" className="px-7 py-3 mt-2 w-full text-white text-sm border rounded-md bg-zinc-800 font-semibold shadow-sm hover:bg-zinc-800 border-zinc-800">Create Account</button>
        </div>

        {/* Login link */}
        <div className='flex justify-center text-sm mt-6 px-20'> 
            <p className='text-neutral-400'>
                Already have an account?{' '}
            </p>
            <a 
                href="#" 
                role="button"
                onClick={() => setCurrentPage?.('Login')}
                className='text-blue-500 hover:text-blue-400 ml-1 font-semibold cursor-pointer transition duration-150'
            >
                Login
            </a>
        </div>
            
     </form>
  );
}

// Export the component
export default Signup;