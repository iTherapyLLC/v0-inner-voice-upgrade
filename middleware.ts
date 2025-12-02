import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/api")

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for beta access cookie
  const betaAccess = request.cookies.get("beta_access")

  console.log("[v0] Middleware check - Path:", pathname, "Has cookie:", !!betaAccess?.value)

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
     * Match all paths including root "/" except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - static assets
     */
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
}
