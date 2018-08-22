import IdentityManager from '../src/identity/IdentityManager';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('IdentityManager', function() {
  let hypertyURL = 'hyperty://localhost/526e9670-593f-4641-8b63-98fa49f933a1';
  let runtimeURL = 'runtime://localhost/1051';
  let msgBus = {
    postMessage: (msg, replyCallback) => {

      expect(msg).to.eql({
        type: 'read', from: hypertyURL, to: runtimeURL + '/registry/',
        body: { resource: '.', criteria: hypertyURL}
      });

      replyCallback({
        type: 'read', from: runtimeURL + '/registry/', to: hypertyURL,
        body: { code: 200, resource: {cn: 'test OpenID', userURL: 'user://gmail.com/openidtest10', username: 'openidtest10@gmail.com', avatar: 'avatarURL'}}
      });
    }
  };

  let identityManager = new IdentityManager(hypertyURL, runtimeURL, msgBus);
  let expectedValue = {cn: 'test OpenID', userURL: 'user://gmail.com/openidtest10', username: 'openidtest10@gmail.com', avatar: 'avatarURL'};

  describe('constructor()', function() {
    it('should create a identityManager object without error', function() {
      expect(identityManager.runtimeURL).to.be.equal(runtimeURL);
    });
  });

  describe('discoverUserRegistered()', function() {
    it('should return a Promise with the identity associated', function(done) {

      expect(identityManager.discoverUserRegistered().then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedValue).and.notify(done);
    });

    it('should return a Promise with the identity associated (with optional hyperty field)', function(done) {

      expect(identityManager.discoverUserRegistered('.', hypertyURL).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedValue).and.notify(done);
    });

  });

});
