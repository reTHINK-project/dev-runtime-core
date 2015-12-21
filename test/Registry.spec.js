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

let runtimeURL = 'hyperty-runtime://ua.pt/123';

let sandboxFactory = new SandboxFactory();
let appSandbox = sandboxFactory.createAppSandbox();
let identityModule = {
  getIdentities: () => {
    let identities = [];
    let identityBundle = {identity: 'user://gmail.com/openidtest10', token: 'idToken'};
    identities.push(identityBundle);
    return identities;
  }
};

let getRegistry = new Promise(function(resolve, reject) {
  var registry = new Registry(runtimeURL, appSandbox, identityModule);
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

    describe('registerStub(sandBox, domainURL)', function() {

      it('should register a stub', function(done) {
        let sandBox = new SandboxBase('ua.pt');
        let domainURL = 'ua.pt';

        expect(registry.registerStub(sandBox, domainURL).then(function(done) {
          return done;
        })).to.be.fulfilled.and.eventually.to.contain('msg-node.ua.pt/protostub/').and.notify(done);

      });
    });

    describe('discoverProtostub(url)', function() {

      it('should discover a ProtocolStub', function(done) {
        let url = 'ua.pt';

        expect(registry.discoverProtostub(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.contain('msg-node.ua.pt/protostub/').and.notify(done);
      });
    });

    describe('getSandbox(url)', function() {

      it('should get a sandbox from the url', function(done) {
        let url = 'ua.pt';

        expect(registry.getSandbox(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.not.be.null.and.notify(done);

      });
    });

    describe('registerPEP(postMessage, hyperty)', function() {

      it('should register PEP', function(done) {
        let postMessage = {};
        let hyperty = 'hyperty-catalogue://ua.pt/HelloHyperty';

        expect(registry.registerPEP(postMessage, hyperty).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('PEP registered with success').and.notify(done);

      });
    });

    describe('unregisterPEP(HypertyRuntimeURL)', function() {

      it('should unregister PEP', function(done) {
        let HypertyRuntimeURL = 'hyperty-catalogue://ua.pt/HelloHyperty';

        expect(registry.unregisterPEP(HypertyRuntimeURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('PEP successfully removed.').and.notify(done);

      });
    });

    describe('registerHyperty(sandbox, descriptor)', function() {

      it('should register an Hyperty', function(done) {
        let sandbox = new SandboxBase('ua.pt');
        let descriptor = 'hyperty-catalogue://ua.pt/<catalogue-object-identifier>';

        let protoStub = registry.discoverProtostub('ua.pt');
        registry.messageBus.addListener('domain://msg-node.ua.pt/hyperty-address-allocation', (msg) => {
          message = {id: 1, type: 'response', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: msg.from,
          body: {code: 200, allocated: ['hyperty-instance://ua.pt/1']}};

          registry.messageBus.postMessage(message, (reply) => {
            console.log('Reply: ', reply);
          });
        });

        expect(registry.registerHyperty(sandbox, descriptor).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('hyperty-instance://ua.pt/1').and.notify(done);

      });
    });

    describe('resolve(url)', function() {

      it('should return a protostub url', function(done) {
        let url = 'hyperty-runtime://ua.pt/protostub/123';

        expect(registry.resolve(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.contain('msg-node.ua.pt/protostub/').and.notify(done);

      });
    });

    describe('unregisterStub(url)', function() {

      it('should unregister a ProtocolStub', function(done) {
        let url = 'ua.pt';

        expect(registry.unregisterStub(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('ProtostubURL removed').and.notify(done);

      });
    });

    describe('unregisterHyperty(url)', function() {
      it('should unregister an Hyperty', function(done) {
        let url = 'hyperty-instance://ua.pt/1';

        expect(registry.unregisterHyperty(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('Hyperty successfully deleted').and.notify(done);
      });
    });
  });

});
