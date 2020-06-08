import Config from "../config.ts";

const Twitter = {
  baseUrl: "https://api.twitter.com",
  apis: {
    auth: "/oauth2/token",
    search: "/1.1/search/tweets.json",
    user_timeline:
      "/1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi",
  },
};

/**
 * The authentication response from Twitter
 */
interface TwitterAuthResponse {
  access_token: string;
  token_type: string;
}

/**
 * The required authentication params for twitter client
 */
interface AuthConfig {
  key: string;
  secret: string;
}

/**
 * The response from Twitter API
 */
export interface TweetResponse {
  statuses: Tweet[];
}

/**
 * Fields in a tweet
 */
export interface Tweet {
  created_at: Date;
  text: string;
}

let token: string = "";
const getBearerToken = async ({ key, secret }: AuthConfig) => {
  if (token !== "") {
    return token;
  }

  const keyAndSecretB64 = btoa(`${key}:${secret}`);
  try {
    const response: TwitterAuthResponse = await fetch(
      `${Twitter.baseUrl}${Twitter.apis.auth}`,
      {
        method: "POST",
        headers: new Headers([
          ["content-type", "application/x-www-form-urlencoded;charset=UTF-8"],
          ["authorization", `Basic ${keyAndSecretB64}`],
        ]),
        body: "grant_type=client_credentials",
      }
    ).then((res) => {
      if (res.status === 200) {
        return res.json();
      }

      console.error(res.json());

      throw res;
    });

    return response.access_token;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Searches for the recent tweets of the provided username that have more than 5 likes
 *
 * @param username
 */
export const search = async (
  config: AuthConfig,
  username: string
): Promise<Tweet[]> => {
  const bearerToken = await getBearerToken(config);

  const query = `(from:${username}) min_faves:5`;
  return fetch(`${Twitter.baseUrl}${Twitter.apis.search}?q=${query}`, {
    headers: new Headers([
      ["content-type", "application/json"],
      ["authorization", `Bearer ${bearerToken}`],
    ]),
  }).then((res) => res.json());
};
