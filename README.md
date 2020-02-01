# koa-force-https &middot; [![npm version](https://img.shields.io/npm/v/koa-force-https.svg?style=flat)](https://www.npmjs.com/package/koa-force-https) [![minzipped size](https://img.shields.io/bundlephobia/minzip/koa-force-https.svg?label=gzip%20size)](https://bundlephobia.com/result?p=koa-force-https)

[Koa.js](https://koajs.com/) middleware to force HTTPS connection on any incoming requests. In case of a non-encrypted HTTP request, `koa-force-https` automatically redirects to an HTTPS address.

## Requirements

- Koa@2+
- Node@6.13+

## Installation

```sh
npm install koa-force-https --save
```

## Options

| Name             | Type    | Default     | Description                                                    |
|------------------|---------|-------------|----------------------------------------------------------------|
| `port`           | Integer |             | HTTPS port (port `:443` is automatically removed from the URL) |
| `hostname`       | String  | `same host` | Hostname for redirect                                          |
| `httpStatusCode` | Integer | `301`       | HTTP status code for redirect                                  |

## Usage

```js
const Koa = require('koa');
const forceHTTPS = require('koa-force-https');

const app = new Koa();

app.use(forceHTTPS());
```

## Examples

### Redirect requests from `http` to `https`

```js
const fs = require('fs');
const http = require('http');
const https = require('https');
const Koa = require('koa');
const forceHTTPS = require('koa-force-https');

const options = {
  key: fs.readFileSync('ssl-certificate.key'),
  cert: fs.readFileSync('ssl-certificate.crt')
}

const app = new Koa();

app.use(forceHTTPS());

app.use((ctx) => {
  ctx.body = 'Hello! This is an HTTPS connection.';
});

// Runs 2 servers for the application
// Requests from the HTTP server will be redirected to the HTTPS server
http.createServer(app.callback()).listen(80);
https.createServer(options, app.callback()).listen(443);
```

#### Some results requests for this example

| Request URL                    | Status Code | Location                        |
|--------------------------------|-------------|---------------------------------|
| `http://example.com`           | `301`       | `https://example.com/`          |
| `http://www.example.com`       | `301`       | `https://www.example.com/`      |
| `http://www.example.com/news`  | `301`       | `https://www.example.com/news`  |
| `http://www.example.com/?id=1` | `301`       | `https://www.example.com/?id=1` |
| `http://example.com/news?id=1` | `301`       | `https://example.com/news?id=1` |
| `https://example.com`          | `200`       | *no redirect*                   |
| `https://www.example.com`      | `200`       | *no redirect*                   |

### Redirect requests from `http` to `https` (using HTTP/2 protocol) to hostname `example.com` using the HTTP status code `307` ("307 Temporary Redirect")

```js
const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const Koa = require('koa');
const forceHTTPS = require('koa-force-https');

const options = {
  key: fs.readFileSync('ssl-certificate.key'),
  cert: fs.readFileSync('ssl-certificate.crt')
}

const app = new Koa();

app.use(forceHTTPS(undefined, 'example.com', 307));

app.use((ctx) => {
  ctx.body = 'Hello! This is an HTTPS connection using HTTP/2 protocol.';
});

http.createServer(app.callback()).listen(80);
http2.createSecureServer(options, app.callback()).listen(443);
```

#### Results requests for this example

| Request URL                    | Status Code | Location                        |
|--------------------------------|-------------|---------------------------------|
| `http://example.com`           | `307`       | `https://example.com/`          |
| `http://www.example.com`       | `307`       | `https://example.com/`          |
| `http://www.example.com/news`  | `307`       | `https://example.com/news`      |
| `http://www.example.com/?id=1` | `307`       | `https://example.com/?id=1`     |
| `http://example.com/news?id=1` | `307`       | `https://example.com/news?id=1` |
| `https://example.com`          | `200`       | *no redirect*                   |
| `https://www.example.com`      | `200`       | *no redirect*                   |

## License

`koa-force-https` is [MIT licensed](https://github.com/mahovich/koa-force-https/blob/master/LICENSE).
