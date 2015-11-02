import expect from 'expect.js';
import MiniBus from '../src/bus/MiniBus';

describe('MiniBus', function() {
  it('simple sending message', function(done) {
    var msgResult;

    let mBus = new MiniBus();
    let listener = mBus.addListener('hyper-2', (msg) => {
      msgResult = msg;
    });

    mBus.postMessage({
      header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
      body: {value: 'x'}
    });

    expect(listener.url).to.eql('hyper-2');

    setTimeout(() => {
      expect(msgResult).to.eql({
        header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
        body: {value: 'x'}
      });

      listener.remove();
      expect(mBus._subscriptions).to.eql({});

      mBus.postMessage({
        header: {id: 1, from: 'hyper-3', to: 'hyper-2'},
        body: {value: 'y'}
      });

      setTimeout(() => {
        //should stay the same since the listener is off
        expect(msgResult).to.eql({
          header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
          body: {value: 'x'}
        });

        done();
      });
    });
  });
});
