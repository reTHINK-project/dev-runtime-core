import chai from 'chai';
import MessageBus from '../../src/bus/MessageBus';

let expect = chai.expect;

describe('Deliver Messages', function() {
  it('sending message among Hyperties in the same runtime', function(done) {
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

});
