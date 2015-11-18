import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

chai.use(chaiAsPromised);

// Main dependecies
import Registry from '../src/registry/Registry';
import SandboxFactory from '../resources/sandboxes/SandboxFactory';
import SandboxBase from '../src/sandbox/Sandbox';
import MessageBus from '../src/bus/MessageBus';

// Testing Registry
// some simple tests to test functions
//TODO improve later the expected result from the protosub, where the result is random.

let runtimeURL = 'hyperty-runtime://sp1/123';

let sandboxFactory = new SandboxFactory();
let appSandbox = sandboxFactory.createAppSandbox();

let getRegistry = new Promise(function(resolve, reject) {
  var registry = new Registry(runtimeURL, appSandbox);
  resolve(registry);
});

//registry = new Registry(msgbus, runtimeURL, appSandbox);
getRegistry.then(function(registry) {
  describe('Registry', function() {
    let msgbus = new MessageBus(registry);
    registry.messageBus = msgbus;

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
        })).to.be.fulfilled.and.eventually.to.not.be.null;

      });
    });

    describe('discoverProtostub(url)', function(done) {

      it('should discover a ProtocolStub', function() {
        let url = 'sp1';

        expect(registry.discoverProtostub(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.not.be.null;
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

      it('should register an Hyperty', function() {
        let sandbox = new SandboxBase('sp1');
        let descriptor = 'hyperty-catalogue://sp1/<catalogue-object-identifier>';

        expect(registry.registerHyperty(sandbox, descriptor).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.not.be.null;

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
