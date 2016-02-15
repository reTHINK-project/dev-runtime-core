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
          type: 'create', from: 'local://fake.url', to: 'domain://msg-node.ua.pt/hyperty-address-allocation',
          body: {value: {number: 2}}
        });

        replyCallback({
          id: 1, type: 'response', from: 'domain://msg-node.ua.pt/hyperty-address-allocation', to: 'local://fake.url',
          body: {code: 200, value: {allocated: ['hyperty://ua.pt/1', 'hyperty://ua.pt/2']}}
        });
      }
    };

    let aa = new AddressAllocation('local://fake.url', bus);
    expect(aa.create('ua.pt', 2).then((list) => {
      expect(list).to.eql(['hyperty://ua.pt/1', 'hyperty://ua.pt/2']);
    })).notify(done);
  });
});
