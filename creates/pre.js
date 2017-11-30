const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create';

  // Do a _pre_write() from scripting.
  const preWriteEvent = {
    name: 'create.pre',
    key: 'pre_create',
  };
  return legacyScriptingRunner.runEvent(preWriteEvent, z, bundle)
    .then((preWriteResult) => z.request(preWriteResult))
    .then((response) => JSON.parse(response.content));
};

module.exports = {
  key: 'pre_create',
  noun: 'Pre',

  display: {
    label: 'Pre Create',
    description: 'A create with just a _pre_write.',
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
