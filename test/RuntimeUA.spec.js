import chai from 'chai';
let expect = chai.expect;

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
  let registry = new Registry(runtimeURL);
  let messageBus = new MessageBus(registry);

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

  describe('loadHyperty(HypertyDescriptorURL)', function() {

    describe('describe the status of load hyperty', function() {

      it('should return Hyperty Registration Status', function(done) {

        let hypertyURL = 'ptinovacao.pt';
        let hyperty = runtime.loadHyperty(hypertyURL);
        let hypertyRegistration = {};

        hyperty.then(function(result) {
          done();
          expect(result).to.not.throw();
        }).catch(function(reason) {
          done();
          expect(reason).to.not.throw();
        });

      });

    });

  });

  describe('loadStub(domain)', function() {

    let domain = 'hyperty-runtime://sp1/protostub/123';
    let hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';
    let hypertyRuntimeURLStatus = 'hyperty-runtime://sp1/protostub/123/status';

    it('should throw when given no arguments', function() {
      expect(runtime.loadStub).to.throw();
    });

    it('should be a Promise and return status of stub', function(done) {

      let result = runtime.loadStub(domain);

      expect(result).to.be.instanceof(Promise);

      result.then(function(resolved) {
        done();
        expect(resolved).to.not.throw();
      }).catch(function(reason) {
        done();
        console.log('REASON: ', reason);
        expect(rejected).to.not.throw();
      });
    });

  });

});
