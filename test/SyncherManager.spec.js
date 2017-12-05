import { runtimeFactory } from './resources/runtimeFactory';
import { Syncher, DataObjectReporter, DataObjectObserver } from 'service-framework/dist/Syncher';
import SyncherManager from '../src/syncher/SyncherManager';
import DataObjectsStorage from '../src//store-objects/DataObjectsStorage';
import MessageBus from '../src/bus/MessageBus';


import PEP from '../src/policy/PEP';
import IdentityManager from '../src/identity/IdentityManager';
import * as cryptoManager from '../src/cryptoManager/CryptoManager';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';

import MsgBusHandlers from '../src/runtime/MsgBusHandlers';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

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

  // let responseCallbacks = {};

  let bus;


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

    if (msg.type === 'response') {
      if (msg.id === 4 && bus._responseCallbacks[msg.to + msg.id]) {
        return bus._responseCallbacks[msg.to + msg.id];
      }
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

    getHypertyOwner: (hypertyURL) => {
      console.log('Hyperty', hypertyURL);
      return 'user@domain.com';
    },

    getPreAuthSubscribers: () => {
      return ['hyperty://domain/hyperty-instance'];
    },
    getHypertyName: () => {
      return 'HypertyChat';
    },
    isDataObjectURL: (dataObjectURL) => {
      let splitURL = dataObjectURL.split('://');
      return splitURL[0] === 'comm';
    },
    registerSubscribedDataObject: () => {},
    registerSubscriber: () => {},
    isLocal: (url) => {
      console.log('isLocal: ', url);
      return true;
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

          let result = { sourcePackage: { sourceCode: {
            properties: {
              scheme: { constant: 'resources' },
              children: { constant: ['children1', 'children2'] }
            }
          }}};

          resolve(result);
        } else {
          reject('No schema provided');
        }
      });
    }
  };

  let runtimeCapabilities =  runtimeFactory.runtimeCapabilities();

  let runtimeCoreCtx = new RuntimeCoreCtx(runtimeURL, identityModule, registry, storageManager, runtimeCapabilities);
  let policyEngine = new PEP(runtimeCoreCtx);

  let identityManager = new IdentityManager(identityModule);

  let handlers = new MsgBusHandlers(policyEngine, identityManager, cryptoManager.default);

  // // Instantiate the IdentityManager
  // let identityManager = new IdentityManager(identityModule);

  // let cryptoManager = {

  // };

  // let handlers = new MsgBusHandlers(policyEngine, identityManager, cryptoManager);

  // // handlers.idmHandler((ctx) => { console.log('CTX: ', ctx); });

  // console.log('Handlers:', handlers);

  // let handlers = [

  //   // Policy message authorise
  //   function(ctx) {
  //     console.log('PEP:', ctx);

  //     policyEngine.authorise(ctx.msg).then(function(changedMgs) {

  //       console.log('PEP:', changedMgs);

  //       changedMgs.body.identity = {
  //         userProfile: {
  //           userURL: 'user://user@domain.pt'
  //         }
  //       };

  //       ctx.msg = changedMgs;
  //       ctx.next();

  //     }).catch(function(reason) {
  //       console.log('PEP: Error', reason);
  //       ctx.fail(reason);
  //     });
  //   }
  // ];

  it.skip('reporter read', function(done) {

    bus = new MessageBus(registry);
    bus.pipelineOut.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply', dor.onRead);
      dor.onRead((event) => {
        console.log('on-read', event);
        event.accept();
      });

      sync2.read(dor.url).then((data) => {
        console.log('on-read-reply', data);
        expect(data.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10 });
        done();
      })

    });

  });

  it.skip('reporter observer integration', function(done) {
    bus = new MessageBus(registry);
    bus.pipelineOut.handlers = handlers;

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

  it.skip('should resume observers', function(done) {

    bus = new MessageBus(registry);
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

  it.skip('should resume reporters', function(done) {

    bus = new MessageBus(registry);

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

  // TODO we should update the ProxyObject on service-framework to make test pass
  // TODO or we should update the tests messages, because the order;
  it.skip('verify produced sync messages', function(done) {
    this.timeout(10000);

    let seq = 0;
    let data;

    let bus = {
      postMessage: (msg, replyCallback) => {
        seq++;
        console.log('replyCallback:', replyCallback);
        console.log('3-postMessage: (seq === ' + seq + ')', JSON.stringify(msg));

        if (seq === 1) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 1, source: hyperURL1, attribute: '1',
              value: {
                name: 'Micael',
                birthdate: '28-02-1981',
                email: 'micael-xxx@gmail.com',
                phone: 911000000
              }
            }
          });
        }

        if (seq === 2) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 2, source: hyperURL1, attribute: '1.obj1',
              value: {
                name: 'xpto'
              }
            }
          });
        }

        if (seq === 3) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 3, source: hyperURL1, attribute: '2',
              value: {
                name: 'Luis Duarte',
                birthdate: '02-12-1991',
                email: 'luis-xxx@gmail.com',
                phone: 910000000
              }
            }
          });

          //apply changes...
          data['1'].name = 'Micael Pedrosa';
          data['1'].birthdate = new Date(1982, 1, 28).toUTCString();
          data['1'].obj1.name = 'XPTO';
        }

/*      if (seq === 3) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 3, source: hyperURL1, attribute: '2' }
          });
        }*/

        if (seq === 4) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 4, source: hyperURL1, attribute: '1.name', value: 'Micael Pedrosa' }
          });

        }

        if (seq === 5) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 5, source: hyperURL1, attribute: '1.birthdate', value: new Date(1982, 1, 28).toUTCString() }
          });

        }

        if (seq === 6) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 6, source: hyperURL1, attribute: '1.obj1.name', value: 'XPTO' }
          });

          //apply changes...
          data['1'].arr = [1, 0, { x: 10, y: 20 }];
        }

        if (seq === 7) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 7, source: hyperURL1, attribute: '1.arr', value: [1, 0, {x: 10, y: 20}] }
          });

          //apply changes...
          data['1'].arr[1] = 2;
        }

        if (seq === 8) {
          console.log('data', data);

          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 8, source: hyperURL1, attributeType: 'array', attribute: '1.arr.1', value: 2 }
          });

          //apply changes...
          setTimeout(() => {
            data['1'].arr.push(3);
            data['1'].arr.push({ x: 1, y: 2 });
          });

          done();
        }

        if (seq === 9) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 9, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.3', value: 3 }
          });
        }

        if (seq === 10) {

          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 10, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.4', value: {x: 1, y: 2} }
          });

          //apply changes...
          data['1'].arr.splice(1, 2, 10, 11, 12);
          data['1'].arr[5].x = 10;
        }

        if (seq === 11) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 11, source: 'hyperty://h1.domain/h1', attribute: '1.arr.4.x', value: 10 }
          });

          // done();
        }

        if (seq === 12) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 12, source: hyperURL1, attributeType: 'array', operation: 'remove', attribute: '1.arr.1', value: 2 }
          });
        }

        if (seq === 13) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 12, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.1', value: [10, 11, 12] }
          });
        }

        if (seq === 14) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 13, source: hyperURL1, attribute: '1.arr.5.x', value: 10 }
          });

          //apply changes...
          data['1'].arr.pop();
        }

        if (seq === 14) {
          expect(msg).to.deep.equal({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 14, source: hyperURL1, attributeType: 'array', operation: 'remove', attribute: '1.arr.5', value: 1 }
          });

          done();
        }
      },

      addListener: (url, callback) => {
        console.log('3-addListener', url, callback);
      }
    };

    //BEGIN: skip message system (already tested in previous units) and manually create a reporter and subscription, this should not be done in real code.
    let sync = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });

    /*
    input.syncher ? _this._syncher = input.syncher : throwMandatoryParmMissingError('syncher');
    input.url ?  _this._url = input.url : throwMandatoryParmMissingError('url');
    input.created ? _this._created = input.created : throwMandatoryParmMissingError('created');
    input.reporter ? _this._reporter = input.reporter : throwMandatoryParmMissingError('reporter');
    input.runtime ? _this._runtime = input.runtime : throwMandatoryParmMissingError('runtime');
    input.schema ? _this._schema = input.schema : throwMandatoryParmMissingError('schema');
    input.name ? _this._name = input.name : throwMandatoryParmMissingError('name');
    */
    let dataObjectReporter = {
      syncher: sync,
      url: objURL,
      created: new Date().toUTCString(),
      reporter: hyperURL1,
      schema: schemaURL,
      runtime: runtimeURL,
      name: 'test1'
    };

    let reporter = new DataObjectReporter(dataObjectReporter);
    reporter.subscriptions[hyperURL2] = { status: 'on' };
    sync.reporters[objURL] = reporter;

    //END
    data = reporter.data;

    //apply changes...
    data['1'] = { name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000};
    data['1'].obj1 = { name: 'xpto' };
    data['2'] = { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000 };
  });

  // TODO we should update the ProxyObject on service-framework to make test pass
  // TODO or we should update the tests messages, because the order;
  it.skip('verify consumed sync messages', function(done) {
    this.timeout(10000);

    let post;
    let bus = {
      addListener: (url, callback) => {
        console.log('4-addListener', url);

        if (url === objURLChanges) {
          post = callback;
        }
      }
    };

    //BEGIN: skip message system (already tested in previous units) and manually create an observer, this should not be done in real code.
    let seq = 0;
    let data;
    let compacted = false;

    let sync = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });

    let dataObjectObserver = {
      syncher: sync,
      url: objURL,
      created: new Date().toUTCString(),
      reporter: hyperURL1,
      schema: schemaURL,
      runtime: runtimeURL,
      name: 'test1'
    };

    let observer = new DataObjectObserver(dataObjectObserver);
    sync.observers[objURL] = observer;

    // let observer = new DataObjectObserver(sync, objURL, schemaURL, 'on', { data: {}, childrens: {} }, [], 0);

    observer.onChange('*', (event) => {
      seq++;
      console.log('4-onChange: (seq === ' + seq + ')', JSON.stringify(event));

      if (seq === 1) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'object', field: '1', data: { name: 'Micael', birthdate: '28-01-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'xpto' } } });
      }

      if (seq === 2) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'object', field: '2', data: { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' } } });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael', birthdate: '28-01-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'xpto' } },
          2: { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' } }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 3, attribute: '2' }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 4, attribute: '1.name', value: 'Micael Pedrosa' }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 5, attribute: '1.birthdate', value: '28-02-1981' }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 6, attribute: '1.obj1.name', value: 'XPTO' }
        });
      }

      if (seq === 3) {
        expect(event).to.contain.all.keys({ cType: 'remove', oType: 'object', field: '2' });
      }

      if (seq === 4) {
        expect(event).to.contain.all.keys({ cType: 'update', oType: 'object', field: '1.name', data: 'Micael Pedrosa' });
      }

      if (seq === 5) {
        expect(event).to.contain.all.keys({ cType: 'update', oType: 'object', field: '1.birthdate', data: '28-02-1981' });
      }

      if (seq === 6) {
        expect(event).to.contain.all.keys({ cType: 'update', oType: 'object', field: '1.obj1.name', data: 'XPTO' });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' } }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 7, attribute: '1.arr', value: [1, 0, { x: 10, y: 20 }] }
        });
      }

      if (seq === 7) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'object', field: '1.arr', data: [1, 0, { x: 10, y: 20 }] });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 0, { x: 10, y: 20 }] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 8, attributeType: 'array', attribute: '1.arr.1', value: 2 }
        });
      }

      if (seq === 8) {
        expect(event).to.contain.all.keys({ cType: 'update', oType: 'array', field: '1.arr.1', data: 2 });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 2, { x: 10, y: 20 }] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 9, attributeType: 'array', operation: 'add', attribute: '1.arr.3', value: [3] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 10, attributeType: 'array', operation: 'add', attribute: '1.arr.4', value: [{ x: 1, y: 2 }] }
        });
      }

      if (seq === 9) {
        if (event.data.length === 1) {
          expect(event).to.contain.all.keys({ cType: 'add', oType: 'array', field: '1.arr.3', data: [3] });
        } else {
          //it's OK to compact 2 messages...
          expect(event).to.contain.all.keys({ cType: 'add', oType: 'array', field: '1.arr.3', data: [3, { x: 1, y: 2 }]});
          compacted = true;
        }
      }

      if (seq === 10) {
        if (!compacted) {
          expect(event).to.contain.all.keys({ cType: 'add', oType: 'array', field: '1.arr.4', data: [{ x: 1, y: 2 }] });
        }

        compacted = false;

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' }, arr: [1, 2, { x: 10, y: 20 }, 3, { x: 1, y: 2 }]}
        });

        done();

        /*
        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 11, attributeType: 'array', operation: 'remove', attribute: '1.arr.1', value: 2 }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 12, attributeType: 'array', operation: 'add', attribute: '1.arr.1', value: [10, 11, 12] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 13, attribute: '1.arr.5.x', value: 10 }
        });
        */
      }

      /*
      if (seq === 11) {
        expect(event).to.contain.all.keys({ cType: 'remove', oType: 'array', field: '1.arr.1', data: 2 });
      }

      if (seq === 12) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'array', field: '1.arr.1', data: [10, 11, 12] });
      }

      if (seq === 13) {
        expect(event).to.contain.all.keys({ cType: 'update', oType: 'object', field: '1.arr.5.x', data: 10 });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' }, arr: [1, 10, 11, 12, 3, { x: 10, y: 2 }] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 14, attributeType: 'array', operation: 'remove', attribute: '1.arr.5', value: 1 }
        });
      }

      if (seq === 14) {
        expect(event).to.contain.all.keys({ cType: 'remove', oType: 'array', field: '1.arr.5', data: 1 });

        //verify changes...
        expect(data).to.contain.all.keys({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' }, arr: [1, 10, 11, 12, 3] }
        });

        done();
      }
      */
    });

    //END
    data = observer.data;

    post({
      type: 'update', from: objURL, to: objURLChanges,
      body: { version: 1, attribute: '1',
        value: {
          name: 'Micael',
          birthdate: '28-01-1981',
          email: 'micael-xxx@gmail.com',
          phone: 911000000,
          obj1: { name: 'xpto'}
        }
      }
    });

    post({
      type: 'update', from: objURL, to: objURLChanges,
      body: { version: 2, attribute: '2',
        value: {
          name: 'Luis Duarte',
          birthdate: '02-12-1991',
          email: 'luis-xxx@gmail.com',
          phone: 910000000,
          obj1: { name: 'xpto' }
        }
      }
    });
  });

  it.skip('reporter addChild', function(done) {
    bus = new MessageBus(registry);
    bus._onPostMessage = (msg) => {
      console.log('5-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply');
      dor.addChild('children1', {message: 'my message'}).then((doc) => {
        console.log('on-addChild-reply', doc);
        done();
      });
    });
  });

  it.skip('observer addChild', function(done) {
    bus = new MessageBus(registry);

    bus._onPostMessage = (msg) => {
      console.log('6-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });

    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('on-subscribe-reply');
        doo.addChild('children1', { message: 'Hello World!' }).then((doc) => {
          console.log('on-local-addChild', doc);

          doc.onResponse((event) => {
            console.log('on-remote-addChild-reply', event);
            expect(event).to.contain.all.keys({ type: 'response', url: hyperURL1, code: 200 });
          });
        });

      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData).then((dor) => {
      console.log('on-create-reply');
      dor.onSubscription((subscribeEvent) => {
        dor.onAddChild((event) => {
          console.log('on-remote-addChild', event);
          delete event.identity;
          expect(event).to.contain.all.keys({
            type: 'create',
            from: hyperURL2,
            url: 'resource://obj1/children/children1',
            childId: hyperURL2 + '#1',
            value: { message: 'Hello World!'}
          });
          done();
        });
        console.log('on-resources: ', subscribeEvent);
        subscribeEvent.accept();
      });
    });

  });

  it.skip('children deltas generate and process', function(done) {
    bus = new MessageBus(registry);
    bus.pipelineOut.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('7-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      notifyEvent.ack(100);

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {

        doo.addChild('children1', { message: 'Hello Micael!' }).then((doc) => {
          doc.data.message = 'Hello Luis!';
        });

      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData).then((dor) => {
      dor.onSubscription((subscribeEvent) => {

        dor.onAddChild((event) => {
          let children1 = event.child; //dor.childrens[event.childId];

          console.log('Children 1: ', dor, children1, event);

          children1.onChange((changeEvent) => {
            console.log('onChange: ', changeEvent);
            expect(changeEvent).to.contain.all.keys({ cType: 'update', oType: 'object', field: 'message', data: 'Hello Luis!' });
            expect(children1.data).to.contain.all.keys({ message: 'Hello Luis!' });
            done();
          });
        });

        subscribeEvent.accept();
      });
    });
  });

  it('create and delete', function(done) {
    let deleted = false;

    bus = new MessageBus(registry);
    bus.pipelineOut.handlers = [handlers.idmHandler, handlers.pepOutHandler];

    // console.log(bus.pipelineIn.handlers);

    bus._onPostMessage = (msg) => {
      console.log('8-_onPostMessage: ', msg);
      if (msg.type === 'subscribe') {
        bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 200 }
        });
      } else if (msg.type === 'delete') {
        //expect delete message to msg-node
        if (msg.from === runtimeURL + '/sm') {
          expect(msg.to).to.eql('domain://msg-node.h1.domain/object-address-allocation');
          expect(msg.body.resource).to.eql(objURL);
        }

        if (msg.from === objURL + '/subscription') {
          deleted = true;
        }
      }
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      if (notifyEvent.type === 'create') {
        notifyEvent.ack(100);
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          console.log('resources: ', doo.url);
        });
      } else if (notifyEvent.type === 'delete') {
        notifyEvent.ack(100);
        expect(deleted).to.eql(true);
        done();
      }
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData, false, false).then((dor) => {
      console.log('create: ', dor.url);
      dor.onSubscription((subscribeEvent) => {
        console.log('onSubscription: ', subscribeEvent);
        subscribeEvent.accept();

        setTimeout(() => {
          expect(sync1.reporters[dor.url]).to.eql(dor);
          dor.delete();
          delete sync1.reporters[dor.url];
          expect(sync1.reporters[dor.url]).to.be.undefined;
          console.log('reporter-deleted');
        }, 100);

      });
    });
  });

  it.skip('subscribe and unsubscribe', function(done) {
    bus = new MessageBus(registry);
    bus.pipelineOut.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('8-_onPostMessage: ', msg);
      if (msg.type === 'subscribe') {
        bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 200 }
        });
      } else if (msg.type === 'unsubscribe') {
        //expect delete message to msg-no  it.skip('de
        expect(msg.from).to.eql(runtimeURL + '/sm');
        expect(msg.to).to.eql('domain://msg-node.h2.domain/sm');
        expect(msg.body.resource).to.eql(objURL);
        done();
      }
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('resources: ', doo.url);
        doo.unsubscribe();
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData).then((dor) => {
      console.log('create: ', dor.url);

      dor.onSubscription((subscribeEvent) => {

        if (subscribeEvent.accept instanceof Function) {
          console.log('onSubscription: ', subscribeEvent);
          subscribeEvent.accept();
        }

      });
    });
  });

  describe('should use the storageManager', function() {

    let hyperties = {};

    // let sync1DataObjectReporter;
    // let sync2DataObjectObserver;
    // let sync3DataObjectObserver;

    it.skip('should save the url on storageManager', function(done) {

      bus = new MessageBus(registry);
      bus.pipelineOut.handlers = handlers;

      bus._onPostMessage = function(msg)  {
        console.log('8-_onPostMessage: ', msg);
        if (msg.type === 'subscribe') {
          bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: 200 }
          });
        }
      };

      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      let objURL = 'resource://domain/' + guid();

      //fake object allocator -> always return the same URL
      let allocator = {
        create: () => {
          return new Promise((resolve) => {
            hyperties.object = objURL;
            resolve({address: [objURL]});
          });
        }
      };

      new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

      let hypertyURL3 = 'hyperty://h1.domain/' + guid();
      hyperties.h3 = hypertyURL3;
      let sync3 = new Syncher(hypertyURL3, bus, { runtimeURL: runtimeURL });
      sync3.onNotification((notifyEvent) => {
        sync3.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          //sync3DataObjectObserver = doo;
          console.log('sync3 resources: ', doo.url);
          done();
        });
      });

      let hypertyURL2 = 'hyperty://h1.domain/' + guid();
      hyperties.h2 = hypertyURL2;
      let sync2 = new Syncher(hypertyURL2, bus, { runtimeURL: runtimeURL });
      sync2.onNotification((notifyEvent) => {
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          //sync2DataObjectObserver = doo;
          console.log('sync2 resources:', doo.url);
        });
      });

      let hypertyURL1 = 'hyperty://h1.domain/' + guid();
      hyperties.h1 = hypertyURL1;
      let sync1 = new Syncher(hypertyURL1, bus, { runtimeURL: runtimeURL });
      sync1.create(schemaURL, [hypertyURL2, hypertyURL3], initialData, true, false).then((dor) => {
        // sync1DataObjectReporter = dor;
        dor.onSubscription((subscribeEvent) => {
          subscribeEvent.accept();
        });
      });
    });

    it.skip('should resume the url stored on storageManager', (done) => {

      bus = new MessageBus(registry);
      bus.pipelineOut.handlers = handlers;
      bus._onPostMessage = (msg) => {
        console.log('10-_onPostMessage: ', msg);

        if (msg.type === 'subscribe') {
          bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: 200 }
          });
        }

        // TODO: remove the msg.body.version verification
        // TODO: this could be related with the syncher synchronization mechanism
        if (msg.type === 'update' && msg.body.version === 2) {
          expect(msg.from).to.eql(hyperties.object);
          expect(msg.to).to.eql(hyperties.object + '/changes');

          done();
        }

      };

      //fake object allocator -> always return the same URL
      let allocator = {
        create: function() {
          return new Promise(function(resolve) {
            resolve({address: [hyperties.object]});
          });
        }
      };

      new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator, dataObjectsStorage, identityModule);

      let sync3 = new Syncher(hyperties.h3, bus, { runtimeURL: runtimeURL });
      sync3.onNotification((notifyEvent) => {
        sync3.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          doo.onChange('*', function(changes) {
            console.log('Sync 3: ', changes);
          });
          console.log('sync3 resources: ', doo.url);
        });
      });

      let sync2 = new Syncher(hyperties.h2, bus, { runtimeURL: runtimeURL });
      sync2.onNotification((notifyEvent) => {
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          doo.onChange('*', function(changes) {
            console.log('Sync 2: ', changes);
          });
          console.log('sync2 resources:', doo.url);
        });
      });

      let sync1 = new Syncher(hyperties.h1, bus, { runtimeURL: runtimeURL });
      sync1.create(schemaURL, [hyperties.h2, hyperties.h3], initialData).then((dor) => {

        dor.onSubscription((subscribeEvent) => {
          subscribeEvent.accept();

          dor.data.x = 20;
        });
      });

    });

  });

});
