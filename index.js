const url = require('url');

/**
 * Force HTTPS connection on any incoming requests
 *
 * @param  {Integer}  port
 * @param  {String}   hostname
 * @param  {Integer}  httpStatusCode
 * @return {Function}
 * @api    public
 */

module.exports = (port = 443, hostname, httpStatusCode = 301) => (ctx, next) => {
  if (ctx.secure) return next();

  const httpsPort = (port === 443) ? '' : `:${port}`;
  const httpsHost = hostname || url.parse(`http://${ctx.request.header.host}`).hostname;

  ctx.response.status = httpStatusCode;
  ctx.response.redirect(`https://${httpsHost}${httpsPort}${ctx.request.url}`);
};
