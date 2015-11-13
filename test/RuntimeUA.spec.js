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

  let _stubDescriptor;
  let _hypertyDescriptor;

  // Mockup the registry and messageBus
  let registry = {
    registerHyperty: function() {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    },
    discoverProtostub: function() {
      return new Promise(function(resolve, reject) {
        let stubDescriptor = {
          guid: 'guid',
          id: 'idProtoStub',
          classname: 'VertxProtoStub',
          description: 'description of ProtoStub',
          kind: 'hyperty',
          catalogueURL: '....',
          sourceCode: '../resources/VertxProtoStub.js',
          dataObject: '',
          type: '',
          messageSchema: '',
          configuration: {
            url: 'ws://localhost:9090/ws',
            runtimeURL: _this.hypertyRuntimeURL
          },
          policies: '',
          constraints: '',
          hypertyCapabilities: '',
          protocolCapabilities: ''
        };
        resolve(stubDescriptor);
      });
    },
    registerStub: function() {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    },
    getSandbox: function() {
      return new Promise(function(resolve, reject) {
        resolve(sandboxFactory.createSandbox());
      });
    },
    getAppSandbox: function() {
      return new Promise(function(resolve, reject) {
        resolve(sandboxFactory.createAppSandbox());
      });
    }
  };

  let messageBus = {
    addListener: function() {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }
  };

  describe('constructor()', function() {

    let runtime = new RuntimeUA(sandboxFactory);

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

    let runtime = new RuntimeUA(sandboxFactory);

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

    let runtime = new RuntimeUA(sandboxFactory);

    it('should get hyperty source code', function(done) {

      let hypertySourceCodeURL = _hypertyDescriptor.sourceCode;
      expect(runtime.getHypertySourceCode(hypertySourceCodeURL))
      .to.be.fulfilled.and.notify(done);

    });
  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    let runtime = new RuntimeUA(sandboxFactory);
    runtime.registry = registry;
    runtime.messageBus = messageBus;

    let hypertyDescriptorURL = 'hyperty-catalogue://sp1.pt/HelloHyperty';
    let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

    it('should throw when given no arguments', function(done) {
      expect(loadHyperty)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {

      expect(loadHyperty)
      .to.be.fulfilled
      .and.to.be.instanceof(Promise)
      .and.notify(done);

    });

    it('should be deployed', function(done) {

      let hypertyResolved = ['runtimeHypertyURL', 'status'];

      expect(loadHyperty).to.be.fulfilled
      .and.eventually.to.have.all.keys(hypertyResolved)
      .and.notify(done);

    });

  });

  describe('getStubDescriptor(domainURL)', function() {

    let runtime = new RuntimeUA(sandboxFactory);

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
      let domainURL = 'sp1.pt';
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

    let runtime = new RuntimeUA(sandboxFactory);

    it('should get hyperty source code', function(done) {

      let stubSourceCodeURL = _stubDescriptor.sourceCode;
      expect(runtime.getStubSourceCode(stubSourceCodeURL))
      .to.be.fulfilled.and.notify(done);

    });
  });

  describe('loadStub(sp-domain)', function() {

    let runtime = new RuntimeUA(sandboxFactory);
    runtime.registry = registry;
    runtime.messageBus = messageBus;

    let spDomain = 'ptinovacao.pt';
    let loadStubPromise = runtime.loadStub(spDomain);

    it('should throw when given no arguments', function(done) {
      expect(loadStubPromise)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {
      expect(loadStubPromise).to.be.fulfilled
      .to.be.instanceof(Promise)
      .and.notify(done);
    });

    it('should be deployed', function(done) {
      let stubResolved = ['runtimeProtoStubURL', 'status'];
      expect(loadStubPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
      .and.notify(done);
    });

  });

});
