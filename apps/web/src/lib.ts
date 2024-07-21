import type { NextRequest } from 'next/server';

export async function isLogin(req: NextRequest) {
  // console.log(req.cookies);
  
  if (!req.cookies.get('auth_token') && !req.cookies.get('verification')) {
    return false;
  }
  return true;
}
