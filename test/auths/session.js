require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Authentication - Session', () => {

  before(function() {
    zapier.tools.env.inject();

    if (!process.env.AUTH_TYPE || process.env.AUTH_TYPE !== 'session') {
      this.skip();
    }
  });

  const now = new Date();
  const expectedToken = `${now.getFullYear()}-${now.getMonth() + 1}`;

  it('should pass authentication', (done) => {
    const bundle = {
      authData: {
        sessionKey: expectedToken,
      },
    };

    appTester(App.authentication.test, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.authenticated.should.equal(true);
        result.user.should.equal('Zapier-Session');
        result.token.should.equal(expectedToken);
        done();
      })
      .catch(done);
  });

  it('should get a token from email/password', (done) => {
    const bundle = {
      authData: {
        email: process.env.USERNAME,
        pass: process.env.PASSWORD,
      },
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((result) => {
        result.sessionKey.should.equal(expectedToken);
        done();
      })
      .catch(done);
  });

  it('should fail on a bad email/password', (done) => {
    const bundle = {
      authData: {},
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then(() => {
        should(false).eql(true, 'Did not raise error!');
        done();
      })
      .catch((error) => {
        error.name.should.eql('Error');
        error.message.should.containEql('The Email/Password you supplied is invalid');
        done();
      });
  });

});
