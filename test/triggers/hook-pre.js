require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const utils = require('../utils');

describe('Triggers - Pre Hook', () => {
  zapier.tools.env.inject();

  it('should get an array', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
    };

    appTester(App.triggers.pre_hook_trigger.operation.performList, bundle)
      .then((results) => {
        results.should.be.an.Array();
        done();
      })
      .catch(done);
  });

  it('should get an item', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      cleanedRequest: {
        id: 1,
      },
    };

    appTester(App.triggers.pre_hook_trigger.operation.perform, bundle)
      .then((results) => {
        results.should.be.an.Array();
        results[0].id.should.eql('1');
        results[0].name.should.eql('name 1');// From the request
        done();
      })
      .catch(done);
  });

  it('should subscribe hook', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      targetUrl: 'https://hooks.zapier.com/test/123',
    };

    appTester(App.triggers.pre_hook_trigger.operation.performSubscribe, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });

  it('should unsubscribe hook', (done) => {
    const bundle = {
      authData: utils.getAuthData(),
      targetUrl: 'https://hooks.zapier.com/test/123',
      subscribeData: {
        id: 1,
      },
    };

    appTester(App.triggers.pre_hook_trigger.operation.performUnsubscribe, bundle)
      .then((result) => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });

});
