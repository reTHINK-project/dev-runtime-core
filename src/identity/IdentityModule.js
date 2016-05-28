
import {divideURL, getUserURLFromEmail} from '../utils/utils.js';
import Identity from './Identity';

/**
*
* The Identity Module (Id Module) is the component responsible for handling the
* user identity and the association of this identity with the Hyperty instances,
* in order to make Hyperty instances identifiable. The identity in the reTHINK project
* is not fixed to a unique Identity Service Provider, but obtained through several
* different Identity sources. With this approach, the Id Module provides to the user the
* option to choose the preferred method for authentication.
* This module will thus able to support multiple Identity acquisition methods,
* such as OpenID connect 1.0, Kerberos System, or authentication through smart cards.
* For example, a user with a Google account can use the Google as an Identity Provider to provide Identity Tokens,
*  which can be used by the Identity Module to associate it with a Hyperty instance.
*
* The Identity Module uses a node package, the HelloJS, which is a client-side JavaScript API for authentication
* that facilitates the requests for the OpenID connect protocol. This method allows for some abstraction
* when making requests for different Identity Providers, such as OpenID connect used by Google, Facebook, Microsoft, for example.
*
* When a request for a user identity is made using the method loginWithRP(identifier, scope),
* this method will analyse the Identity Provider chosen to obtain an identity and will use the HelloJS node package
* with the selected Identity Provider and identity scope. After the HelloJS request for an Access Token
* to the Identity Providers, the user will be prompted to authenticate towards the Identity Provider.
* Upon receiving the Access Token, this token is validated with a RESTful web service request to an endpoint
* on the Identity Provider Authorization Server, and after the validation is done,
* an ID token is obtained with the information according to the scope required.
* This ID token is then preserved in this module that can obtained through the getIdentities()
* and is passed as return value of the loginWithRP function. The methods generateAssertion and validateAssertion have not yet been developed.
*
*/
class IdentityModule {

  /**
  * This is the constructor to initialise the Identity Module it does not require any input.
  */
  constructor(runtimeURL) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');

    _this._runtimeURL = runtimeURL;
    _this._idmURL = runtimeURL + '/idm';

    _this._domain = divideURL(_this._runtimeURL).domain;

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
    let newIdentity = new Identity('guid','HUMAN');
    _this.identity = newIdentity;
  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;

  }

  /**
  * Function to return all the identities registered within a session by a user.
  * These identities are returned in an array containing a JSON package for each user identity.
  * @return {Array<Identities>}         Identities
  */
  getIdentities() {
    let _this = this;
    return _this.identities;
  }

  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
  }

  /**
  * Function to set the current Identity with a given Identity
  * @param {Identity}        identity         identity
  */
  setCurrentIdentity(identity) {
    let _this = this;
    _this.currentIdentity = identity;
  }

  /**
  * Function to remove the an identity from the Identities array
  * @param {String}    userURL      userURL
  */
  deleteIdentity(userURL) {
    let _this = this;

    for (let identity in _this.identities) {
      if (_this.identities[identity].identity === userURL) {
        _this.identities.splice(identity, 1);
      }
    }
  }

  /**
  * Function that resolve and create the domainURL in case it is provided one. If not, resolve the default domainURL
  * @param {String}     idpDomain     idpDomain (Optional)
  */
  _resolveDomain(idpDomain) {
    if (!idpDomain) {
      return 'domain-idp://google.com';
    } else {
      return 'domain-idp://' + idpDomain;
    }
  }

  /**
  * Function to login a user within the session, it will start the process to obtain an Identity from a user, including the request for an identity Assertion. The function returns a promise with the token received by the idpProxy.
  *
  * @param  {Identifier}      identifier      identifier
  * @param  {Scope}           scope           scope
  * @return {Promise}         Promise         IDToken containing the user information
  */
  loginWithRP(identifier, scope) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //TODO remove this verification and refactor this part
      _this.currentIdentity = undefined;
      _this.getIdentityAssertion('identifier', 'origin', 'hint', identifier).then(function(value) {
        console.log('loginWithRP');
        resolve(value);
      }, function(err) {
        console.log('loginWithRP err');
        reject(err);
      });
    });
  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identifier, origin, usernameHint, idpDomain) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      if (_this.currentIdentity !== undefined) {
        //TODO verify whether the token is still valid or not.
        // should be needed to make further requests, to obtain a valid token
        return resolve(_this.currentIdentity);
      } else {

        //CHECK whether is browser environment or nodejs
        //if it is browser, then create a fake identity
        if (!window) {
          let randomNumber = Math.floor((Math.random() * 10000) + 1);
          let identityBundle = {assertion: 'assertion', email: 'nodejs-' + randomNumber + '@nodejs.com', identity: 'user://nodejs-' + randomNumber, idp:'nodejs', infoToken: {
            email:'nodejs-' + randomNumber + '@nodejs.com'
          }};
          _this.currentIdentity = identityBundle;
          _this.identities.push(identityBundle);
          return resolve(identityBundle);
        } else {

          _this.generateAssertion('', origin, usernameHint, idpDomain).then(function(url) {
            _this.generateAssertion(url, origin, usernameHint, idpDomain).then(function(value) {
              if (value) {
                resolve(value);
              } else {
                reject('Error on obtaining Identity');
              }
            }, function(err) {
              reject(err);
            });
          }, function(error) {
            reject(error);
          });

        }
      }

    });
  }

  /**
  * Requests the IdpProxy from a given Domain for an identityAssertion
  *
  * @param  {DOMString} contents     contents
  * @param  {DOMString} origin       origin
  * @param  {DOMString} usernameHint usernameHint
  * @return {IdAssertion}              IdAssertion
  */
  generateAssertion(contents, origin, usernameHint, idpDomain) {
    let _this = this;
    let domain = _this._resolveDomain(idpDomain);
    let message;

    return new Promise(function(resolve,reject) {

      message = {type:'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'generateAssertion', params: {contents: contents, origin: origin, usernameHint: usernameHint}}};

      _this._messageBus.postMessage(message, (res) => {
        let result = res.body.value;

        if (result.loginUrl) {

          //let msgOpenIframe = {type: 'execute', from: _this._idmURL, to: _this._runtimeURL + '/gui-manager', body: {method: 'unhideAdminPage'}};

          let win = window.open(result.loginUrl, 'openIDrequest', 'width=800, height=600');
          let pollTimer = setInterval(function() {
            try {

              if (win.closed) {
                resolve(undefined);
                clearInterval(pollTimer);
              }

              if (win.document.URL.indexOf('id_token') !== -1 || win.document.URL.indexOf(location.origin) !== -1) {
                window.clearInterval(pollTimer);
                let url =   win.document.URL;

                win.close();
                resolve(url);
              }
            } catch (e) {
              //console.log(e);
            }
          }, 500);

        } else if (result) {

          let assertionParsed = JSON.parse(atob(result.assertion));
          let idToken;

          //TODO remove the verification and remove the tokenIDJSON from the google idpProxy;
          if (assertionParsed.tokenIDJSON) {
            idToken = assertionParsed.tokenIDJSON;
          } else {
            idToken = assertionParsed;
          }

          if (idToken) {
            result.identity = getUserURLFromEmail(idToken.email);

            _this.identity.addIdentity(result);

            // check if exists any infoToken in the result received
            let infoToken = (result.infoToken) ? result.infoToken : {};
            let userProfileBundle = {username: idToken.email, cn: idToken.name, avatar: infoToken.picture, locale: infoToken.locale, userURL: getUserURLFromEmail(idToken.email)};

            //creation of a new JSON with the identity to send via messages
            let newIdentity = {userProfile: userProfileBundle, idp: result.idp.domain, assertion: result.assertion, email: idToken.email, identity: result.identity, idToken: idToken, infoToken: infoToken};
            result.messageInfo = newIdentity;

            _this.currentIdentity = newIdentity;
            _this.identities.push(result);
            resolve(newIdentity);

          }
        } else {
          reject('error on obtaining identity information');
        }

      });
    });
  }

  /**
  * OTHER USER'S IDENTITY
  */

  /**
  * Requests the IdpProxy from a given Domain to validate an IdentityAssertion
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @param  {DOMString} origin       origin
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion, origin, idpDomain) {
    let _this = this;

    let domain = _this._resolveDomain(idpDomain);

    let message = {type:'EXECUTE', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'validateAssertion',
           params: {assertion: assertion, origin: origin}}};

    return new Promise(function(resolve, reject) {
      _this._messageBus.postMessage(message, (result) => {
        if (result.body.code === 200) {
          resolve(result.body.value);
        } else {
          reject('error', result.body.code);
        }
      });
    });
  }

  /**
  * Function that encrypts the messages to send and decrypts and validate the messages received.
  * In case there is no session key established between the two users from the message, this function will start the communication with the other user acquire a session key.
  **/
  validateMessage(message) {
    console.log(message);
  }

}

export default IdentityModule;
