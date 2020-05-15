import { ServerRequest } from "../deps.ts";

export interface RouteHandler {
  name: string;
  description: string;
  match: (url: string) => boolean;
  url: string | RegExp;
  execute: (request: ServerRequest) => Promise<void>;
}
