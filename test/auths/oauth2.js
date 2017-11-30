require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Authentication - OAuth 2', () => {

  before(function() {
    zapier.tools.env.inject();

    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE !== 'oauth2') {
      this.skip();
    }
  });

  it('should pass authentication', (done) => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
      },
    };

    appTester(App.authentication.test, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.authenticated.should.equal(true);
        result.user.should.equal('Zapier-OAuth2');
        done();
      })
      .catch(done);
  });

  it('should fail on a bad access token', (done) => {
    const bundle = {
      authData: {},
    };

    appTester(App.authentication.test, bundle)
      .then(() => {
        should(false).eql(true, 'Did not raise error!');
        done();
      })
      .catch((error) => {
        error.name.should.eql('Error');
        error.message.should.containEql('The access token you supplied is invalid');
        done();
      });
  });

  it('generates an authorize URL', (done) => {
    const bundle = {
      inputData: {
        state: '4444',
        redirect_uri: 'http://zapier.com/',
      },
    };

    appTester(App.authentication.oauth2Config.authorizeUrl, bundle)
      .then((authorizeUrl) => {
        authorizeUrl.should.eql('https://wt-d9eeb64793d8836c8641adb2acda6ed3-0.run.webtask.io/oauth2-authorize?client_id=1234&state=4444&redirect_uri=http%3A%2F%2Fzapier.com%2F&response_type=code');
        done();
      })
      .catch(done);
  });

  it('can fetch an access token', (done) => {
    const bundle = {
      inputData: {
        code: 'one_time_code',
      },
    };

    appTester(App.authentication.oauth2Config.getAccessToken, bundle)
      .then((result) => {
        result.access_token.should.eql('a_token');
        result.refresh_token.should.eql('a_refresh_token');
        done();
      })
      .catch(done);
  });

  it('can refresh the access token', (done) => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
      },
    };

    appTester(App.authentication.oauth2Config.refreshAccessToken, bundle)
      .then((result) => {
        result.access_token.should.eql('a_new_token');
        result.access_token.should.not.eql(bundle.authData.access_token);
        done();
      })
      .catch(done);
  });

});
