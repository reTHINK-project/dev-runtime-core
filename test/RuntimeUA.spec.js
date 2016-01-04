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

  before(function() {

    let Hyperties = {
      HelloHyperty: {
        guid:'guid',
        id:'HelloHyperty',
        classname:'activate',
        description:'description of Hello Hyperty',
        kind:'hyperty',
        catalogueURL:'....',
        sourcePackageURL:'../resources/descriptors/HelloHyperty-sourcePackageURL.json',
        dataObject:'',
        type:'',
        messageSchema:'',
        policies:'',
        constraints:'',
        hypertyCapabilities:'',
        protocolCapabilities:''
      },
      WorldHyperty:{
        guid:'guid',
        id:'WorldHyperty',
        classname:'activate',
        description:'description of World Hyperty',
        kind:'hyperty',
        catalogueURL:'....',
        sourcePackageURL:'../resources/descriptors/WorldHyperty-sourcePackageURL.json',
        dataObject:'',
        type:'',
        messageSchema:'',
        policies:'',
        constraints:'',
        hypertyCapabilities:'',
        protocolCapabilities:''
      }
    };

    let ProtoStubs = {
      'sp.domain': {
        guid: 'guid',
        id: 'VertxProtoStub',
        classname: 'activate',
        description: 'description of ProtoStub',
        kind: 'Protostub',
        catalogueURL: '....',
        sourcePackageURL: '../resources/descriptors/VertxProtoStub-sourcePackageURL.json',
        dataObject: '',
        type: '',
        messageSchema: '',
        configuration: {
          url: 'wss://msg-node.ua.pt:9090/ws'
        },
        policies: '',
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: ''
      }
    };

    // Mockup the source code request
    let mockup = {
      encoding: 'UTF-8',
      sourceCodeClasname: 'HelloHyperty',
      sourceCode: '',
      signature: ''
    };

    let mockupHypertyDescriptor = sinon.stub(runtime.runtimeCatalogue, 'mockupHypertyDescriptor');
    mockupHypertyDescriptor.returns(new Promise(function(resolve, reject) {
      runtime.runtimeCatalogue.Hyperties = Hyperties;
      resolve(Hyperties);
    }));

    let mockupStubDescriptor = sinon.stub(runtime.runtimeCatalogue, 'mockupStubDescriptor');
    mockupStubDescriptor.returns(new Promise(function(resolve, reject) {
      runtime.runtimeCatalogue.ProtoStubs = ProtoStubs;
      resolve(ProtoStubs);
    }));

    let tes = sinon.stub(runtime.runtimeCatalogue, '_makeExternalRequest');
    tes.returns(new Promise(function(resolve, reject) {
      resolve(JSON.stringify(mockup));
    }));

    sinon.stub(runtime.registry, 'registerHyperty')
    .returns(new Promise(function(resolve, reject) {
      resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
    }));

    sinon.stub(runtime.registry, 'discoverProtostub')
    .returns(new Promise(function(resolve, reject) {
      let stubDescriptor = ProtoStubs['sp.domain'];

      resolve(stubDescriptor);
    }));

    sinon.stub(runtime.registry, 'registerStub')
    .returns(new Promise(function(resolve, reject) {
      resolve('msg-node.sp.domain/protostub/8541');
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
      let hypertyDescriptorURL = 'hyperty-catalogue://sp.domain/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.notify(done);
    });

    it('should be a Promise', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp.domain/HelloHyperty';
      let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

      expect(loadHyperty)
      .to.be.fulfilled
      .and.to.be.instanceof(Promise)
      .and.notify(done);

    });

    it('should be deployed', function(done) {

      let hypertyDescriptorURL = 'hyperty-catalogue://sp.domain/HelloHyperty';
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

      expect(loadStubPromise)
      .to.be.fulfilled
      .and.notify(done);
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

});
