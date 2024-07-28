'use client';

import { FormEvent, useContext, useState } from 'react';
import {  signInProcess } from '@/server.actions';
import { Bounce, toast } from 'react-toastify';
import { useSafeBack } from '@/hooks';
import { UserContext } from '@/stores/user/userContext';
// import { User } from '@/stores/user/userAnnotation';
import { UserComplete } from '@/interfaces/user.interface';

export function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const safeBack = useSafeBack()
  const { dispatch } = useContext(UserContext);
  let err :  string | (()=> JSX.Element)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signInProcess({ identifier, password });
    setStatus('pending');
    if (res.ok === true) {
      toast.success('Login success!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });

      setStatus('success');

      dispatch({
        type: 'SIGN_IN',
        payload: {
          user : res.user as UserComplete,
          isSignIn: true
        }
      })
      safeBack()
      // setTimeout(() => safeBack(), 2000);
    } else {
      setStatus('fail');

      if (Array.isArray(res.error as Array<any>)) {
        err = function () {
          return (
            <ul className='ml-5 list-disc'>
              {(res.error as Array<any>).map((e: string, i:number) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          );
        };
      }

      if (typeof res.error === "string") {
        err = "Server side error, please contact web support" 
      }
      
      // console.log(err);
      
      toast.error(err, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="gap-4 flex flex-col max-w-full items-center"
      >
            <h1 className="text-xl font-bold my-2">Sign in</h1>

        <div id="input" className="w-80">
          <label className="input input-bordered flex items-center gap-2 my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              disabled={status === 'success' ? true : false}
              className="grow"
              placeholder="Username or identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              disabled={status === 'success' ? true : false}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button disabled={status==='success'?true:false} type="submit" className="btn btn-neutral btn-block" >
            Sign In
            {status === 'pending' ? (
              <span className="loading loading-spinner"></span>
            ) : status === 'success' ? (
              ' Success'
            ) : (
              ''
            )}
          </button>
        </div>
      </form>
    </>
  );
}
