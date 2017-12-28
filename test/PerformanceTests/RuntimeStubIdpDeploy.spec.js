import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from '../resources/descriptors.js';
import { getDescriptor } from '../resources/getDescriptor.js';

// Testing Module
import RuntimeUA from  '../../dist/Runtime.js';

// Main dependecies
import Registry from '../../src/registry/Registry';
import IdentityModule from '../../src/identity/IdentityModule';
import PEP from '../../src/policy/PEP';
import MessageBus from '../../src/bus/MessageBus';

import { divideURL } from '../../src/utils/utils';

import { runtimeFactory } from '../resources/runtimeFactory';

/// import { runtimeConfiguration } from './resources/runtimeConfiguration';

// Testing runtimeUA;
let domain = 'localhost';
describe('RuntimeUA', function() {

  let runtime = new RuntimeUA(descriptors.Runtimes.Runtime, runtimeFactory, domain);

  after(function() {
    runtime.descriptorInstance.getStubDescriptor.restore();
    runtime.descriptorInstance.getIdpProxyDescriptor.restore();
  });

  it('should load Runtime with success', (done) => {

    expect(runtime.init().then((result) => {

      // sinon.stub(runtime.messageBus, 'postMessage', function(msg, replyCallback) {
      //
      //   console.log('MSG->', msg);
      //
      //   if (replyCallback) {
      //     replyCallback({
      //       id: 1, type: 'response', from: 'domain://msg-node.localhost/address-allocation', to: 'local://localhost',
      //       body: {code: 200, value: {allocated: msg.body.scheme + '://localhost/9c8c1949-e08e-4554-b201-bab201bdb21d'}}
      //     });
      //   }
      //
      // });
      sinon.stub(runtime.descriptorInstance, 'getStubDescriptor').callsFake((stubURL) => {
        console.log('stubURL', stubURL);
        return getDescriptor(stubURL);
      });

      sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor').callsFake((idpProxyURL) => {
        let url = 'https://localhost/.well-known/idp-proxy/' +  idpProxyURL;
        return getDescriptor(url);
      });

      return result;
    }))
      .to.be.fulfilled
      .and.to.eventually.be.true
      .and.notify(done);

  });

  it('Stub should be deployed', function(done) {
    let spDomain = 'localhost';
    let loadStubPromise = runtime.loadStub(spDomain);

    expect(loadStubPromise).to.be.fulfilled
    .and.eventually.have.all.keys('url', 'status', 'descriptorURL')
    .and.eventually.to.have.property('status').to.include('live')
    .and.notify(done);
  });

  it('IDP Proxy should be deployed', function(done) {
    let domain = 'google.com';
    let loadIdpPromise = runtime.loadIdpProxy(domain);
    let stubResolved = ['url', 'status'];
    expect(loadIdpPromise).to.be.fulfilled
    .and.eventually.have.all.keys('url', 'status')
    .and.eventually.to.have.property('status').to.include('live')
    .and.notify(done);
  });


});
