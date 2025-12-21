// // middleware/authMiddleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyAuth } from '@/lib/auth';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('token')?.value;

//   // Public routes that don't require authentication
//   const publicRoutes = [
//     '/login',
//     '/register', 
//     '/forgot-password',
//     '/verify-otp',
//     '/api/auth/login',
//     '/api/auth/register'
//   ];

//   // Check if the current route is public
//   const isPublicRoute = publicRoutes.some(route => 
//     pathname === route || pathname.startsWith(route + '/')
//   );

//   // Allow access to public routes
//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // If no token and trying to access protected route, redirect to login
//   if (!token) {
//     const loginUrl = new URL('/login', request.url);
//     // Add return URL for redirecting back after login
//     loginUrl.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     // Verify the token
//     const verified = await verifyAuth(token);

//     // Add user info to headers for use in server components
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('user', JSON.stringify(verified));

//     // If user is authenticated and tries to access auth pages, redirect to dashboard
//     if (pathname === '/login' || pathname === '/register') {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     // Invalid token - clear cookie and redirect to login
//     const loginUrl = new URL('/login', request.url);
//     const response = NextResponse.redirect(loginUrl);
    
//     // Clear the invalid token
//     response.cookies.delete('token');
    
//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     '/',
    
//     // Dashboard group routes
//     '/dashboard/:path*',
    
//     // Individual protected pages
//     '/appointments/:path*',
//     '/attendance/:path*', 
//     '/inventory/:path*',
//     '/medical-records/:path*',
//     '/patients/:path*',
//     '/reports/:path*',
//     '/roles/:path*',
//     '/staff/:path*',
    
//     // API routes (except auth)
//     '/api/((?!auth).*):path*',
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
//   ],
// };



import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
 
}