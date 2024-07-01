import "server-only";
import { getSession } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";
import { APIPathname } from "./enums";

async function validateUserSession(sessionToken: string) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/user/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    return data.isValid;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionToken = await getSession("jwt");

  if (sessionToken) {
    try {
      const isValidSession = await validateUserSession(sessionToken);
      if (!isValidSession) {
        return NextResponse.redirect(new URL(APIPathname.HOME, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(APIPathname.HOME, request.url));
    }
  } else {
    return NextResponse.redirect(new URL(APIPathname.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard(.*)",
};
