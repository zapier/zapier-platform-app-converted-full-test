require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Triggers - Stop', () => {
  zapier.tools.env.inject();

  it('should stop getting an array', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.stop_trigger.operation.perform, bundle)
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
