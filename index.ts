import { serve } from "./deps.ts";
import * as PopularRoutes from "./routes/popular.ts";
import Config from "./config.ts";
import { RouteHandler } from "./routes/types.ts";

const s = serve({ port: Config.port });
console.log(`Running on port ${Config.port}`);

if (!Config.twitter.consumerKey || !Config.twitter.consumerSecret) {
  throw "Twitter client keys not found";
}

for await (const req of s) {
  const routes: RouteHandler[] = [PopularRoutes.byUser];

  const matchedRoute = routes.find((route) => route.match(req.url));
  if (matchedRoute) {
    try {
      await matchedRoute.execute(req);
    } catch (e) {
      console.error("error running route", matchedRoute.url, e);

      req.respond({ status: 500 });
    }
  } else {
    req.respond({ status: 404 });
  }
}
