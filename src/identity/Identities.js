// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import { decode, secondsSinceEpoch } from '../utils/utils.js';


/**
* The Identity Data Model is used to model the reTHINK User entity. The Identity data model is handled by Identity Management functionality.
*
*/
class Identities {

  constructor(type, storageManager) {
    let _this = this;

    _this._storageManager = storageManager;
    _this._guid;
    _this._type = type;
    _this._identities = {};

  }

  get identities() {
    return this._identities;
  }

  set guid(guid) {
    this._guid = guid;
  }

  get guid() {
    return this._guid;
  }

  set defaultIdentity(identifier) {
    if (this.identities[identifier]) this._defaultIdentity = identifier;
    else throw new Error('[Identities.set defaultIdentity ] Error: identity does not exist here: ', identity);
  }

  set currentIdentity(identifier) {
    if (this.identities[identifier]) this._currentIdentity = identifier;
    else throw '[Identities.set currentIdentity ] Error: identity does not exist here: ', identifier;
  }

  get defaultIdentity() {
    if (this._defaultIdentity) return this.identities[this._defaultIdentity];
    else return false;
  }
  
  get currentIdentity() {
    return this.identities[this._currentIdentity];
  }

  get identifiers() {
    return Object.keys(this._identities);
  }

  getIdentity(identifier) {
    return this._identities[identifier];
  }

  loadIdentities() {
    let _this = this;
    return new Promise((resolve) => {

      _this._storageManager.get('idModule:identities').then((identities) => {

        if (identities) {
          _this._identities = identities;

          // let's set as default identity the one that expires later

          _this.identifiers.forEach((id) => {
            let timeNow = secondsSinceEpoch();
            let identity = _this._identities[id];
            let expires = identity.assertion.expires;

            if (!identity.hasOwnProperty('interworking') 
            || !identity.interworking) {
              _this.defaultIdentity = id;

              if (parseInt(expires) > timeNow) {
                _this.defaultIdentity.assertion.expires = parseInt(expires);
                _this.currentIdentity = id;               
              }
            }

          });
        }
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
        this._storeIdentity(identity).then(()=> {
          this._identities[id].status = 'created';
          resolve();
        });
      } else reject('[Identities.addIdentity] invalid IdAssertion');
    });

  }

  addAssertion(assertion) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (_this._isValid(assertion)) {

        let userUrl = assertion.userProfile.userURL;

        if (!_this.identities[userUrl]) _this._identities[userUrl] = { assertion: assertion };
        else _this.identities[userUrl].assertion = assertion;

          _this._store().then(()=> {
            this._identities[userUrl].status = 'created';
            resolve(assertion);
          });
      } else reject('[Identities.addIdentity] invalid IdAssertion');
    });

  }
  
  updateAssertion(assertion) {
    let _this = this;

    return new Promise( (resolve) => {
      let userUrl = assertion.userProfile.userUrl;

      if (!_this.identities[userUrl]) return reject('[Identities.updateAssertion] Identity not found for ', userUrl);
      else {
        _this.identities[userUrl].assertion = assertion;
        _this._store().then(()=> {
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

  //TODO: add function to only set one new identity using the new indexed storage manager

  _store() {
    let _this = this;

    return new Promise((resolve, reject) => {


      _this._storageManager.set('idModule:identities', 0, _this._identities).then(() => {
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
