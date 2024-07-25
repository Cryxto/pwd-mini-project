'use client';

import { Dispatch, createContext } from 'react';
import { UserActionType, UserStateInterface, initialUserState } from './userAnnotation';

interface UserContextInterface {
  state: UserStateInterface;
  dispatch: Dispatch<UserActionType>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<UserContextInterface>({
  state: initialUserState,
  dispatch: () => undefined,
  loading: true,
  setLoading: () => undefined,
});
