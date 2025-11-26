import { useState, useEffect } from 'react';

const useScreenSize = (breakpoint) => {
    const [isMobile, setIsMobile] = useState(() => {
        // Initial state check
        if (typeof window !== 'undefined') {
            return window.innerWidth < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

export default useScreenSize;