'use client';
import { useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoPerson } from 'react-icons/go';

export function Navbar() {
  const pathname = usePathname();
  const { state, loading } = useContext(UserContext);

  return (
    <nav className="navbar px-12 justify-between">
      <div className="flex-none">
        <Link href="/" className="hover:underline font-bold text-2xl mr-5">
          myEvent
        </Link>
        <Link
          href="/search-event"
          className={`hover:underline font-bold mx-5 ${pathname === '/search-event' ? 'underline' : ''}`}
        >
          Search Event
        </Link>
        <Link
          href="/category"
          className={`hover:underline font-bold mx-5 ${pathname === '/category' ? 'underline' : ''}`}
        >
          Category
        </Link>
      </div>
      <div className="flex-none">
        {loading ? (
          // <span className="loading loading-spinner loading-md"></span> // Display a loading spinner while loading
          <span className="loading loading-dots loading-md"></span>
        ) : !state.isSignIn ? (
          <>
            <div className="btn btn-neutral mx-1">
              <Link href="/sign-up">Sign Up</Link>
            </div>
            <div
              className={`btn btn-ghost ${pathname === '/sign-in' ? 'btn-active' : ''}`}
            >
              <Link href="/sign-in">Sign In</Link>
            </div>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="flex flex-col justify-center items-center rounded-full">
                <GoPerson size={30} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
    </nav>
  );
}
