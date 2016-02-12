import expect from 'expect.js';
import MessageBus from '../src/bus/MessageBus';

describe('MessageBus', function() {
  it('sending message', function(done) {
    let msgResult;

    let mockRegistry = {
      resolve(url) {
        return new Promise((resolve) => {
          //resolve to the same URL
          resolve(url);
        });
      }
    };

    let msgBus = new MessageBus(mockRegistry);
    msgBus.addListener('hyper-2', (msg) => {
      msgResult = msg;
    });

    msgBus.postMessage({
      from: 'hyper-1', to: 'hyper-2',
      body: {value: 'x'}
    });

    setTimeout(() => {
      expect(msgResult).to.eql({
        id: 1, from: 'hyper-1', to: 'hyper-2',
        body: {value: 'x'}
      });

      done();
    });
  });

  it('pipeline msg change', function(done) {
    let mBus = new MessageBus();
    mBus.pipeline.handlers = [
      function(ctx) {
        ctx.msg.token = '12345678';
        ctx.next();
      }
    ];

    mBus.addListener('hyper-2', (msg) => {
      expect(msg).to.eql({ id: 1, type: 'ping', token: '12345678', from: 'hyper-1', to: 'hyper-2' });
      done();
    });

    mBus.postMessage({ type: 'ping', from: 'hyper-1', to: 'hyper-2' });
  });

  it('sending using external system', function(done) {
    let msgResult;

    let mockRegistry = {
      resolve() {
        return new Promise((resolve) => {
          //resolve to default
          resolve('protostub');
        });
      }
    };

    let msgBus = new MessageBus(mockRegistry);
    msgBus.addListener('protostub', (msg) => {
      msgResult = msg;
    });

    msgBus.postMessage({
      from: 'hyper-1', to: 'hyper-2/other',
      body: {value: 'x'}
    });

    setTimeout(() => {
      expect(msgResult).to.eql({
        id: 1, from: 'hyper-1', to: 'hyper-2/other',
        body: {value: 'x'}
      });

      done();
    });

  });

  it('forward unique messages', function(done) {
    let result = { x1: 0, x2: 0 };
    let seq = 0;

    let sandbox1 = {
      postMessage: (msg) => {
        expect(msg).to.eql({ id: 1, from: 'x', to: 'obj1' });
        result.x1 += 1;
      }
    };

    let sandbox2 = {
      postMessage: (msg) => {
        seq++;
        result.x2 += 1;

        if (seq === 1) {
          expect(msg).to.eql({ id: 1, from: 'x', to: 'obj1' });
        }

        if (seq === 2) {
          expect(msg).to.eql({ id: 2, from: 'x', to: 'obj2' });
        }
      }
    };

    let mockRegistry = {
      getSandbox(url) {
        return new Promise((resolve) => {
          if (url === 'h1') {
            resolve(sandbox1);
          } else {
            resolve(sandbox2);
          }
        });
      }
    };

    let msgBus = new MessageBus(mockRegistry);
    msgBus.addForward('obj1', 'h1');
    msgBus.addForward('obj1', 'h1'); //repeated route ignored
    msgBus.addForward('obj1', 'h2');
    msgBus.addForward('obj1', 'h3');
    msgBus.addForward('obj2', 'h3'); //new route to h3

    /*
    msgBus.addListener('h1-proto', (msg) => {
      expect(msg).to.eql({ id: 1, from: 'x', to: 'obj1' });
      result.x1 += 1;
    });

    msgBus.addListener('h2-h3-proto', (msg) => {
      seq++;
      result.x2 += 1;

      if (seq === 1) {
        expect(msg).to.eql({ id: 1, from: 'x', to: 'obj1' });
      }

      if (seq === 2) {
        expect(msg).to.eql({ id: 2, from: 'x', to: 'obj2' });
      }
    });
    */

    setTimeout(() => {
      msgBus.postMessage({ from: 'x', to: 'obj1' });
      msgBus.postMessage({ from: 'x', to: 'obj2' });

      setTimeout(() => {
        expect(result).to.eql({ x1: 1, x2: 2 });
        done();
      });
    });
  });
});
