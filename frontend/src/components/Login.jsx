import React, { useState, useEffect } from 'react';

// Define the login component
function Login({user, password, setUser, setPassword, onLoginSuccess, onLogin, setCurrentPage}) {
    // The component's logic goes here (state, effects, handlers, etc.)

    // Local state used when the parent doesn't control the search term
    const [localUser, setLocalUser] = useState(user || '');
    const [localPassword, setLocalPassword] = useState(password || '');

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
        if (typeof setPassword === 'function') setPassword(v);
        else setLocalPassword(v);
    }
    const passwordTerm = typeof password === 'string' ?password : localPassword;

    //Handles form submission
    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            username: userTerm.trim(), 
            password: passwordTerm,
        };

        if (typeof onLogin === 'function') {

            const loginSuccess = await onLogin(payload);

            if(loginSuccess === true){
                alert("Sucessful login");
                onLoginSuccess();
                setCurrentPage?.('Home');
            }
            else{
                alert("Invalid username or password");
            }
        }
        else console.log('search payload', payload);

        // clear fields
        setLocalPassword('');
        setLocalUser('');
    }
  

  // Renders the component's UI
  return (
     <form className="w-full max-w-2xl mx-auto p-2 mt-48" onSubmit={handleSubmit}>
        {/* Title/subtitle text */}
        <div className="flex justify-between items-center px-20">
            <h1 className="text-4xl font-bold mb-6 ">Welcome Back</h1>
        </div>
        <div className="flex justify-between items-center px-20">
            <h2 className="text-2xl font-bold mb-6 ">Sign in</h2>
        </div>
        {/* Username field */}
        <div className="flex sm:flex-row px-20 mt-2">
            <input
                type="text"
                value={userTerm}
                onChange={handleUserChange}
                placeholder="Enter username"
                className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
        </div> 
        {/* Password field */}
        <div className="flex sm:flex-row mt-8 px-20">
            <input
                type="password"
                value={passwordTerm}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
        </div>
        {/* Login button */}
        <div className="flex justify-center items-center px-20 mt-8">
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 w-full">Login</button>
        </div>
            
     </form>
  );
}

// Export the component
export default Login;