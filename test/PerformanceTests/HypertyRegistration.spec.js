import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import { generateGUID } from '../../src/utils/utils';
import AddressAllocation from '../../src/allocation/AddressAllocation';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('AddressAllocation', function() {

  let aa;
  let registry;
  let bus;
  let guid = generateGUID();
  let domain = 'sp.domain';

  before(() => {

    registry = {
      registerHyperty: () => {},
      checkRegisteredURLs: () => {}
    };

    bus = {
      postMessage: (msg, replyCallback) => {

        if (!msg.body.scheme) { msg.body.scheme = 'hyperty'; }

        replyCallback({
          id: 1, type: 'response', from: 'domain://msg-node.sp.domain/address-allocation', to: 'local://fake.url',
          body: {code: 200, value: {allocated: msg.body.scheme + '://' + domain + '/' + guid}}
        });

      }
    };

    sinon.stub(registry, 'checkRegisteredURLs', (info) => {

      return new Promise((resolve) => {

        console.log('CHECK REGISTER: ', info);

        if (info.reporter.length === 0) {
          resolve('hyperty://' + domain + '/' + guid);
        } else {
          resolve('comm://' + domain + '/' + guid);
        }

      });

    });

    let runtimeURL = 'hyperty-runtime://ua.pt/123';
    new AddressAllocation(runtimeURL, bus, registry);
    aa = AddressAllocation.instance;
  });

  it('should register a new hyperty address', function(done) {

    let number = 2;
    let scheme = 'hyperty';
    let info = {
      name: 'test',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/hello',
      reporter: [],
      resources: []
    };
    expect(aa.create(domain, number, info, scheme))
    .eventually.to.eql({newAddress: true, address: 'hyperty://' + domain + '/' + guid})
    .notify(done);
  });

});
