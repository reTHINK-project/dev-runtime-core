import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import AddressAllocation from '../src/allocation/AddressAllocation';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('AddressAllocation', function() {

  let registry = {
    registerHyperty: () => {},
    checkRegisteredURLs: () => {}
  };

  before(() => {
    sinon.stub(registry, 'checkRegisteredURLs')
    .returns(new Promise((resolve) => {
      resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21e');
    }));
  });

  it('creation message and reply', function(done) {
    let bus = {
      postMessage: (msg, replyCallback) => {
        expect(msg).to.eql({
          type: 'create', from: 'local://fake.url', to: 'domain://msg-node.sp.domain/hyperty-address-allocation',
          body: {value: {number: 2}}
        });

        replyCallback({
          id: 1, type: 'response', from: 'domain://msg-node.sp.domain/hyperty-address-allocation', to: 'local://fake.url',
          body: {code: 200, value: {allocated: ['hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21e', 'hyperty://ua.pt/2']}}
        });
      }
    };

    // TODO Should improve this test and check the first time and 2 second when a hyperty will be reused;
    let aa = new AddressAllocation('local://fake.url', bus, registry);
    let domain = 'sp.domain';
    let number = 2;
    let info = {

    };

    expect(aa.create(domain, number, info).then((list) => {
      expect(list).to.eql({newAddress: false, address: 'hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21e'});
    })).notify(done);
  });
});
