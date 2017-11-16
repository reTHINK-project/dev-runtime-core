import { runtimeFactory } from '../resources/runtimeFactory';
import {Syncher, DataObjectReporter, DataObjectObserver} from 'service-framework/dist/Syncher';
import SyncherManager from '../../src/syncher/SyncherManager';
import DataObjectsStorage from '../../src//store-objects/DataObjectsStorage';
import MessageBus from '../../src/bus/MessageBus';

import PEP from '../../src/policy/PEP';
import RuntimeCoreCtx from '../../src/policy/context/RuntimeCoreCtx';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Data Synchronisation', function() {
  let storageManager = runtimeFactory.storageManager();
  let dataObjectsStorage = new DataObjectsStorage(storageManager, {});

  let schemaURL = 'schema://fake-schema-url';
  let runtimeURL = 'hyperty-runtime://fake-runtime';

  let objURL = 'resource://obj1';
  let objURLChanges = objURL + '/changes';

  let hyperURL1 = 'hyperty://h1.domain/h1';
  let hyperURL2 = 'hyperty://h2.domain/h2';

  let initialData = {
    communication: { name: 'chat-x' },
    x: 10, y: 10
  };
  let msgNodeResponseFunc;
  let allocator;
  let registry;
  let identityModule;
  let catalog;
  let runtimeCoreCtx;
  let policyEngine;
  let bus;
  let dataObjectReporter;
  let dataObjectObserver;
  let sync1;
  let sync2;

  before(() => {
    msgNodeResponseFunc = (bus, msg) => {

      if (msg.type === 'subscribe') {
        if (msg.id === 2) {
          //reporter subscribe
          expect(msg).to.contain.all.keys({
            id: 2, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h1.domain/sm',
            body: { resources: [objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL1 }
          });
        } else {
          //observer subscribe
          expect(msg).to.contain.all.keys({
            id: 5, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.obj1/sm',
            body: { resources: [objURL + '/changes', objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL2 }
          });
        }

        //simulate msg-node response
        bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 200 }
        });
      }
    };

    allocator = {
      create: () => {
        return new Promise((resolve) => {
          resolve({address: [objURL]});
        });
      }
    };

    registry = {
      registerDataObject: (objectRegistration) => {
        console.log('REGISTRY-OBJECT: ', objectRegistration);
        return new Promise((resolve) => {
          resolve('ok');
        });
      },

      isInterworkingProtoStub: (url) => {
        console.log('isInterworkingProtoStub: ', url);
        return false;
      },

      unregisterDataObject: (url) => {
        console.log('Unregister Data Object:', url);
        return true;
      },

      getPreAuthSubscribers: () => {
        return ['hyperty://domain/hyperty-instance'];
      },
      getHypertyName: () => {
        return 'HypertyChat';
      },
      isDataObjectURL: (dataObjectURL) => {
        let splitURL = dataObjectURL.split.skip('://');
        return splitURL[0] === 'comm';
      },
      registerSubscribedDataObject: () => {},
      registerSubscriber: () => {},
      isLocal: (url) => {
        console.log('isLocal: ', url);
        return false;
      },
      isLocal: () => {
        return false;
      },
      getHypertyOwner: () => {
          return 'user://user@domain.pt';
      },
      runtimeURL: 'runtime://localhost/7601'
    };

    identityModule = {
      getToken: () => {
        return new Promise((resolve) => {
          resolve({ userProfile: {username: 'user@domain' } });
        });
      }
    };

    /*cryptoManager = {
      decryptMessage: (message) => {
        return new Promise((resolve) => {
          resolve(message);
        });
      },
      encryptMessage: (message) => {
        return new Promise((resolve) => {
          resolve(message);
        });
      }
    };*/


    catalog = {
      getDataSchemaDescriptor: (schema) => {
        console.log('REQUEST-SCHEMA: ', schema);
        return new Promise((resolve, reject) => {
          if (schema) {
            resolve({ sourcePackage: { sourceCode: {
              properties: {
                scheme: { constant: 'resource' },
                children: { constant: ['children1', 'children2'] }
              }
            }}});
          } else {
            reject('No schema provided');
          }
        });
      }
    };

/*    runtimeCoreCtx = new RuntimeCoreCtx(runtimeURL, identityModule, registry, storageManager, runtimeFactory.runtimeCapabilities());
    policyEngine = new PEP(runtimeCoreCtx);*/

    bus = new MessageBus(registry);
    bus.pipelineOut.handlers =  [

      // Policy message authorise
      function(ctx) {
        (() => {

          let changedMgs = ctx.msg;

          changedMgs.body.identity = {
            userProfile: {
              userURL: 'user://user@domain.pt'
            }
          };

          ctx.msg = changedMgs;
          ctx.next();
        }).catch(function(reason) {
          console.error(reason);
          ctx.fail(reason);
        });
      }
    ];
    bus._onPostMessage = (msg) => {
      console.log('[reporter observer integration - onPostMessage]: ', msg);

      msgNodeResponseFunc(bus, msg);
    };
    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);
  });

  it('Create Reporter and create dataObject', function(done) {
    sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData, true, false).then((dor) => {
      console.log('on-create-reply', dor);
      dataObjectReporter = dor;
      dataObjectReporter.onRead((event) => {
        console.log('on-read');
        event.accept();
      });
      dataObjectReporter.onSubscription((subscribeEvent) => {
        console.log('on-resources: ', subscribeEvent);
        subscribeEvent.accept();
      });
      done();
    });
  });

  it('create observer and subscribe to dataObjectReporter', function(done) {

    dataObjectReporter.inviteObservers([hyperURL2]);


    sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);

      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url, true, false).then((doo) => {
        console.log('on-subscribe-reply', doo, doo.data);
        dataObjectObserver = doo;
        done();

      });
    });
  });

  it('Update dataObjectReporter and Sync with Observer', function(done) {
    let testDone = false;
    dataObjectObserver.onChange('*', (changeEvent) => {
      console.log('on-change: ', JSON.stringify(changeEvent));
      expect(changeEvent).to.contain.all.keys({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
      expect(dataObjectObserver.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c'] });
      if (!testDone) {
        testDone = true;
        done();
      }
    });

    dataObjectReporter.data.test = ['a', 'b', 'c'];

  });

  it('Data Objects subscribed by Observers are resumed', function(done) {

    let a;
    sync2.resumeObservers({}).then((doos) => {

      console.log('on-subscribe-resume-reply', doos);

      Object.values(doos).forEach((doo) => {
        console.log('on-subscribe-resume-reply DataObjectObserver: ', doo);

        expect(doo.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c']});
        done();
      });

      a.data.test = ['a', 'b', 'c'];

    }).catch((error) => {
      expect(error).to.be.equal('No data objects observers to be resumed')
      done();
    });

  });

  it('Data Objects created by Reporters are resumed', function(done) {

    sync1.resumeReporters({}).then((dors) => {

      console.log('on-subscribe-resume-reply', dors);

      Object.values(dors).forEach((dor) => {

        console.log('on-create-resume-reply DataObjectReporter: ', dor);

        dor.data.newTest = ['a', 'b', 'c'];
        expect(dor.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c'], newTest: ['a', 'b', 'c'] });
        done();

      });

    }).catch((error) => {
      console.log('AQUI:', error);
      expect(error).to.be.equal('No data objects reporters to be resumed')
      done();
    });

  });

});
