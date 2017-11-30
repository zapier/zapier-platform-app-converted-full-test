const getList = (z, bundle) => {
  const options = {
    // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-search/blob/master/searches/recipe.js
    url: 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes',
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

  // Do a _pre_custom_search_fields() from scripting.
  const preFieldsEvent = {
    name: 'search.input.pre',
    key: 'fields_search',
  };
  return legacyScriptingRunner.runEvent(preFieldsEvent, z, bundle)
    .then((preFieldsResult) => z.request(preFieldsResult))
    .then((response) => {
      // Do a _post_custom_search_fields() from scripting.
      const postFieldsEvent = {
        name: 'search.input.post',
        key: 'fields_search',
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

  // Do a _pre_custom_search_result_fields() from scripting.
  const preResultFieldsEvent = {
    name: 'search.output.pre',
    key: 'fields_search',
  };
  return legacyScriptingRunner.runEvent(preResultFieldsEvent, z, bundle)
    .then((preResultFieldsResult) => z.request(preResultFieldsResult))
    .then((response) => {
      // Do a _post_custom_search_result_fields() from scripting.
      const postResultFieldsEvent = {
        name: 'search.output.post',
        key: 'fields_search',
        response,
      };
      return legacyScriptingRunner.runEvent(postResultFieldsEvent, z, bundle);
    });
};

module.exports = {
  key: 'fields_search',
  noun: 'Fields',

  display: {
    label: 'Fields Search',
    description: 'A Search with a _pre_custom_search_fields, _post_custom_search_fields, _pre_custom_search_result_fields, and a _post_custom_search_result_fields.',
    important: true,
  },

  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Name',
        type: 'string',
        required: false,
      },
      getInputFields,
    ],
    perform: getList,
    outputFields: [
      getOutputFields,
    ],
  },
};
