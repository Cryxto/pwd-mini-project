'use client';
import { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoPerson } from 'react-icons/go';

export function Navbar() {
  const pathname = usePathname();
  const { state, loading } = useContext(UserContext);

  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node) &&
      profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)
    ) {
      setMobileDropdownOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileLinkClick = () => {
    setMobileDropdownOpen(false);
  };

  return (
    <nav className="navbar bg-base-100 flex justify-between items-center w-full">
      <div className="navbar-start">
        <div ref={mobileDropdownRef} className="dropdown">
          <button
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            onClick={() => setMobileDropdownOpen(!isMobileDropdownOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isMobileDropdownOpen ? 'block' : 'hidden'}`}
          >
            <li>
              <Link href="/search-event" onClick={handleMobileLinkClick}>Search Event</Link>
            </li>
            <li>
              <Link href="/category" onClick={handleMobileLinkClick}>Category</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">myEvent</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/search-event" className={`${pathname === '/search-event' ? 'underline' : ''}`}>Search Event</Link>
          </li>
          <li>
            <Link href="/category" className={`${pathname === '/category' ? 'underline' : ''}`}>Category</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end hidden lg:flex">
        {loading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : !state.isSignIn ? (
          <>
            <Link href="/sign-in" className={`btn btn-ghost ${pathname === '/sign-in' ? 'btn-active' : ''}`}>Sign In</Link>
            <Link href="/sign-up" className="btn btn-neutral mx-1">Sign Up</Link>
          </>
        ) : (
          <div ref={profileDropdownRef} className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="flex flex-col justify-center items-center rounded-full">
                <GoPerson size={30} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isProfileDropdownOpen ? 'block' : 'hidden'}`}
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="navbar-end lg:hidden">
        {loading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : !state.isSignIn && (
          <div ref={profileDropdownRef} className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="flex flex-col justify-center items-center rounded-full">
                <GoPerson size={30} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isProfileDropdownOpen ? 'block' : 'hidden'}`}
            >
              <li>
                <Link href="/sign-up" className="justify-between" onClick={() => setProfileDropdownOpen(false)}>Sign Up</Link>
              </li>
              <li>
                <Link href="/sign-in" className="justify-between" onClick={() => setProfileDropdownOpen(false)}>Sign In</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
