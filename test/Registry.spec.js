import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

chai.use(chaiAsPromised);

// Main dependecies
import Registry from '../src/registry/Registry';
import SandboxFactoryTest from './resources/sandboxes/SandboxFactoryTest';
import SandboxBase from '../src/sandbox/Sandbox';
import MessageBus from '../src/bus/MessageBus';

// Testing Registry
// some simple tests to test functions

let registry;
let msgbus = new MessageBus(registry);

let runtimeURL = 'hyperty-runtime://sp1/123';

let sandboxFactory = new SandboxFactoryTest();
let appSandbox = sandboxFactory.createAppSandbox();

let getRegistry = new Promise(function(resolve, reject) {
  resolve(new Registry(msgbus, runtimeURL, appSandbox));
});

//registry = new Registry(msgbus, runtimeURL, appSandbox);
getRegistry.then(function(registry) {
  describe('Registry', function() {

    describe('constructor()', function() {

      it('depends of the MessageBus', function() {
        expect(registry.messageBus).to.be.instanceof(MessageBus);
      });
    });

    describe('getAppSandbox()', function() {
      it('return AppSandbox()', function() {
        let sandbox = registry.getAppSandbox();
        expect(sandbox).to.not.be.null;
      });
    });

    describe('registerStub(sandBox, domainURL)', function(done) {

      it('should register a stub', function() {
        let sandBox = new SandboxBase('sp1');
        let domainURL = 'sp1';

        expect(registry.registerStub(sandBox, domainURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('sp1/protostub/123');

      });
    });

    describe('discoverProtostub(url)', function(done) {

      it('should discover a ProtocolStub', function() {
        let url = 'sp1';

        expect(registry.discoverProtostub(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('sp1/protostub/123');
      });
    });

    describe('getSandbox(url)', function(done) {

      it('should get a sandbox from the url', function() {
        let url = 'sp1';

        expect(registry.getSandbox(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.not.be.null;

      });
    });

    describe('unregisterStub(url)', function(done) {

      it('should unregister a ProtocolStub', function() {
        let url = 'sp1';

        expect(registry.unregisterStub(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('ProtostubURL removed');

      });
    });

    describe('registerPEP(postMessage, hyperty)', function(done) {

      it('should register PEP', function() {
        let postMessage = {};
        let hyperty = 'test';

        expect(registry.registerPEP(postMessage, hyperty).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('test/pep');

      });
    });

    describe('unregisterPEP(HypertyRuntimeURL)', function(done) {

      it('should unregister PEP', function() {
        let HypertyRuntimeURL = 'test';

        expect(registry.unregisterPEP(HypertyRuntimeURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal(' PEP sucessfully deleted');

      });
    });

    describe('registerHyperty(sandbox, descriptor)', function(done) {

      it.skip('should register an Hyperty', function() {
        let sandBox = new SandboxBase('sp1');
        let descriptor = 'hyperty-catalogue://sp1/<catalogue-object-identifier>';

        registry.registerHyperty(sandbox, descriptor).then(
          function(result) {
            // value returned from the message simulated in the registry.
            result.should.equal('hyperty-runtime://sp1/123');
            done();
          },
          function(err) {
            done(err);
          }
        );
      });
    });

    describe('resolve(url)', function(done) {

      it('should return a protostub url', function() {
        let url = 'hyperty-runtime://sp1/protostub/123';

        expect(registry.resolve(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.not.be.null;

      });
    });

  });

});
