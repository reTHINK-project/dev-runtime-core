import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

chai.use(chaiAsPromised);

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';

import SandboxFactory from './resources/sandboxes/SandboxFactory';

// Testing runtimeUA;
describe('RuntimeUA', function() {

  // Only for testing
  let runtimeURL = 'hyperty-runtime://sp1/protostub/123';

  let sandboxFactory = new SandboxFactory();
  let runtime = new RuntimeUA(sandboxFactory);

  let _stubDescriptor;
  let _hypertyDescriptor;

  describe('constructor()', function() {

    before(function(done) {
      // Mockup to open the database before all tests running
      // Because the Registry have precistence
      let DB_NAME = 'registry-DB';
      let DB_VERSION = 1;

      let request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onsuccess = function(event) {
        done();
      };

    });

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

  describe('getHypertyDescriptor(hypertyURL)', function() {

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
      let hypertyDescriptorURL = 'hyperty-catalogue://sp1/HelloHyperty';
      expect(runtime.getHypertyDescriptor(hypertyDescriptorURL).then(function(hypertyDescriptor) {
        _hypertyDescriptor = hypertyDescriptor;
        return _hypertyDescriptor;
      }))
      .to.be.fulfilled
      .and.eventually.to.have.all.keys(descriptorValidation)
      .and.notify(done);

    });

  });

  describe('getHypertySourceCode(hypertySourceCodeURL)', function() {

    it('should get hyperty source code', function(done) {

      let hypertySourceCodeURL = _hypertyDescriptor.sourceCode;
      expect(runtime.getHypertySourceCode(hypertySourceCodeURL))
      .to.be.fulfilled.and.notify(done);

    });
  });

  describe('getStubDescriptor(domainURL)', function() {

    it('should get Stub descriptor', function(done) {

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
      let domainURL = 'hyperty-catalogue://sp1/HelloHyperty';
      expect(runtime.getStubDescriptor(domainURL).then(function(stubDescriptor) {
        _stubDescriptor = stubDescriptor;
        return _stubDescriptor;
      }))
      .to.be.fulfilled
      .and.eventually.to.have.all.keys(descriptorValidation)
      .and.notify(done);

    });

  });

  describe('getStubSourceCode(stubSourceCodeURL)', function() {

    it('should get hyperty source code', function(done) {

      let stubSourceCodeURL = _stubDescriptor.sourceCode;
      expect(runtime.getStubSourceCode(stubSourceCodeURL))
      .to.be.fulfilled.and.notify(done);

    });
  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    it('should throw when given no arguments', function() {
      expect(runtime.loadHyperty).to.throw(Error);
    });

    it.skip('should be a Promise', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp1/HelloHyperty';
      expect(runtime.loadHyperty(hypertyDescriptorURL))
      .to.be.fulfilled
      .and.to.be.instanceof(Promise)
      .and.notify(done);

    });

    it.skip('should be deployed', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp1/HelloHyperty';
      expect(runtime.loadHyperty(hypertyDescriptorURL)).to.be.fulfilled
      .and.notify(done);

    });

  });

  describe('loadStub(sp-domain)', function() {

    let spDomain = 'ptinovacao.pt';

    it('should throw when given no arguments', function() {
      let loadStubPromise = runtime.loadStub;
      expect(loadStubPromise).to.throw();
    });

    it.skip('should be a Promise', function(done) {
      expect(runtime.loadStub(spDomain)).to.be.fulfilled
      .to.be.instanceof(Promise)
      .and.notify(done);
    });

    it.skip('should be deployed', function(done) {
      expect(runtime.loadStub(spDomain)).to.be.fulfilled.and.notify(done);
    });

  });

});
