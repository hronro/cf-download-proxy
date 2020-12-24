# CF Download Proxy

A download proxy using [Cloudflare Workers](https://workers.cloudflare.com/).

> Try it online: [https://download-proxy.zhaofengying.com](https://download-proxy.zhaofengying.com)

## How to build your own

First, you need to install [Node.js](https://nodejs.org) and [pnpm](https://pnpm.js.org).

Then install dependencies:

```sh
pnpm i
```

Finally run this command to build:

```sh
pnpm build
```

The built file is in the `dist` folder, you can upload it directly to Cloudflare Workers.
