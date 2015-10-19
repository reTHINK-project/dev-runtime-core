import chai from 'chai';
var expect = chai.expect;

// Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

// Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';
import Sandbox from '../src/sandbox/Sandbox';

describe('RuntimeUA', function() {

  let runtime = new RuntimeUA();
  let registry = new Registry();
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

      // TODO: test the result of promises
      result.then(function(resolved) {
        expect(resolved).to.be.a('string');
        done();
      }).catch(function(rejected) {
        expect(rejected).to.be.a('string');
        done();
      });

    });

  });

});
