import { NextResponse, NextRequest } from 'next/server';
import { isLogin } from '@/lib';

const shouldNotSignedInRoutes = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const apiKey = process.env.API_KEY!;
  
  // Handle protected routes
  if (shouldNotSignedInRoutes.includes(req.nextUrl.pathname)) {
    
    if (await isLogin(req)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Clone the request headers and append the API key
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-api-key', apiKey);

  // Create a new request with the modified headers
  const modifiedRequest = new Request(req.url, {
    headers: requestHeaders,
    method: req.method,
    body: req.body,
    redirect: req.redirect,
    signal: req.signal,
  });
  return NextResponse.next(modifiedRequest);
}
