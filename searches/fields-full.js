const getList = (z, bundle) => {
  const options = {
    // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-search/blob/master/searches/recipe.js
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
  return z.request({ url: bundle._legacyUrl })
    .then((response) => {
      // Do a _custom_search_result_fields() from scripting.
      const fullResultFieldsEvent = {
        name: 'search.output',
        key: 'fields_full_search',
        response,
      };
      return legacyScriptingRunner.runEvent(fullResultFieldsEvent, z, bundle);
    });
};

module.exports = {
  key: 'fields_full_search',
  noun: 'Fields',

  display: {
    label: 'Fields Full Search',
    description: 'A Search with just a _custom_search_result_fields.',
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
    ],
    perform: getList,
    outputFields: [
      getOutputFields,
    ],
  },
};
