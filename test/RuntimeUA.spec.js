import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

chai.use(chaiAsPromised);

// Utils
import request from '../src/utils/request';

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';

import SandboxFactoryTest from './resources/sandboxes/SandboxFactoryTest';

import mockHypertyDescriptor from './resources/hypertyDescriptor.json';
import mockHypertySourceCode from './resources/HelloHyperty.ES5.js';

// Testing runtimeUA;
describe('RuntimeUA', function() {

  // Only for testing
  let runtimeURL = 'hyperty-runtime://sp1/protostub/123';

  let sandboxFactory = new SandboxFactoryTest();
  let sandbox = sandboxFactory.createSandbox();
  let appSandbox = sandboxFactory.createAppSandbox();

  let runtime = new RuntimeUA(sandboxFactory);

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
      expect(runtime).to.have.property('sandboxFactory');
    });

  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    let getHypertyDescriptor;
    let getHypertySourceCode;
    let getHypertySandbox;
    let getAppSandbox;

    // NOTE: Probably the ajax request to get the hypertyDescriptor
    // and the hypertySourceCode should be validated also.
    // For this tests i don't use the catalogue
    // i only use local verification of that code;
    before(function() {

      getHypertyDescriptor = new Promise(function(resolve, reject) {
        resolve(mockHypertyDescriptor);
      });

      getHypertySourceCode = new Promise(function(resolve, reject) {
        resolve(mockHypertySourceCode);
      });

      getHypertySandbox = function(_hypertyDescriptorURL) {
        return new Promise(function(resolve, reject) {
          resolve(sandbox);
        });
      };

    });

    it('should throw when given no arguments', function() {
      expect(runtime.loadHyperty).to.throw(Error);
    });

    it('should be a Promise', function() {
      let hypertyURL = 'http://localhost:8080/.well-known/hyperty/MyFirstHyperty';
      expect(runtime.loadHyperty(hypertyURL)).to.be.instanceof(Promise);
    });

    it('should get hyperty descriptor', function(done) {

      //
      // guid, id, description, kind, catalogueURL,
      // sourceCode, dataObject, type, messageSchema,
      // policies, constraints, configuration,
      // hypertyCapabilities, protocolCapabilities
      //
      let descriptorValidation = [
        'guid', 'id', 'classname', 'description', 'kind', 'catalogueURL',
        'sourceCode', 'dataObject', 'type', 'messageSchema',
        'configuration', 'policies', 'constraints', 'hypertyCapabilities',
        'protocolCapabilities'
      ];

      // TODO: Check the hyperty descriptor response and compare
      // with what is defined in the specification;
      expect(getHypertyDescriptor.then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.to.have.all.keys(descriptorValidation).and.notify(done);

    });

    it('should get hyperty source code', function(done) {

      expect(getHypertySourceCode.then(function(response) {
        return response;
      })).to.be.fulfilled.and.notify(done);

    });

    it.skip('should check the Policy engine', function() {
      // TODO: Check the policy engine and handle with the result;
    });

    describe('App and Hyperty executes in same sandbox', function() {

      it('should get App Sandbox', function() {
        let _sandbox;
        _sandbox = runtime.registry.getAppSandbox();
        expect(_sandbox).to.not.be.null;
      });

    });

    describe('App and Hyperty executes in different sandboxes', function() {

      it('should get Hyperty Sandbox', function(done) {

        let _sandbox;
        _sandbox = getHypertySandbox('hypertyDescriptorURL');
        expect(_sandbox).to.be.fulfilled.and.notify(done);

      });

      it('should deploy component in the App', function(done) {

        let _sandbox;
        _sandbox = getHypertySandbox('hypertyDescriptorURL');
        expect(_sandbox.then(function(result) {
          return result.deployComponent(mockHypertySourceCode, 'componentURL', {});
        })).to.be.fulfilled.and.notify(done);

      });

      it.skip('should can register Hyperty - in the registry spec test', function(done) {

        // TODO: Check the if the hypertyURl returned for registerHyperty
        // match with the specification;
        // the match should be overide for a RegEX to validate the
        // specification hyperty URL
        let hypertyDescriptorURL = 'hyperty-catalogue://sp1/<catalogue-object-identifier>';
        expect(runtime.registry.registerHyperty(sandbox, hypertyDescriptorURL))
        .to.be.fulfilled
        .and.eventually.to.match(/hyperty-runtime:\/\/sp1\/123/)
        .and.notify(done);

      });

    });

    describe('should return the status of Hyperty', function(done) {

      it('should be deployed', function() {
        // TODO: pass valid arguments to be deployed;
        let hypertyURL = 'http://localhost:8080/.well-known/hyperty/MyFirstHyperty';
        expect(runtime.loadHyperty(hypertyURL)).be.fulfilled.and.notify(done);
      });

      it('should be rejected', function() {
        // TODO: make the load hyperty fail;
        let hypertyURL = 'http://localhost:8080/.well-known/hyperty/MyThirdHyperty';
        expect(runtime.loadHyperty(hypertyURL)).be.rejected.and.notify(done);
      });

    });

  });

  describe('loadStub(sp-domain)', function() {

    let spDomain = 'ptinovacao.pt';

    it('should throw when given no arguments', function() {
      let loadStubPromise = runtime.loadStub;
      expect(loadStubPromise).to.throw();
    });

    it('should be a Promise', function() {
      let loadStubPromise = runtime.loadStub(spDomain);
      expect(loadStubPromise).to.be.instanceof(Promise);
    });

    // TODO: Check this testes
    it('should be deployed', function(done) {
      // TODO: make the promise to loadStub and has successfully deployed
      // TODO: need the server to run and teste the runtimeUA;
      let loadStubPromise = runtime.loadStub(spDomain);
      expect(loadStubPromise).be.fulfilled.and.notify(done);
      done();
    });

    // TODO: Check this testes
    it('should be rejected', function(done) {
      // TODO: make the load hyperty fail;
      let loadStubPromise = runtime.loadStub(spDomain);
      expect(loadStubPromise).be.rejected.and.notify(done);
      done();
    });

  });

});
