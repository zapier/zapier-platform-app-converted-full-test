require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Creates - Halted', () => {
  zapier.tools.env.inject();

  it('should halt creating an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      inputData: {
        name: 'Testing',
      },
    };

    appTester(App.creates.halted_create.operation.perform, bundle)
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
