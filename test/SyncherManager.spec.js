import Syncher from '../src/syncher/Syncher';
import SyncherManager from '../src/syncher/internal/SyncherManager';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('SyncherManager', function() {
  let runtimeURL = 'hyperty-runtime://fake-runtime';

  it('create reporter and observer', function(done) {
    let seq1 = 0;

    let syncListener;
    let smListener;

    let createReplyCallback;

    let bus = {
      postMessage: (msg, replyCallback) => {
        seq1++;
        if (!msg.id) { msg.id = seq1; }
        console.log('postMessage: ', JSON.stringify(msg));

        if (seq1 === 1) {
          expect(replyCallback).to.be.an.instanceof(Function);
          expect(msg).to.eql({
            id: 1, type: 'create', from: 'hyper-1', to: 'hyperty-runtime://fake-runtime/sm',
            body: { schema: 'schema://point-schema-url', value: { x: 10, y: 10 }, authorise: ['hyper-2'] }
          });

          createReplyCallback = replyCallback;
          smListener(msg);
        }

        if (seq1 === 2) {
          expect(msg).to.eql({
            id: 1, type: 'response', from: 'hyperty-runtime://fake-runtime/sm', to: 'hyper-1',
            body: { code: 200, resource: 'resource://obj1' }
          });

          createReplyCallback(msg);
        }

        if (seq1 === 3) {
          expect(msg).to.eql({
            id: 3, type: 'create', from: 'hyper-1', to: 'hyper-2',
            body: { code: 200, schema: 'schema://point-schema-url', resource: 'resource://obj1', value: { x: 10, y: 10 } }
          });

          syncListener(msg);
        }
      },

      addListener: (url, callback) => {
        console.log('addListener: ', url);
        if (url === 'hyper-2') {
          syncListener = callback;
        }

        if (url === 'hyperty-runtime://fake-runtime/sm') {
          smListener = callback;
        }
      }
    };

    let sm = new SyncherManager(runtimeURL, bus, { });
    let sync1 = new Syncher('hyper-1', bus, { runtimeURL: runtimeURL });
    let sync2 = new Syncher('hyper-2', bus, { runtimeURL: runtimeURL });

    expect(sync1.create('schema://point-schema-url', ['hyper-2'], { x: 10, y: 10 }).then((dor) => {
      expect(sync1.reporters).to.have.any.keys('resource://obj1');
      expect(dor.status).to.eql('on');
      expect(dor.data).to.eql({ x: 10, y: 10 });
      expect(sync2.observers).to.have.any.keys('resource://obj1');
    })).notify(done);
  });
});
