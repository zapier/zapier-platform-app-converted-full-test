require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Triggers - Async', () => {
  zapier.tools.env.inject();

  it('should get an array', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.async_trigger.operation.perform, bundle)
      .then((results) => {
        results.should.be.an.Array();
        done();
      })
      .catch(done);
  });

});
