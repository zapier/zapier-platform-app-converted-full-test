const _ = require('lodash');

const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // We're cloning bundle to re-use it when mimicking a "fetch resource" that happened in WB
  const resourceBundle = _.cloneDeep(bundle);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-search/blob/master/searches/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';
  resourceBundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes/{{id}}';

  // Do a _search() from scripting.
  const fullSearchEvent = {
    name: 'search.search',
    key: 'search_with_post_read',
  };
  return legacyScriptingRunner.runEvent(fullSearchEvent, z, bundle)
  .then((fullSearchResult) => {
    // Mimick the "fetch resource" that happened in WB
    const results = fullSearchResult;

    resourceBundle.results = results;

    const finalUrl = legacyScriptingRunner.replaceVars(resourceBundle._legacyUrl, resourceBundle, _.get(results, '[0]', {}));
    return z.request({ url: finalUrl });
  })
  .then((response) => {
    // Do a _post_read_resource() from scripting.
    const postResourceEvent = {
      name: 'search.resource.post',
      key: 'search_with_post_read',
      response,
      results: resourceBundle.results,
    };
    return legacyScriptingRunner.runEvent(postResourceEvent, z, resourceBundle);
  })
  .then((results) => {
    // WB would return a single record, but in CLI we expect an array
    if (_.isArray(results)) {
      return results;
    } else {
      return [results];
    }
  });
};

module.exports = {
  key: 'search_with_post_read',
  noun: 'Full Resource Post',

  display: {
    label: 'Full Resource Post Search',
    description: 'A Search with just a _search and a _post_read_resource.',
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
  },
};
