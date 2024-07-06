import { APIPathname } from "@/enums";
import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

const getTwitterClient = async (accessToken: string) => {
  return new TwitterApi(accessToken);
};

const scheduleTweet = async (token: string, text: string) => {
  // Implement the logic to schedule a tweet
};

export const POST = async (req: NextRequest) => {
  console.log(req.nextUrl.pathname, req);
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  switch (req.nextUrl.pathname) {
    case APIPathname.SCHEDULE:
      console.log(req);
      if (token !== undefined) {
        const { text } = await req.json();
        const response = await scheduleTweet(token, text);
        return NextResponse.json(response);
      }
    default:
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
};
