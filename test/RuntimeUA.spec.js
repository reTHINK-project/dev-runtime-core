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

// Mockup code, for tests;
class SandboxBrowser {

  constructor() {
    console.log('Sandbox Browser');
  }

}

class AppSandboxBrowser {

  constructor() {
    console.log('App Sandbox Browser');
  }

}

class SandboxFactoryTest {

  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;
  }

  createSandbox() {
    let _this = this;
    return new SandboxBrowser(_this._messageBus);
  }

  createAppSandbox() {
    let _this = this;
    return new AppSandboxBrowser(_this._messageBus);
  }

  removeSandbox() {

  }

}

// Testing runtimeUA;
describe('RuntimeUA', function() {

  // Only for testing
  let runtimeURL = 'hyperty-runtime://sp1/protostub/123';

  let sandboxFactory = new SandboxFactoryTest();

  let runtime = new RuntimeUA(sandboxFactory);

  let messageBus = new MessageBus(registry);

  let registry = new Registry(runtimeURL);
  registry.registerMessageBus(messageBus);

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
  });

  describe('loadHyperty(hypertyDescriptorURL)', function() {

    let hypertyDescriptorURL = 'test/resources/helloHyperty.js';
    let loadHyperty = runtime.loadHyperty(hypertyDescriptorURL);

    it('should throw when given no arguments', function() {
      expect(runtime.loadHyperty).to.throw();
    });

    it('should be a Promise', function() {
      expect(loadHyperty).to.be.instanceof(Promise);
    });

    it('should be deployed', function() {
      // TODO: pass valid arguments to be deployed;
      // expect(loadHyperty).be.fulfilled.and.notify(done);
    });

    it('should be rejected', function(done) {
      // TODO: make the load hyperty fail;
      expect(loadHyperty).be.rejected.and.notify(done);
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

    it('should be deployed', function(done) {
      // TODO: make the promise to loadStub and has successfully deployed
      // TODO: need the server to run and teste the runtimeUA;
      // let loadStubPromise = runtime.loadStub(spDomain);
      // expect(loadStubPromise).be.fulfilled.and.notify(done);
      done();
    });

    it('should be rejected', function(done) {
      // TODO: make the load hyperty fail;
      // let loadStubPromise = runtime.loadStub(spDomain);
      // expect(loadStubPromise).be.rejected.and.notify(done);
      done();
    });

  });

});
