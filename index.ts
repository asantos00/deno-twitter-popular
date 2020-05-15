import { serve } from "./deps.ts";
import * as PopularRoutes from "./routes/popular.ts";
import Config from "./config.ts";
import { RouteHandler } from "./routes/types.ts";

const s = serve({ port: Config.port });
console.log(`Running on port ${Config.port}`);

if (!Config.twitter.consumerKey || !Config.twitter.consumerSecret) {
  throw "Twitter client keys not found";
}

const createIndexRoute = (routes: RouteHandler[]): RouteHandler => ({
  name: "routeList - /",
  description: "Lists all the available routes",
  url: "/",
  match(url) {
    return url === this.url;
  },
  async execute(req) {
    req.respond({
      status: 200,
      body: JSON.stringify({
        routes: routes.map((r) => ({
          name: r.name,
          description: r.description,
        })),
      }),
    });
  },
});

for await (const req of s) {
  let routes: RouteHandler[] = [PopularRoutes.byUser];
  routes.unshift(createIndexRoute(routes));

  console.log(JSON.stringify({ body: req.body, url: req.url }, null, 4));
  const matchedRoute = routes.find((route) => route.match(req.url));
  console.log({ matchedRoute });
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
