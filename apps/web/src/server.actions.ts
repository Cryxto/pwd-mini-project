'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { User } from './stores/user/userAnnotation';

const backEndUrl = process.env.BACKEND_URL;
const apiKey = process.env.API_KEY!;
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers.set('x-api-key', apiKey);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export async function signInProcess({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}): Promise<{
  ok: boolean;
  user: unknown | User | null;
  error?: string | Array<any>;
}> {
  let result: {
    ok: boolean;
    user: unknown | User | null;
    error?: string | Array<any>;
  } = {
    ok: false,
    user: null,
  };
  try {
    const res = await axiosInstance.post(
      '/auth/sign-in',
      { identifier, password },
      {
        withCredentials: true,
        signal: AbortSignal.timeout(8000),
        baseURL: backEndUrl,
      },
    );
    cookies().set('auth_token', res.data.auth_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 5 * 1000,
    });
    cookies().set('verification', res.data.verification, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 5 * 1000,
    });
    console.log(res.data.auth_token);
    console.log(jwtSecret);

    const jwtRes = await jwtVerify(res.data.auth_token, jwtSecret);
    delete jwtRes.payload.iat;
    delete jwtRes.payload.exp;

    result.ok = true;
    result.user = jwtRes.payload as unknown as User;
  } catch (error: any) {
    if (error.response) {
      result.error = error.response.data.error.errors as Array<any>;
    } else {
      result.error = error.code as string;
    }
  }

  return result;
}

export const verifyToken = async (): Promise<{
  ok: boolean;
  user: unknown | User | null;
  error?: string | Array<any>;
}> => {
  let result: {
    ok: boolean;
    user: unknown | User | null;
    error?: string | Array<any>;
  } = {
    ok: false,
    user: null,
  };
  try {
    const token = cookies().get('auth_token');
    if (token) {
      const token = cookies().get('auth_token')?.value as unknown as string;

      const jwtRes = await jwtVerify(token, jwtSecret);
      result.user = jwtRes.payload as unknown as User;
      result.ok = true;
    }
  } catch (error) {
    console.error('Token verification failed', error);
    result.error = 'Token verification failed';
  }
  return result;
};

export async function signUpProceed({
  email,
  username,
  password,
  firstName,
  lastName,
  referal,
  middleName,
}: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  referal?: string;
  middleName?: string;
}): Promise<{
  ok: boolean;

  error?: string | Array<any>;
}> {
  let result: {
    ok: boolean;

    error?: string | Array<any>;
  } = {
    ok: false,
  };
  try {
    await axiosInstance.post(
      '/auth/sign-up',
      {
        email,
        username,
        password,
        firstName,
        lastName,
        referal,
        middleName,
      },
      {
        withCredentials: true,
        signal: AbortSignal.timeout(8000),
        baseURL: backEndUrl,
      },
    );
    result.ok = true;
  } catch (error: any) {
    if (error.response) {
      result.error = error.response.data.error.errors as Array<any>;
    } else {
      result.error = error.code as string;
    }
  }

  return result;
}
export async function signOut() : Promise<boolean> {
  const verify = await verifyToken()
  let status =false
  if (verify.ok) {
    cookies().delete('auth_token')
    cookies().delete('verification')
    status = true
  }
  return status
}
