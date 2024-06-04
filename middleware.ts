import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyJWTToken } from "@/utils/server";
import prisma from "@/lib/prisma";

export async function middleware(request: NextRequest) {
  const session = await getSession("jwt");

  if (session) {
    try {
      const validateSession = await verifyJWTToken(session);

      const sessionUser = await prisma.user.findUnique({
        where: { id: validateSession.id },
      });

      if (!(sessionUser?.sessionId === validateSession.sessionId)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If there's no session, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard(.*)",
};