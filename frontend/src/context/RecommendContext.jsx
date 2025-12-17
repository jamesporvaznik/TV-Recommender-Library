import React, { createContext, useContext, useState, useEffect } from 'react';
import { useShow } from './ShowContext.jsx';

const RecommendContext = createContext();

export const RecommendProvider = ({ children }) => {

    const [getShowById] = useShow();

    // const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const API_BASE_URL = 'http://localhost:5000';

    
    

    return (
        <RecommendContext.Provider value={{ 

        }}>
            {children}
        </RecommendContext.Provider>
    );
};

// Custom hook to use the Recommend context
export const useRecommend = () => useContext(RecommendContext);