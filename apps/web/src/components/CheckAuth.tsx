'use client';

import { useEffect, useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';
import { getProfile, verifyToken } from '@/server.actions';
import { UserComplete } from '@/interfaces/user.interface';

export const CheckAuth = () => {
  const { state, dispatch, setLoading } = useContext(UserContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const result = await verifyToken();
      if (result.ok && result.user) {
        const profile = await getProfile()
        // console.log(profile.data);
        
        dispatch({
          type: 'SIGN_IN',
          payload: { user: profile.data as UserComplete, isSignIn: true },
        });
        // console.log(dispatch({type: 'INFO'}));
        
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
      setLoading(false); // Set loading to false after checking authentication
    };

    checkAuthStatus();
  }, [dispatch, setLoading]);

  return null; // CheckAuth does not render anything
};
