import expect from 'expect.js';
import MiniBus from '../src/bus/MiniBus';

describe('MiniBus', function() {
  it('simple sending message', function(done) {
    this.timeout(4000);
    let msgResult;

    let mBus = new MiniBus();
    let listener = mBus.addListener('hyper-2', (msg) => {
      msgResult = msg;
    });

    mBus.postMessage({
      type: 'test', from: 'hyper-1', to: 'hyper-2',
      body: {value: 'x'}
    });

    expect(listener.url).to.eql('hyper-2');

    setTimeout(() => {
      expect(msgResult).to.eql({
        id: 1, type: 'test', from: 'hyper-1', to: 'hyper-2',
        body: {value: 'x'}
      });

      listener.remove();
      expect(mBus._subscriptions).to.eql({});

      mBus.postMessage({
        type: 'test', from: 'hyper-3', to: 'hyper-2',
        body: {value: 'y'}
      });

      setTimeout(() => {
        //should stay the same since the listener is off
        expect(msgResult).to.eql({
          id: 1, type: 'test', from: 'hyper-1', to: 'hyper-2',
          body: {value: 'x'}
        });

        done();
      });
    });
  });

  it('send and response', function(done) {
    this.timeout(4000);
    let msgResult = {};

    let mBus = new MiniBus();
    mBus.addListener('hyper-1', (msg) => {
      msgResult = msg;
    });

    mBus.addListener('hyper-2', (msg) => {
      expect(msg).to.eql({
        id: 1, type: 'test', from: 'hyper-1', to: 'hyper-2',
        body: {value: 'x'}
      });

      mBus.postMessage({
        id: 1, type: 'response', from: 'hyper-2', to: 'hyper-1',
        body: {value: 'y'}
      });
    });

    mBus.postMessage({
      type: 'test', from: 'hyper-1', to: 'hyper-2',
      body: {value: 'x'}
    }, (response) => {
      expect(response).to.eql({
        id: 1, type: 'response', from: 'hyper-2', to: 'hyper-1',
        body: {value: 'y'}
      });

      expect(msgResult).to.be.empty();
      done();
    });
  });

  it('pipeline msg change', function(done) {
    let mBus = new MiniBus();
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

});
