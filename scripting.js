'use strict';

// START:HEAD -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v0.0.1

const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
const crypto = require('crypto');
const async = require('async');
const moment = require('moment-timezone');
const { DOMParser, XMLSerializer } = require('xmldom');
const atob = require('zapier-platform-legacy-scripting-runner/atob');
const btoa = require('zapier-platform-legacy-scripting-runner/btoa');
const z = require('zapier-platform-legacy-scripting-runner/z');
const $ = require('zapier-platform-legacy-scripting-runner/$');
const {
  ErrorException,
  HaltedException,
  StopRequestException,
  ExpiredAuthException,
  RefreshTokenException,
  InvalidSessionException,
} = require('zapier-platform-legacy-scripting-runner/exceptions');

// END:HEAD -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v0.0.1

// Using this to check some bundle properties are not empty
const shouldExist = (value) => {
  if (typeof value === 'undefined' || value === null) {
    throw new Error('Found an empty value!!');
  }
};
const shouldNotExist = (value) => {
  if (typeof value !== 'undefined' && value !== null) {
    throw new Error('Found an existing value!!');
  }
};

var Zap = {
  //
  // Auth
  //
  get_connection_label: function(bundle) {
    shouldExist(bundle.test_result);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return bundle.test_result.user;
  },

  get_session_info: function(bundle) {
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE !== 'session') {
      throw new ErrorException('get_session_info should not be called except for Session Auth!');
    }

    shouldExist(bundle.request.url);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    var response = z.request({
      // NOTE: Runs this: https://gist.github.com/BrunoBernardino/e1c3b71489eb46c3b5635d724628e127
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
      url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/session',
      data: z.JSON.stringify(bundle.auth_fields),
    });

    const result = z.JSON.parse(response.content);

    if (!result.token) {
      throw new ErrorException('The Email/Password you supplied is invalid');
    }

    return {
      token: result.token,
    };
  },

  pre_oauthv2_token: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldNotExist(bundle.request.auth);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.oauth_data);
    shouldExist(bundle.load);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  post_oauthv2_token: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.oauth_data);
    shouldExist(bundle.auth_fields);

    return z.JSON.parse(bundle.response.content);
  },

  pre_oauthv2_refresh: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldNotExist(bundle.request.auth);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.oauth_data);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.load);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  //
  // Triggers
  //
  pre_trigger_pre_poll: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);
    shouldExist(bundle.meta);

    // These are no-ops, but test a bunch of libraries/utils aren't broken
    z.hash('sha256', 'my awesome string');
    z.hmac('sha256', 'key', 'string');
    z.snipify('something');
    btoa('something');
    atob('c29tZXRoaW5n');
    $.param({test: 'something', more: true, also: '@'});
    $.parseXML('<do><something>also</something></do>');
    const doc = new DOMParser().parseFromString('<do><something>also</something></do>', 'text/html');
    new XMLSerializer().serializeToString(doc);

    return bundle.request;
  },

  post_trigger_post_poll: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);
    shouldExist(bundle.meta);

    return z.JSON.parse(bundle.response.content);
  },

  full_trigger_poll: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);
    shouldExist(bundle.meta);

    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  async_trigger_poll: function(bundle, callback) {
    z.request(bundle.request, function(err, response) {
      shouldNotExist(err);
      callback(err, z.JSON.parse(response.content));
    });
  },

  halted_trigger_poll: function(bundle) {
    throw new HaltedException('This should halt!');
  },

  stop_trigger_poll: function(bundle) {
    throw new StopRequestException('This should stop!');
  },

  pre_subscribe: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.target_url);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.event);
    shouldExist(bundle.zap);
    shouldExist(bundle.meta);

    return bundle.request;
  },

  post_subscribe: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request);
    shouldExist(bundle.target_url);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.event);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  pre_unsubscribe: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.target_url);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.event);
    shouldExist(bundle.subscribe_data);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  hook_trigger_catch_hook: function(bundle) {
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.querystring);
    shouldExist(bundle.request.content);
    shouldExist(bundle.cleaned_request);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);

    return bundle.cleaned_request;
  },

  hook_trigger_poll: function(bundle) {
    var response = z.request(bundle.request);
    return z.JSON.parse(response.content);
  },

  pre_hook_trigger_pre_hook: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  pre_hook_trigger_poll: function(bundle) {
    var response = z.request(bundle.request);
    return z.JSON.parse(response.content);
  },

  post_hook_trigger_post_hook: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  post_hook_trigger_poll: function(bundle) {
    var response = z.request(bundle.request);
    return z.JSON.parse(response.content);
  },

  fields_trigger_pre_custom_trigger_fields: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.trigger_fields);
    shouldExist(bundle.trigger_fields_raw);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  fields_trigger_post_custom_trigger_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  //
  // Creates
  //
  pre_create_pre_write: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.action_fields);
    shouldExist(bundle.action_fields_full);
    shouldExist(bundle.action_fields_raw);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  post_create_post_write: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.action_fields);
    shouldExist(bundle.action_fields_full);
    shouldExist(bundle.action_fields_raw);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  full_create_write: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.action_fields);
    shouldExist(bundle.action_fields_full);
    shouldExist(bundle.action_fields_raw);
    shouldExist(bundle.zap);

    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  async_create_write: function(bundle, callback) {
    z.request(bundle.request, function(err, response) {
      shouldNotExist(err);
      callback(err, z.JSON.parse(response.content));
    });
  },

  halted_create_write: function(bundle) {
    throw new HaltedException('This should halt!');
  },

  stop_create_write: function(bundle) {
    throw new StopRequestException('This should stop!');
  },

  fields_create_pre_custom_action_fields: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.action_fields);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  fields_create_post_custom_action_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  fields_create_pre_custom_action_result_fields: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.action_fields);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  fields_create_post_custom_action_result_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  fields_full_create_custom_action_result_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  //
  // Searches
  //
  pre_search_pre_search: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  post_search_post_search: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  full_search_search: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.zap);

    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  async_search_search: function(bundle, callback) {
    z.request(bundle.request, function(err, response) {
      shouldNotExist(err);
      callback(err, z.JSON.parse(response.content));
    });
  },

  halted_search_search: function(bundle) {
    throw new HaltedException('This should halt!');
  },

  stop_search_search: function(bundle) {
    throw new StopRequestException('This should stop!');
  },

  fields_search_pre_custom_search_fields: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  fields_search_post_custom_search_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  fields_search_pre_custom_search_result_fields: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  fields_search_post_custom_search_result_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  fields_full_search_custom_search_result_fields: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  // _pre_read_resource combinations
  pre_search_with_pre_read_pre_search: function(bundle) {
    return bundle.request;
  },

  pre_search_with_pre_read_pre_read_resource: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.search_fields);
    shouldExist(bundle.read_fields);
    shouldExist(bundle.read_context);
    shouldExist(bundle.zap);

    return bundle.request;
  },

  post_search_with_pre_read_post_search: function(bundle) {
    return z.JSON.parse(bundle.response.content);
  },

  post_search_with_pre_read_pre_read_resource: function(bundle) {
    return bundle.request;
  },

  search_with_pre_read_search: function(bundle) {
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_pre_read_pre_read_resource: function(bundle) {
    return bundle.request;
  },

  // _post_read_resource combinations
  pre_search_with_post_read_pre_search: function(bundle) {
    return bundle.request;
  },

  pre_search_with_post_read_post_read_resource: function(bundle) {
    shouldExist(bundle.response.status_code);
    shouldExist(bundle.response.headers);
    shouldExist(bundle.response.content);
    shouldExist(bundle.request);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.read_fields);
    shouldExist(bundle.read_context);
    shouldExist(bundle.zap);

    return z.JSON.parse(bundle.response.content);
  },

  post_search_with_post_read_post_search: function(bundle) {
    return z.JSON.parse(bundle.response.content);
  },

  post_search_with_post_read_post_read_resource: function(bundle) {
    return z.JSON.parse(bundle.response.content);
  },

  search_with_post_read_search: function(bundle) {
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_post_read_post_read_resource: function(bundle) {
    return z.JSON.parse(bundle.response.content);
  },

  // _read_resource combinations
  pre_search_with_read_pre_search: function(bundle) {
    return bundle.request;
  },

  pre_search_with_read_read_resource: function(bundle) {
    shouldExist(bundle.request.url);
    shouldExist(bundle.request.method);
    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE === 'basic') {
      shouldExist(bundle.request.auth);
    } else {
      shouldNotExist(bundle.request.auth);
    }
    shouldExist(bundle.request.headers);
    shouldExist(bundle.request.params);
    shouldExist(bundle.request.data);
    shouldExist(bundle.url_raw);
    shouldExist(bundle.auth_fields);
    shouldExist(bundle.read_fields);
    shouldExist(bundle.read_context);
    shouldExist(bundle.zap);

    bundle.request.url = _.template(bundle.request.url)(_.get(bundle.read_fields, '[0]', {}));
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  post_search_with_read_post_search: function(bundle) {
    return z.JSON.parse(bundle.response.content);
  },

  post_search_with_read_read_resource: function(bundle) {
    bundle.request.url = _.template(bundle.request.url)(_.get(bundle.read_fields, '[0]', {}));
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_read_search: function(bundle) {
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_read_read_resource: function(bundle) {
    bundle.request.url = _.template(bundle.request.url)(_.get(bundle.read_fields, '[0]', {}));
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_async_read_search: function(bundle) {
    var response = z.request(bundle.request);

    return z.JSON.parse(response.content);
  },

  search_with_async_read_read_resource: function(bundle, callback) {
    bundle.request.url = _.template(bundle.request.url)(_.get(bundle.read_fields, '[0]', {}));

    z.request(bundle.request, function(err, response) {
      shouldNotExist(err);
      callback(err, z.JSON.parse(response.content));
    });
  },
};

// START:FOOT -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v0.0.1

module.exports = Zap;

// END:FOOT -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v0.0.1
