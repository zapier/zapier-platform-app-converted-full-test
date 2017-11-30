const testAuth = (z/*, bundle */) => {
  const requestPromise = z.request({
    // NOTE: Runs this: https://gist.github.com/BrunoBernardino/916535912897f5f096f70d5c53095de2
    url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/oauth2-test',
  });

  return requestPromise
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('The access token you supplied is invalid');
      }

      return z.JSON.parse(response.content);
    });
};

const getAccessToken = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/b3ccaadd12c570a9dc6542f51fce4bec
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/oauth2-access-token';

  // Do a pre_oauthv2_token() from scripting.
  const preOAuth2TokenEvent = {
    name: 'auth.oauth2.token.pre',
  };
  return legacyScriptingRunner.runEvent(preOAuth2TokenEvent, z, bundle)
    .then((preOAuth2TokenResult) => z.request(preOAuth2TokenResult))
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Unable to fetch access token: ${response.content}`);
      }

      // Do a post_oauthv2_token() from scripting.
      const postOAuth2TokenEvent = {
        name: 'auth.oauth2.token.post',
        response,
      };
      return legacyScriptingRunner.runEvent(postOAuth2TokenEvent, z, bundle);
    });
};

const refreshAccessToken = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // NOTE: Runs this: https://gist.github.com/BrunoBernardino/2adb45d0f72d420f58da85139d6eea05
  bundle._legacyUrl = 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/oauth2-refresh-token';

  // Do a pre_oauthv2_refresh() from scripting.
  const preOAuth2RefreshEvent = {
    name: 'auth.oauth2.refresh.pre',
  };
  return legacyScriptingRunner.runEvent(preOAuth2RefreshEvent, z, bundle)
    .then((preOAuth2RefreshResult) => z.request(preOAuth2RefreshResult))
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Unable to fetch access token: ${response.content}`);
      }

      return z.JSON.parse(response.content);
    });
};

const oauth2Auth = {
  type: 'oauth2',
  test: testAuth,
  oauth2Config: {
    authorizeUrl: {
      // NOTE: Runs this: https://gist.github.com/BrunoBernardino/5be552af01242b7defed50c9e076fcdc
      url: 'https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/oauth2-authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken,
    refreshAccessToken,
    autoRefresh: true,
  },
  connectionLabel: '{{bundle.inputData.user}}',
};


module.exports = oauth2Auth;
