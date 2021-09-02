# CF Download Proxy

A download proxy using [Cloudflare Workers](https://workers.cloudflare.com/).

> Try it online: [https://download-proxy.zhaofengying.com](https://download-proxy.zhaofengying.com)

> Or if you prefer using an API directly: `GET https://download-proxy.zhaofengying.com/api/download?url={ORIGINAL_FILE_URL}`

## How to build your own

> If you don't want to build it yourself, you can also download it from [GitHub Release](https://github.com/hronro/cf-download-proxy/releases).

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
