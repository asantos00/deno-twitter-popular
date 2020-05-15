const defaultPort = 8080;
const port = parseInt(Deno.env.get("PORT") as string, 10) || defaultPort;

export default {
  port,
  twitter: {
    consumerKey: btoa(Deno.env.get("TWITTER_CONSUMER_KEY") as string),
    consumerSecret: btoa(Deno.env.get("TWITTER_CONSUMER_SECRET") as string),
  },
};
