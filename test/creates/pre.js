require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Creates - Pre', () => {
  zapier.tools.env.inject();

  it('should create an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      inputData: {
        name: 'Testing',
      },
    };

    appTester(App.creates.pre_create.operation.perform, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.should.have.property('id');
        done();
      })
      .catch(done);
  });

});
