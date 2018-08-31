import MessageBodyIdentity from '../src/identity/MessageBodyIdentity.js';
import UserProfile from '../src/identity/UserProfile.js';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

//Testing the Message factory
describe('IdentityFactory', function() {
  let identity;

  describe('constructor()', function() {
    it('should create an Identity object without error', function(done) {

      let username = 'alice';
      let userURL = 'slack://alice@slacl.com';
      let avatar = 'http://i.imgur.com/gVtNW22.png';
      let cn = 'alice@slack.com';
      let locale = 'pt';
      let idp = 'idp.com';
      let assertion = 'yrtt6trassertionexamplerga5tgarg';
      identity = new MessageBodyIdentity(username, userURL, avatar, cn, locale, idp, assertion);
      done();
    });
  });
});
