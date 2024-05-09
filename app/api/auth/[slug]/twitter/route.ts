import { client } from "@/lib/twitter";
import { createSession, getSession } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import prisma from "@/lib/prisma";

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
    var loginUser: TwitterApi | null = new TwitterApi(loggedClient.accessToken);
    loginUser.v2.me().then(async (res) => {
      const value = res.data;
      const some = await prisma.user.upsert({
        where: { id: value.id },
        update: {
          name: value.name,
          username: value.username,
          accessToken: loggedClient.accessToken,
          refreshToken: loggedClient.refreshToken,
          expiresIn: loggedClient.expiresIn,
          scope: loggedClient.scope,
        },
        create: {
          id: value.id,
          name: value.name,
          username: value.username,
          accessToken: loggedClient.accessToken,
          refreshToken: loggedClient.refreshToken ?? "",
          expiresIn: loggedClient.expiresIn,
          scope: loggedClient.scope,
        },
      });
    });
    loginUser = null;

    return NextResponse.redirect(process.env.URL || "");
  } else {
    return NextResponse.json({ message: "No action performed" });
  }
};
