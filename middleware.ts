import { auth as middleware } from '@/lib/auth';

export default middleware;

export const config = {
  matcher: ['/((?!|_next/static|_next/image|favicon.ico|node_modules).*)'],
};