export interface UserStateInterface {
  user: User | null;
  isSignIn: boolean;
}

export interface User {
  id: number;
  username: string;
  referalCode: string;
  firstName: string;
  lastName: string;
  middleName: string | null | undefined;
}

export type UserActionType =
  | {
      type: 'SIGN_IN';
      payload: UserStateInterface;
    }
  | {
      type: 'INFO';
    }
  | { type: 'SIGN_OUT' };

export const initialUserState: UserStateInterface = {
  user: null,
  isSignIn: false,
};
