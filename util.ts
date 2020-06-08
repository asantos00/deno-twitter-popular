import { serve, ServerRequest } from "./deps.ts";

export const runServer = async (
  handler: (req: ServerRequest) => Promise<any>
) => {
  const s = serve(":8080");

  for await (const req of s) {
    await handler(req);
    s.close();
  }
};
