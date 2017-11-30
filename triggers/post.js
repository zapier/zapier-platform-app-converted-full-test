const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-trigger/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';

  const responsePromise = z.request({
    url: bundle._legacyUrl,
  });
  return responsePromise
    .then((response) => {
      // Do a _post_poll() from scripting.
      const postPollEvent = {
        name: 'trigger.post',
        key: 'post_trigger',
        response,
      };
      return legacyScriptingRunner.runEvent(postPollEvent, z, bundle);
    });
};

module.exports = {
  key: 'post_trigger',
  noun: 'Post',

  display: {
    label: 'Post Trigger',
    description: 'A trigger with just a _post_poll.',
    important: true,
  },

  operation: {
    inputFields: [],
    perform: getList,
  },
};
