import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Extracts the current URL path
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Instantly forces the browser to the very top left corner
        window.scrollTo(0, 0);
    }, [pathname, search]); // Re-runs every time the URL or search parameter (like ?filter=beds) changes

    // This component doesn't render any HTML, it just runs logic in the background
    return null;
};

export default ScrollToTop;