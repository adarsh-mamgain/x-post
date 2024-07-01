import { createSession, getSession, signJWTToken } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import TwitterApi from "twitter-api-v2";
import { v4 as uuidv4 } from "uuid";
import { APIPathname } from "@/enums";

const BASE_URL = process.env.URL ?? "http://localhost:3000";

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID ?? "",
  clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
});

const generateAuthLink = async () => {
  const result = twitterClient.generateOAuth2AuthLink(
    `${BASE_URL}${APIPathname.TWITTER_CALLBACK}`,
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
  return result;
};

const handleTwitterCallback = async (req: NextRequest) => {
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
  const loggedClient = await twitterClient.loginWithOAuth2({
    redirectUri: `${BASE_URL}${APIPathname.TWITTER_CALLBACK}`,
    codeVerifier,
    code,
  });

  const loginUser = new TwitterApi(loggedClient.accessToken);
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

  const redirectUrl = new URL(APIPathname.DASHBOARD, BASE_URL);
  return NextResponse.redirect(redirectUrl);
};

export const GET = async (req: NextRequest) => {
  switch (req.nextUrl.pathname) {
    case APIPathname.TWITTER_SIGNIN:
      return NextResponse.json(await generateAuthLink());
    case APIPathname.TWITTER_CALLBACK:
      return await handleTwitterCallback(req);
    default:
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
};
