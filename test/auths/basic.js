require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Authentication - Basic', () => {

  before(function() {
    zapier.tools.env.inject();

    if (process.env.AUTH_TYPE && process.env.AUTH_TYPE !== 'basic') {
      this.skip();
    }
  });

  it('should pass authentication', (done) => {
    const bundle = {
      authData: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    };

    appTester(App.authentication.test, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.authenticated.should.equal(true);
        result.user.should.equal(bundle.authData.username);
        done();
      })
      .catch(done);
  });

  it('should fail on a bad username/password', (done) => {
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
        error.message.should.containEql('Got 401 calling');
        done();
      });
  });

});
