# Popular tweets

This repo contains a webserver made in deno, for testing purposes. It currently fetches tweets for an username, using the twitter API.

It is made using deno webserver and has a docker image that enables it to run.

Expects a secret named `twitter` to be available with `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` defined inside of it.

`node_modules` are still included for editor support (they aren't used by deno).

This is covered by an [article series on my blog](https://alexandrempsantos.com/adventures-in-deno-land/).
