import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/',
  '/analytics(.*)',
  '/users(.*)',
  '/documents(.*)',
  '/notifications(.*)',
  '/settings(.*)',
]);

// Define public routes (sign-in and sign-up should use custom pages)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/verify-email(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Only protect non-public routes
  if (!isPublicRoute(request) && isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

