import { authMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

// Check if Clerk keys are available and not placeholders
const isPlaceholder = (v?: string) => !v || v.toLowerCase().includes('placeholder');
const hasClerkKeys =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !isPlaceholder(process.env.CLERK_SECRET_KEY) &&
  !isPlaceholder(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default hasClerkKeys ? authMiddleware({
  publicRoutes: [
    '/api/uploadthing', 
    /^\/blog(\/.*)?$/, // This is the key change
    '/', '/api/webhooks(.*)'],
}) : (req: any) => {
  // If no Clerk keys or placeholder keys, just pass through without authentication
  if (process.env.NODE_ENV !== 'test') {
    console.warn('Clerk disabled (no or placeholder keys) - running without authentication');
  }
  return;
};

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
