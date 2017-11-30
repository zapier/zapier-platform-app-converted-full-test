const basicAuth = require('./auths/basic');
const apiHeaderAuth = require('./auths/api-header');
const apiQueryAuth = require('./auths/api-query');
const sessionAuth = require('./auths/session');
const oauth2Auth = require('./auths/oauth2');

let authentication = basicAuth;

if (process.env.AUTH_TYPE) {
  if (process.env.AUTH_TYPE === 'api-header') {
    authentication = apiHeaderAuth;
  } else if (process.env.AUTH_TYPE === 'api-query') {
    authentication = apiQueryAuth;
  } else if (process.env.AUTH_TYPE === 'session') {
    authentication = sessionAuth;
  } else if (process.env.AUTH_TYPE === 'oauth2') {
    authentication = oauth2Auth;
  }
}

module.exports = authentication;
