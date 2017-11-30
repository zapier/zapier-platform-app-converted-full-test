const makeRequest = (z, bundle) => {
  const options = {
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/01eac85539d8bfd818a9028b46fa38c9
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/recipe-create',
    params: bundle.inputData,
  };

  return z.request(options)
    .then((response) => z.JSON.parse(response.content));
};

const getInputFields = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/60f6af585b37ecbcb708a1f86f8da37f
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/fields-input';

  // Do a _pre_custom_action_fields() from scripting.
  const preFieldsEvent = {
    name: 'create.input.pre',
    key: 'fields_create',
  };
  return legacyScriptingRunner.runEvent(preFieldsEvent, z, bundle)
    .then((preFieldsResult) => z.request(preFieldsResult))
    .then((response) => {
      // Do a _post_custom_action_fields() from scripting.
      const postFieldsEvent = {
        name: 'create.input.post',
        key: 'fields_create',
        response,
      };
      return legacyScriptingRunner.runEvent(postFieldsEvent, z, bundle);
    });
};

const getOutputFields = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/6e7a216e97e6d0e62c5c364c6ec2d743
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/fields-output';

  // Do a _pre_custom_action_result_fields() from scripting.
  const preResultFieldsEvent = {
    name: 'create.output.pre',
    key: 'fields_create',
  };
  return legacyScriptingRunner.runEvent(preResultFieldsEvent, z, bundle)
    .then((preResultFieldsResult) => z.request(preResultFieldsResult))
    .then((response) => {
      // Do a _post_custom_action_result_fields() from scripting.
      const postResultFieldsEvent = {
        name: 'create.output.post',
        key: 'fields_create',
        response,
      };
      return legacyScriptingRunner.runEvent(postResultFieldsEvent, z, bundle);
    });
};

module.exports = {
  key: 'fields_create',
  noun: 'Fields',

  display: {
    label: 'Fields Create',
    description: 'A create with a _pre_custom_action_fields, _post_custom_action_fields, _pre_custom_action_result_fields, and a _post_custom_action_result_fields.',
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
      getInputFields,
    ],

    perform: makeRequest,

    outputFields: [
      getOutputFields,
    ],
  },
};
