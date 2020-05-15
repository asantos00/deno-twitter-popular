const defaultPort = 8080;
const port = parseInt(Deno.env.get("PORT") as string, 10) || defaultPort;

export default {
  port,
  twitter: {
    consumerKey: Deno.env.get("TWITTER_CONSUMER_KEY"),
    consumerSecret: Deno.env.get("TWITTER_CONSUMER_SECRET"),
  },
};
