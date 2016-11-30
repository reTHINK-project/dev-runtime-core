import chai from 'chai';
import sinon from 'sinon';
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
import { descriptors } from './resources/descriptors';
import {divideURL} from '../src/utils/utils';
import { runtimeFactory } from './resources/runtimeFactory';

// Testing Registry
let runtimeURL = 'hyperty-runtime://ua.pt/123';

let storageManager = runtimeFactory.storageManager();
let appSandbox = runtimeFactory.createAppSandbox();
let sandboxDummy = {sandbox: 'sandbox', type: 'normal'};
let protostubURL = 'url';

//registry = new Registry(msgbus, runtimeURL, appSandbox);
describe('Registry', function() {

  let registry;

  before(() => {
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

    registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue, 'runtimeCapabilities', storageManager);

    // Prepare the on instance to handle with the fallbacks and runtimeCatalogue;
    let descriptorInstance = new Descriptors(runtimeURL, runtimeCatalogue, {});

    // Prepare the loader to load the hyperties, protostubs and idpproxy;
    let loader = new Loader(runtimeURL, {}, descriptorInstance);
    loader.runtimeURL = runtimeURL;
    loader.runtimeCatalogue = runtimeCatalogue;
    loader.registry = registry;
    loader.runtimeFactory = runtimeFactory;

    let msgbus = new MessageBus(registry);
    loader.messageBus = msgbus;

    registry._loader = loader;
    registry.messageBus = msgbus;

    registry.messageBus.addListener('domain://registry.ua.pt/', (msg) => {
      console.log('MSG BUS LISTENER: ', msg);
      let responseMessage = {id: msg.id, type: 'response', to: msg.from, from: msg.to,
                              body: {code: 200}};

      msgbus.postMessage(responseMessage);
    });

    let getDescriptor = (url) => {

      return new Promise(function(resolve, reject) {

        let dividedURL = divideURL(url);
        let identity = dividedURL.identity;

        if (!identity) {
          identity = 'default';
        } else {
          identity = identity.substring(identity.lastIndexOf('/') + 1);
        }

        let result;

        if (url.includes('Hyperties') || url.includes('Hyperty')) {
          try {
            result = descriptors.Hyperties[identity];
          } catch (e) {
            reject(e);
          }

        } else if (!(url.includes('Hyperties') || url.includes('Hyperty')) || url.includes('ProtoStubs') || url.includes('protostub')) {
          try {
            result = descriptors.ProtoStubs[identity];
          } catch (e) {
            reject(e);
          }
        } else if (url.includes('idp-proxy')) {
          try {
            result = descriptors.IdpProxies[identity];
          } catch (e) {
            reject(e);
          }
        }

        console.log(result);
        resolve(result);

      });
    };

    console.log('registry ', descriptorInstance);
    sinon.stub(descriptorInstance, 'getHypertyDescriptor', (hypertyURL) => {
      return getDescriptor(hypertyURL);
    });

    sinon.stub(descriptorInstance, 'getStubDescriptor', (stubURL) => {
      //console.log('get descriptor for:', stubURL);
      return getDescriptor('https://catalogue.ua.pt/.well-known/protocolstub/' + stubURL);
    });

    sinon.stub(descriptorInstance, 'getIdpProxyDescriptor', (idpProxyURL) => {
      return getDescriptor(idpProxyURL);
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
      let addressURL = {newAddress: true, address: ['hyperty://ua.pt/1']};
      expect(registry.registerHyperty(sandboxDummy, descriptorURL, descriptor, addressURL)).to.be.fulfilled.and.eventually.equal('hyperty://ua.pt/1').and.notify(done);

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
      let addressURL = {newAddress: true, address: ['comm://localhost/9303b707-f301-4929-ad7d-65a89a356871']};

      expect(registry.registerDataObject(identifier, dataObjectschema, dataObjectUrl, dataObjectReporter, ['fake'], addressURL, authorise).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.equal('ok').and.notify(done);
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
      })).to.be.fulfilled.and.eventually.to.be.eql(['comm://localhost/9303b707-f301-4929-ad7d-65a89a356871']).and.notify(done);

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

  describe('isLegacy(url)', function() {

    it('should return a protostub', function(done) {
      let url = 'slack://user@team.slack.com';

      expect(registry.isLegacy(url).then(function(response) {
        console.log('ProtoSTUB->', response);
        return response;
      })).to.be.fulfilled.and.eventually.to.equal(true).and.notify(done);

    });
  });

});
