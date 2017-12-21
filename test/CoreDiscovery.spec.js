import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

// dependencies
import MessageBus from '../src/bus/MessageBus';
import Descriptors from '../src/runtime/Descriptors';
import { runtimeFactory } from './resources/runtimeFactory';
import GraphConnector from '../src/graphconnector/GraphConnector';
import CoreDiscovery from '../src/discovery/CoreDiscovery';
import Registry from '../src/registry/Registry';
import AddressAllocation from '../src/allocation/AddressAllocation';

let msgbus;
let runtimeURL = 'hyperty-runtime://ua.pt/123';
let domain = 'ua.pt';
let appSandbox = runtimeFactory.createAppSandbox();
let storageManager = runtimeFactory.storageManager('capabilities');
let runtimeCatalogue = runtimeFactory.createRuntimeCatalogue();
let runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
let coreDiscovery;

let hyperty = {'hyperty://ist.pt/1':
                {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                 lastModified: '"2016-03-03T13:32:06Z"',
                 dataSchemes: ['comm'],
                 resources:   ['chat']}
};

let dataObject = {'comm://ist.pt/1':
                {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                 url: 'comm://ist.pt/1',
                 name: 'mychat',
                 lastModified: '"2016-03-03T13:32:06Z"',
                 dataSchemes: ['comm'],
                 resources:   ['chat']}
};

describe('CoreDiscovery', function() {

  // this will be executed before all the tests, and you can garantee this will be setted
  before(() => {

      let identityModule = {
          getIdentities: () => {
              let identities = [];
              let identityBundle = {identity: 'user://gmail.com/openidtest10', token: 'idToken'};
              identities.push(identityBundle);
              return identities;
          }
      };

      console.log('CoreDiscovery - GraphConnector:', GraphConnector);

      // instanciate the registry;
      let registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue, runtimeCapabilities, storageManager);
      msgbus = new MessageBus(registry);
      new AddressAllocation(runtimeURL, msgbus, registry);
      registry.messageBus = msgbus;
      // Prepare the on instance to handle with the fallbacks and runtimeCatalogue;
      let descriptorInstance = new Descriptors(runtimeURL, runtimeCatalogue, {});
      let graphConnector = new GraphConnector(runtimeURL, msgbus, storageManager);
      coreDiscovery = new CoreDiscovery(runtimeURL, msgbus, graphConnector, runtimeFactory);

      coreDiscovery.messageBus.addListener('domain://registry.ua.pt', (msg) => {
        console.info(msg);
        let message_hyperties = {
            id: msg.id, type: 'response', from: 'domain://registry.ua.pt', to: msg.from,
            body: {
                code: 200,
                value: [hyperty]
            }
        };

        let message_hyperty = {
            id: msg.id, type: 'response', from: 'domain://registry.ua.pt', to: msg.from,
            body: {
                code: 200,
                value: hyperty
            }
        };

        let message_dataObjects = {
            id: msg.id, type: 'response', from: 'domain://registry.ua.pt', to: msg.from,
            body: {
                code: 200,
                value: [dataObject]
            }
        };

        let message_dataObject = {
            id: msg.id, type: 'response', from: 'domain://registry.ua.pt', to: msg.from,
            body: {
                code: 200,
                value: dataObject
            }
        };

        if(msg.body.resource === '/hyperty/idp-identifier/openidtest20@gmail.com')
          coreDiscovery.messageBus.postMessage(message_hyperties); //discoverHyperties
        else if(msg.body.resource === '/comm')
          coreDiscovery.messageBus.postMessage(message_dataObjects); //discoverDataObjects && //discoverDataObjectsPerReporter
        else if (msg.body.resource === 'hyperty://ist.pt/1')
          coreDiscovery.messageBus.postMessage(message_hyperty); //discoverHypertyPerURL
        else if (msg.body.resource === 'comm://ist.pt/1')
          coreDiscovery.messageBus.postMessage(message_dataObject); //discoverDataObjectPerURL
        else if (msg.body.resource === 'myChat')
          coreDiscovery.messageBus.postMessage(message_dataObjects); //discoverDataObjectsPerName

      });
  });

  describe('construction', function() {
      it('should create a new CoreDiscovery without error', function() {
          expect(coreDiscovery).to.be.instanceof(CoreDiscovery);
      });
  });

  describe('discoverHyperties()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverHyperties('openidtest20@gmail.com', ['comm'], ['chat'], domain).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql([hyperty]).and.notify(done);
    });
  });

  describe('discoverDataObjects()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverDataObjects('openidtest20@gmail.com', ['comm'], ['chat'], domain).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql([dataObject]).and.notify(done);
    });
  });

  describe('discoverHypertyPerURL()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverHypertyPerURL('hyperty://ist.pt/1').then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(hyperty).and.notify(done);
    });
  });

  describe('discoverDataObjectPerURL()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverDataObjectPerURL('comm://ist.pt/1').then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(dataObject).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerName()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverDataObjectsPerName('myChat', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql([dataObject]).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerReporter()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(coreDiscovery.discoverDataObjectsPerReporter('hyperty://ist.pt/1', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql([dataObject]).and.notify(done);
    });
  });

});
