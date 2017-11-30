const makeRequest = (z, bundle) => {
  const options = {
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create',
    params: bundle.inputData,
  };

  return z.request(options)
    .then((response) => z.JSON.parse(response.content));
};

const getOutputFields = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/6e7a216e97e6d0e62c5c364c6ec2d743
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/fields-output';
  return z.request({ url: bundle._legacyUrl })
    .then((response) => {
      // Do a _custom_action_result_fields() from scripting.
      const fullResultFieldsEvent = {
        name: 'create.output',
        key: 'fields_full_create',
        response,
      };
      return legacyScriptingRunner.runEvent(fullResultFieldsEvent, z, bundle);
    });
};

module.exports = {
  key: 'fields_full_create',
  noun: 'Fields',

  display: {
    label: 'Fields Full Create',
    description: 'A create with just a _custom_action_result_fields.',
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

    outputFields: [
      getOutputFields,
    ],
  },
};
