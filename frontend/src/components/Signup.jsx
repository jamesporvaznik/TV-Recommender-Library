import React, { useState, useEffect } from 'react';
import { use } from 'react';


// Define the functional component
function Signup({user, password, confirm, setUser, setPassword, setConfirm, onSubmit}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localUser, setLocalUser] = useState(user || '');
    const [localPassword, setLocalPassword] = useState(password || '');
    const [localConfirm, setLocalConfirm] = useState(confirm || '');


    // Handles text input changes
    function handleUserChange(e) {
        const v = e.target.value;
        if (typeof setUser === 'function') setUser(v);
        else setLocalUser(v);
    }
    const userTerm = typeof user === 'string' ?user : localUser;

    // Handles text input changes
    function handlePasswordChange(e) {
        const v = e.target.value;
        if (typeof setUser === 'function') setPassword(v);
        else setLocalPassword(v);
    }
    const passwordTerm = typeof password === 'string' ?password : localPassword;

     // Handles text input changes
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
            q: userTerm.trim(),
            user: user === '' ? null : user,
            password: password === '' ? null : password,
            confirm: confirm === '' ? null : confirm
        };

        if (typeof onSubmit === 'function') onSubmit(payload);
        else console.log('search payload', payload);
    }
  

  // Return the JSX (the component's UI)
  return (
     <form className="w-full max-w-2xl mx-auto p-2 mt-56" onSubmit={handleSubmit}>
        {/* Search bar and clear burton */}
            <div className="flex justify-between items-center px-20">
                <h1 className="text-4xl font-bold mb-6 ">Welcome</h1>
            </div>
            <div className="flex justify-between items-center px-20">
                <h2 className="text-2xl font-bold mb-6 ">Create an Account</h2>
            </div>
            <div className="flex sm:flex-row px-20 mt-2">
                <input
                    type="search"
                    value={userTerm}
                    onChange={handleUserChange}
                    placeholder="Enter username"
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
            </div> 

            <div className="flex sm:flex-row mt-8 px-20">
                <input
                    type="search"
                    value={passwordTerm}
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            <div className="flex sm:flex-row mt-8 px-20">
                <input
                    type="search"
                    value={confirmTerm}
                    onChange={handleConfirmChange}
                    placeholder="Confirm your password"
                    className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <div className="flex justify-center items-center px-20 mt-8">
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 w-full">Login</button>
            </div>
            
     </form>
  );
}

// Export the component
export default Signup;