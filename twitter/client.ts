import Config from "../config.ts";

const Twitter = {
  consumerKey: Config.twitter.consumerKey,
  consumerSecret: Config.twitter.consumerSecret,
  baseUrl: "https://api.twitter.com",
  apis: {
    auth: "/oauth2/token",
    search: "/1.1/search/tweets.json",
    user_timeline:
      "/1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi",
  },
};

interface TwitterAuthResponse {
  access_token: string;
  token_type: string;
}

console.log("Loaded with configs", Twitter.consumerKey, Twitter.consumerSecret);

let token: string = "";
const getBearerToken = async () => {
  if (token !== "") {
    return token;
  }

  const keyAndSecretB65 = btoa(
    `${Twitter.consumerKey}:${Twitter.consumerSecret}`,
  );
  try {
    const response: TwitterAuthResponse = await fetch(
      `${Twitter.baseUrl}${Twitter.apis.auth}`,
      {
        method: "POST",
        headers: new Headers([
          ["content-type", "application/x-www-form-urlencoded;charset=UTF-8"],
          ["authorization", `Basic ${keyAndSecretB65}`],
        ]),
        body: "grant_type=client_credentials",
      },
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }

        console.error(res);

        throw res;
      });

    return response.access_token;
  } catch (e) {
    console.error(e);
  }
};

export const search = async (username: string) => {
  const bearerToken = await getBearerToken();

  if (!bearerToken) {
    return Promise.reject("Couldn't get token");
  }

  const query = `(from:${username}) min_faves:5`;
  return fetch(
    `${Twitter.baseUrl}${Twitter.apis.search}?q=${query}`,
    {
      headers: new Headers([
        ["content-type", "application/json"],
        ["authorization", `Bearer ${bearerToken}`],
      ]),
    },
  )
    .then((res) => res.json());
};
