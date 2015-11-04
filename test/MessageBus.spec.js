import expect from 'expect.js';
import MessageBus from '../src/bus/MessageBus';

describe('MessageBus', function() {
  it('sending message', function(done) {
    var msgResult;

    let mockRegistry = {
      resolve(url) {
        return new Promise((resolve, reject) => {
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
      header: {from: 'hyper-1', to: 'hyper-2'},
      body: {value: 'x'}
    });

    setTimeout(() => {
      expect(msgResult).to.eql({
        header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
        body: {value: 'x'}
      });

      done();
    });
  });

  it('sending using external system', function(done) {
    var msgResult;

    let mockRegistry = {
      resolve(url) {
        return new Promise((resolve, reject) => {
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
      header: {from: 'hyper-1', to: 'hyper-2/other'},
      body: {value: 'x'}
    });

    setTimeout(() => {
      expect(msgResult).to.eql({
        header: {id: 1, from: 'hyper-1', to: 'hyper-2/other'},
        body: {value: 'x'}
      });

      done();
    });

  });
});
