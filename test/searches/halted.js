require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Searches - Halted', () => {
  zapier.tools.env.inject();

  it('should halt getting an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.searches.halted_search.operation.perform, bundle)
      .then(() => {
        should(false).eql(true, 'Did not raise HaltedError!');
        done();
      })
      .catch((error) => {
        error.name.should.eql('HaltedError');
        error.message.should.containEql('This should halt!');
        done();
      });
  });

});
