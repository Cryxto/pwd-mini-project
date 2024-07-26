'use client';
import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';

export const Header = () => {
  const [scrollState, setScrollState] = useState<boolean>(false);

  useEffect(() => {
    function handleScrollState() {
      if (window.scrollY > 110 || window.pageYOffset > 110) {
        setScrollState(true);
      } else {
        setScrollState(false);
      }
    }

    window.addEventListener("scroll", handleScrollState);
    return () => {
      window.removeEventListener("scroll", handleScrollState);
    };
  }, []);

  return (
    <header className={`bg-base-100 text-base-content sticky top-0 z-30 flex h-16 max-w-full w-full justify-center bg-opacity-80 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] ${scrollState ? 'shadow-sm' : ''}`}>
      <Navbar />
    </header>
  );
};
