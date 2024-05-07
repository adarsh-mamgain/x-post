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
      redirectUri: "http://localhost:3000/api/auth/callback/twitter",
      codeVerifier,
      code,
    });

    // console.log("Logged client:", code, state, loggedClient);
    // client.v2.me().then((response) => {
    //   console.log("Me response:", response);
    // });
    // prisma?.session.upsert({
    //   where: { id: "twitter" },
    //   update: {
    //     token: loggedClient.accessToken,
    //     tokenSecret: loggedClient.accessTokenSecret,
    //   },
    //   create: {
    //     id: "twitter",
    //     token: loggedClient.accessToken,
    //     tokenSecret: loggedClient.accessTokenSecret,
    //   },
    // });

    return NextResponse.redirect(process.env.URL || "");
  } else {
    return NextResponse.json({ message: "No action performed" });
  }
};
