import chai from 'chai';
import MiniBus from '../src/bus/MiniBus';

let expect = chai.expect;

describe('MiniBus', function() {
  it('simple sending message', function(done) {
    let mBus = new MiniBus();
    mBus._onPostMessage = (msg) => {
      expect(msg).to.eql({
        id: 1, type: 'test', from: 'hyper-1', to: 'hyper-2',
        body: {value: 'x'}
      });

      done();
    };

    mBus.postMessage({
      type: 'test', from: 'hyper-1', to: 'hyper-2',
      body: {value: 'x'}
    });
  });

  it('send with external response', function(done) {
    this.timeout(4000);
    let msgResult = {};

    let mBus = new MiniBus();
    mBus.addListener('hyper-1', (msg) => {
      msgResult = msg;
    });

    mBus._onPostMessage = (msg) => {
      expect(msg).to.eql({
        id: 1, type: 'test', from: 'hyper-1', to: 'hyper-2',
        body: {value: 'x'}
      });

      mBus._onMessage({
        id: 1, type: 'response', from: 'hyper-2', to: 'hyper-1',
        body: {value: 'y'}
      });
    };

    mBus.postMessage({
      type: 'test', from: 'hyper-1', to: 'hyper-2',
      body: {value: 'x'}
    }, (response) => {
      expect(response).to.eql({
        id: 1, type: 'response', from: 'hyper-2', to: 'hyper-1',
        body: {value: 'y'}
      });

      setTimeout(() => {
        //expect not to enter in the hyper-1 listener
        expect(msgResult).to.be.empty;
        done();
      });
    });
  });

  it('send and publish', function(done) {
    let mBus = new MiniBus();
    let msgResult = {};

    let defaultListener = false;
    let hyper2Listener = false;
    let objListener = false;

    mBus.addListener('*', (msg) => {
      msgResult = msg;
      defaultListener = true;
    });

    mBus.addListener('hyperty://hyper-2', (msg) => {
      msgResult = msg;
      hyper2Listener = true;
    });

    mBus.addListener('resource://fake-url', (msg) => {
      msgResult = msg;
      objListener = true;
    });

    //simulate message from MessageBus core
    mBus._onMessage({
      id: 1, type: 'send', from: 'hyperty://hyper-1', to: 'hyperty://hyper-2',
      body: {value: 'x'}
    });

    setTimeout(() => {
      //should be only received in the hyperty listener
      expect(defaultListener).to.eql(false);
      expect(hyper2Listener).to.eql(true);
      expect(msgResult).to.eql({
        id: 1, type: 'send', from: 'hyperty://hyper-1', to: 'hyperty://hyper-2',
        body: {value: 'x'}
      });

      //simulate message from MessageBus core
      mBus._onMessage({
        id: 2, type: 'publish', from: 'hyperty://hyper-1', to: 'resource://fake-url',
        body: {value: 'x'}
      });

      setTimeout(() => {
        //should be received in default and object listener
        expect(defaultListener).to.eql(true);
        expect(objListener).to.eql(true);
        expect(msgResult).to.eql({
          id: 2, type: 'publish', from: 'hyperty://hyper-1', to: 'resource://fake-url',
          body: {value: 'x'}
        });
        done();
      });
    });
  });
});
