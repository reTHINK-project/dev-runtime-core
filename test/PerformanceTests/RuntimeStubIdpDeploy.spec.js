import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from '../resources/descriptors.js';

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
  let getDescriptor;

  before(function() {

    getDescriptor = (url) => {

      return new Promise(function(resolve, reject) {

        let dividedURL = divideURL(url);
        let identity = dividedURL.identity;

        if (!identity) {
          identity = 'default';
        } else {
          identity = identity.substring(identity.lastIndexOf('/') + 1);
        }

        let result;

        if (url.includes('protocolstub') || url === dividedURL.domain) {
          try {
            result = descriptors.ProtoStubs[identity];
          } catch (e) {
            reject(e);
          }
        } else if (url.includes('idp-proxy')) {
          try {
            result = descriptors.IdpProxies[identity];
          } catch (e) {
            reject(e);
          }
        }

        resolve(result);

      });
    };
  });

  after(function() {
    runtime.descriptorInstance.getStubDescriptor.restore();
    runtime.descriptorInstance.getIdpProxyDescriptor.restore();
  });

  describe('constructor()', function() {

    it('should load Runtime with success', (done) => {

      expect(runtime.init().then((result) => {

        sinon.stub(runtime.messageBus, 'postMessage', function(msg, replyCallback) {
          replyCallback({
            id: 1, type: 'response', from: 'domain://msg-node.sp.domain/address-allocation', to: 'local://fake.url',
            body: {code: 200, value: {allocated: msg.body.scheme + '://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d'}}
          });
        });
        sinon.stub(runtime.descriptorInstance, 'getStubDescriptor', (stubURL) => {
          return getDescriptor(stubURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor', (idpProxyURL) => {
          return getDescriptor(idpProxyURL);
        });

        return result;
      }))
      .to.be.fulfilled
      .and.to.eventually.be.true
      .and.notify(done);

    });

  });

  describe('loadStub(sp-domain)', function() {

    it('Stub should be deployed', function(done) {
      let spDomain = 'sp.domain';
      let loadStubPromise = runtime.loadStub(spDomain);

      expect(loadStubPromise).to.be.fulfilled
      .and.eventually.have.all.keys('url', 'status', 'descriptorURL')
      .and.eventually.to.have.property('url').to.include('runtime://sp.domain/protostub/')
      .and.notify(done);
    });

  });

  describe('loadIdpProxy(google.com)', function() {

    it('IDP Proxy should be deployed', function(done) {
      let domain = 'google.com';
      let loadIdpPromise = runtime.loadIdpProxy(domain);
      let stubResolved = ['url', 'status'];
      expect(loadIdpPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
      .and.notify(done);
    });

  });

});
