require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Creates - Stop', () => {
  zapier.tools.env.inject();

  it('should stop creating an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      inputData: {
        name: 'Testing',
      },
    };

    appTester(App.creates.stop_create.operation.perform, bundle)
      .then(() => {
        should(false).eql(true, 'Did not raise StopRequestError!');
        done();
      })
      .catch((error) => {
        error.name.should.eql('StopRequestError');
        error.message.should.containEql('This should stop!');
        done();
      });
  });

});
