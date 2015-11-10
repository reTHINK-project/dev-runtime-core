import AddressAllocation from '../src/registry/AddressAllocation';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('AddressAllocation', function() {
  it('creation message and reply', function(done) {
    let bus = {
      postMessage: (msg, replyCallback) => {
        expect(msg).to.eql({
          header: {type: 'create', from: 'local://fake.url', to: 'domain://msg-node.ua.pt/hyperty-address-allocation'},
          body: {number: 2}
        });

        replyCallback({
          header: {id: 1, type: 'reply', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: 'local://fake.url'},
          body: {code: 'ok', allocated: ['hyperty-instance://ua.pt/1', 'hyperty-instance://ua.pt/2']}
        });
      }
    };

    let aa = new AddressAllocation('local://fake.url', bus);
    expect(aa.create('ua.pt', 2).then((list) => {
      expect(list).to.eql(['hyperty-instance://ua.pt/1', 'hyperty-instance://ua.pt/2']);
    })).notify(done);
  });
});
