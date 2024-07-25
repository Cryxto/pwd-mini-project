"use client"
import { ReactNode, useReducer, useState } from 'react';
import { UserContext } from './userContext';
import { userReducer } from './userReducer';
import { initialUserState } from './userAnnotation';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={{ state, dispatch, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};
