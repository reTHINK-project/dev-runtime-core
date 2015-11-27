import {Syncher, DataObjectReporter, DataObjectObserver} from 'service-framework';
import SyncherManager from '../src/syncher/SyncherManager';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('SyncherManager', function() {
  let schemaURL = 'schema://fake-schema-url';
  let runtimeURL = 'hyperty-runtime://fake-runtime';

  let objURL = 'resource://obj1';
  let objChangesURL = objURL + '/changes';

  let hyperURL1 = 'hyperty://h1.domain/h1';
  let hyperURL2 = 'hyperty://h2.domain/h2';

  it('create reporter and observer', function(done) {
    let seq = 0;

    let syncListener;
    let smListener;

    let createReplyCallback;

    let bus = {
      postMessage: (msg, replyCallback) => {
        seq++;
        if (!msg.id) { msg.id = seq; }
        console.log('1-postMessage: ', JSON.stringify(msg));

        if (seq === 1) {
          expect(replyCallback).to.be.an.instanceof(Function);
          expect(msg).to.eql({
            id: 1, type: 'create', from: hyperURL1, to: 'hyperty-runtime://fake-runtime/sm',
            body: { schema: schemaURL, value: { x: 10, y: 10 }, authorise: [hyperURL2] }
          });

          createReplyCallback = replyCallback;
          smListener(msg);
        }

        if (seq === 2) {
          expect(msg).to.eql({
            id: 1, type: 'response', from: 'hyperty-runtime://fake-runtime/sm', to: hyperURL1,
            body: { code: 200, resource: objURL }
          });

          createReplyCallback(msg);
        }

        if (seq === 3) {
          expect(msg).to.eql({
            id: 3, type: 'create', from: hyperURL1, to: hyperURL2,
            body: { code: 200, schema: schemaURL, resource: objURL, value: { x: 10, y: 10 } }
          });

          syncListener(msg);
        }
      },

      addListener: (url, callback) => {
        console.log('1-addListener: ', url);
        if (url === hyperURL2) {
          syncListener = callback;
        }

        if (url === 'hyperty-runtime://fake-runtime/sm') {
          smListener = callback;
        }
      }
    };

    let sm = new SyncherManager(runtimeURL, bus, { });
    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });

    expect(sync1.create(schemaURL, [hyperURL2], { x: 10, y: 10 }).then((dor) => {
      expect(sync1.reporters).to.have.any.keys(objURL);
      expect(dor.status).to.eql('on');
      expect(dor.data).to.eql({ x: 10, y: 10 });
      expect(sync2.observers).to.have.any.keys(objURL);
    })).notify(done);
  });

  it('create and subscribe (with pub/sub mode)', function(done) {
    let seq = 0;

    let syncListener1;
    let syncListener2;

    let smListener;
    let objSubscription;

    let createReplyCallback;
    let subscribeReplyCallback;
    let forwardReplyCallback;

    let registry = {
      getSandbox: (domainURL) => {
        console.log('getSandbox: ', domainURL);
        return new Promise((resolve, reject) => {
          resolve({});
        });
      }
    };

    let bus = {
      postMessage: (msg, replyCallback) => {
        seq++;
        if (!msg.id) { msg.id = seq; }
        console.log('2-postMessage: ', JSON.stringify(msg));

        if (seq === 1) {
          expect(replyCallback).to.be.an.instanceof(Function);
          expect(msg).to.eql({
            id: 1, type: 'create', from: hyperURL1, to: 'hyperty-runtime://fake-runtime/sm',
            body: { schema: schemaURL, value: { x: 10, y: 10 }, authorise: [] }
          });

          createReplyCallback = replyCallback;
          smListener(msg);
        }

        if (seq === 2) {
          expect(msg).to.eql({
            id: 1, type: 'response', from: 'hyperty-runtime://fake-runtime/sm', to: hyperURL1,
            body: { code: 200, resource: objURL }
          });

          createReplyCallback(msg);
        }

        if (seq === 3) {
          expect(replyCallback).to.be.an.instanceof(Function);
          expect(msg).to.eql({
            id: 3, type: 'subscribe', from: hyperURL2, to: 'resource://obj1/subscription'
          });

          subscribeReplyCallback = replyCallback;
          objSubscription(msg);
        }

        if (seq === 4) {
          expect(replyCallback).to.be.an.instanceof(Function);
          expect(msg).to.eql({
            id: 4, type: 'forward', from: 'hyperty-runtime://fake-runtime/sm', to: hyperURL1,
            body: { type: 'subscribe', from: hyperURL2, to: objURL }
          });

          forwardReplyCallback = replyCallback;
          syncListener1(msg);
        }

        if (seq === 5) {
          expect(msg).to.eql({
            id: 4, type: 'response', from: hyperURL1, to: 'hyperty-runtime://fake-runtime/sm',
            body: { code: 200, schema: schemaURL, version: 0, value: { x: 10, y: 10 } }
          });

          forwardReplyCallback(msg);
        }

        if (seq === 6) {
          expect(msg).to.eql({
            id: 3, type: 'response', from: 'resource://obj1/subscription', to: hyperURL2,
            body: { code: 200, schema: schemaURL, version: 0, value: { x: 10, y: 10 } }
          });

          subscribeReplyCallback(msg);
        }
      },

      addListener: (url, callback) => {
        console.log('2-addListener: ', url);
        if (url === hyperURL1) {
          syncListener1 = callback;
        }

        if (url === hyperURL2) {
          syncListener2 = callback;
        }

        if (url === 'hyperty-runtime://fake-runtime/sm') {
          smListener = callback;
        }

        if (url === 'resource://obj1/subscription') {
          objSubscription = callback;
        }
      }
    };

    let sm = new SyncherManager(runtimeURL, bus, registry);
    let sync1 = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    let sync2 = new Syncher(hyperURL2, bus, { runtimeURL: runtimeURL });

    expect(sync1.create(schemaURL, [], { x: 10, y: 10 }).then((dor) => {
      expect(sync1.reporters).to.have.any.keys(objURL);
      expect(dor.status).to.eql('on');
      expect(dor.data).to.eql({ x: 10, y: 10 });

      dor.onSubscription((event) => {
        console.log('onSubscription');
        event.accept();
      });

      return sync2.subscribe(objURL).then((doo) => {
        console.log('OK');
        expect(doo.status).to.eql('on');
        expect(sync2.observers).to.have.any.keys(objURL);
        expect(doo.data).to.eql({x: 10, y: 10});
      });
    })).notify(done);
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
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 1, oType: 'object', attrib: '1',
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
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 2, oType: 'object', attrib: '2',
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
            type: 'remove', from: hyperURL1, to: objChangesURL,
            body: { version: 3, oType: 'object', attrib: '2', value: undefined }
          });
        }

        if (seq === 4) {
          expect(msg).to.eql({
            type: 'update', from: hyperURL1, to: objChangesURL,
            body: { version: 4, oType: 'object', attrib: '1.name', value: 'Micael Pedrosa' }
          });
        }

        if (seq === 5) {
          expect(msg).to.eql({
            type: 'update', from: hyperURL1, to: objChangesURL,
            body: { version: 5, oType: 'object', attrib: '1.birthdate', value: '1982-02-28T00:00:00.000Z' }
          });
        }

        if (seq === 6) {
          expect(msg).to.eql({
            type: 'update', from: hyperURL1, to: objChangesURL,
            body: { version: 6, oType: 'object', attrib: '1.obj1.name', value: 'XPTO' }
          });

          //apply changes...
          data['1'].arr = [1, 0, { x: 10, y: 20 }];
        }

        if (seq === 7) {
          expect(msg).to.eql({
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 7, oType: 'object', attrib: '1.arr', value: [1, 0, {x: 10, y: 20}] }
          });

          //apply changes...
          data['1'].arr[1] = 2;
        }

        if (seq === 8) {
          expect(msg).to.eql({
            type: 'update', from: hyperURL1, to: objChangesURL,
            body:{ version: 8, oType: 'array', attrib: '1.arr.1', value: 2 }
          });

          //apply changes...
          data['1'].arr.push(3);
          data['1'].arr.push({ x: 1, y: 2 });
        }

        if (seq === 9) {
          expect(msg).to.eql({
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 9, oType: 'array', attrib: '1.arr.3', value: [3] }
          });
        }

        if (seq === 10) {
          expect(msg).to.eql({
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 10, oType: 'array', attrib: '1.arr.4', value: [{x: 1, y: 2}] }
          });

          //apply changes...
          data['1'].arr.splice(1, 2, 10, 11, 12);
          data['1'].arr[5].x = 10;
        }

        if (seq === 11) {
          expect(msg).to.eql({
            type: 'remove', from: hyperURL1, to: objChangesURL,
            body: { version: 11, oType: 'array', attrib: '1.arr.1', value: 2 }
          });
        }

        if (seq === 12) {
          expect(msg).to.eql({
            type: 'add', from: hyperURL1, to: objChangesURL,
            body: { version: 12, oType: 'array', attrib: '1.arr.1', value: [10, 11, 12] }
          });
        }

        if (seq === 13) {
          expect(msg).to.eql({
            type: 'update', from: hyperURL1, to: objChangesURL,
            body: { version: 13, oType: 'object', attrib: '1.arr.5.x', value: 10 }
          });

          //apply changes...
          data['1'].arr.pop();
        }

        if (seq === 14) {
          expect(msg).to.eql({
            type: 'remove', from: hyperURL1, to: objChangesURL,
            body: { version: 14, oType: 'array', attrib: '1.arr.5', value: 1 }
          });

          done();
        }
      },

      addListener: (url, callback) => {
        console.log('3-addListener', url);
      }
    };

    //BEGIN: skip message system (already tested in previous units) and manually create a reporter and subscription, this should not be done in real code.
    let reporter = new DataObjectReporter(hyperURL1, objURL, schemaURL, bus, 'on');
    reporter.subscriptions[hyperURL2] = { status: 'on' };

    let sync = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
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

        if (url === objChangesURL) {
          post = callback;
        }
      }
    };

    //BEGIN: skip message system (already tested in previous units) and manually create an observer, this should not be done in real code.
    let seq = 0;
    let data;
    let compacted = false;

    let sync = new Syncher(hyperURL1, bus, { runtimeURL: runtimeURL });
    let observer = sync._addObserver(objURL, schemaURL);
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
          type: 'remove', from: hyperURL1, to: objChangesURL,
          body: { version: 3, oType: 'object', attrib: '2' }
        });

        post({
          type: 'update', from: hyperURL1, to: objChangesURL,
          body: { version: 4, oType: 'object', attrib: '1.name', value: 'Micael Pedrosa' }
        });

        post({
          type: 'update', from: hyperURL1, to: objChangesURL,
          body: { version: 5, oType: 'object', attrib: '1.birthdate', value: '28-02-1981' }
        });

        post({
          type: 'update', from: hyperURL1, to: objChangesURL,
          body: { version: 6, oType: 'object', attrib: '1.obj1.name', value: 'XPTO' }
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
          type: 'add', from: hyperURL1, to: objChangesURL,
          body: { version: 7, oType: 'object', attrib: '1.arr', value: [1, 0, { x: 10, y: 20 }] }
        });
      }

      if (seq === 7) {
        expect(event).to.eql({ cType: 'add', oType: 'object', field: '1.arr', data: [1, 0, { x: 10, y: 20 }] });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 0, { x: 10, y: 20 }] }
        });

        post({
          type: 'update', from: hyperURL1, to: objChangesURL,
          body:{ version: 8, oType: 'array', attrib: '1.arr.1', value: 2 }
        });
      }

      if (seq === 8) {
        expect(event).to.eql({ cType: 'update', oType: 'array', field: '1.arr.1', data: 2 });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 2, { x: 10, y: 20 }] }
        });

        post({
          type: 'add', from: hyperURL1, to: objChangesURL,
          body: { version: 9, oType: 'array', attrib: '1.arr.3', value: [3] }
        });

        post({
          type: 'add', from: hyperURL1, to: objChangesURL,
          body: { version: 10, oType: 'array', attrib: '1.arr.4', value: [{ x: 1, y: 2 }] }
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

        post({
          type: 'remove', from: hyperURL1, to: objChangesURL,
          body: { version: 11, oType: 'array', attrib: '1.arr.1', value: 2 }
        });

        post({
          type: 'add', from: hyperURL1, to: objChangesURL,
          body: { version: 12, oType: 'array', attrib: '1.arr.1', value: [10, 11, 12] }
        });

        post({
          type: 'update', from: hyperURL1, to: objChangesURL,
          body: { version: 13, oType: 'object', attrib: '1.arr.5.x', value: 10 }
        });

        done();
      }

      if (seq === 11) {
        expect(event).to.eql({ cType: 'remove', oType: 'array', field: '1.arr.1', data: 2 });
      }

      if (seq === 12) {
        expect(event).to.eql({ cType: 'add', oType: 'array', field: '1.arr.1', data: [10,11,12] });
      }

      if (seq === 13) {
        expect(event).to.eql({ cType: 'update', oType: 'object', field: '1.arr.5.x', data: 10 });

        //verify changes...
        expect(data).to.eql({
          1: { name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: { name: 'XPTO' }, arr: [1, 10, 11, 12, 3, { x: 10, y: 2 }] }
        });

        post({
          type: 'remove', from: hyperURL1, to: objChangesURL,
          body: { version: 14, oType: 'array', attrib: '1.arr.5', value: 1 }
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
    });

    //END
    data = observer.data;

    post({
      type: 'add', from: hyperURL1, to: objChangesURL,
      body: { version: 1, oType: 'object', attrib: '1',
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
      type: 'add', from: hyperURL1, to: objChangesURL,
      body: { version: 2, oType: 'object', attrib: '2',
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
});
