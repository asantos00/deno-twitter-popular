import { ServerRequest } from "../deps.ts";

export interface RouteHandler {
  match: (url: string) => boolean;
  url: string | RegExp;
  execute: (request: ServerRequest) => Promise<void>;
}
