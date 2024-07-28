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

export async function middleware(req: NextRequest) {
  const apiKey = process.env.API_KEY!;

  // Handle protected routes
  if (shouldNotSignedInRoutes.includes(req.nextUrl.pathname)) {
    if (await isLogin(req)) {
      return NextResponse.redirect(new URL('/', req.url));
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
    // const param = useParams<{ slug: string }>();

    // const getCurrentEvent = req.nextUrl.pathname
    const getCurrentEvent = (await getSingleEvent(req.nextUrl.pathname.replace('/event/checkout/',''))).data as EventInterface;
    // console.log(req.nextUrl.pathname.replace('/event/checkout/',''));
    // console.log('get current event : '+getCurrentEvent.id);
    // console.log('weasd');
    // console.log(userProfile);
    
    
    
    // console.log('user profle  user profle user profle user profle : ');
    // console.log('user profle  user profle user profle user profle : ' + JSON.stringify(userProfile));
    
    // const getCurrentEvent = (await getSingleEvent(param.slug)).data as EventInterface;
    if (userProfile) {
      const isRelatedTransactionExist = userProfile.EventTransaction.filter(
        (e) => e.eventId === getCurrentEvent.id,
      );
      // console.log('isRelatedTransactionExist : ');
      
      // console.log(isRelatedTransactionExist);
      
      if (isRelatedTransactionExist.length>0) {
        return NextResponse.redirect(new URL('/event', req.url));
      }
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
