import { NextRequest, NextResponse } from 'next/server';
import { isResultsAnnounced } from './constant/constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to root route and API routes
  if (pathname === '/' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // After results are announced, block casestory and related investigation pages
  if (isResultsAnnounced()) {
    const blockedRoutes = ['/casestory', '/case', '/day', '/suspects', '/evidence'];
    if (blockedRoutes.some(route => pathname.startsWith(route))) {
      // Redirect to result page if trying to access investigation pages
      return NextResponse.redirect(new URL('/result', request.url));
    }
    // Allow /result and /verdict pages
    if (pathname === '/result' || pathname === '/verdict') {
      return NextResponse.next();
    }
  }

  // Check for wallet connection via cookies
  // Wagmi stores connection state in cookies when using cookieStorage
  const allCookies = request.cookies.getAll();
  
  // Check multiple possible cookie names
  let wagmiStoreCookie = request.cookies.get('wagmi.store');
  if (!wagmiStoreCookie) {
    // Try alternative cookie names
    wagmiStoreCookie = request.cookies.get('wagmi.wallet') || 
                      request.cookies.get('reown.appkit') ||
                      request.cookies.get('wagmi') ||
                      allCookies.find(c => c.name.includes('wagmi')) ||
                      allCookies.find(c => c.name.includes('reown')) ||
                      allCookies.find(c => c.name.includes('appkit'));
  }
  
  const isWalletConnected = checkWalletConnection(wagmiStoreCookie?.value);

  // If we found a cookie but couldn't parse connection, or no cookie found,
  // allow the request through - client-side will handle the redirect
  // This prevents infinite redirect loops when cookies aren't set yet
  if (!wagmiStoreCookie) {
    // No cookie found - allow through, client-side will check and redirect if needed
    return NextResponse.next();
  }

  // If cookie exists but wallet is not connected, redirect to home
  if (!isWalletConnected) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

/**
 * Check if wallet is connected by parsing wagmi store cookie
 * The cookie contains serialized state with accounts array
 * Handles different cookie structures from wagmi/reown
 */
function checkWalletConnection(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  try {
    // Parse the cookie value (may be URL encoded JSON)
    let decoded = cookieValue;
    try {
      decoded = decodeURIComponent(cookieValue);
    } catch {
      // If decode fails, use original value
      decoded = cookieValue;
    }

    const state = JSON.parse(decoded);

    // Wagmi v2 structure: connections are stored as a serialized Map
    // Structure: state.state.connections = { __type: "Map", value: [[key, connectionObject], ...] }
    if (state?.state?.connections) {
      const connections = state.state.connections;
      
      // Handle serialized Map structure
      if (connections.__type === 'Map' && Array.isArray(connections.value)) {
        // Iterate through Map entries: [[key, connectionObject], ...]
        for (const entry of connections.value) {
          if (Array.isArray(entry) && entry.length >= 2) {
            const connectionObject = entry[1];
            
            // Check if this connection has accounts
            if (connectionObject?.accounts && Array.isArray(connectionObject.accounts)) {
              // Check if accounts array has valid addresses
              const hasValidAccount = connectionObject.accounts.some((acc: any) => 
                acc && typeof acc === 'string' && acc.startsWith('0x')
              );
              
              if (hasValidAccount) {
                return true;
              }
            }
          }
        }
      }
    }

    // Fallback: Check for accounts in other possible locations
    const accounts = state?.state?.accounts || state?.accounts;
    if (Array.isArray(accounts) && accounts.length > 0) {
      const hasValidAccount = accounts.some((acc: any) => 
        acc && (typeof acc === 'string' && acc.startsWith('0x') || typeof acc === 'object')
      );
      if (hasValidAccount) {
        return true;
      }
    }

    // Check for current connection indicator
    if (state?.state?.current) {
      return true;
    }

    return false;
  } catch (error) {
    // If parsing fails, assume not connected
    return false;
  }
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};

