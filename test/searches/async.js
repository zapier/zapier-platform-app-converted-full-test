require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Searches - Async', () => {
  zapier.tools.env.inject();

  it('should get an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.searches.async_search.operation.perform, bundle)
      .then((results) => {
        results.should.be.an.Array();
        results.length.should.be.aboveOrEqual(1);
        results[0].should.have.property('id');
        done();
      })
      .catch(done);
  });

});
