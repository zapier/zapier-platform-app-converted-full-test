const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-trigger/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';

  // Do a _pre_poll() from scripting.
  const prePollEvent = {
    name: 'trigger.pre',
    key: 'pre_trigger',
  };
  return legacyScriptingRunner.runEvent(prePollEvent, z, bundle)
    .then((prePollResult) => z.request(prePollResult))
    .then((response) => JSON.parse(response.content));
};

module.exports = {
  key: 'pre_trigger',
  noun: 'Pre',

  display: {
    label: 'Pre Trigger',
    description: 'A trigger with just a _pre_poll.',
    important: true,
  },

  operation: {
    inputFields: [],
    perform: getList,
  },
};
