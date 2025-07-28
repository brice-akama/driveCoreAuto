'use client';

import { useState, useEffect } from 'react';
import { MdArrowUpward } from 'react-icons/md'; // Import the icon from React Icons

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
<button
  onClick={scrollToTop}
  className="fixed bottom-20 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
  aria-label="Back to Top"
>
  <MdArrowUpward className="h-6 w-6" />
</button>

  );
};

export default BackToTop;