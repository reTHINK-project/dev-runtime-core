import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from './resources/descriptors.js';

// Testing Module
import RuntimeUA from  '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PEP from '../src/policy/PEP';
import MessageBus from '../src/bus/MessageBus';

import { divideURL } from '../src/utils/utils';

import { runtimeFactory } from './resources/runtimeFactory';

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

        if (url.includes('hyperty')) {
          try {
            result = descriptors.Hyperties[identity];
          } catch (e) {
            reject(e);
          }

        } else if (url.includes('protocolstub') || url === dividedURL.domain) {
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
        } else if (url.includes('dataschema')) {
          try {
            result = descriptors.DataSchemas[identity];
          } catch (e) {
            reject(e);
          }

        }

        resolve(result);

      });
    };
  });

  after(function() {
    runtime.descriptorInstance.getHypertyDescriptor.restore();
    runtime.descriptorInstance.getStubDescriptor.restore();
    runtime.descriptorInstance.getIdpProxyDescriptor.restore();
  });

  describe('constructor()', function() {

    it('expects the runtime was ready', (done) => {

      expect(runtime.init().then((result) => {

        sinon.stub(runtime.messageBus, 'postMessage', function(msg, replyCallback) {
          replyCallback({
            id: 1, type: 'response', from: 'domain://msg-node.sp.domain/address-allocation', to: 'local://fake.url',
            body: {code: 200, value: {allocated: msg.body.scheme + '://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d'}}
          });
        });

        sinon.stub(runtime.descriptorInstance, 'getHypertyDescriptor', (hypertyURL) => {
          return getDescriptor(hypertyURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getStubDescriptor', (stubURL) => {
          return getDescriptor(stubURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor', (idpProxyURL) => {
          return getDescriptor(idpProxyURL);
        });

        sinon.stub(runtime.runtimeCatalogue, 'getDataSchemaDescriptor', (dataSchemaURL) => {
          return getDescriptor(dataSchemaURL);
        });

        sinon.stub(runtime.registry, 'registerHyperty', (sandbox, descriptorURL, descriptor, addressURL) => {
          return new Promise(function(resolve) {
            console.log('AQIO:', addressURL);
            if (addressURL.newAddress) {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            } else {
              resolve(addressURL.address);
            }
          });

        });

        sinon.stub(runtime.registry, 'checkRegisteredURLs', (info, reuseURL) => {

          return new Promise((resolve) => {
            console.log('checkRegisteredURLs:', typeof(reuseURL), reuseURL);
            if (typeof(reuseURL) === 'boolean') {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            } else if (typeof(reuseURL) === 'string') {
              console.log('checkRegisteredURLs is string:', reuseURL);
              resolve(reuseURL);
            } else {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            }

          });

        });

        return result;
      }))
      .to.be.fulfilled
      .and.to.eventually.be.true
      .and.notify(done);

    });

    it('depends of the Registry', function() {
      expect(runtime.registry).to.be.instanceof(Registry);
    });

    it('depends of the Identity Module', function() {
      expect(runtime.identityModule).to.be.instanceof(IdentityModule);
    });

    it('depends of the Policy Engine', function() {
      expect(runtime.policyEngine).to.be.instanceof(PEP);
    });

    it('depends of the MessageBus', function() {
      expect(runtime.messageBus).to.be.instanceof(MessageBus);
    });

    it('should throw when given no arguments', function() {
      expect(runtime).to.have.property('runtimeFactory');
      expect(runtime.runtimeFactory).to.have.property('atob');
      expect(runtime.runtimeFactory).to.have.property('persistenceManager');
      expect(runtime.runtimeFactory).to.have.property('runtimeCapabilities');
      expect(runtime.runtimeFactory).to.have.property('storageManager');
      expect(runtime.runtimeFactory).to.have.property('createSandbox');
      expect(runtime.runtimeFactory).to.have.property('createAppSandbox');
      expect(runtime.runtimeFactory).to.have.property('createHttpRequest');
      expect(runtime.runtimeFactory).to.have.property('createRuntimeCatalogue');
    });

  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    it('should throw when given no arguments', function(done) {
      let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.to.be.instanceof(Promise)
      .and.notify(done);

    });

    it('should be deployed', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);
      let hypertyResolved = ['runtimeHypertyURL', 'status'];

      expect(loadHyperty).to.eventually.to.have.all.keys(hypertyResolved)
      .and.to.be.fulfilled
      .and.notify(done);

    });

    it('should load an hyperty based on given true value for the reuse', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL, true);
      let hypertyResolved = ['runtimeHypertyURL', 'status'];

      expect(loadHyperty).to.be.fulfilled
      .and.eventually.to.have.all.keys(hypertyResolved)
      .and.notify(done);

    });

    it('should load an hyperty based on given reuse URL address', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL, 'hyperty://sp.domain/1');
      let hypertyResolved = {
        runtimeHypertyURL: 'hyperty://sp.domain/1',
        status: 'deployed'
      };

      expect(loadHyperty).to.eventually.to.deep.equal(hypertyResolved)
      .and.to.be.fulfilled
      .and.notify(done);

    });


  });

  describe('loadStub(sp-domain)', function() {

    it('should throw when given no arguments', function(done) {
      let spDomain = 'sp.domain';
      let loadStubPromise = runtime.loadStub(spDomain);

      loadStubPromise.then(function(a) {
        console.log(a);
      }).catch(function(reason) {
        console.error(reason);
      });

      expect(loadStubPromise).to.be.fulfilled.and.notify(done);
    });

    it('should be a Promise', function(done) {
      let spDomain = 'sp.domain';
      let loadStubPromise = runtime.loadStub(spDomain);

      expect(loadStubPromise).to.be.fulfilled
      .to.be.instanceof(Promise)
      .and.notify(done);
    });

    it('should be deployed', function(done) {
      let spDomain = 'sp.domain';
      let loadStubPromise = runtime.loadStub(spDomain);

      //let stubResolved = ['url', 'status'];

      expect(loadStubPromise).to.be.fulfilled
      .and.eventually.to.contain('runtime://sp.domain/protostub')
      .and.notify(done);
    });

  });

  describe('loadIdpProxy(google.com)', function() {

    it('should throw when given no arguments', function(done) {
      let domain = 'google.com';
      let loadIdpPromise = runtime.loadIdpProxy(domain);

      expect(loadIdpPromise).to.be.fulfilled.and.notify(done);
    });

    it('should be a Promise', function(done) {
      let domain = 'google.com';
      let loadIdpPromise = runtime.loadIdpProxy(domain);

      expect(loadIdpPromise).to.be.fulfilled
      .to.be.instanceof(Promise)
      .and.notify(done);
    });

    it('should be deployed', function(done) {
      let domain = 'google.com';
      let loadIdpPromise = runtime.loadIdpProxy(domain);
      let stubResolved = ['url', 'status'];

      expect(loadIdpPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
      .and.notify(done);
    });

  });

});
