import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if accessing admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to home (or login page if you have one)
    if (!session) {
      // For now, we'll allow access without auth
      // In production, you would redirect to a login page:
      // return NextResponse.redirect(new URL('/login', req.url))
      console.warn('Admin access without authentication')
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}



