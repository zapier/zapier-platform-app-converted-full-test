const testAuth = (z/*, bundle */) => {
  const requestPromise = z.request({
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/e1c3b71489eb46c3b5635d724628e127
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/session',
  });

  return requestPromise
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('The Email/Password you supplied is invalid');
      }

      return z.JSON.parse(response.content);
    });
};

const getSessionKey = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // Do a get_session_info() from scripting.
  const getSessionEvent = {
    name: 'auth.session',
  };
  return legacyScriptingRunner.runEvent(getSessionEvent, z, bundle)
    .then((getSessionResult) => {
      // IMPORTANT NOTE:
      //   WB apps in scripting's get_session_info() allowed you to return any object and that would be
      //   added to the authData, but CLI apps require you to specifically define those.
      //   That means that if you return more than one key from your scripting's get_session_info(),
      //   you might need to manually tweak this method to return that value at the end of this method,
      //   and also add more fields to the authentication definition.

      const resultKeys = Object.keys(getSessionResult);
      const firstKeyValue = (getSessionResult && resultKeys.length > 0) ? getSessionResult[resultKeys[0]] : getSessionResult;

      return {
        sessionKey: firstKeyValue,
      };
    });
};

const sessionAuth = {
  type: 'session',
  test: testAuth,
  fields: [
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
    },
    {
      key: 'pass',
      label: 'Password',
      type: 'password',
      required: true,
    },
  ],
  sessionConfig: {
    perform: getSessionKey,
  },
  connectionLabel: '{{bundle.inputData.user}}',
};

module.exports = sessionAuth;
