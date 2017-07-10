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

describe('SyncherManager', function() {
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

  let msgNodeResponseFunc = (bus, msg) => {

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

  //fake object allocator -> always return the same URL
  let allocator = {
    create: () => {
      return new Promise((resolve) => {
        resolve({address: [objURL]});
      });
    }
  };

  let registry = {
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
    runtimeURL: 'runtime://localhost/7601'
  };

  let identityModule = {
    decryptMessage: (message) => {
      return new Promise((resolve) => {
        resolve(message);
      });
    },
    encryptMessage: (message) => {
      return new Promise((resolve) => {
        resolve(message);
      });
    },
    getToken: () => {
      return new Promise((resolve) => {
        resolve({ userProfile: {username: 'user@domain' } });
      });
    }
  };

  let catalog = {
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

  let runtimeCoreCtx = new RuntimeCoreCtx(runtimeURL, identityModule, registry, storageManager, runtimeFactory.runtimeCapabilities());
  let policyEngine = new PEP(runtimeCoreCtx);

  let handlers = [

    // Policy message authorise
    function(ctx) {
      policyEngine.authorise(ctx.msg).then(function(changedMgs) {

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

  it('Data Synchronisation between reporter and observer', function(done) {
    let bus = new MessageBus();
    bus.pipeline.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('[reporter observer integration - onPostMessage]: ', msg);

      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);

      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url, true, false).then((doo) => {
        console.log('on-subscribe-reply', doo, doo.data);

        doo.onChange('*', (changeEvent) => {
          console.log('on-change: ', JSON.stringify(changeEvent));
          expect(changeEvent).to.contain.all.keys({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
          expect(doo.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c'] });
          done();
        });
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData, true, false).then((dor) => {
      console.log('on-create-reply', dor);
      dor.inviteObservers([hyperURL2]);

      dor.onRead((event) => {
        console.log('on-read');
        event.accept();
      });

      dor.onSubscription((subscribeEvent) => {
        console.log('on-resources: ', subscribeEvent);

        //we may have some problems in the time sequence here.
        //change-msg can reach the observer first
        subscribeEvent.accept();

        // TODO: We had the settimeout because when the proxyobserve trigger will trigger with this version of object..
        // this hack should make it trigger in next cycle;
        setTimeout(() => {
          dor.data.test = ['a', 'b', 'c'];
        });

      });
    });
  });

  it('should resume observers', function(done) {

    let bus = new MessageBus();
    bus._onMessage((a) => {
      console.log('BUS:', a);
    });

    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let a;

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.resumeObservers({}).then((doos) => {

      console.log('on-subscribe-resume-reply', doos);

      Object.values(doos).forEach((doo) => {
        console.log('on-subscribe-resume-reply DataObjectObserver: ', doo);

        expect(doo.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c']});

        // doo.onChange('*', (changeEvent) => {
        //   console.log('on-subscribe-resume on-change: ', JSON.stringify(changeEvent), doo.data);
        //   expect(changeEvent).to.contain.all.keys({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
        // });

        done();
      });

      a.data.test = ['a', 'b', 'c'];

    }).catch((error) => {
      expect(error).to.be.equal('No data objects observers to be resumed')
      done();
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-resume-reply', dor);
      a = dor;
      dor.inviteObservers([hyperURL2]);

      dor.onRead((readEvent) => {
        readEvent.accept();
      });

      dor.onSubscription((subscribeEvent) => {
        console.log('on-resume-resources: ', subscribeEvent);

        //we may have some problems in the time sequence here.
        //change-msg can reach the observer first
        subscribeEvent.accept();
      });
    });

  });

  it('should resume reporters', function(done) {

    let bus = new MessageBus();

    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
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
