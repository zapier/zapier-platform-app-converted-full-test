const getList = (z, bundle) => {
  const options = {
    // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-trigger/blob/master/triggers/recipe.js
    url: 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes',
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

  // Do a _pre_custom_trigger_fields() from scripting.
  const preResultFieldsEvent = {
    name: 'trigger.output.pre',
    key: 'fields_trigger',
  };
  return legacyScriptingRunner.runEvent(preResultFieldsEvent, z, bundle)
    .then((preResultFieldsResult) => z.request(preResultFieldsResult))
    .then((response) => {
      // Do a _post_custom_trigger_fields() from scripting.
      const postResultFieldsEvent = {
        name: 'trigger.output.post',
        key: 'fields_trigger',
        response,
      };
      return legacyScriptingRunner.runEvent(postResultFieldsEvent, z, bundle);
    });
};

module.exports = {
  key: 'fields_trigger',
  noun: 'Fields',

  display: {
    label: 'Fields Trigger',
    description: 'A trigger with just a _pre_custom_trigger_fields and a _post_custom_trigger_fields.',
    important: true,
  },

  operation: {
    inputFields: [],
    perform: getList,
    outputFields: [
      getOutputFields,
    ],
  },
};
