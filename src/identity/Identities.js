import { decode, secondsSinceEpoch } from '../utils/utils.js';


/**
* The Identity Data Model is used to model the reTHINK User entity. The Identity data model is handled by Identity Management functionality.
*
*/
class Identities {

  constructor(type, storageManager) {
    let _this = this;

    _this._storageManager = storageManager;
    _this._guid = undefined;
    _this._type = type;
    _this._identities = {};

  }

  get identities() {
    return this._identities;
  }

  set defaultIdentity(identity) {
    if (this.identities[identity.identifier[0]]) this._defaultIdentity = identity.identifier[0];
    else throw new Error('[Identities.set defaultIdentity ] Error: identity does not exist here: ', identity);
  }

  set currentIdentity(identity) {
    if (this.identities[identity.identifier[0]]) this._currentIdentity = identity.identifier[0];
    else throw '[Identities.set currentIdentity ] Error: identity does not exist here: ', identity;
  }

  get defaultIdentity() {
    return this.identities[this._defaultIdentity];
  }
  
  get currentIdentity() {
    return this.identities[this._currentIdentity];
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

          identities.forEach((identity) => {
            let timeNow = secondsSinceEpoch();
            let expires = identity.assertion.expires;

            if (!identity.hasOwnProperty('interworking') && !identity.interworking) {
              _this.defaultIdentity = identity;

              if (parseInt(expires) > timeNow) {
                _this.defaultIdentity.expires = parseInt(expires);
                _this.currentIdentity = _this.defaultIdentity;               }
            }

          });
        }
        resolve();
      });
    });
  }
  
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

  updateAssertion(assertion) {
    let _this = this;

    return new Promise( (resolve) => {
      let userUrl = assertion.userProfile.userUrl;

      if (!_this.identities[userUrl]) return reject('[Identities.updateAssertion] Identity not found for ', userUrl);
      else {
        _this.identities[userUrl].assertion.assertion = assertion;
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
    log.log('[Identities._storeIdentity:identity]', identity);
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
