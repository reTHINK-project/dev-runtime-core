import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

// Main dependecies
import Registry from '../src/registry/Registry';
import Sandbox from '../src/sandbox/Sandbox';
import MessageBus from '../src/bus/MessageBus';
import Loader from '../src/runtime/Loader';
import Descriptors from '../src/runtime/Descriptors';

import { getDescriptor } from './resources/getDescriptor.js';

import { generateGUID } from '../src/utils/utils';
import { runtimeFactory } from './resources/runtimeFactory';

import AddressAllocation from '../src/allocation/AddressAllocation';

import { storage } from '../src/runtime/Storage';

// Testing Registry
let runtimeURL = 'runtime://ua.pt';
let p2pHandlerURL;

let sandboxDummyCapabilities = {browser: true};

const storages = storage(runtimeFactory);
let storageManager = storages.registry;
let appSandbox = runtimeFactory.createAppSandbox();
appSandbox.type = 'app';

// let sandboxDummy = {sandbox: 'sandbox', type: 'normal', capabilities: sandboxDummyCapabilities};
let protostubURL;
let sandboxDummy = new Sandbox(sandboxDummyCapabilities);
sandboxDummy.type = 'normal';

console.log('App:', appSandbox);
console.log('Work:', sandboxDummy);

//registry = new Registry(msgbus, runtimeURL, appSandbox);
describe('Registry', function() {

  let registry;

  before(() => {
    let identityModule = {
      getIdentityAssertion: () => {
        let identityBundle = {userProfile: {email: 'openidtest10@gmail.com', token: 'idToken', userURL: 'user://gmail.com/openidtest10'}};
        return new Promise(function(resolve) {
          resolve(identityBundle);
        });
      }
    };

    let runtimeCatalogue = {
      getDataSchemaDescriptor: () => {
        return new Promise(function(resolve) {
          let dataschema = {sourcePackage: {sourceCode: {properties: {scheme: {constant: 'value'}}}}};
          resolve(dataschema);
        });
      }

      /*getIdpProxyDescriptor: () => {
        return new Promise(function(resolve) {
          let idpproxy = {sourcePackage: {sourceCode: {properties: {scheme: {constant: 'value'}}}}, interworking: true};
          resolve(idpproxy);
        });
      }*/
    };

    let remoteRegistry = '';
    p2pHandlerURL = runtimeURL + '/p2phandler/' + generateGUID();

    registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue, 'runtimeCapabilities', storageManager, p2pHandlerURL, remoteRegistry);

    let msgbus = new MessageBus(registry);
    new AddressAllocation(runtimeURL, msgbus);

    // Prepare the on instance to handle with the fallbacks and runtimeCatalogue;
    let descriptorInstance = new Descriptors(runtimeURL, runtimeCatalogue, {});

    // Prepare the loader to load the hyperties, protostubs and idpproxy;
    let loader = new Loader(runtimeURL, {}, descriptorInstance);
    loader.runtimeURL = runtimeURL;
    loader.runtimeCatalogue = runtimeCatalogue;
    loader.registry = registry;
    loader.runtimeFactory = runtimeFactory;

    loader.messageBus = msgbus;

    registry._runtimeURL = runtimeURL;
    registry._loader = loader;
    registry.messageBus = msgbus;

    // to emulate registrations

    registry.messageBus.addListener('domain://registry.ua.pt', (msg) => {
      console.log('MSG BUS LISTENER for Domain Registry: ', msg);
      let responseMessage = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {code: 200}};

      msgbus.postMessage(responseMessage);
    });

    // to emulate MN subscriptions

    registry.messageBus.addListener('domain://msg-node.ua.pt/sm', (msg) => {
      console.log('MSG BUS LISTENER for MN Subscription Manager: ', msg);
      let responseMessage = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {code: 200}};

      msgbus.postMessage(responseMessage);
    });

    sinon.stub(descriptorInstance, 'getHypertyDescriptor').callsFake((hypertyURL) => {
      return getDescriptor(hypertyURL);
    });

    sinon.stub(descriptorInstance, 'getStubDescriptor').callsFake((stubURL) => {
      //console.log('get descriptor for:', stubURL);
      return getDescriptor('https://catalogue.ua.pt/.well-known/protocolstub/' + stubURL);
    });

    sinon.stub(descriptorInstance, 'getIdpProxyDescriptor').callsFake((idpProxyURL) => {
      return getDescriptor('https://catalogue.ua.pt/.well-known/idp-proxy/' + idpProxyURL);
    });

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

    let domainURL = 'ua.pt';

    it('should register a stub', function(done) {
      expect(registry.registerStub(sandboxDummy, domainURL).then((deployed) => {
        console.log('Depoyed->', deployed);
        protostubURL = deployed.url;
        return deployed.url;
      })).to.be.fulfilled.and.eventually.to.contain('runtime://ua.pt/protostub/').and.notify(done);

    });

    it('should register a P2P Handler Stub', (done) => {
      let p2pConfig = {
        isHandlerStub: true,
        runtimeURL: runtimeURL
      };

      expect(registry.registerStub(sandboxDummy, registry.runtimeURL, p2pConfig).then((deployed) => {
        return deployed.url;
      })).to.be.fulfilled.and.eventually.to.contain('runtime://ua.pt/p2phandler/').and.notify(done);
    });

    it('should register a P2P Requester Stub', (done) => {

      let p2pConfig = {
        remoteRuntimeURL: 'runtime://ua.pt/1234566',
        p2pHandler: 'runtime://ua.pt/p2phandler/1234',
        p2pRequesterStub: true
      };

      registry.p2pHandlerAssociation[registry.runtimeURL] = [];

      expect(registry.registerStub(sandboxDummy, domainURL, p2pConfig).then((deployed) => {
        return deployed.url;
      })).to.be.fulfilled.and.eventually.to.contain('runtime://ua.pt/p2prequester/').and.notify(done);
    });

    it('should discover P2PHandlerStub', (done) => {

      expect(registry.discoverP2PStub()).to.have.property('url').contain('runtime://ua.pt/p2phandler/');
      done();
    });

  });

  describe('discoverProtostub(url)', function() {

    it('should discover a ProtocolStub', function(done) {
      let domain = 'ua.pt';
      registry.protostubsList[domain].status = 'live';
      expect(registry.discoverProtostub(domain)).to.have.property('url').contain('runtime://ua.pt/protostub/');
      done();
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

      let addressURL = {
        newAddress: true,
        address: ['hyperty://ua.pt/1']
      };

      expect(registry.registerHyperty(sandboxDummy, descriptorURL, descriptor, addressURL))
        .to.be.fulfilled
        .and.eventually.to.deep.equal({
          url: 'hyperty://ua.pt/1',
          p2pHandler: p2pHandlerURL,
          p2pRequester: undefined
        }).and.notify(done);

    });
  });

  describe('getSandbox(url, constraints)', function() {

    // let anotherSandbox = { sandbox: sandbox1, type: 'normal', capabilities: sandboxDummyCapabilities};
    let sandbox1 = new Sandbox(sandboxDummyCapabilities);
    sandbox1.type = 'normal';

    it('should register a anotherdomain protoStub URL', function(done) {
      let domainURL = 'anotherDomain.pt';

      expect(registry.registerStub(sandbox1, domainURL).then(function(response) {
        return response.url;
      })).to.be.fulfilled.and.eventually.contain(domainURL).and.notify(done);
    });


    it('should get a sandbox from another domain', function(done) {
      let domainURL = 'anotherDomain.pt';

      expect(registry.getSandbox(domainURL, sandboxDummyCapabilities))
        .to.be.fulfilled
        .and.eventually.to.be.equal(sandbox1)
        .and.notify(done);
    });


    it('should get a sandbox from a domain', function(done) {
      let domain = 'ua.pt';

      console.log('Get Sandbox:', sandboxDummy, registry);

      expect(registry.getSandbox(domain, sandboxDummyCapabilities))
        .to.be.fulfilled
        .and.eventually.to.be.eql(sandboxDummy)
        .and.notify(done);

    });

    it('should get a sandbox from a specific hypertyIstance', function(done) {
      let hypertyInstance = 'hyperty://ua.pt/1';

      expect(registry.getSandbox(hypertyInstance, sandboxDummyCapabilities))
        .to.be.fulfilled
        .and.eventually.to.be.eql(sandboxDummy)
        .and.notify(done);
    });

    it('should get a sandbox from a specific protostubURL', function(done) {

    //  let protostubURL = 'runtime://ua.pt/protostub/123';

      expect(registry.getSandbox(protostubURL, sandboxDummyCapabilities))
        .to.be.fulfilled
        .and.eventually.to.be.eql(sandboxDummy)
        .and.notify(done);
    });

  });

  describe('resolve(url)', function() {

    it('should return a protostub url', function(done) {
      let url = 'hyperty://ua.pt/123-dhsdhsg';

      expect(registry.resolve(url).then(function(response) {
        console.log('response:', response);
        return response;
      }).catch(console.error))
        .to.be.fulfilled
        .and.eventually.to.contain('runtime://ua.pt/protostub/')
        .and.notify(done);

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
      let objectRegistration = {};
      objectRegistration.name = 'hello-chat';
      objectRegistration.schema = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication';
      objectRegistration.url = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';
      objectRegistration.reporter = 'hyperty://localhost/d692091f-192c-420c-a763-a180f13e626a';
      objectRegistration.authorise = ['user://gmail.com/user15'];
      objectRegistration.resources = ['fake'];

      expect(registry.registerDataObject(objectRegistration))
        .to.be.fulfilled
        .and.eventually.to.deep.equal({
          name: objectRegistration.name,
          schema: objectRegistration.schema,
          url: objectRegistration.url,
          reporter: objectRegistration.reporter,
          resources: objectRegistration.resources,
          startingTime: undefined,
          expires: 3600,
          dataSchemes: ['comm'],
          p2pHandler: p2pHandlerURL,
          p2pRequester: undefined,
          status: 'live'
        })
        .and.notify(done);
    });
  });

  describe('checkRegisteredURLs(info)', function() {

    it('should return a previously registered Hyperty URL', function(done) {

      let descriptor = {
        _objectName: 'hyperty-chat',
        dataObjects: ['url'],
        hypertyType: ['comm']
      };

      expect(registry.checkRegisteredURLs(descriptor).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.to.be.eql(['hyperty://ua.pt/1']).and.notify(done);

    });

    it('should return a undefined value if the Hyperty is not previously registered', function(done) {

      let fakeDescriptor = {
        _objectName: 'hyperty-fake',
        dataObjects: ['url2'],
        hypertyType: ['comm2']
      };
      expect(registry.checkRegisteredURLs(fakeDescriptor).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.to.be.equal(undefined).and.notify(done);
    });

    it('should return a previously registered Data Object URL', function(done) {

      let info = {
        name: 'hello-chat',
        schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',
        resources: ['fake'],
        reporter: 'hyperty://localhost/d692091f-192c-420c-a763-a180f13e626a'
      };

      expect(registry.checkRegisteredURLs(info).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.to.be.eql('comm://localhost/9303b707-f301-4929-ad7d-65a89a356871').and.notify(done);

    });

    it('should return a undefined value if the dataObjectURL is not previously registered', function(done) {
      let fakeInfo = {
        name: 'fake',
        schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/unknown',
        resources: ['fake'],
        reporter: 'hyperty://localhost/anotherURL123'
      };
      expect(registry.checkRegisteredURLs(fakeInfo).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.to.be.equal(undefined).and.notify(done);
    });

    it('should return an hyperty url based on given address', function(done) {

      let descriptor = {
        _objectName: 'hyperty-chat',
        dataObjects: ['url'],
        hypertyType: ['comm']
      };

      let reuseURL = 'hyperty://ua.pt/1';

      expect(registry.checkRegisteredURLs(descriptor, reuseURL)).to.eventually
      .to.be.eql(['hyperty://ua.pt/1'])
      .and.to.be.fulfilled
      .and.notify(done);

    });

  });

  describe('getReporterURL(dataObjectURL)', function() {

    it('should return the reporterURL associated with the dataobject URL', function(done) {
      let dataObjectURL = 'comm://localhost/9303b707-f301-4929-ad7d-65a89a356871';

      expect(registry.getReporterURL(dataObjectURL).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.equal('hyperty://localhost/d692091f-192c-420c-a763-a180f13e626a').and.notify(done);
    });

    it('should not found the reporter the reporterURL associated with the dataobject URL', function(done) {
      let fakedataObjectURL = 'comm://fake';
      expect(registry.getReporterURL(fakedataObjectURL).then(function(response) {
        return response;
      })).eventually.equal('No reporter was found').and.to.be.rejected.and.notify(done);

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

  describe('isLegacy(url)', function() {

    it('should return a protostub', function(done) {
      let url = 'slack://user@slack.com';

      expect(registry.isLegacy(url).then(function(response) {
        console.log('ProtoSTUB->', response);
        return response;
      })).to.be.fulfilled.and.eventually.to.equal(true).and.notify(done);

    });
  });

});
