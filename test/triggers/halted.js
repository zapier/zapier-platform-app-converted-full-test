require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Triggers - Halted', () => {
  zapier.tools.env.inject();

  it('should halt getting an array', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.halted_trigger.operation.perform, bundle)
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
