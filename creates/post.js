const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create';

  const responsePromise = z.request({
    url: bundle._legacyUrl,
  });
  return responsePromise
    .then((response) => {
      // Do a _post_write() from scripting.
      const postWriteEvent = {
        name: 'create.post',
        key: 'post_create',
        response,
      };
      return legacyScriptingRunner.runEvent(postWriteEvent, z, bundle);
    });
};

module.exports = {
  key: 'post_create',
  noun: 'Post',

  display: {
    label: 'Post Create',
    description: 'A create with just a _post_write.',
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
