// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAuth } from './src/models/Authentication/auth';

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/api/auth',
  '/verify-password-reset'
];

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const pathname = req.path;

  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '') || null;

  console.log("MIDDLEWARE TOKEN:", token);
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // 1. Handle public routes - allow access without token
  if (isPublicRoute) {
    // If user has a valid token and tries to access auth pages, redirect to dashboard
    if (token) {
      try {
        await verifyAuth(token);
        // Token is valid, redirect away from auth pages
        if (pathname.startsWith('/login') ||
            pathname.startsWith('/register') ||
            pathname.startsWith('/verify-otp')) {
          return res.status(302).redirect('/');
        }
      } catch (error) {
        // Token is invalid, but we're on a public route so allow access
        // Clear invalid token
        res.clearCookie('token');
      }
    }
    return next();
  }

  // 2. Handle protected routes
  if (!token) {
    // No token, return 401
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Verify token for protected routes
  try {
    const verified = await verifyAuth(token);

    // Add user info to req for protected routes
    (req as any).user = verified;

    next();

  } catch (error) {
    console.error('Invalid or expired token detected:', error);

    // Token is invalid, clear cookie and return 401
    res.clearCookie('token');

    return res.status(401).json({ error: 'Invalid token' });
  }
};