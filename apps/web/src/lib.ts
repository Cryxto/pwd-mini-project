import type { NextRequest } from 'next/server';
import { UserComplete } from './interfaces/user.interface';
import { decodeJwt, jwtVerify } from 'jose';
import axios from 'axios'
import { cookies } from 'next/headers';
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

export async function isLogin(req: NextRequest) {
  if (!req.cookies.get('auth_token') && !req.cookies.get('verification')) 
  {
    return false;
  }
  return true;
}

export async function getProfileForMiddleware(req: NextRequest): Promise<{
  ok: boolean;
  data?: Object | null | UserComplete 
  error?: string | null | Array<any>;
}> {
  let res: {
    ok: boolean;
    data?: Object | null | UserComplete 
    error?: string | null | Array<any>;
  } = {
    ok: false,
    data: null,
  };

  try {
    const tokenCookie = req.cookies.get('auth_token')?.value;
    // console.log('token cookue : ' + tokenCookie);
    // console.log(tokenCookie);
    
    const token = tokenCookie as unknown as string;

    // Decode the original auth_token to get its expiration time
    // const decodedToken = decodeJwt(token);
    // const expirationDate = new Date(decodedToken.exp! * 1000);

    // Get the new profile data
    const data = await axiosInstance.get(`/user/profile`, {
      withCredentials: true,
      signal: AbortSignal.timeout(8000),
      baseURL: backEndUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('data : ' + JSON.stringify(data.data.data));
    
    // Verify the new auth_token
    await jwtVerify(data.data.auth_token, jwtSecret);

    // Set the new auth_token with the same expiration time and Lax setting
    // cookies().set('auth_token', data.data.auth_token, {
    //   expires :expirationDate,
    //   httpOnly: true,
    //   sameSite : 'lax'
    // });

    // // Set the verification cookie with Strict setting
    // const verification = require('crypto').randomBytes(48).toString('base64url');
    // cookies().set('verification', verification, {
    //   expires : expirationDate,
    //   httpOnly : true,
    //   sameSite : "strict"
    // });

    res.data = data.data.data;
    res.ok = true;
  } catch (error: any) {
    res.error = error.response;
    res.ok = false;
  }

  return res;
}