import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

// Main dependecies
import Registry from '../src/registry/Registry';
import Sandbox from '../src/sandbox/Sandbox';
import MessageBus from '../src/bus/MessageBus';

import { runtimeFactory } from './resources/runtimeFactory';

// Testing Registry
let runtimeURL = 'hyperty-runtime://ua.pt/123';

let appSandbox = runtimeFactory.createAppSandbox();
let sandboxDummy = {sandbox: 'sandbox', type: 'normal'};
let protostubURL = 'url';
let identityModule = {
  getIdentityAssertion: () => {
    let identityBundle = {userProfile: {email: 'openidtest10@gmail.com', token: 'idToken', userURL: 'user://gmail.com/openidtest10'}};
    return new Promise(function(resolve, reject) {
      resolve(identityBundle);
    });
  }
};

let runtimeCatalogue = {
  getDataSchemaDescriptor: () => {
    return new Promise(function(resolve, reject) {
      let dataschema = {sourcePackage: {sourceCode: {properties: {scheme: {constant: 'value'}}}}};
      resolve(dataschema);
    });
  }
};

let getRegistry = new Promise(function(resolve) {
  let registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue);
  resolve(registry);
});

//registry = new Registry(msgbus, runtimeURL, appSandbox);
getRegistry.then(function(registry) {
  describe('Registry', function() {
    let msgbus = new MessageBus(registry);
    registry.messageBus = msgbus;

    registry.messageBus.addListener('domain://registry.ua.pt/', (msg) => {
      let responseMessage = {id: msg.id, type: 'response', to: msg.from, from: msg.to,
                              body: {code: 200}};

      msgbus.postMessage(responseMessage);
    });

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
        let domainURL = 'ua.pt';

        expect(registry.registerStub(sandboxDummy, domainURL).then(function(done) {
          return done;
        })).to.be.fulfilled.and.eventually.to.contain('msg-node.ua.pt/protostub/').and.notify(done);

      });
    });

    describe('discoverProtostub(url)', function() {

      it('should discover a ProtocolStub', function(done) {
        let url = 'ua.pt';

        expect(registry.discoverProtostub(url).then((result) => {
          expect(result).to.have.property('url').include('msg-node.ua.pt/protostub/');
          expect(result).to.have.property('status', 'deployed');
          protostubURL = result.url;
          return result;
        }))
        .and.eventually.to.have.all.keys('url', 'status')
        .and.to.be.fulfilled
        .and.notify(done);
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

    describe('registerHyperty(sandbox, descriptorURL, descriptor)', function() {

      it('should register an Hyperty', function(done) {

        let descriptorURL = 'hyperty-catalogue://ua.pt/<catalogue-object-identifier>';
        let descriptor = {
          _objectName: 'hyperty-chat',
          dataObjects: ['url'],
          hypertyType: ['comm']
        };

        registry.messageBus.addListener('domain://msg-node.ua.pt/hyperty-address-allocation', (msg) => {
          let message = {id: 1, type: 'response', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: msg.from,
          body: {code: 200, value: {allocated: ['hyperty://ua.pt/1']}}};

          registry.messageBus.postMessage(message, (reply) => {
            console.log('Reply: ', reply);
          });
        });

        expect(registry.registerHyperty(sandboxDummy, descriptorURL, descriptor)).to.be.fulfilled.and.eventually.equal('hyperty://ua.pt/1').and.notify(done);

      });
    });

    describe('getSandbox(url)', function() {

      it('should get a sandbox from a domain', function(done) {
        let domain = 'ua.pt';

        expect(registry.getSandbox(domain).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.eql(sandboxDummy).and.notify(done);

      });

      it('should get a sandbox from a specific hypertyIstance', function(done) {
        let hypertyInstance = 'hyperty://ua.pt/1';

        expect(registry.getSandbox(hypertyInstance).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.to.be.eql(sandboxDummy).and.notify(done);
      });

      it('should get a sandbox from a specific protostubURL', function(done) {

        expect(registry.getSandbox(protostubURL))
        .to.be.fulfilled
        .and.eventually.to.be.eql(sandboxDummy)
        .and.notify(done);
      });

      it('should get a sandbox from a protoStub URL containing the domain', function(done) {
        let domainURL = 'anotherDomain.pt';

        registry.registerStub(sandboxDummy, domainURL).then(function() {
          expect(registry.getSandbox('anotherDomain.pt').then(function(response) {
            return response;
          })).to.be.fulfilled.and.eventually.equal(sandboxDummy).and.notify(done);
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

    describe('getHypertyOwner(hypertyURL)', function() {
      it('should return the user associated to the hyperty URL', function() {
        let url = 'hyperty://ua.pt/1';
        expect(registry.getHypertyOwner(url)).to.be.eql('user://gmail.com/openidtest10');
      });
    });

    describe('getHypertyName(hypertyURL)', function() {
      it('should return the hyperty Name from a given hypertyURL', function() {
        let url = 'hyperty://ua.pt/1';

        expect(registry.getHypertyName(url)).to.be.equal('hyperty-chat');
      });
    });

    describe('registerDataObject(identifier, dataObjectschema, dataObjectUrl, dataObjectReporter, authorise)', function() {
      it('should register a new Data Object in the runtime registry', function(done) {
        let identifier = 'hello-chat';
        let dataObjectschema = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication';
        let dataObjectUrl = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';
        let dataObjectReporter = 'hyperty://localhost/d692091f-192c-420c-a763-a180f13e626a';
        let authorise = ['user://gmail.com/user15'];

        expect(registry.registerDataObject(identifier, dataObjectschema, dataObjectUrl, dataObjectReporter, ['fake'], authorise).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('ok').and.notify(done);
      });
    });

    describe('getReporterURL(dataObjectURL)', function() {
      it('should return the reporterURL associated with the dataobject URL', function(done) {
        let dataObjectURL = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';
        let fakedataObjectURL = 'comm://fake';

        expect(registry.getReporterURL(dataObjectURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('hyperty://localhost/d692091f-192c-420c-a763-a180f13e626a').and.notify(done);

        expect(registry.getReporterURL(fakedataObjectURL).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('No reporter was found').and.notify(done);
      });
    });

    describe('getPreAuthSubscribers(dataObjectURL)', function() {
      it('should return the list of pre authorised users', function() {
        let dataObjectURL = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';
        let fakedataObjectURL = 'comm://fake';

        expect(registry.getPreAuthSubscribers(dataObjectURL)).to.be.eql(['user://gmail.com/user15']);

        expect(registry.getPreAuthSubscribers(fakedataObjectURL)).to.be.eql([]);
      });
    });

    describe('getDataObjectSubscribers(dataObjectURL)', function() {
      it('should return the list of pre authorised users', function() {
        let dataObjectURL = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';
        let fakedataObjectURL = 'comm://fake';
        let subscriberURL = 'hyperty://localhost/00-00-sub1';

        registry.registerSubscriber(dataObjectURL, subscriberURL);

        expect(registry.getDataObjectSubscribers(dataObjectURL)).to.be.eql(['hyperty://localhost/00-00-sub1']);
      });
    });

    describe('unregisterHyperty(url)', function() {
      it('should unregister an Hyperty', function(done) {
        let url = 'hyperty://ua.pt/1';

        expect(registry.unregisterHyperty(url).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal('Hyperty successfully deleted').and.notify(done);
      });
    });

  });

});
