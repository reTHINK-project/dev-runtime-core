import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

// Main dependecies
import Registry from '../src/registry/Registry';
import SandboxFactory from '../resources/sandboxes/SandboxFactory';
import Sandbox from '../src/sandbox/Sandbox';
import MessageBus from '../src/bus/MessageBus';

// Testing Registry

let runtimeURL = 'hyperty-runtime://ua.pt/123';

let sandboxFactory = new SandboxFactory();
let appSandbox = sandboxFactory.createAppSandbox();
let protostubURL = 'url';
let identityModule = {
  loginWithRP: () => {
    let identityBundle = {email: 'openidtest10@gmail.com', token: 'idToken'};
    return new Promise(function(resolve, reject) {
      resolve(identityBundle);
    });
  }
};

let getRegistry = new Promise(function(resolve) {
  let registry = new Registry(runtimeURL, appSandbox, identityModule);
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
        expect(sandbox).to.be.instanceof(Sandbox);
      });
    });

    describe('registerStub(sandBox, domainURL)', function() {

      it('should register a stub', function(done) {
        let sandBox = new Sandbox('ua.pt');
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
          protostubURL = response;
          return response;
        })).to.be.fulfilled.and.eventually.to.contain('msg-node.ua.pt/protostub/').and.notify(done);
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
        let sandbox = new Sandbox('ua.pt');
        let descriptor = 'hyperty-catalogue://ua.pt/<catalogue-object-identifier>';

        registry.messageBus.addListener('domain://msg-node.ua.pt/hyperty-address-allocation', (msg) => {
          let message = {id: 1, type: 'response', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: msg.from,
          body: {code: 200, value: {allocated: ['hyperty-instance://ua.pt/1']}}};

          registry.messageBus.postMessage(message, (reply) => {
            console.log('Reply: ', reply);
          });
        });

        expect(registry.registerHyperty(sandbox, descriptor)).to.be.fulfilled.and.eventually.equal('hyperty-instance://ua.pt/1').and.notify(done);

      });
    });

    describe('getSandbox(url)', function() {

      it('should get a sandbox from a domain', function(done) {
        let domain = 'ua.pt';

        expect(registry.getSandbox(domain).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.instanceof(Sandbox).and.notify(done);

      });

      it('should get a sandbox from an hypertyIstance', function(done) {
        let hypertyInstance = 'hyperty-instance://ua.pt/1';

        expect(registry.getSandbox(hypertyInstance).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.instanceof(Sandbox).and.notify(done);
      });

      it('should get a sandbox from a domain from an url', function(done) {
        let url = 'hyperty://ua.pt/well-knownAddress/';

        expect(registry.getSandbox(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.instanceof(Sandbox).and.notify(done);
      });

      it('should get a sandbox from a protostubURL', function(done) {

        expect(registry.getSandbox(protostubURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.instanceof(Sandbox).and.notify(done);
      });

      it('should get a sandbox from a protoStub URL containing the domain', function(done) {
        let sandBox = 'fakeSandbox';
        let domainURL = 'anotherDomain.pt';

        registry.registerStub(sandBox, domainURL).then(function() {
          expect(registry.getSandbox('msg-node.anotherDomain.pt').then(function(response) {
            return response;
          })).to.be.fulfilled.and.eventually.equal(sandBox).and.notify(done);
        });

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
