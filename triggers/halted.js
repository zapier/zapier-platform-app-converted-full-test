const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-trigger/blob/master/triggers/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';

  // Do a _poll() from scripting.
  const fullPollEvent = {
    name: 'trigger.poll',
    key: 'halted_trigger',
  };
  return legacyScriptingRunner.runEvent(fullPollEvent, z, bundle);
};

module.exports = {
  key: 'halted_trigger',
  noun: 'Halted',

  display: {
    label: 'Halted Trigger',
    description: 'A trigger with just a _poll that halts.',
    important: true,
  },

  operation: {
    inputFields: [],
    perform: getList,
  },
};
