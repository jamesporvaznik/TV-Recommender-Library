import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);

    // const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const API_BASE_URL = 'http://localhost:5000';

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function that checks user credentials against database
    const checkUser = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.ok && data.success) {

                // holds user credentials in localStorage
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('currentUserId', data.userId);
                localStorage.setItem('username', data.username);

                setIsLoggedIn(true);
                setUsername(data.username);
                setToken(data.token);

                // loads the users watched and bookmarked shows upon login
                // loadData();

                console.log("Login API success:", data.message);
                return true;
                
            } else {
                // Failure: Invalid credentials
                console.error("Login failed:", data.message);
                return false;
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Error during login. Please try again.");
            return false;
        }
    }

    const handleSignUp = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Signup API success:", data.message);
                return true; 
            } else {
                // Failure: Invalid credentials
                console.error("Signup failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Error during signup. Please try again.");
            return false;
        }
    };

    const onLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            username,
            token,
            checkUser, 
            onLogout, 
            handleSignUp 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);