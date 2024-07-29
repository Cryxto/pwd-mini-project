import { NextResponse, NextRequest } from 'next/server';
import { getProfileForMiddleware, isLogin } from '@/lib';
import {
  getSingleEvent,
  signOut,
  verifyToken,
} from './server.actions';
import { UserComplete } from './interfaces/user.interface';
import { EventInterface } from './interfaces/event.interface';

const shouldNotSignedInRoutes = ['/sign-in', '/sign-up'];
const shouldSignedInRoutes = ['/profile','/admin', '/admin/dashboard','/event/checkout'];

export async function middleware(req: NextRequest) {
  const apiKey = process.env.API_KEY!;

  // Handle protected routes
  if (shouldNotSignedInRoutes.includes(req.nextUrl.pathname)) {
    if (await isLogin(req)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  if (shouldSignedInRoutes.includes(req.nextUrl.pathname)) {
    if (!await isLogin(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/event/checkout')) {
    if (!(await verifyToken()).ok) {
      await signOut();
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    if (!(await isLogin(req))) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    const userProfile = (await getProfileForMiddleware(req)).data as UserComplete
    const getCurrentEvent = (await getSingleEvent(req.nextUrl.pathname.replace('/event/checkout/',''))).data as EventInterface;
    if (userProfile) {
      const isRelatedTransactionExist = userProfile.EventTransaction.filter(
        (e) => e.eventId === getCurrentEvent.id,
      );
      if (isRelatedTransactionExist.length>0) {
        return NextResponse.redirect(new URL('/event', req.url));
      }
    }
  }
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const userProfile = (await getProfileForMiddleware(req)).data as UserComplete
    if (userProfile.Organization.length === 0) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (!userProfile.Organization[0].approvedAt) {
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
  NextResponse.next(modifiedRequest);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
