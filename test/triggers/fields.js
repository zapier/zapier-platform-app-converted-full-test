require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Triggers - Custom Result Fields', () => {
  zapier.tools.env.inject();

  it('should get an array', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.fields_trigger.operation.perform, bundle)
      .then((results) => {
        results.should.be.an.Array();
        done();
      })
      .catch(done);
  });

  it('should get the output fields', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.fields_trigger.operation.outputFields[0], bundle)
      .then((results) => {
        results.should.be.an.Array();
        results[0].key.should.eql('name');
        results[0].label.should.eql('Better Name');
        results[0].type.should.eql('string');
        done();
      })
      .catch(done);
  });

});
