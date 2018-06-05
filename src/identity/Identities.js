// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import { decode, secondsSinceEpoch, deepClone } from '../utils/utils.js';
import { WatchingYou } from 'service-framework/dist/Utils';


/**
* The Identity Data Model is used to model the reTHINK User entity. The Identity data model is handled by Identity Management functionality.
*
*/
class Identities {

  constructor(type, storageManager) {
    let _this = this;

    _this._watchingYou = new WatchingYou();

    _this._storageManager = storageManager;
    _this._guid;
    _this._type = type;
    _this._identities = {};
    _this._accessTokens = _this.watchingYou.watch('accessTokens', {}, true);

  }

  reset() {
    this._identities = {};
    console.log(this);
    this.currentIdentity = undefined;
    this.defaultIdentity = undefined;
  }

  get identities() {
    return this._identities;
  }

  get accessTokens() {
    return this._accessTokens;
  }

  get watchingYou() {
    return this._watchingYou;
  }

  set guid(guid) {
    this._guid = guid;
  }

  get guid() {
    return this._guid;
  }

  set defaultIdentity(identifier) {
    if (this.identities[identifier]) this._defaultIdentity = identifier;
    else throw new Error('[Identities.set defaultIdentity ] Error: identity does not exist here: ', identifier);
  }

  set currentIdentity(identifier) {
    if (this.identities[identifier]) this._currentIdentity = identifier;
    else throw '[Identities.set currentIdentity ] Error: identity does not exist here: ', identifier;
  }

  get defaultIdentity() {
    if (this._defaultIdentity) return Object.assign({}, this.identities[this._defaultIdentity]);
    else return false;
  }

  get currentIdentity() {
    return Object.assign({}, this.identities[this._currentIdentity]);
  }

  get identifiers() {
    return Object.keys(this._identities);
  }

  getIdentity(identifier) {
    return Object.assign({}, this._identities[identifier]);
  }

  loadIdentities() {
    let _this = this;
    return new Promise((resolve) => {

      _this._storageManager.get(null, null, 'identities').then((identities) => {

        log.info('[Identities.Load Identities] identities: ', identities);

        if (identities) {
          _this._identities = identities;

          // let's set as default identity the one that expires later

          _this.identifiers.forEach((id) => {
            let timeNow = secondsSinceEpoch();
            let identity = _this._identities[id];
            let expires = identity.expires;

            //            if (!identity.hasOwnProperty('interworking')
            //            || !identity.interworking) {
            _this.defaultIdentity = id;

            if (parseInt(expires) > timeNow) {
              _this.defaultIdentity.expires = parseInt(expires);
              _this.currentIdentity = id;
            }

          });
        }

        resolve();
      });
    });
  }

  loadAccessTokens() {
    let _this = this;
    return new Promise((resolve) => {

      _this._storageManager.get('accessTokens').then((accessTokens) => {

        if (accessTokens) _this._accessTokens = accessTokens;
        resolve();
      });
    });
  }

  // to confirm if this function is required when the App constraints the identity selection

  addIdentity(identity) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (_this._isValid(identity)) {
        let id = identity.identifiers[0];
        Object.assign(this._identities[id], identity);
        //TODO: WARNING: This does not exist!
        this._storeIdentity(identity).then(() => {
          this._identities[id].status = 'created';
          resolve();
        });
      } else { reject('[Identities.addIdentity] invalid IdAssertion'); }
    });

  }

  addAssertion(assertion) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (_this._isValid(assertion)) {
        assertion.userProfile.guid = _this._guid;
        let userUrl = assertion.userProfile.userURL;
        if (!_this.identities[userUrl]) _this._identities[userUrl] = assertion;
        else _this.identities[userUrl] = assertion;

        _this._store().then(() => {
          this._identities[userUrl].status = 'created';
          resolve(assertion);
        });
      } else { reject('[Identities.addAssertion] invalid IdAssertion: ', assertion); }
    });

  }

  removeIdentity(userUrl) {
    let _this = this;


    return new Promise((resolve, reject) => {
      delete _this.identities[userUrl];

      _this._store().then(() => {
        resolve();
      });

    });

  }

  addAccessToken(accessToken) {
    let _this = this;
    log.info('[Identities.addAccessToken] ', accessToken);

    return new Promise((resolve, reject) => {

      if (_this._isValidAccessToken(accessToken)) {

        //        let newAccessToken = deepClone(accessToken);

        _this._accessTokens[accessToken.domain] = accessToken;

        _this._storeAccessTokens().then(() => {
          _this._accessTokens[accessToken.domain].status = 'created';
          resolve(accessToken);
        });
      } else { reject('[Identities.addIdentity] invalid AccessToken: ', accessToken); }
    });

  }

  setAccessTokenInProgress(domain) {

    if (this._accessTokens[domain]) this._accessTokens[domain].status = 'in-progress';
    else this._accessTokens[domain] = { status: 'in-progress' };
  }

  getAccessToken(domain, resources) {
    let accessToken = this._accessTokens[domain];

    if (!accessToken) { return undefined; } else if (
      resources.every((i) => { return accessToken.resources.indexOf(i) != -1; })) { return this._accessTokens[domain]; } else { return new Error('[Identities.getAccessToken] Not found for ', domain); }

  }

  updateAssertion(assertion) {
    let _this = this;

    return new Promise((resolve) => {
      let userUrl = assertion.userProfile.userUrl;

      if (!_this.identities[userUrl]) { return reject('[Identities.updateAssertion] Identity not found for ', userUrl); } else {
        _this.identities[userUrl] = assertion;
        _this._store().then(() => {
          resolve();
        });
      }

    });

  }

  addIdAssertion(identifier, assertion, idp, scope) {
    let _this = this;

    let newIdAssertion = new IdAssertion(assertion, idp, scope);

    _this.idAssertionList.push(newIdAssertion);
  }

  //TODO: complete with more verifications. To be moved to Identity?

  _isValid(identity) {
    if (!identity.hasOwnProperty('assertion')) {
      return false;
    }

    let splitedAssertion = identity.assertion.split('.');
    let assertionParsed;

    //verify if the token contains the 3 components, or just the assertion
    try {
      if (splitedAssertion[1]) {
        assertionParsed = decode(splitedAssertion[1]);
      } else {
        assertionParsed = decode(identity.assertion);
      }
    } catch (err) {
      return false;
    }


    return true;

  }

  _isValidAccessToken(accessToken) {

    if (!accessToken.hasOwnProperty('accessToken')) {
      return false;
    }

    if (!accessToken.hasOwnProperty('domain')) {
      return false;
    }

    if (!(accessToken.hasOwnProperty('resources') && Array.isArray(accessToken.resources))) {
      return false;
    }


    if (!(accessToken.hasOwnProperty('expires') && Number.isInteger(accessToken.expires))) {
      return false;
    }

    if (!accessToken.hasOwnProperty('input')) {
      return false;
    }

    return true;

  }

  //TODO: add function to only set one new identity using the new indexed storage manager

  _store() {
    let _this = this;

    return new Promise((resolve, reject) => {

      const store = Object.keys(this._identities).map((userURL) => {
        return _this._storageManager.set(userURL, 0, this._identities[userURL], 'identities');
      });

      Promise.all(store).then(() => {
        resolve();
      }).catch(err => {
        reject('On _sendReporterSessionKey from method storeIdentity error: ' + err);
      });

    });
  }
  _storeAccessTokens() {
    let _this = this;

    return new Promise((resolve, reject) => {

      let accessTokens = deepClone(_this._accessTokens);

      _this._storageManager.set('accessTokens', 0, accessTokens).then(() => {
        resolve();
      }).catch(err => {
        reject('On _sendReporterSessionKey from method storeIdentity error: ' + err);
      });

    });
  }

}

// move to Identity service framework?

class IdAssertion {

  constructor(assertion, idp, userProfile) {
    let _this = this;

    _this._assertion = assertion;
    _this._idp = idp;
    _this._userProfile = userProfile;
  }

  get assertion() {
    return this._assertion;
  }

  get idp() {
    return this._idp;
  }

  get userProfile() {
    return this._userProfile;
  }

}

class IdValidation {

  constructor(identity, contents) {
    let _this = this;
    _this.identity = identity;
    _this.contents = contents;
  }

  validates(identity, contents) {
    //TODO implement the logic

  }
}

export default Identities;
