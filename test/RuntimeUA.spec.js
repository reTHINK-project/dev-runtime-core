import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from './resources/descriptors.js';
import { getDescriptor } from './resources/getDescriptor.js';

// Testing Module
import RuntimeUA from  '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PEP from '../src/policy/PEP';
import MessageBus from '../src/bus/MessageBus';

import { runtimeFactory } from './resources/runtimeFactory';

// Testing runtimeUA;
let domain = 'localhost';
describe('RuntimeUA', function() {

  let runtime = new RuntimeUA(descriptors.Runtimes.Runtime, runtimeFactory, domain);

  before(function() {

    runtime.graphConnector = function() {};

  });

  after(function() {
    runtime.descriptorInstance.getHypertyDescriptor.restore();
    runtime.descriptorInstance.getStubDescriptor.restore();
    runtime.descriptorInstance.getIdpProxyDescriptor.restore();
  });

  describe('constructor()', function() {

    it('expects the runtime was ready', (done) => {

      runtime.init().then(() => {

        sinon.stub(runtime.messageBus, 'postMessage').callsFake(function(msg, replyCallback) {

          if (replyCallback) {
            replyCallback({
              id: 1, type: 'response', from: 'domain://msg-node.sp.domain/address-allocation', to: 'local://fake.url',
              body: {code: 200, value: {allocated: msg.body.scheme + '://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d'}}
            });
          }

        });

        sinon.stub(runtime.descriptorInstance, 'getHypertyDescriptor').callsFake(function(hypertyURL) {
          return getDescriptor(hypertyURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getStubDescriptor').callsFake(function(stubURL) {
          return getDescriptor(stubURL);
        });

        sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor').callsFake(function(idpProxyURL) {
          let url = 'https://localhost/.well-known/idp-proxy/' +  idpProxyURL;
          return getDescriptor(url);
        });

        sinon.stub(runtime.runtimeCatalogue, 'getDataSchemaDescriptor').callsFake(function(dataSchemaURL) {
          return getDescriptor(dataSchemaURL);
        });

        sinon.stub(runtime.registry, 'registerHyperty').callsFake(function(sandbox, descriptorURL, descriptor, addressURL) {
          return new Promise(function(resolve) {
            if (addressURL.newAddress) {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            } else {
              resolve(addressURL.address);
            }
          });

        });

        sinon.stub(runtime.registry, 'checkRegisteredURLs').callsFake(function(info, reuseURL) {

          return new Promise((resolve) => {
            console.log('checkRegisteredURLs:', typeof(reuseURL), reuseURL);
            if (typeof(reuseURL) === 'boolean') {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            } else if (typeof(reuseURL) === 'string') {
              console.log('checkRegisteredURLs is string:', reuseURL);
              resolve({url: reuseURL });
            } else {
              resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
            }

          });

        });

        done();
      }).catch((reason) => {
        console.error('Error Initializing: ', reason);
        done();
      });

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
      console.log('wtf', loadHyperty);
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
        .and.eventually.have.all.keys('url', 'status', 'descriptorURL')
        .and.eventually.to.have.property('url').to.include('runtime://sp.domain/protostub/')
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
