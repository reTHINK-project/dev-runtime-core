import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from './resources/descriptors.js';

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PEP from '../src/policy/PEP';
import MessageBus from '../src/bus/MessageBus';

import { divideURL } from '../src/utils/utils';

import { runtimeFactory } from './resources/runtimeFactory';

/// import { runtimeConfiguration } from './resources/runtimeConfiguration';

// Testing runtimeUA;
describe('RuntimeUA', function() {
  let runtime = new RuntimeUA(descriptors.Runtimes.Runtime, runtimeFactory, 'localhost');
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

        if (url.includes('Hyperties') || url.includes('Hyperty')) {
          try {
            result = descriptors.Hyperties[identity];
          } catch (e) {
            reject(e);
          }

        } else if (!(url.includes('Hyperties') || url.includes('Hyperty')) || url.includes('ProtoStubs') || url.includes('protostub')) {
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

        console.log(result);
        resolve(result);

      });
    };

  });

  after(function() {
    runtime.loader.descriptors.getHypertyDescriptor.restore();
    runtime.loader.descriptors.getStubDescriptor.restore();
    runtime.loader.descriptors.getIdpProxyDescriptor.restore();
  });

  describe('constructor()', function() {

    it('expects the runtime was ready', (done) => {

      expect(runtime.init().then((result) => {

        sinon.stub(runtime.descriptorInstance, 'getHypertyDescriptor', (hypertyURL) => {
          return getDescriptor(hypertyURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getStubDescriptor', (stubURL) => {
          return getDescriptor(stubURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor', (idpProxyURL) => {
          return getDescriptor(idpProxyURL);
        });

        sinon.stub(runtime.registry, 'registerHyperty')
        .returns(new Promise(function(resolve) {
          resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
        }));

        sinon.stub(runtime.registry, 'checkRegisteredURLs')
        .returns(new Promise((resolve) => {
          resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
        }));

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

      expect(loadHyperty).to.be.fulfilled
      .and.eventually.to.have.all.keys(hypertyResolved)
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
      let stubResolved = ['url', 'status'];

      expect(loadStubPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
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
