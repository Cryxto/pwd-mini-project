import type { NextRequest } from 'next/server';

export async function isLogin(req: NextRequest) {
  if (!req.cookies.get('auth_token') && !req.cookies.get('verification')) 
  {
    return false;
  }
  return true;
}
