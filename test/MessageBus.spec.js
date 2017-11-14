import chai from 'chai';
import MessageBus from '../src/bus/MessageBus';

let expect = chai.expect;

describe('MessageBus', function() {
  it.('sending message', function(done) {
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

  it.('pipeline msg change', function(done) {
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

  it.('sending using external system', function(done) {
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

  it.('publish unique messages', function(done) {
    let result = { obj1: 0, obj2: 0 };

    let msgBus = new MessageBus();
    msgBus._onPostMessage = (msg) => {
      console.log(msg);
      result[msg.to]++;
    };

    msgBus.addPublish('obj1');
    msgBus.addPublish('obj1'); //repeated route ignored
    msgBus.addPublish('obj2');

    setTimeout(() => {
      msgBus.postMessage({ from: 'x', to: 'obj1' });
      msgBus.postMessage({ from: 'x', to: 'obj2' });
      msgBus.postMessage({ from: 'x', to: 'obj2' });

      setTimeout(() => {
        expect(result).to.eql({ obj1: 1, obj2: 2 });
        done();
      });
    });
  });
  it('sending without callback and without pipeline processing', function(done) {
    let mockRegistry = {
      resolve() {
        return new Promise((resolve) => {
          //resolve to default
          resolve('error');
        });
      }
    };

    let mBus = new MessageBus(mockRegistry);

    let msg = { type: 'create', from: 'runtime://local/123/idm', to: 'runtime://local/123/identity-gui' };

    mBus.addListener('runtime://local/123/identity-gui', (msg) => {

      mBus.postMessage({type: 'response', id: msg.id, from: msg.to, to: msg.from, body: {code: 200}});
    });

    mBus.postMessage(msg, (reply) => {
       console.log('[MessageBus.test sending without callback and without pipeline processing] reply:', reply);
       mBus.removeResponseListener(msg.to, reply.id);
      expect(reply).to.eql({ id: 1, type: 'response', from: 'runtime://local/123/identity-gui', to: 'runtime://local/123/idm' , body: {code: 200}});
      done();
    }, false);
  });
});
