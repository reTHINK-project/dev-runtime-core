import expect from 'expect.js';
import VertxProtoStub from '../src/js/VertxProtoStub';

describe('VertxProtoStub', function() {
  it('runtime connectivity', function(done) {
    let seq = 0;
    let proto;

    //TODO: requirement -> vertx MN must be online on ws://localhost:9090/ws

    let callback = function(msg) {
      if (seq === 0) {
        expect(msg).to.eql({
          header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
          body: {value: 'connected'}
        });

        //send loopback ping
        proto.postMessage({
          header: {id: 1, type: 'ping', from: 'runtime:/alice', to: 'runtime:/alice'}
        });
      }

      if (seq === 1) {
        //if the runtime is registered, ping should arrive here
        expect(msg).to.eql({
          header: {id: 1, type: 'ping', from: 'runtime:/alice', to: 'runtime:/alice'}
        });

        proto.disconnect();
      }

      if (seq === 2) {
        expect(msg).to.eql({
          header: {type: 'update', from: 'hyperty-runtime://sp1/protostub/123', to: 'hyperty-runtime://sp1/protostub/123/status'},
          body: {value: 'disconnected', desc: 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.'}
        });

        done();
      }

      seq++;
    };

    let config = {
      url: 'ws://localhost:9090/ws',
      runtimeURL: 'runtime:/alice'
    };

    proto = new VertxProtoStub('hyperty-runtime://sp1/protostub/123', callback, config);
    proto.connect();
  });
});
