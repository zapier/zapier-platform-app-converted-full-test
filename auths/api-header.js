const testAuth = (z/*, bundle */) => {
  const requestPromise = z.request({
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/bd9495aa54575bdaec64e0b41f5fd71e
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/api-header',
  });

  return requestPromise
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('The API Key you supplied is invalid');
      }

      return z.JSON.parse(response.content);
    });
};

const apiHeaderAuth = {
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
  connectionLabel: '{{bundle.inputData.user}}',
};

module.exports = apiHeaderAuth;
