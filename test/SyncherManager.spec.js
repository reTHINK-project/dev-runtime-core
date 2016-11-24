import { runtimeFactory } from './resources/runtimeFactory';
import {Syncher, DataObjectReporter, DataObjectObserver} from 'service-framework/dist/Syncher';
import SyncherManager from '../src/syncher/SyncherManager';
import MessageBus from '../src/bus/MessageBus';

import PEP from '../src/policy/PEP';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('SyncherManager', function() {
  let storageManager = runtimeFactory.storageManager();
  let persistenceManager = runtimeFactory.persistenceManager();

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
          body: { subscribe: [objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL1 }
        });
      } else {
        //observer subscribe
        expect(msg).to.contain.all.keys({
          id: 5, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.obj1/sm',
          body: { subscribe: [objURL + '/changes', objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL2 }
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
    registerDataObject: (identifier, dataObjectschema, dataObjectUrl, dataObjectReporter) => {
      console.log('REGISTRY-OBJECT: ', identifier, dataObjectschema, dataObjectUrl, dataObjectReporter);
      return new Promise((resolve) => {
        resolve('ok');
      });
    }
  };

  let runtimeRegistry = {
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
    getIdentityOfHyperty: () => {
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

  let policyEngine = new PEP(new RuntimeCoreCtx(identityModule, runtimeRegistry, storageManager));

  let handlers = [

    // Policy message authorise
    function(ctx) {
      policyEngine.authorise(ctx.msg).then(function(changedMgs) {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch(function(reason) {
        console.error(reason);
        ctx.fail(reason);
      });
    }
  ];

  it('reporter read', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply', dor.onRead);
      dor.onRead((event) => {
        console.log('on-read');
        event.accept();
      });

      sync2.read(dor.url).then((data) => {
        console.log('on-read-reply', data);
        expect(data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10 });
        done();
      });
    });
  });

  it('reporter observer integration', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('on-subscribe-reply');
        doo.onChange('*', (changeEvent) => {
          console.log('on-change: ', JSON.stringify(changeEvent));
          expect(changeEvent).to.contain.all.keys({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
          expect(doo.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c'] });
          done();
        });
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply');
      dor.inviteObservers([hyperURL2]);

      dor.onSubscription((subscribeEvent) => {
        console.log('on-subscribe: ', subscribeEvent);

        //we may have some problems in the time sequence here.
        //change-msg can reach the observer first
        subscribeEvent.accept();
        dor.data.test = ['a', 'b', 'c'];
      });
    });
  });

  it('verify produced sync messages', function(done) {
    this.timeout(10000);

    let seq = 0;
    let data;

    let bus = {
      postMessage: (msg, replyCallback) => {
        seq++;
        console.log('3-postMessage: (seq === ' + seq + ')', JSON.stringify(msg));

        if (seq === 1) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 1, source: hyperURL1, attribute: '1',
              value: {
                name: 'Micael',
                birthdate: '28-02-1981',
                email: 'micael-xxx@gmail.com',
                phone: 911000000,
                obj1: { name: 'xpto'}
              }
            }
          });
        }

        if (seq === 2) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 2, source: hyperURL1, attribute: '2',
              value: {
                name: 'Luis Duarte',
                birthdate: '02-12-1991',
                email: 'luis-xxx@gmail.com',
                phone: 910000000,
                obj1: { name: 'xpto' }
              }
            }
          });

          //apply changes...
          data['1'].name = 'Micael Pedrosa';
          data['1'].birthdate = new Date(1982, 1, 28);
          data['1'].obj1.name = 'XPTO';
          delete data['2'];
        }

        if (seq === 3) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 3, source: hyperURL1, attribute: '2' }
          });
        }

        if (seq === 4) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 4, source: hyperURL1, attribute: '1.name', value: 'Micael Pedrosa' }
          });
        }

        if (seq === 5) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 5, source: hyperURL1, attribute: '1.birthdate', value: '1982-02-28T00:00:00.000Z' }
          });
        }

        if (seq === 6) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 6, source: hyperURL1, attribute: '1.obj1.name', value: 'XPTO' }
          });

          //apply changes...
          data['1'].arr = [1, 0, { x: 10, y: 20 }];
        }

        if (seq === 7) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 7, source: hyperURL1, attribute: '1.arr', value: [1, 0, {x: 10, y: 20}] }
          });

          //apply changes...
          data['1'].arr[1] = 2;
        }

        if (seq === 8) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body:{ version: 8, source: hyperURL1, attributeType: 'array', attribute: '1.arr.1', value: 2 }
          });

          //apply changes...
          data['1'].arr.push(3);
          data['1'].arr.push({ x: 1, y: 2 });
        }

        if (seq === 9) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 9, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.3', value: [3] }
          });
        }

        if (seq === 10) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 10, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.4', value: [{x: 1, y: 2}] }
          });

          //apply changes...
          data['1'].arr.splice(1, 2, 10, 11, 12);
          data['1'].arr[5].x = 10;
        }

        if (seq === 11) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 11, source: hyperURL1, attributeType: 'array', operation: 'remove', attribute: '1.arr.1', value: 2 }
          });
        }

        if (seq === 12) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 12, source: hyperURL1, attributeType: 'array', operation: 'add', attribute: '1.arr.1', value: [10, 11, 12] }
          });
        }

        if (seq === 13) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 13, source: hyperURL1, attribute: '1.arr.5.x', value: 10 }
          });

          //apply changes...
          data['1'].arr.pop();
        }

        if (seq === 14) {
          expect(msg).to.contain.all.keys({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 14, source: hyperURL1, attributeType: 'array', operation: 'remove', attribute: '1.arr.5', value: 1 }
          });

          done();
        }
      },

      addListener: (url, callback) => {
        console.log('3-addListener', url);
      }
    };

    //BEGIN: skip message system (already tested in previous units) and manually create a reporter and subscription, this should not be done in real code.
    let sync = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    let reporter = new DataObjectReporter(sync, objURL, schemaURL, 'on', {}, []);
    reporter.subscriptions[hyperURL2] = { status: 'on' };
    sync.reporters[objURL] = reporter;

    //END
    data = reporter.data;

    //apply changes...
    data['1'] = { name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000 };
    data['1'].obj1 = { name: 'xpto' };
    data['2'] = { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' } };
  });

  it('verify consumed sync messages', function(done) {
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
    let observer = new DataObjectObserver(sync, objURL, schemaURL, 'on', { data: {}, childrens: {} }, [], 0);
    sync.observers[objURL] = observer;

    observer.onChange('*', (event) => {
      seq++;
      console.log('4-onChange: (seq === ' + seq + ')', JSON.stringify(event));

      if (seq === 1) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'object', field: '1', data: { name: 'Micael', birthdate:'28-01-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'xpto' } } });
      }

      if (seq === 2) {
        expect(event).to.contain.all.keys({ cType: 'add', oType: 'object', field: '2', data: { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1:{ name: 'xpto' } } });

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
          body:{ version: 8, attributeType: 'array', attribute: '1.arr.1', value: 2 }
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

  it('reporter addChild', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('5-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply');
      dor.addChild('children1', 'my message').then((doc) => {
        console.log('on-addChild-reply', doc);
        done();
      });
    });
  });

  it('observer addChild', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('6-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('on-subscribe-reply');
        doo.addChild('children1', { message: 'Hello World!' }).then((doc) => {
          console.log('on-local-addChild');
          doc.onResponse((event) => {
            console.log('on-remote-addChild-reply', event);
            expect(event).to.contain.all.keys({ type: 'response', url: hyperURL1, code: 200 });
            done();
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
          expect(event).to.contain.all.keys({ type: 'create', from: hyperURL2, url: 'resource://obj1/children/children1', childId: hyperURL2 + '#1', value: { message: 'Hello World!' } });
        });

        console.log('on-subscribe: ', subscribeEvent);
        subscribeEvent.accept();
      });
    });
  });

  it('children deltas generate and process', function(done) {
    let bus = new MessageBus();
    bus.pipeline.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('7-_onPostMessage: ', msg);
      msgNodeResponseFunc(bus, msg);
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      notifyEvent.ack();

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
          let children1 = dor.childrens[event.childId];
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

    let bus = new MessageBus();
    bus.pipeline.handlers = handlers;

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

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      if (notifyEvent.type === 'create') {
        notifyEvent.ack(100);
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          console.log('subscribe: ', doo.url);
        });
      } else if (notifyEvent.type === 'delete') {
        notifyEvent.ack(100);
        expect(deleted).to.eql(true);
        done();
      }
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData).then((dor) => {
      console.log('create: ', dor.url);
      dor.onSubscription((subscribeEvent) => {
        console.log('onSubscription: ', subscribeEvent);
        subscribeEvent.accept();

        setTimeout(() => {
          expect(sync1.reporters[dor.url]).to.eql(dor);
          dor.delete();
          delete sync1.reporters[dor.url];
          expect(sync1.reporters[dor.url]).to.be.empty;
          console.log('reporter-deleted');
        }, 100);

      });
    });
  });

  it('subscribe and unsubscribe', function(done) {
    let bus = new MessageBus();
    bus.pipeline.handlers = handlers;

    bus._onPostMessage = (msg) => {
      console.log('8-_onPostMessage: ', msg);
      if (msg.type === 'subscribe') {
        bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 200 }
        });
      } else if (msg.type === 'unsubscribe') {
        //expect delete message to msg-node
        expect(msg.from).to.eql(runtimeURL + '/sm');
        expect(msg.to).to.eql('domain://msg-node.h2.domain/sm');
        expect(msg.body.resource).to.eql(objURL);
        done();
      }
    };

    new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('subscribe: ', doo.url);
        doo.unsubscribe();
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], initialData).then((dor) => {
      console.log('create: ', dor.url);
      dor.onSubscription((subscribeEvent) => {
        console.log('onSubscription: ', subscribeEvent);
        subscribeEvent.accept();
      });
    });
  });

  describe('should use the storageManager', function() {

    let hyperties = {};
    // let sync1DataObjectReporter;
    // let sync2DataObjectObserver;
    // let sync3DataObjectObserver;

    it('should save the url on storageManager', function(done) {

      let bus = new MessageBus();
      bus.pipeline.handlers = handlers;

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

      new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

      let hypertyURL3 = 'hyperty://h1.domain/' + guid();
      hyperties.h3 = hypertyURL3;
      let sync3 = new Syncher(hypertyURL3, bus, { runtimeURL: runtimeURL });
      sync3.onNotification((notifyEvent) => {
        sync3.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          //sync3DataObjectObserver = doo;
          console.log('sync3 subscribe: ', doo.url);
          done();
        });
      });

      let hypertyURL2 = 'hyperty://h1.domain/' + guid();
      hyperties.h2 = hypertyURL2;
      let sync2 = new Syncher(hypertyURL2, bus, { runtimeURL: runtimeURL });
      sync2.onNotification((notifyEvent) => {
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          //sync2DataObjectObserver = doo;
          console.log('sync2 subscribe:', doo.url);
        });
      });

      let hypertyURL1 = 'hyperty://h1.domain/' + guid();
      hyperties.h1 = hypertyURL1;
      let sync1 = new Syncher(hypertyURL1, bus, { runtimeURL: runtimeURL });
      sync1.create(schemaURL, [hypertyURL2, hypertyURL3], initialData).then((dor) => {
        // sync1DataObjectReporter = dor;
        dor.onSubscription((subscribeEvent) => {
          subscribeEvent.accept();
        });
      });
    });

    it('should resume the url stored on storageManager', (done) => {

      let bus = new MessageBus();
      bus.pipeline.handlers = handlers;
      bus._onPostMessage = (msg) => {
        console.log('10-_onPostMessage: ', msg);

        if (msg.type === 'subscribe') {
          bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: 200 }
          });
        }

        if (msg.type === 'update') {
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

      new SyncherManager(runtimeURL, bus, registry, catalog, storageManager, allocator);

      let sync3 = new Syncher(hyperties.h3, bus, { runtimeURL: runtimeURL });
      sync3.onNotification((notifyEvent) => {
        sync3.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          doo.onChange('*', function(changes) {
            console.log('Sync 3: ', changes);
          });
          console.log('sync3 subscribe: ', doo.url);
        });
      });

      let sync2 = new Syncher(hyperties.h2, bus, { runtimeURL: runtimeURL });
      sync2.onNotification((notifyEvent) => {
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          doo.onChange('*', function(changes) {
            console.log('Sync 2: ', changes);
          });
          console.log('sync2 subscribe:', doo.url);
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
