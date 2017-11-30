const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create';

  // Do a _write() from scripting.
  const fullWriteEvent = {
    name: 'create.write',
    key: 'halted_create',
  };
  return legacyScriptingRunner.runEvent(fullWriteEvent, z, bundle);
};

module.exports = {
  key: 'halted_create',
  noun: 'Halted',

  display: {
    label: 'Halted Create',
    description: 'A create with just a _write that halts.',
    important: true,
  },

  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: true,
      },
    ],

    perform: makeRequest,
  },
};
