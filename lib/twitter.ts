import TwitterApi from "twitter-api-v2";

// Create a partial client for auth links
export const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID ?? "",
  clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
});
