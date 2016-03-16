import {Syncher, DataObjectReporter, DataObjectObserver} from 'service-framework';
import SyncherManager from '../src/syncher/SyncherManager';
import MessageBus from '../src/bus/MessageBus';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('SyncherManager', function() {
  let schemaURL = 'schema://fake-schema-url';
  let runtimeURL = 'hyperty-runtime://fake-runtime';

  let objURL = 'resource://obj1';
  let objURLChanges = objURL + '/changes';

  let hyperURL1 = 'hyperty://h1.domain/h1';
  let hyperURL2 = 'hyperty://h2.domain/h2';

  //fake object allocator -> always return the same URL
  let allocator = {
    create: () => {
      return new Promise((resolve) => {
        resolve([objURL]);
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

  it('reporter observer integration', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);

      if (msg.type === 'subscribe') {
        expect(msg).to.eql({
          id: 4, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h2.domain/sm',
          body: { resource: objURL, childrenResources: ['children1', 'children2'], schema: schemaURL }
        });

        //simulate msg-node response
        bus.postMessage({
          id: 4, type: 'response', from: 'domain://msg-node.h2.domain/sm', to: 'hyperty-runtime://fake-runtime/sm',
          body: { code: 200 }
        });
      }
    };

    new SyncherManager(runtimeURL, bus, { }, catalog, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('on-subscribe-reply');
        doo.onChange('*', (changeEvent) => {
          console.log('on-change: ', JSON.stringify(changeEvent));
          expect(changeEvent).to.eql({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
          expect(doo.data).to.eql({ x: 10, y: 10, test: ['a', 'b', 'c'] });
          done();
        });
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      console.log('on-create-reply');
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
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 1, attribute: '1',
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
          expect(msg).to.eql({
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

          //apply changes...
          data['1'].name = 'Micael Pedrosa';
          data['1'].birthdate = new Date(1982, 1, 28);
          data['1'].obj1.name = 'XPTO';
          delete data['2'];
        }

        if (seq === 3) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 3, attribute: '2' }
          });
        }

        if (seq === 4) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 4, attribute: '1.name', value: 'Micael Pedrosa' }
          });
        }

        if (seq === 5) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 5, attribute: '1.birthdate', value: '1982-02-28T00:00:00.000Z' }
          });
        }

        if (seq === 6) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 6, attribute: '1.obj1.name', value: 'XPTO' }
          });

          //apply changes...
          data['1'].arr = [1, 0, { x: 10, y: 20 }];
        }

        if (seq === 7) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 7, attribute: '1.arr', value: [1, 0, {x: 10, y: 20}] }
          });

          //apply changes...
          data['1'].arr[1] = 2;
        }

        if (seq === 8) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body:{ version: 8, attributeType: 'array', attribute: '1.arr.1', value: 2 }
          });

          //apply changes...
          data['1'].arr.push(3);
          data['1'].arr.push({ x: 1, y: 2 });
        }

        if (seq === 9) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 9, attributeType: 'array', operation: 'add', attribute: '1.arr.3', value: [3] }
          });
        }

        if (seq === 10) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 10, attributeType: 'array', operation: 'add', attribute: '1.arr.4', value: [{x: 1, y: 2}] }
          });

          //apply changes...
          data['1'].arr.splice(1, 2, 10, 11, 12);
          data['1'].arr[5].x = 10;
        }

        if (seq === 11) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 11, attributeType: 'array', operation: 'remove', attribute: '1.arr.1', value: 2 }
          });
        }

        if (seq === 12) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 12, attributeType: 'array', operation: 'add', attribute: '1.arr.1', value: [10, 11, 12] }
          });
        }

        if (seq === 13) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 13, attribute: '1.arr.5.x', value: 10 }
          });

          //apply changes...
          data['1'].arr.pop();
        }

        if (seq === 14) {
          expect(msg).to.eql({
            type: 'update', from: objURL, to: objURLChanges,
            body: { version: 14, attributeType: 'array', operation: 'remove', attribute: '1.arr.5', value: 1 }
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
        expect(event).to.eql({ cType: 'add', oType: 'object', field: '1', data: { name: 'Micael', birthdate:'28-01-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'xpto' } } });
      }

      if (seq === 2) {
        expect(event).to.eql({ cType: 'add', oType: 'object', field: '2', data: { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1:{ name: 'xpto' } } });

        //verify changes...
        expect(data).to.eql({
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
        expect(event).to.eql({ cType: 'remove', oType: 'object', field: '2' });
      }

      if (seq === 4) {
        expect(event).to.eql({ cType: 'update', oType: 'object', field: '1.name', data: 'Micael Pedrosa' });
      }

      if (seq === 5) {
        expect(event).to.eql({ cType: 'update', oType: 'object', field: '1.birthdate', data: '28-02-1981' });
      }

      if (seq === 6) {
        expect(event).to.eql({ cType: 'update', oType: 'object', field: '1.obj1.name', data: 'XPTO' });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' } }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 7, attribute: '1.arr', value: [1, 0, { x: 10, y: 20 }] }
        });
      }

      if (seq === 7) {
        expect(event).to.eql({ cType: 'add', oType: 'object', field: '1.arr', data: [1, 0, { x: 10, y: 20 }] });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 0, { x: 10, y: 20 }] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body:{ version: 8, attributeType: 'array', attribute: '1.arr.1', value: 2 }
        });
      }

      if (seq === 8) {
        expect(event).to.eql({ cType: 'update', oType: 'array', field: '1.arr.1', data: 2 });

        //verify changes...
        expect(data).to.eql({
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
          expect(event).to.eql({ cType: 'add', oType: 'array', field: '1.arr.3', data: [3] });
        } else {
          //it's OK to compact 2 messages...
          expect(event).to.eql({ cType: 'add', oType: 'array', field: '1.arr.3', data: [3, { x: 1, y: 2 }]});
          compacted = true;
        }
      }

      if (seq === 10) {
        if (!compacted) {
          expect(event).to.eql({ cType: 'add', oType: 'array', field: '1.arr.4', data: [{ x: 1, y: 2 }] });
        }

        compacted = false;

        //verify changes...
        expect(data).to.eql({
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
        expect(event).to.eql({ cType: 'remove', oType: 'array', field: '1.arr.1', data: 2 });
      }

      if (seq === 12) {
        expect(event).to.eql({ cType: 'add', oType: 'array', field: '1.arr.1', data: [10, 11, 12] });
      }

      if (seq === 13) {
        expect(event).to.eql({ cType: 'update', oType: 'object', field: '1.arr.5.x', data: 10 });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' }, arr: [1, 10, 11, 12, 3, { x: 10, y: 2 }] }
        });

        post({
          type: 'update', from: objURL, to: objURLChanges,
          body: { version: 14, attributeType: 'array', operation: 'remove', attribute: '1.arr.5', value: 1 }
        });
      }

      if (seq === 14) {
        expect(event).to.eql({ cType: 'remove', oType: 'array', field: '1.arr.5', data: 1 });

        //verify changes...
        expect(data).to.eql({
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

  it('reporter addChildren', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('5-_onPostMessage: ', msg);
    };

    new SyncherManager(runtimeURL, bus, { }, catalog, allocator);

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], { x: 10, y: 10 }).then((dor) => {
      console.log('on-create-reply');
      dor.addChildren('children1', 'my message').then((doc) => {
        console.log('on-addChildren-reply', doc);
        done();
      });
    });
  });

  it('observer addChildren', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('6-_onPostMessage: ', msg);
      bus.postMessage({
        id: 4, type: 'response', from: 'domain://msg-node.h2.domain/sm', to: 'hyperty-runtime://fake-runtime/sm',
        body: { code: 200 }
      });
    };

    new SyncherManager(runtimeURL, bus, { }, catalog, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('on-subscribe-reply');
        doo.addChildren('children1', { message: 'Hello World!' }).then((doc) => {
          console.log('on-local-addChildren');
          doc.onResponse((event) => {
            console.log('on-remote-addChildren-reply', event);
            expect(event).to.eql({ type: 'response', url: hyperURL1, code: 200 });
            done();
          });
        });
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      console.log('on-create-reply');
      dor.onSubscription((subscribeEvent) => {
        dor.onAddChildren((event) => {
          console.log('on-remote-addChildren', event);
          expect(event).to.eql({ type: 'create', from: hyperURL2, url: 'resource://obj1/children/children1', childId: hyperURL2 + '#1', value: { message: 'Hello World!' } });
        });

        console.log('on-subscribe: ', subscribeEvent);
        subscribeEvent.accept();
      });
    });
  });

  it('children deltas generate and process', function(done) {
    let bus = new MessageBus();
    bus._onPostMessage = (msg) => {
      console.log('7-_onPostMessage: ', msg);
      if (msg.type === 'subscribe') {
        expect(msg).to.eql({
          id: 4, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h2.domain/sm',
          body: { resource: objURL, childrenResources: ['children1', 'children2'], schema: schemaURL }
        });

        bus.postMessage({
          id: 4, type: 'response', from: 'domain://msg-node.h2.domain/sm', to: 'hyperty-runtime://fake-runtime/sm',
          body: { code: 200 }
        });
      }
    };

    new SyncherManager(runtimeURL, bus, {}, catalog, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        doo.addChildren('children1', { message: 'Hello Micael!' }).then((doc) => {
          doc.data.message = 'Hello Luis!';
        });
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      dor.onSubscription((subscribeEvent) => {
        dor.onAddChildren((event) => {
          let children1 = dor.childrens[event.childId];
          children1.onChange((changeEvent) => {
            console.log('onChange: ', changeEvent);
            expect(changeEvent).to.eql({ cType: 'update', oType: 'object', field: 'message', data: 'Hello Luis!' });
            expect(children1.data).to.eql({ message: 'Hello Luis!' });
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

          expect(deleted).to.eql(true);

          done();
        }
      }
    };

    new SyncherManager(runtimeURL, bus, { }, catalog, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      if (notifyEvent.type === 'create') {
        sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
          console.log('subscribe: ', doo.url);
        });
      } else if (notifyEvent.type === 'delete') {
        notifyEvent.ack();
        deleted = true;
      }
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      console.log('create: ', dor.url);
      dor.onSubscription((subscribeEvent) => {
        console.log('onSubscription: ', subscribeEvent);
        subscribeEvent.accept();

        setTimeout(() => {
          expect(sync1.reporters[dor.url]).to.eql(dor);
          dor.delete();
          expect(sync1.reporters[dor.url]).to.be.empty;
          console.log('reporter-deleted');
        });
      });
    });
  });

  it('subscribe and unsubscribe', function(done) {
    let bus = new MessageBus();
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

    new SyncherManager(runtimeURL, bus, { }, catalog, allocator);

    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('onNotification: ', notifyEvent);
      sync2.subscribe(schemaURL, notifyEvent.url).then((doo) => {
        console.log('subscribe: ', doo.url);
        doo.unsubscribe();
      });
    });

    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      console.log('create: ', dor.url);
      dor.onSubscription((subscribeEvent) => {
        console.log('onSubscription: ', subscribeEvent);
        subscribeEvent.accept();
      });
    });
  });
});
