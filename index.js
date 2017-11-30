const authentication = require('./authentication');

const preTrigger = require('./triggers/pre');
const postTrigger = require('./triggers/post');
const fullTrigger = require('./triggers/full');
const asyncTrigger = require('./triggers/async');
const haltedTrigger = require('./triggers/halted');
const stopTrigger = require('./triggers/stop');
const hookTrigger = require('./triggers/hook');
const preHookTrigger = require('./triggers/hook-pre');
const postHookTrigger = require('./triggers/hook-post');
const fieldsTrigger = require('./triggers/fields');

const preCreate = require('./creates/pre');
const postCreate = require('./creates/post');
const fullCreate = require('./creates/full');
const asyncCreate = require('./creates/async');
const haltedCreate = require('./creates/halted');
const stopCreate = require('./creates/stop');
const fieldsCreate = require('./creates/fields');
const fieldsFullCreate = require('./creates/fields-full');

const preSearch = require('./searches/pre');
const postSearch = require('./searches/post');
const fullSearch = require('./searches/full');
const asyncSearch = require('./searches/async');
const haltedSearch = require('./searches/halted');
const stopSearch = require('./searches/stop');
const fieldsSearch = require('./searches/fields');
const fieldsFullSearch = require('./searches/fields-full');
const preResourcePreSearch = require('./searches/pre-resource-pre');
const postResourcePreSearch = require('./searches/post-resource-pre');
const fullResourcePreSearch = require('./searches/full-resource-pre');
const preResourcePostSearch = require('./searches/pre-resource-post');
const postResourcePostSearch = require('./searches/post-resource-post');
const fullResourcePostSearch = require('./searches/full-resource-post');
const preResourceFullSearch = require('./searches/pre-resource-full');
const postResourceFullSearch = require('./searches/post-resource-full');
const fullResourceFullSearch = require('./searches/full-resource-full');
const fullResourceAsyncSearch = require('./searches/full-resource-async');

const maybeIncludeAuth = (request, z, bundle) => {
  if (process.env.AUTH_TYPE) {
    if (bundle.authData.apiKey) {
      if (process.env.AUTH_TYPE === 'api-header') {
        request.headers['X-API-Key'] = bundle.authData.apiKey;
      } else if (process.env.AUTH_TYPE === 'api-query') {
        request.params.apiKey = bundle.authData.apiKey;
      }
    } else if (process.env.AUTH_TYPE === 'session' && bundle.authData.sessionKey) {
      request.headers['X-Token'] = bundle.authData.sessionKey;
    } else if (process.env.AUTH_TYPE === 'oauth2' && bundle.authData.access_token) {
      request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
    }
  }

  return request;
};

const maybeRefresh = (response, z, bundle) => {
  if (process.env.AUTH_TYPE && process.env.AUTH_TYPE === 'session' && bundle.authData.sessionKey) {
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new z.errors.RefreshAuthError('Session key needs refreshing.');
    }
  }

  return response;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [
    maybeIncludeAuth,
  ],

  afterResponse: [
    maybeRefresh,
  ],

  triggers: {
    [preTrigger.key]: preTrigger,
    [postTrigger.key]: postTrigger,
    [fullTrigger.key]: fullTrigger,
    [asyncTrigger.key]: asyncTrigger,
    [haltedTrigger.key]: haltedTrigger,
    [stopTrigger.key]: stopTrigger,
    [hookTrigger.key]: hookTrigger,
    [preHookTrigger.key]: preHookTrigger,
    [postHookTrigger.key]: postHookTrigger,
    [fieldsTrigger.key]: fieldsTrigger,
  },

  searches: {
    [preSearch.key]: preSearch,
    [postSearch.key]: postSearch,
    [fullSearch.key]: fullSearch,
    [asyncSearch.key]: asyncSearch,
    [haltedSearch.key]: haltedSearch,
    [stopSearch.key]: stopSearch,
    [fieldsSearch.key]: fieldsSearch,
    [fieldsFullSearch.key]: fieldsFullSearch,
    [preResourcePreSearch.key]: preResourcePreSearch,
    [postResourcePreSearch.key]: postResourcePreSearch,
    [fullResourcePreSearch.key]: fullResourcePreSearch,
    [preResourcePostSearch.key]: preResourcePostSearch,
    [postResourcePostSearch.key]: postResourcePostSearch,
    [fullResourcePostSearch.key]: fullResourcePostSearch,
    [preResourceFullSearch.key]: preResourceFullSearch,
    [postResourceFullSearch.key]: postResourceFullSearch,
    [fullResourceFullSearch.key]: fullResourceFullSearch,
    [fullResourceAsyncSearch.key]: fullResourceAsyncSearch,
  },

  creates: {
    [preCreate.key]: preCreate,
    [postCreate.key]: postCreate,
    [fullCreate.key]: fullCreate,
    [asyncCreate.key]: asyncCreate,
    [haltedCreate.key]: haltedCreate,
    [stopCreate.key]: stopCreate,
    [fieldsCreate.key]: fieldsCreate,
    [fieldsFullCreate.key]: fieldsFullCreate,
  },

};

module.exports = App;
