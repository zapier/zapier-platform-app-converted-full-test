const _ = require('lodash');

const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-hooks/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';

  // Do a _poll() from scripting.
  const fullPollEvent = {
    name: 'trigger.poll',
    key: 'pre_hook_trigger',
  };
  return legacyScriptingRunner.runEvent(fullPollEvent, z, bundle);
};

const getItem = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-hooks/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes/{{id}}';

  // Do a _pre_hook() from scripting.
  const preHookEvent = {
    name: 'trigger.hook.pre',
    key: 'pre_hook_trigger',
  };
  return legacyScriptingRunner.runEvent(preHookEvent, z, bundle)
    .then((preHookResult) => {
      preHookResult.url = legacyScriptingRunner.replaceVars(preHookResult.url, bundle, bundle.cleanedRequest);
      return z.request(preHookResult);
    })
    .then((response) => {
      const results = z.JSON.parse(response.content);

      // WB could return a single record, but in CLI we expect an array
      if (_.isArray(results)) {
        return results;
      } else {
        return [results];
      }
    });
};

const subscribeHook = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create';
  bundle._legacyEvent = 'recipe';

  // Do a pre_subscribe() from scripting.
  const preSubscribeEvent = {
    name: 'trigger.hook.subscribe.pre',
  };
  return legacyScriptingRunner.runEvent(preSubscribeEvent, z, bundle)
    .then((preSubscribeResult) => z.request(preSubscribeResult))
    .then((response) => {
      // Do a post_subscribe() from scripting.
      const postSubscribeEvent = {
        name: 'trigger.hook.subscribe.post',
        response,
      };
      return legacyScriptingRunner.runEvent(postSubscribeEvent, z, bundle);
    });
};

const unsubscribeHook = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-hooks/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/hooks/{{id}}';
  bundle._legacyEvent = 'recipe';

  // Do a pre_unsubscribe() from scripting.
  const preUnsubscribeEvent = {
    name: 'trigger.hook.unsubscribe.pre',
  };
  return legacyScriptingRunner.runEvent(preUnsubscribeEvent, z, bundle)
    .then((preUnsubscribeResult) => {
      preUnsubscribeResult.url = legacyScriptingRunner.replaceVars(preUnsubscribeResult.url, bundle, bundle.subscribeData);
      return z.request(preUnsubscribeResult);
    })
    .then((response) => z.JSON.parse(response.content));
};

module.exports = {
  key: 'pre_hook_trigger',
  noun: 'Pre Hook',

  display: {
    label: 'Pre Hook Trigger',
    description: 'A trigger with just a _pre_hook (which also runs pre_subscribe, post_subscribe, and pre_unsubscribe).',
    important: true,
  },

  operation: {
    inputFields: [],
    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getItem,
    performList: getList,
  },
};
