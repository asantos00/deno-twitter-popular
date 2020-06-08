import { TweetResponse } from "../twitter/client.ts";

export function popular(handle: string): Promise<TweetResponse> {
  return fetch(`http://localhost:8080/popular/${handle}`)
    .then((res) => res.json())
    .catch(console.error);
}

export function routes(): Promise<any> {
  return fetch(`http://localhost:8080/`)
    .then((res) => res.json())
    .catch(console.error);
}
