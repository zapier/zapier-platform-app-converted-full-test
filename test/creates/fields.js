require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Creates - Custom Fields', () => {
  zapier.tools.env.inject();

  it('should create an object', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      inputData: {
        name: 'Testing',
      },
    };

    appTester(App.creates.fields_create.operation.perform, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        result.should.have.property('id');
        done();
      })
      .catch(done);
  });

  it('should get the input fields', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.creates.fields_create.operation.inputFields[1], bundle)
      .then((results) => {
        results.should.be.an.Array();
        results[0].key.should.eql('authorId');
        results[0].label.should.eql('Author');
        results[0].required.should.eql(true);
        results[0].type.should.eql('number');
        results[0].helpText.should.eql('This is some help, yo!');
        done();
      })
      .catch(done);
  });

  it('should get the output fields', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.creates.fields_create.operation.outputFields[0], bundle)
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
