import { UserComplete } from "@/interfaces/user.interface";

export interface UserStateInterface {
  user: UserComplete | null;
  // profile ?: UserComplete | null
  isSignIn: boolean;
}


export interface User {
  id: number;
  username: string;
  email: string;
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
  // profile : null
};
