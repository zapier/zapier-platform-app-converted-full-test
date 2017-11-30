require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Authentication - API Key on Query String', () => {

  before(function() {
    zapier.tools.env.inject();

    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE !== 'api-query') {
      this.skip();
    }
  });

  it('should pass authentication', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
      },
    };

    appTester(App.authentication.test, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.authenticated.should.equal(true);
        result.user.should.equal('Zapier');
        done();
      })
      .catch(done);
  });

  it('should fail on a bad api key', (done) => {
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
        error.message.should.containEql('The API Key you supplied is invalid');
        done();
      });
  });

  it('should get the connection label', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.API_KEY,
      },
      inputData: {
        authenticated: true,
        user: 'Zapier',
      },
    };

    appTester(App.authentication.connectionLabel, bundle)
      .then((result) => {
        result.should.equal('Zapier');
        done();
      })
      .catch(done);
  });

});
