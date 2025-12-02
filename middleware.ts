import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = ["/login", "/api"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for beta access cookie
  const betaAccess = request.cookies.get("beta_access")

  if (!betaAccess?.value) {
    // Redirect to login if no access
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
