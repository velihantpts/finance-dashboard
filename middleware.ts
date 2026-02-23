export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    '/',
    '/analytics/:path*',
    '/transactions/:path*',
    '/reports/:path*',
    '/risk/:path*',
    '/settings/:path*',
  ],
};
