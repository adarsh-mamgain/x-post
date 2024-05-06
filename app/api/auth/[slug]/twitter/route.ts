import { client } from "@/lib/twitter";
import { createSession, getSession } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  if (
    req.method === "GET" &&
    req.nextUrl.pathname === "/api/auth/signin/twitter"
  ) {
    const result = client.generateOAuth2AuthLink(
      "http://localhost:3000/api/auth/callback/twitter",
      {
        scope: [
          "tweet.read",
          "tweet.write",
          "tweet.moderate.write",
          "users.read",
          "offline.access",
        ],
      }
    );

    await createSession(
      "codeVerifier",
      result.codeVerifier,
      Date.now() + 60 * 1000
    );
    return NextResponse.json(result);
  } else if (
    req.method === "GET" &&
    req.nextUrl.pathname === "/api/auth/callback/twitter"
  ) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const codeVerifier = await getSession("codeVerifier");
    const loggedClient = await client.loginWithOAuth2({
      redirectUri: "http://localhost:3000/api/auth/callback/twitter",
      codeVerifier,
      code,
    });

    // console.log("Logged client:", code, state, loggedClient);

    return NextResponse.redirect(process.env.URL || "");
  } else {
    return NextResponse.json({ message: "No action performed" });
  }
};
