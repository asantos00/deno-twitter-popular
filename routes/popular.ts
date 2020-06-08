import { ServerRequest } from "../deps.ts";
import { RouteHandler } from "./types.ts";
import Config from "../config.ts";
import * as TwitterClient from "../twitter/client.ts";

const respondWithCors = (req: ServerRequest, body: any) => {
  const headers = new Headers();
  headers.append("access-control-allow-origin", "*");
  headers.append(
    "access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Range"
  );
  return req.respond({
    ...body,
    headers,
  });
};

export const byUser: RouteHandler = {
  name: "getPopularTweetsByUser - /:twitterHandle",
  description: "Gets 15 popular tweets from the provided handle",
  url: /\/popular\/\w+/g,
  match(url: string) {
    return !!url.match(this.url);
  },
  async execute(req: ServerRequest) {
    let [_, , handle] = req.url.split("/");
    if (!handle) {
      return req.respond({
        status: 401,
        body: "Missing username parameter in url",
      });
    }

    try {
      const searchResult = await TwitterClient.search(
        {
          key: Config.twitter.consumerKey,
          secret: Config.twitter.consumerSecret,
        },
        handle
      );
      return respondWithCors(req, {
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
