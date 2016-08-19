import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import IdentityModule from '../src/identity/IdentityModule';

let runtimeURL = 'hyperty-runtime://csp.com/123';

let identityModule = new IdentityModule(runtimeURL);

describe('IdentityModule', function() {

  describe('constructor()', function() {

    it('successfully instantiated', function() {
      expect(identityModule).to.be.instanceof(IdentityModule);
    });
  });

  //TODO complete with encryptMessage() and decryptMessage()
  /*describe('encryptMessage()', function() {

    it('successfully instantiated', function() {
      expect(identityModule).to.be.instanceof(IdentityModule);
    });
  });*/
});
