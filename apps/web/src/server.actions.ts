'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { decodeJwt, jwtVerify } from 'jose';
import { User } from './stores/user/userAnnotation';
import {
  EventInterface,
  EventTransactionResult,
} from './interfaces/event.interface';
import { UserComplete } from './interfaces/user.interface';

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
  user: unknown | User | null | UserComplete;
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
    // console.log(res.data.auth_token);
    // console.log(jwtSecret);

    const jwtRes = await jwtVerify(res.data.auth_token, jwtSecret);
    delete jwtRes.payload.iat;
    delete jwtRes.payload.exp;

    result.ok = true;
    result.user = (await getProfile()).data as UserComplete;
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
      // console.log(jwtRes);

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
export async function signOut(): Promise<boolean> {
  const verify = await verifyToken();
  let status = false;
  if (verify.ok) {
    cookies().delete('auth_token');
    cookies().delete('verification');
    status = true;
  }
  return status;
}

export async function getAllEvent(): Promise<{
  ok: boolean;
  data?: Array<any> | null | { data: EventInterface };
  error?: string | null | Array<any>;
}> {
  let res: {
    ok: boolean;
    data?: Array<any> | null;
    error?: string | null | Array<any>;
  } = {
    ok: false,
    data: null,
  };
  try {
    const token = cookies().get('auth_token')?.value as unknown as string;
    let theHeader = {};
    if (token) {
      theHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    const data = await axiosInstance.get('/event', {
      withCredentials: true,
      signal: AbortSignal.timeout(8000),
      baseURL: backEndUrl,
      ...(token?theHeader: {})
    });
    res.data = data.data.data.data;
    res.ok = true;
  } catch (error: any) {
    res.error = error.response;
    res.ok = false;
  }
  return res;
}

export async function getSingleEvent(slug: string): Promise<{
  ok: boolean;
  data?: Object | null | { data: EventInterface };
  error?: string | null | Array<any>;
}> {
  let res: {
    ok: boolean;
    data?: Object | null | { data: EventInterface };
    error?: string | null | Array<any>;
  } = {
    ok: false,
    data: null,
  };
  try {
    if (!slug || slug === undefined || slug === '') {
      res.ok = false;
      res.data = null;
      return res;
    }
    const token = cookies().get('auth_token')?.value as unknown as string;

    const data = await axiosInstance.get(`/event/${slug}`, {
      withCredentials: true,
      signal: AbortSignal.timeout(8000),
      baseURL: backEndUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.data = data.data.data.data;
    res.ok = true;
  } catch (error: any) {
    res.error = error.response;
    res.ok = false;
  }
  return res;
}

export async function getProfile(): Promise<{
  ok: boolean;
  data?: Object | null | { data: UserComplete };
  error?: string | null | Array<any>;
}> {
  let res: {
    ok: boolean;
    data?: Object | null | { data: UserComplete };
    error?: string | null | Array<any>;
  } = {
    ok: false,
    data: null,
  };

  try {
    const tokenCookie = cookies().get('auth_token');
    const token = tokenCookie?.value as unknown as string;

    // Decode the original auth_token to get its expiration time
    const decodedToken = decodeJwt(token);
    const expirationDate = new Date(decodedToken.exp! * 1000);

    // Get the new profile data
    const data = await axiosInstance.get(`/user/profile`, {
      withCredentials: true,
      signal: AbortSignal.timeout(8000),
      baseURL: backEndUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verify the new auth_token
    await jwtVerify(data.data.auth_token, jwtSecret);

    // Set the new auth_token with the same expiration time and Lax setting
    cookies().set('auth_token', data.data.auth_token, {
      expires :expirationDate,
      httpOnly: true,
      sameSite : 'lax'
    });

    // Set the verification cookie with Strict setting
    const verification = require('crypto').randomBytes(48).toString('base64url');
    cookies().set('verification', verification, {
      expires : expirationDate,
      httpOnly : true,
      sameSite : "strict"
    });

    res.data = data.data.data;
    res.ok = true;
  } catch (error: any) {
    res.error = error.response;
    res.ok = false;
  }

  return res;
}

export async function makeTransaction({
  usersCouponId,
  usePoint,
  eventId,
  paymentDate,
}: {
  usersCouponId?: number;
  usePoint: boolean;
  eventId: number;
  paymentDate: Date;
}): Promise<{
  ok: boolean;
  data?: Object | null;
  error?: string | null | Array<any>;
}> {
  let data: {
    ok: boolean;
    data?: Object | null | EventTransactionResult;
    error?: string | null | Array<any>;
  } = {
    ok: false,
    data: null,
  };
  try {
    // console.log({
    //   usersCouponId,
    //   usePoint,
    //   eventId,
    //   paymentDate,
    // });

    const token = cookies().get('auth_token')?.value as unknown as string;
    let res = await axiosInstance.post(
      '/event/transaction',
      {
        usersCouponId,
        usePoint,
        eventId,
        paymentDate,
      },
      {
        withCredentials: true,
        signal: AbortSignal.timeout(8000),
        baseURL: backEndUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log(res);

    data.data = res.data.data as EventTransactionResult;
    data.ok = true;
  } catch (error: any) {
    data.ok = false;
    // console.log(error.response.status);

    data.error = error.response.status;
    // console.log(JSON.stringify(error));
    // return data;
  }
  return data;
}
