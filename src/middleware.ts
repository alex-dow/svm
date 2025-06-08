import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	// This x-path is set to work around this limitation of nextjs:
	// https://github.com/vercel/next.js/discussions/49507
	const reqHeaders = new Headers(request.headers);
	reqHeaders.set('x-path', new URL(request.url).pathname);
	

	
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
 
	return NextResponse.next({
		request: {
			headers: reqHeaders
		}
	});
}
 
export const config = {
	matcher: ["/", "/projects/:path*"], // Specify the routes the middleware applies to
};