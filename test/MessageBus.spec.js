import expect from 'expect.js';
import MessageBus from '../src/bus/MessageBus';

describe('MessageBus', function() {
  it('sending message', function() {
    var registered = false;
    var notReceived = true;
    var msgResult;

    var hasOutbound = false;
    var hasInbound = false;

    let mockCon = {
      onMessage(callback) {
        registered = true;
      },

      send(msg) {
        msgResult = msg;
      }
    };

    let msgBus = new MessageBus(mockCon);
    msgBus.subscribe('hyper-1', (msg) => {
      notReceived = false;
    });

    msgBus.outbounds = [
      function(ctx) {
        hasOutbound = true;
        ctx.next();
      }
    ];

    msgBus.inbounds = [
      function(ctx) {
        hasInbound = true;
        ctx.next();
      }
    ];

    msgBus.publish({
      header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
      body: {value: 'x'}
    });

    expect(registered).to.eql(true);
    expect(notReceived).to.eql(true);

    expect(hasOutbound).to.eql(true);
    expect(hasInbound).to.eql(false);

    expect(msgResult).to.eql({
      header: {id: 1, from: 'hyper-1', to: 'hyper-2'},
      body: {value: 'x'}
    });
  });

  it('receiving message', function() {
    var registered = false;
    var sent = false;
    var msgResult;

    var hasOutbound = false;
    var hasInbound = false;

    let mockCon = {
      onMessage(callback) {
        registered = true;
        this._callback = callback;
      },

      send(msg) {
        sent = true;
      },

      simulateMsgNode() {
        this._callback({
          header: {id: 1, from: 'hyper-2', to: 'hyper-1'},
          body: {value: 'remote'}
        });
      }
    };

    let msgBus = new MessageBus(mockCon);
    msgBus.subscribe('hyper-1', (msg) => {
      msgResult = msg;
    });

    msgBus.outbounds = [
      function(ctx) {
        hasOutbound = true;
        ctx.next();
      }
    ];

    msgBus.inbounds = [
      function(ctx) {
        hasInbound = true;
        ctx.next();
      }
    ];

    msgBus.publish({
      header: {id: 1, from: 'hyper-2', to: 'hyper-1'},
      body: {value: 'local'}
    });

    expect(registered).to.eql(true);
    expect(sent).to.eql(true);

    expect(hasOutbound).to.eql(true);
    expect(hasInbound).to.eql(false);

    expect(msgResult).to.eql({
      header: {id: 1, from: 'hyper-2', to: 'hyper-1'},
      body: {value: 'local'}
    });

    mockCon.simulateMsgNode();

    expect(hasInbound).to.eql(true);

    expect(msgResult).to.eql({
      header: {id: 1, from: 'hyper-2', to: 'hyper-1'},
      body: {value: 'remote'}
    });
  });

});
