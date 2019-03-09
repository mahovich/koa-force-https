/**
 * Force HTTPS connection on any incoming requests
 *
 * @param  {Integer}  port
 * @param  {String}   hostname
 * @param  {Integer}  httpStatusCode
 * @return {Function}
 * @api    public
 */

module.exports = (port, hostname, httpStatusCode = 301) => (ctx, next) => {
  if (ctx.secure) return next();

  const urlRedirect = ctx.request.URL;
  urlRedirect.protocol = 'https';
  if (port) urlRedirect.port = port;
  if (hostname) urlRedirect.hostname = hostname;

  ctx.response.status = httpStatusCode;
  ctx.response.redirect(urlRedirect.href);
};
