const testAuth = (z/*, bundle */) => {
  const requestPromise = z.request({
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/dbd7593fd6fe1251f924daedc6451962
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/api-query',
  });

  return requestPromise
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('The API Key you supplied is invalid');
      }

      return z.JSON.parse(response.content);
    });
};

const getConnectionLabel = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // Do a get_connection_label() from scripting.
  const connectionLabelEvent = {
    name: 'auth.connectionLabel',
  };
  return legacyScriptingRunner.runEvent(connectionLabelEvent, z, bundle);
};

const apiQueryAuth = {
  type: 'custom',
  test: testAuth,
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
    },
  ],
  connectionLabel: getConnectionLabel,
};

module.exports = apiQueryAuth;
