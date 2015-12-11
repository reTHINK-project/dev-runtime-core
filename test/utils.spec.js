// Unit test modules
import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

// internal modules to be tested
import {divideURL} from '../src/utils/utils';

let expect = chai.expect;

chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Utils Module', function() {

  it('should divide an url in 3 parts (type, domain, identity)', function() {

    // http://localhost:9090/test
    // hyperty://localhost:9090/test
    // http://sp1.sp/test-testes
    // hyperty-catalogue://sp1.sp/HelloHyperty
    // runtime://sp1.sp/8456/sm
    // domain://msg-node.sp1.sp/hyperty-address-allocation
    // hyperty-runtime://sp1.sp

    let url = 'runtime://sp.sp/8456/sm';
    expect(divideURL(url)).to.deep.equal({'type' : 'runtime','domain': 'sp.sp', 'identity': '/8456/sm'});

    url = 'domain://msg-node.sp1.sp/hyperty-address-allocation';
    expect(divideURL(url)).to.deep.equal({'type' : 'domain','domain': 'msg-node.sp1.sp', 'identity': '/hyperty-address-allocation'});

    url = 'hyperty://sp1.sp/HelloHyperty';
    expect(divideURL(url)).to.deep.equal({'type' : 'hyperty','domain': 'sp1.sp', 'identity': '/HelloHyperty'});

    url = 'hyperty://localhost:9090/test';
    expect(divideURL(url)).to.deep.equal({'type' : 'hyperty','domain': 'localhost:9090', 'identity': '/test'});

    url = 'runtime://sp1.sp';
    expect(divideURL(url)).to.deep.equal({'type' : 'runtime','domain': 'sp1.sp', 'identity': ''});

    url = 'http://localhost:9090/test';
    expect(divideURL(url)).to.deep.equal({'type' : 'http','domain': 'localhost:9090', 'identity': '/test'});

    url = 'https://localhost:9090/secure-test';
    expect(divideURL(url)).to.deep.equal({'type' : 'https','domain': 'localhost:9090', 'identity': '/secure-test'});
  })

})
