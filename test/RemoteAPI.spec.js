import expect from 'expect.js';
import RemoteAPI from '../src/rpc/RemoteAPI';

describe('RemoteAPI', function() {
  it('message call generation', function(done) {
    //this.timeout(10000);

    let component;
    let msgList = [];

    let mockBus = {
      owner: 'hyper-1',

      subscribe: function(comp, callback) {
        component = comp;
      },

      send: function(msg, replyCallback) {
        msgList.push(msg);
        replyCallback({
          header: {
            type: 'reply'
          },
          body: {
            code: 'ok',
            value: 3
          }
        });
      }
    };

    let api = new RemoteAPI(mockBus);
    let hyper2 = api.create('hyper-2');
    hyper2.addMethod('sum');

    hyper2.sum(1, 2).then((ret) => {
      expect(component).to.eql('rpc');
      expect(ret).to.eql(3);
      expect(msgList).to.eql([
        {
          header: {type: 'call', to: 'hyper-2', comp: 'rpc'},
          body: {method: 'sum', params: [1, 2]}
        }
      ]);

      done();
    });
  });

  it('message call process', function(done) {
    let component;

    let mockBus = {
      owner: 'hyper-1',

      subscribe: function(comp, callback) {
        component = comp;
        this._callback = callback;
      },

      simulateRemoteCall(msg) {
        this._callback(msg);
      }
    };

    let localHyper = {
      sum: function(p1, p2) {
        return p1 + p2;
      }
    };

    let api = new RemoteAPI(mockBus, localHyper);

    expect(component).to.eql('rpc');

    mockBus.simulateRemoteCall({
      header: {type: 'call', to: 'hyper-2', comp: 'rpc'},
      body: {method: 'sum', params: [1, 2]},
      reply: function(replyBody) {
        expect(replyBody).to.eql({code: 'ok', value: 3});
      }
    });

    mockBus.simulateRemoteCall({
      header: {type: 'call', to: 'hyper-2', comp: 'rpc'},
      body: {method: 'no-method'},
      reply: function(replyBody) {
        expect(replyBody).to.eql({code: 'error', desc: 'Method not found'});

        done();
      }
    });

  });
});
