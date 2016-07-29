import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';
import {RuntimeCatalogueLocal} from 'service-framework/dist/RuntimeCatalogue';

import { divideURL } from '../src/utils/utils';

import Loader from '../src/runtime/Loader';

import RuntimeFactory from './resources/RuntimeFactory';

// Testing runtimeUA;
describe('RuntimeUA', function() {

  // Only for testing
  let runtimeFactory = new RuntimeFactory();
  let runtime = new RuntimeUA(runtimeFactory, 'sp.domain');

  // Testing with the Local Runtime and Catalogue
  runtime.runtimeCatalogue = new RuntimeCatalogueLocal(runtimeFactory);

  runtime.loader = new Loader();
  runtime.loader.registry = runtime.registry;
  runtime.loader.runtimeURL = runtime.runtimeURL;
  runtime.loader.messageBus = runtime.messageBus;
  runtime.loader.runtimeCatalogue = runtime.runtimeCatalogue;
  runtime.loader.runtimeFactory = runtime.runtimeFactory;

  before(function() {

    let Hyperties = {
      HelloHyperty: {
        sourcePackage: {
          sourceCode: '',
          sourceCodeClassname: 'HelloHyperty',
          encoding: 'UTF-8',
          signature: ''
        },
        cguid: 10003,
        version: 0.1,
        description: 'Description of GroupChat',
        objectName: 'HelloHyperty',
        configuration: {},
        hypertyType: [
          'chat'
        ],
        sourcePackageURL: '/sourcePackage',
        language: 'javascript',
        signature: '',
        messageSchemas: '',
        dataObjects: [
          'https://catalogue.sp.domain/.well-known/dataschema/Communication'
        ],
        accessControlPolicy: 'somePolicy'
      }
    };

    let ProtoStubs = {
      default: {
        cguid: '1',
        type: '0',
        version: '0.1',
        description: 'description of VertxProtoStub',
        objectName: 'VertxProtoStub',
        sourcePackageURL: '/sourcePackage',
        sourcePackage: {
          sourceCode: '',
          sourceCodeClassname: 'VertxProtoStub',
          encoding: 'Base64',
          signature: ''
        },
        language: 'Javascript ECMA5',
        signature: '',
        messageSchemas: '',
        configuration: {
          url: 'wss://127.0.0.1:9090/ws'
        },
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: '',
        policies: '',
        dataObjects: []
      }
    };

    sinon.stub(runtime.runtimeCatalogue, '_createHyperty', function(_this, rawHyperty) {
      console.log('getHypertyDescriptor: ', _this);
      return rawHyperty;
    });

    sinon.stub(runtime.runtimeCatalogue, '_createStub', function(_this, rawHyperty) {
      return rawHyperty;
    });

    sinon.stub(runtime.runtimeCatalogue, '_createRuntimeDescriptor', function(_this, rawHyperty) {
      return rawHyperty;
    });

    sinon.stub(runtime.runtimeCatalogue, '_createDataSchema', function(_this, rawHyperty) {
      return rawHyperty;
    });

    sinon.stub(runtime.runtimeCatalogue, '_createIdpProxy', function(_this, rawHyperty) {
      return rawHyperty;
    });

    sinon.stub(runtime.runtimeCatalogue, 'getHypertyDescriptor', function(hypertyURL) {
      let _this = this;
      return _this.getDescriptor(hypertyURL, runtime.runtimeCatalogue._createHyperty);
    });

    sinon.stub(runtime.runtimeCatalogue, 'getStubDescriptor', function(stubURL) {
      let _this = this;
      return _this.getDescriptor(stubURL, runtime.runtimeCatalogue._createStub);
    });

    sinon.stub(runtime.runtimeCatalogue, 'getRuntimeDescriptor', function(runtimeURL) {
      let _this = this;
      return _this.getDescriptor(runtimeURL, runtime.runtimeCatalogue._createRuntimeDescriptor);
    });

    sinon.stub(runtime.runtimeCatalogue, 'getDataSchemaDescriptor', function(dataSchemaURL) {
      let _this = this;
      return _this.getDescriptor(dataSchemaURL, runtime.runtimeCatalogue._createDataSchema);
    });

    sinon.stub(runtime.runtimeCatalogue, 'getIdpProxyDescriptor', function(idpProxyURL) {
      let _this = this;
      return _this.getDescriptor(idpProxyURL, runtime.runtimeCatalogue._createIdpProxy);
    });

    sinon.stub(runtime.runtimeCatalogue, 'getDescriptor', (url, createFunc) => {

      return new Promise(function(resolve, reject) {
        console.log(url, createFunc);

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
            result = Hyperties[identity];
          } catch (e) {
            reject(e);
          }

        } else if (!(url.includes('Hyperties') || url.includes('Hyperty')) || url.includes('ProtoStubs') || url.includes('protostub')) {
          try {
            result = ProtoStubs[identity];
          } catch (e) {
            reject(e);
          }
        }

        console.log(result);

        // console.log('creating descriptor based on: ', result);
        let descriptor = createFunc(runtime.runtimeCatalogue, result);

        // persistenceManager.set(descriptorURL, descriptor.version, result);
        // console.log('created descriptor object:', hyperty);
        resolve(descriptor);

      });
    });

    sinon.stub(runtime.registry, 'registerHyperty')
    .returns(new Promise(function(resolve, reject) {
      resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
    }));

  });

  after(function() {
    // runtime.runtimeCatalogue.getDescriptor.restore();

    runtime.runtimeCatalogue.getHypertyDescriptor.restore();
    runtime.runtimeCatalogue.getStubDescriptor.restore();
    runtime.runtimeCatalogue.getRuntimeDescriptor.restore();
    runtime.runtimeCatalogue.getDataSchemaDescriptor.restore();
    runtime.runtimeCatalogue.getIdpProxyDescriptor.restore();

    runtime.runtimeCatalogue._createStub.restore();
    runtime.runtimeCatalogue._createRuntimeDescriptor.restore();
    runtime.runtimeCatalogue._createDataSchema.restore();
    runtime.runtimeCatalogue._createIdpProxy.restore();
    runtime.runtimeCatalogue._createHyperty.restore();
  });

  describe('constructor()', function() {

    it('depends of the Registry', function() {
      expect(runtime.registry).to.be.instanceof(Registry);
    });

    it('depends of the Identity Module', function() {
      expect(runtime.identityModule).to.be.instanceof(IdentityModule);
    });

    it('depends of the Policy Engine', function() {
      expect(runtime.policyEngine).to.be.instanceof(PolicyEngine);
    });

    it('depends of the MessageBus', function() {
      expect(runtime.messageBus).to.be.instanceof(MessageBus);
    });

    it('should throw when given no arguments', function() {
      expect(runtime).to.have.property('runtimeFactory');
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
      let stubResolved = ['runtimeProtoStubURL', 'status'];

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
      let stubResolved = ['runtimeIdpProxyURL', 'status'];

      expect(loadIdpPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
      .and.notify(done);
    });

  });

});
