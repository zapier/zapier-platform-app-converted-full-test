const _ = require('lodash');

const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // We're cloning bundle to re-use it when mimicking a "fetch resource" that happened in WB
  const resourceBundle = _.cloneDeep(bundle);

  // NOTE: URL from https://github.com/zapier/zapier-platform-example-app-search/blob/master/searches/recipe.js
  bundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes';
  resourceBundle._legacyUrl = 'http://57b20fb546b57d1100a3c405.mockapi.io/api/recipes/{{id}}';

  const responsePromise = z.request({
    url: bundle._legacyUrl,
  });
  return responsePromise
    .then((response) => {
      // Do a _post_search() from scripting.
      const postSearchEvent = {
        name: 'search.post',
        key: 'post_search_with_pre_read',
        response,
      };
      return legacyScriptingRunner.runEvent(postSearchEvent, z, bundle);
    })
    .then((postSearchResult) => {
      // Mimick the "fetch resource" that happened in WB
      const results = postSearchResult;

      // Do a _pre_read_resource() from scripting.
      const preResourceEvent = {
        name: 'search.resource.pre',
        key: 'post_search_with_pre_read',
        results,
      };
      resourceBundle._legacyUrl = legacyScriptingRunner.replaceVars(resourceBundle._legacyUrl, resourceBundle, _.get(results, '[0]', {}));
      return legacyScriptingRunner.runEvent(preResourceEvent, z, resourceBundle);
    })
    .then((preResourceResult) => z.request(preResourceResult))
    .then((response) => {
      const results = z.JSON.parse(response.content);

      // WB would return a single record, but in CLI we expect an array
      if (_.isArray(results)) {
        return results;
      } else {
        return [results];
      }
    });
};

module.exports = {
  key: 'post_search_with_pre_read',
  noun: 'Post Resource Pre',

  display: {
    label: 'Post Resource Pre Search',
    description: 'A Search with just a _post_search and a _pre_read_resource.',
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
