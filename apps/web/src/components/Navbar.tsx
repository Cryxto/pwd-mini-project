'use client';
import { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GoPerson } from 'react-icons/go';
import { useTheme } from '@/stores/theme/themeProvider';
import { signOut } from '@/server.actions';  // Import the signOut function

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", 
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
  "business", "acid", "lemonade", "night", "coffee", "winter", 
  "dim", "nord", "sunset"
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter()
  const { state, dispatch, loading } = useContext(UserContext);
  const { setTheme } = useTheme();

  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLLIElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node) &&
      profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node) &&
      themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)
    ) {
      setMobileDropdownOpen(false);
      setProfileDropdownOpen(false);
      setThemeDropdownOpen(false);
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

  const handleProfileLinkClick = () => {
    setProfileDropdownOpen(false);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Optionally close the dropdown
    // setThemeDropdownOpen(false);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result) {
      dispatch({ type: 'SIGN_OUT' });
      router.refresh()
      // Optionally redirect to sign-in page or refresh
    }
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
            <li ref={themeDropdownRef}>
              <button
                tabIndex={0}
                className="btn btn-ghost w-full text-left"
                onClick={() => setThemeDropdownOpen(!isThemeDropdownOpen)}
              >
                Theme
                <svg
                  width="12px"
                  height="12px"
                  className="inline-block h-2 w-2 fill-current opacity-60 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
              </button>
              <ul
                tabIndex={0}
                className={`dropdown-content bg-base-300 rounded-box z-[1] mt-2 w-52 p-2 shadow-2xl ${isThemeDropdownOpen ? 'block' : 'hidden'} overflow-auto max-h-60`}
                style={{ columns: 2 }}
              >
                {themes.map((themeOption) => (
                  <li key={themeOption}>
                    <button
                      onClick={() => handleThemeChange(themeOption)}
                      className="btn btn-sm btn-ghost w-full text-left"
                    >
                      {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">myEvent</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/search-event" className={`btn btn-ghost w-full text-left ${pathname === '/search-event' ? 'underline' : ''}`}>Search Event</Link>
          </li>
          <li>
            <Link href="/category" className={`btn btn-ghost w-full text-left ${pathname === '/category' ? 'underline' : ''}`}>Category</Link>
          </li>
          <li ref={themeDropdownRef} className="relative">
            <button
              tabIndex={0}
              className="btn btn-ghost w-full text-left"
              onClick={() => setThemeDropdownOpen(!isThemeDropdownOpen)}
            >
              Theme
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </button>
            <ul
              tabIndex={0}
              className={`dropdown-content bg-base-300 rounded-box z-[1] absolute top-full right-0 mt-2 w-52 p-2 shadow-2xl ${isThemeDropdownOpen ? 'block' : 'hidden'} overflow-auto max-h-60`}
              style={{ columns: 2 }}
            >
              {themes.map((themeOption) => (
                <li key={themeOption}>
                  <button
                    onClick={() => handleThemeChange(themeOption)}
                    className="btn btn-sm btn-ghost w-full text-left"
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-dots loading-md"></span>
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
              {!state.isSignIn ? (
                <>
                  <li>
                    <Link href="/sign-in" className="justify-between" onClick={handleProfileLinkClick}>Sign In</Link>
                  </li>
                  <li>
                    <Link href="/sign-up" className="justify-between" onClick={handleProfileLinkClick}>Sign Up</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a className="justify-between" onClick={handleProfileLinkClick}>Profile</a>
                  </li>
                  <li>
                    <a onClick={() => {
                      handleSignOut();
                      handleProfileLinkClick();
                    }}>Sign out</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
