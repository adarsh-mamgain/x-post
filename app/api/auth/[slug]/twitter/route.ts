import { createSession, getSession, signJWTToken } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import TwitterApi from "twitter-api-v2";
import { v4 as uuidv4 } from "uuid";

// Create a partial client for auth links
const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID ?? "",
  clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
});

export const GET = async (req: NextRequest) => {
  if (
    req.method === "GET" &&
    req.nextUrl.pathname === "/api/auth/signin/twitter"
  ) {
    const result = client.generateOAuth2AuthLink(
      `${process.env.URL}/api/auth/callback/twitter`,
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
      result.state,
      result.codeVerifier,
      new Date(Date.now() + 60 * 1000)
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

    const codeVerifier = await getSession(state);
    const loggedClient = await client.loginWithOAuth2({
      redirectUri: `${process.env.URL}/api/auth/callback/twitter`,
      codeVerifier,
      code,
    });

    // client = null;

    // Create a partial client for auth links
    var loginUser = new TwitterApi(loggedClient.accessToken);
    const newSessionId = uuidv4();
    await loginUser.v2.me().then(async (res) => {
      const value = res.data;
      const user = await prisma.user.upsert({
        where: { id: value.id },
        update: {
          name: value.name,
          username: value.username,
          accessToken: loggedClient.accessToken,
          refreshToken: loggedClient.refreshToken,
          expiresIn: loggedClient.expiresIn,
          scope: loggedClient.scope,
          sessionId: newSessionId,
        },
        create: {
          id: value.id,
          name: value.name,
          username: value.username,
          accessToken: loggedClient.accessToken,
          refreshToken: loggedClient.refreshToken ?? "",
          expiresIn: loggedClient.expiresIn,
          scope: loggedClient.scope,
          sessionId: newSessionId,
        },
      });

      const token = await signJWTToken({
        id: user.id,
        sessionId: user.sessionId,
      });
      await createSession(
        "jwt",
        token,
        new Date(Date.now() + 2 * 60 * 60 * 1000)
      );
    });

    const redirectUrl = new URL("/dashboard", process.env.URL);
    return NextResponse.redirect(redirectUrl);
  } else {
    return NextResponse.json({ message: "No action performed" });
  }
};
