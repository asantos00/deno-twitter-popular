import * as ApiClient from "./index.ts";
import { assertEquals } from "../deps.ts";
import { runServer } from "../util.ts";

Deno.test("calls the correct url", async () => {
  runServer(async (req) => {
    assertEquals(req.url, "/popular/handle-that-doesnt-work");
    await req.respond({ body: JSON.stringify({ statuses: [] }) });
  });

  await ApiClient.popular("ampsantos0");
});

Deno.test("tries to fetch /popular API", async () => {
  const mockResponse = {
    statuses: [
      {
        created_at: new Date(2011, 0, 4),
        text: "tweet 2",
      },
      {
        created_at: new Date(2010, 0, 1),
        text: "tweet 1",
      },
    ],
  };

  runServer(async (req) => req.respond({ body: JSON.stringify(mockResponse) }));

  const res = await ApiClient.popular("ampsantos0");
  assertEquals(
    res.statuses[0].text,
    "tweet 2",
    "Responds with correct message"
  );
});

Deno.test("tries to fetch from index", async () => {
  runServer(async (req) => {
    assertEquals(req.url, "/");

    await req.respond({
      status: 200,
      body: JSON.stringify({ routes: "abcd" }),
    });
  });

  const res = await ApiClient.routes();
  assertEquals(res, { routes: "abcd" });
});
