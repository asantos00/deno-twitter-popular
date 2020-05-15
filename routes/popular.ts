import { ServerRequest } from "../deps.ts";
import { RouteHandler } from "./types.ts";
import * as TwitterClient from "../twitter/client.ts";

export const byUser: RouteHandler = {
  name: "getPopularTweetsByUser - /:twitterHandleWithout@",
  description: "Gets 15 popular tweets from the provided handle",
  url: /\/popular\/\w+/g,
  match(url: string) {
    return !!url.match(this.url);
  },
  async execute(req: ServerRequest) {
    const [_, , handle] = req.url.split("/");
    if (!handle) {
      return req.respond({
        status: 401,
        body: "Missing username parameter in url",
      });
    }

    try {
      const searchResult = await TwitterClient.search(handle);
      return req.respond({
        status: 200,
        body: JSON.stringify(searchResult),
      });
    } catch (e) {
      return req.respond({
        status: 400,
        body: e.toString(),
      });
    }
  },
};
