'use client';

import { useEffect, useContext } from 'react';
import { UserContext } from '@/stores/user/userContext';
import { verifyToken } from '@/server.actions';
import { User } from '@/stores/user/userAnnotation';

export const CheckAuth = () => {
  const { dispatch, setLoading } = useContext(UserContext);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const result = await verifyToken();
      if (result.ok && result.user) {
        dispatch({
          type: 'SIGN_IN',
          payload: { user: result.user as User, isSignIn: true },
        });
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
      setLoading(false); // Set loading to false after checking authentication
    };

    checkAuthStatus();
  }, [dispatch, setLoading]);

  return null; // CheckAuth does not render anything
};
