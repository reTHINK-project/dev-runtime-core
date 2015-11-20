import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

import RuntimeCatalogue from '../src/runtime/RuntimeCatalogue';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';

import SandboxFactory from './resources/sandboxes/SandboxFactory';

// Testing runtimeUA;
describe('RuntimeUA', function() {

  // Only for testing
  let runtimeURL = 'runtime://sp1/123';
  let sandboxFactory = new SandboxFactory();
  let runtime = new RuntimeUA(sandboxFactory);

  let _stubDescriptor;
  let _hypertyDescriptor;

  before(function() {

    // Mockup the source code request
    let mockup = {
      activate:function() {
        console.log('activated');
      }
    };

    sinon.stub(runtime.runtimeCatalogue, '_makeExternalRequest')
    .returns(new Promise(function(resolve, reject) {
      resolve(mockup);
    }));

    sinon.stub(runtime.registry, 'registerHyperty')
    .returns(new Promise(function(resolve, reject) {
      resolve('hyperty://sp1.pt/9c8c1949-e08e-4554-b201-bab201bdb21d');
    }));

    sinon.stub(runtime.registry, 'discoverProtostub')
    .returns(new Promise(function(resolve, reject) {
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
          runtimeURL: runtimeURL
        },
        policies: '',
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: ''
      };

      resolve(stubDescriptor);
    }));

    sinon.stub(runtime.registry, 'registerStub')
    .returns(new Promise(function(resolve, reject) {
      resolve('msg-node.sp1.pt/protostub/8541');
    }));

    sinon.stub(runtime.registry, 'getSandbox')
    .returns(new Promise(function(resolve, reject) {
      resolve(sandboxFactory.createSandbox());
    }));

    sinon.stub(runtime.registry, 'getAppSandbox')
    .returns(new Promise(function(resolve, reject) {
      resolve(sandboxFactory.createAppSandbox());
    }));

    sinon.stub(runtime.messageBus, 'addListener')
    .returns(new Promise(function(resolve, reject) {
      resolve();
    }));

  });

  after(function() {
    runtime.runtimeCatalogue._makeExternalRequest.restore();
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
      expect(runtime).to.have.property('sandboxFactory');
    });

  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    it('should throw when given no arguments', function(done) {
      let hypertyDescriptorURL = 'hyperty-catalogue://sp1.pt/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp1.pt/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.to.be.instanceof(Promise)
      .and.notify(done);

    });

    it('should be deployed', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp1.pt/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      let hypertyResolved = ['runtimeHypertyURL', 'status'];

      expect(loadHyperty).to.be.fulfilled
      .and.eventually.to.have.all.keys(hypertyResolved)
      .and.notify(done);

    });

  });

  describe('loadStub(sp-domain)', function() {

    it('should throw when given no arguments', function(done) {
      let spDomain = 'sp1.pt';
      let loadStubPromise = runtime.loadStub(spDomain);

      expect(loadStubPromise)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {
      let spDomain = 'sp1.pt';
      let loadStubPromise = runtime.loadStub(spDomain);

      expect(loadStubPromise).to.be.fulfilled
      .to.be.instanceof(Promise)
      .and.notify(done);
    });

    it('should be deployed', function(done) {
      let spDomain = 'sp1.pt';
      let loadStubPromise = runtime.loadStub(spDomain);
      let stubResolved = ['runtimeProtoStubURL', 'status'];

      expect(loadStubPromise).to.be.fulfilled
      .and.eventually.to.have.all.keys(stubResolved)
      .and.notify(done);
    });

  });

});
