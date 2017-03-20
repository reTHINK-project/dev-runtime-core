
import {divideURL, getUserURLFromEmail, getUserEmailFromURL, isDataObjectURL, convertToUserURL, getUserIdentityDomain, isLegacy} from '../utils/utils.js';
import Identity from './Identity';
import Crypto from './Crypto';
import GuiFake from './GuiFake';

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
  constructor(runtimeURL, runtimeCapabilities, storageManager) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing');

    _this._runtimeURL = runtimeURL;
    _this.storageManager = storageManager;
    _this._idmURL = _this._runtimeURL + '/idm';
    _this._guiURL = _this._runtimeURL + '/identity-gui';
    _this.runtimeCapabilities = runtimeCapabilities;

    _this._domain = divideURL(_this._runtimeURL).domain;

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
    _this.emailsList = [];
    let newIdentity = new Identity('guid', 'HUMAN');
    _this.identity = newIdentity;
    _this.crypto = new Crypto(_this.runtimeFactory);

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {};

    // hashTable to store all the crypto information between two hyperties
    _this.chatKeys = {};

    // hashTable to store the symmetric keys to be used in the chat group
    _this.dataObjectSessionKeys = {};

    //failsafe to enable/disable all the criptographic functions
    _this.isToUseEncryption = true;

    // variable to know if the GUI is deployed to choose the identity. if the real GUI is not deployed, a fake gui is deployed instead.
    _this.guiDeployed = false;

    // verification of nodeJS, and in case it is nodeJS then disable encryption
    // TODO improve later, this exists because the crypto lib uses browser cryptographic methods
    //_this.isToUseEncryption = (window) ? true : false;

    _this._loadIdentities();

    _this.count = 0;

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
  * return the registry in this idModule
  * @param {registry}           registry
  */
  get registry() {
    let _this = this;
    return _this._registry;
  }

  /**
  * Set the registry in this idModule
  * @param {registry}     reg
  */
  set registry(registry) {
    let _this = this;
    _this._registry = registry;
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
  * gets all the information from a given userURL
  * @param  {String}  userURL     user url
  * @return {JSON}    identity    identity bundle from the userURL
  */
  getIdentity(userURL) {
    let _this = this;

    for (let index in _this.identities) {

      let identity = _this.identities[index];
      if (identity.identity === userURL) {
        return identity;
      }
    }

    throw 'identity not found';
  }


  _loadIdentities() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('idModule:identities').then((identities) => {

        if (identities) {
          _this.identities = identities;
        }
        resolve();
      });
    });
  }

  deployGUI() {
    let _this = this;
    _this.guiDeployed = true;

    console.log('GUI deployed');
  }


  /**
  * get a Token to be added to a message
  * @param  {String}  fromURL     origin of the message
  * @param  {String}  toURL     target of the message
  * @return {JSON}    token    token to be added to the message
  */

  getToken(fromURL, toUrl) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      console.log('[Identity.IdentityModule.getToken] from->', fromURL, '  to->', toUrl);
      if (toUrl) {
//        console.log('toUrl', toUrl);
        _this.registry.isLegacy(toUrl).then(function(result) {
          console.log('[Identity.IdentityModule.getToken] isLEGACY: ', result);
          if (result) {

            let token = _this.getAccessToken(toUrl);
            if (token)              { return resolve(token); }

            console.log('[Identity.IdentityModule.getToken] NO Identity.. Login now');
            let domain = getUserIdentityDomain(toUrl);
            console.log('[Identity.IdentityModule.getToken] domain->', domain);
            _this.callGenerateMethods(domain).then((value) => {
              console.log('[Identity.IdentityModule.getToken] CallGeneratemethods', value);
              let token = _this.getAccessToken(toUrl);
              if (token)                { return resolve(token); }              else {
                return reject('No Access token found');
              }
            }, (err) => {
              console.error('[Identity.IdentityModule.getToken] error CallGeneratemethods');
              return reject(err);
            });
          } else {

            _this.getIdToken(fromURL).then(function(identity) {
              console.log('[Identity.IdentityModule.getToken] getIdToken', identity);
              return resolve(identity);
            }).catch(function(error) {
              //console.error('[Identity.IdentityModule.getToken] error on getToken', error);
              console.log('TIAGO: Invalid id token');
              /*let domain = getUserIdentityDomain(fromURL);
              console.log('[Identity.IdentityModule.getToken] domain->', domain);
              _this.callGenerateMethods(domain).then((value) => {
                _this.getIdToken(fromURL).then(function(identity) {
                  console.log('[Identity.IdentityModule.getToken] from getIdToken', identity);
                  return resolve(identity);
                });
              });*/
              return reject(error);
            });
          }
        });
      } else {
        _this.getIdToken(fromURL).then(function(identity) {
          console.log('[Identity.IdentityModule.getToken] from getIdToken', identity);
          return resolve(identity);
        }).catch(function(error) {
          console.log('TIAGO: Invalid id token');
          /*let domain = getUserIdentityDomain(fromURL);
          console.log('[Identity.IdentityModule.getToken] domain->', domain);
          _this.callGenerateMethods(domain).then((value) => {
            _this.getIdToken(fromURL).then(function(identity) {
              console.log('[Identity.IdentityModule.getToken] from getIdToken', identity);
              return resolve(identity);
            });
          });*/
          return reject(error);
        });
      }
    });
  }

  /**
   * Check to see if an identity did not expire
   * @param  {JSON}     identity
   * @return {Boolean}  true if valid, false otherwise
   */
  isValidIdentity(identity) {
    let _this = this;
    console.log('TIAGO: validate identity');
    /*if (_this.count === 0) {
      _this.count++;
      return false;
    } else {
      return true;
    }*/
    return true;
  }

  /**
  * get an Id Token for a HypertyURL
  * @param  {String}  hypertyURL     the Hyperty address
  * @return {JSON}    token    Id token to be added to the message
  */
  getIdToken(hypertyURL) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      let splitURL = hypertyURL.split('://');
      if (splitURL[0] !== 'hyperty') {

        _this._getHypertyFromDataObject(hypertyURL).then((returnedHypertyURL) => {
          let userURL = _this.registry.getHypertyOwner(returnedHypertyURL);

          console.log('TIAGO option 1');

          if (userURL) {

            for (let index in _this.identities) {
              let identity = _this.identities[index];
              if (identity.identity === userURL) {
                if (_this.isValidIdentity(identity)) {
                  return resolve(identity.messageInfo);
                } else {
                  reject('identity expired!');
                }
              }
            }
          } else {
            return reject('no identity was found ');
          }
        }).catch((reason) => {
          console.error('no identity was found: ', reason);
          reject(reason);
        });
      } else {
        console.log('TIAGO option 2');
        let userURL = _this.registry.getHypertyOwner(hypertyURL);
        if (userURL) {

          for (let index in _this.identities) {
            let identity = _this.identities[index];
            if (identity.identity === userURL) {
              // TODO check this getIdToken when we run on nodejs environment;
              if (_this.isValidIdentity(identity)) {
                if (identity.hasOwnProperty('messageInfo')) {
                  return resolve(identity.messageInfo);
                } else {
                  return resolve(identity);
                }
              } else {
                reject('identity expired!');
              }
            }
          }
        } else {
          return reject('no identity was found.');
        }
      }
    });
  }

  /**
  * get an Access Token for a legacyURL
  * @param  {String}  legacyURL     the legacy address
  * @return {JSON}    token    Access token to be added to the message
  */

  getAccessToken(url) {
    let _this = this;

  /*  let urlSplit = url.split('.');
    let length = urlSplit.length;*/

    let domainToCheck = divideURL(url).domain;

    if (url.includes('protostub')) {
      domainToCheck = domainToCheck.replace(domainToCheck.split('.')[0] + '.', '');
    }

    let identityToReturn;
    for (let index in _this.identities) {
      let identity = _this.identities[index];
      if (identity.hasOwnProperty('interworking') && identity.interworking.domain === domainToCheck) {
        if (identity.hasOwnProperty('messageInfo') && identity.messageInfo.hasOwnProperty('userProfile') && identity.messageInfo.userProfile) {
          identityToReturn = { userProfile: identity.messageInfo.userProfile, access_token: identity.interworking.access_token };
          if (identity.hasOwnProperty('infoToken') && identity.infoToken.hasOwnProperty('id')) {
            identityToReturn.userProfile.id = identity.infoToken.id;
          }
        }
        return identityToReturn;
      }
    }

    return null;
  }

  getIdentitiesToChoose() {
    let _this = this;
    let identities = _this.emailsList;
    let idps = [{domain: 'google.com', type: 'idToken'}, {domain: 'microsoft.com', type: 'idToken'}, {domain: 'orange.fr', type: 'idToken'}, {domain: 'slack.com', type: 'Legacy'}];

    return {identities: identities, idps: idps};
  }

  /**
  * Function to return all the users URLs registered within a session
  * These users URLs are returned in an array of strings.
  * @param  {Boolean}  emailFormat (Optional)   boolean to indicate to return in email format
  * @return {Array<String>}         users
  */
  getUsersIDs(emailFormat) {
    let _this = this;
    let users = [];

    //if request comes with the emailFormat option, then convert url to email format
    let converter = (emailFormat) ? getUserEmailFromURL : (value) => { return value; };

    for (let index in _this.identities) {
      let identity = _this.identities[index];
      users.push(converter(identity.identity));
    }
    return users;
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
  * Function to remove an identity from the Identities array
  * @param {String}    userID      userID
  */
  deleteIdentity(userID) {
    let _this = this;

    let userURL = convertToUserURL(userID);

    for (let identity in _this.identities) {
      if (_this.identities[identity].identity === userURL) {
        _this.identities.splice(identity, 1);
      }
    }
  }

  /**
  * Function to unregister an identity from the emailsList array and not show in to the GUI
  * @param {String}    email      email
  */
  unregisterIdentity(email) {
    let _this = this;

    for (let e in _this.emailsList) {
      if (_this.emailsList[e] === email) {
        _this.emailsList.splice(e, 1);
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
  * Function to login a user within the session, it will start the process to obtain an Identity from a user,
  * including the request for an identity Assertion.
  * The function returns a promise with the token received by the idpProxy.
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
  * Function that sends a request to the GUI using messages. Sends all identities registered and
  * the Idps supported, and return the identity/idp received by the GUI
  * @param {Array<identity>}  identities      list of identitiies
  * @param {Array<String>}    idps            list of idps to authenticate
  * @return {Promise}         returns a chosen identity or idp
  */
  requestIdentityToGUI(identities, idps) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //condition to check if the real GUI is deployed. If not, deploys a fake gui
      if (_this.guiDeployed === false) {

        let guiFake = new GuiFake(_this._guiURL, _this._messageBus);
        _this.guiFake = guiFake;
        _this.guiDeployed = true;
      }

      let message = {type: 'create', to: _this._guiURL, from: _this._idmURL,
        body: {value: {identities: identities, idps: idps}}};

      let id = _this._messageBus.postMessage(message);

      //add listener without timout
      _this._messageBus.addResponseListener(_this._idmURL, id, msg => {
        _this._messageBus.removeResponseListener(_this._idmURL, id);

        // todo: to return the user URL and not the email or identifier

        if (msg.body.code === 200) {
          let selectedIdentity = msg.body;

          console.log('selectedIdentity: ', selectedIdentity.value);
          resolve(selectedIdentity);
        } else {
          reject('error on requesting an identity to the GUI');
        }
      });
    });
  }

  openPopup(urlreceived) {

    return new Promise((resolve, reject) => {

      let win = window.open(urlreceived, 'openIDrequest', 'width=800, height=600');
      if (window.cordova) {
        win.addEventListener('loadstart', function(e) {
          let url = e.url;
          let code = /\&code=(.+)$/.exec(url);
          let error = /\&error=(.+)$/.exec(url);

          if (code || error) {
            win.close();
            resolve(url);
          }
        });
      } else {
        let pollTimer = setInterval(function() {
          try {
            if (win.closed) {
              reject('Some error occured when trying to get identity.');
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
      }
    });
  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identifier, origin, usernameHint, idpDomain) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //CHECK whether is browser environment or nodejs
      //if it is browser, then create a fake identity

      _this.runtimeCapabilities.isAvailable('browser').then((result) => {
        console.log('runtime browser identity acquisition ', result);

        if (!result) return;

        let identitiesInfo = _this.getIdentitiesToChoose();

        _this.requestIdentityToGUI(identitiesInfo.identities, identitiesInfo.idps).then(value => {

          if (value.type === 'identity') {

          //  let chosenID = getUserURLFromEmail(value.value);
          // hack while the user url is not returned from requestIdentityToGUI;

            let chosenID = 'user://' + _this.currentIdentity.idp + '/' + value.value;

            // returns the identity info from the chosen id
            for (let i in _this.identities) {
              if (_this.identities[i].identity === chosenID) {
                return resolve(_this.identities[i].messageInfo);
              }
            }
            reject('no identity was found .');
          } else if (value.type === 'idp') {

            _this.callGenerateMethods(value.value, origin).then((value) => {
              resolve(value);
            }, (err) => {
              reject(err);
            });

          } else {
            reject('error on GUI received message.');
          }
        });
      }).catch(error => {
        console.log('Error on identity acquisition ', error);
        reject(error);
      });

      _this.runtimeCapabilities.isAvailable('node').then((result) => {
        console.log('node identity acquisition ', result);

        if (!result) return;

        if (_this.currentIdentity !== undefined) {
          //TODO verify whether the token is still valid or not.
          // should be needed to make further requests, to obtain a valid token
          return resolve(_this.currentIdentity);
        } else {
          console.log('getIdentityAssertion for nodejs');

          let idp = {type: "idp", value: "google.com", code: 200, auth: false};
          _this.callNodeJsGenerateMethods(idp.value, origin).then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });

          //let assertion = JSON.parse('{"assertion":"eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqa3lObVEyTUdOa01EVTFPVEV4WmpjMVpqTXlOR0ZrWkdVeE56QTRaRGt6TW1ZNU5UazFZV1lpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKcFlYUWlPakUwT0RjMk1EazVOVEVzSW1WNGNDSTZNVFE0TnpZeE16VTFNU3dpWVhSZmFHRnphQ0k2SWtacmJWUmZWM0ZCV1ZWbE1rTjVkV2hsTms4dFdYY2lMQ0poZFdRaU9pSTRNRGd6TWprMU5qWXdNVEl0ZEhGeU9IRnZhREV4TVRrME1tZGtNbXRuTURBM2REQnpPR1l5TnpkeWIya3VZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0p6ZFdJaU9pSXhNVEU1TXpReU16TTJNekkxTWpBd056YzNORE1pTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lZWHB3SWpvaU9EQTRNekk1TlRZMk1ERXlMWFJ4Y2poeGIyZ3hNVEU1TkRKblpESnJaekF3TjNRd2N6aG1NamMzY205cExtRndjSE11WjI5dloyeGxkWE5sY21OdmJuUmxiblF1WTI5dElpd2libTl1WTJVaU9pSk9SR2R6VFZSTmQweEVSWE5OZWxGelRrUm5jMDFVVFhOT2FYYzFURVJSZVV4RVJYcE9RM2N6VFdsM2VFMTZVWE5OYWxFelRFUkZla3hFUlhOTlUzZDRURVJWYzAxRGQzcE1SRVY2VFVOM2VFeEVSVEZNUkVGelRrUm5jMDFVVFhkTVJFVnpUVlJCYzAxcGQzaE5la0Z6VFZOM2VFeEVRWE5OVkd0NFRFUkZlazE1ZDNsTmVsbHpUMFJKYzA5VVFYTk5WR015VEVSRmVVNURkM2xPUkUxelRXcFZkMHhFVVROTVJFVXlUbE4zTTA1VGQzcE5RM2Q0VDFSWmMwMXFVVE5NUkVWNFRtbDNlRTlVUVhOTlZGRXdURVJGTVV4RVJYaFBRM2Q1VFZSQmMwMXFUWHBNUkZsM1RFUkplVTlEZDNsTmFrVnpUbnBSYzA5RVJYTk9VM2Q0VFdwVmMwMVVhM05PUkdkelRsUnJjMDFVWXpCTVJFMDFURVJGTVU1RGQzaE5ha1Z6VG5wQmMwMVVTVE5NUkVVd1RVTjNOVTE1ZDNsTmFtZHpUVlJWZWt4RVJUVk9VM2Q0VFVScmMwMVVhek5NUkVrd1RWTjNlVTVFYTNOTmFrVnpUVlJuTTB4RVJUUk5RM2Q1VFZSamMwMVVZekJNUkVsNlRYbDNkMHhFVVRSTVJFVXdUbE4zZVUxVVZYTk5ha2wzVEVSSk1VMXBkM2hOVkZGelRWUm5jMDFVVlhsTVJHTjVURVJGYzAxVVp6Vk1SR3Q0VEVSVmMwMVVXVFZNUkZVeFRFUmpORXhFU1hsT1UzYzFUbmwzZVUxVVJYTk9WR2R6VFZSWmMwMVVRWE5OVkVrMVRFUkpjMDFxUVRSTVJFVTFUa04zTlU1VGQzaE5WR3R6VG1wSmMwMXFSWE5PYW1OelRWUk5jMDFxVVhOTmFrVjZURVJuTVV4RVNUQk5lWGN6VFhsM2VFOVVaM05OVkZselRsUnJjMDFVYXpGTVJHTTBURVJKTVUxRGR6SlBVM2Q1VFdwWmMwMVVSWGhNUkd0NlRFUmpjMDFVVFhoTVJFVTBUVU4zTUU1NWQzaFBSRkZ6VGtOM2VFMURkekJNUkVVMVRYbDNlVTFxVlhOTlZHTjNURVJKZVV4RVNYZE5hWGQ0VDBSQmMwMVVSVEpNUkVVMFQxTjNlVTVEZHpWT2FYZDVUVVJGYzA1RVVYTk5hazEzVEVSRmVrOURkekJOUTNkNFRWUkJjMDFVWjNoTVJFVTBUWGwzZVUxRVRYTk5WRTE2VEVSWmMwMVVZM2hNUkVsNVRWTjNlRTU2U1hOTlZHc3dURVJGTUUxRGR6Vk5RM2Q0VGxSQmMwNVVSWE5OYW10elRsUnJjMDVVU1hOTmFrMDBURVJuTVV4RVJUTk5RM2Q1VGxSSmMwMVVhelZNUkVsNVQxTjNlRTU2U1hOTlZFMTVURVJGTlU1cGQzbE5hbGx6VFZSVmVFeEVRWE5OVkUwelRFUkZNVTFEZDNkTVJFVXpURVJGTTB4RVRYZE1SRTB3VEVSRmQwNXBkM3BPUTNkNFRYcEJjMDFxVlhOTmFsRXdURVJuTWt4RVJUTlBRM2Q0VG1sM2VFNUVaM05PUkdOelRXcHJjMDFxU1hsTVJFbDVUbWwzZUUxNlozTk5WRWt6VEVSTk5VeEVSVFJOVTNjeVRFUkZkMDE1ZDNoTVJFVjNUME4zZUU5VVozTk9SR3R6VFZSQk1FeEVTWGhOYVhkNVRsUkZjMDFVUlRWTVJFVTFUVk4zZUU5RVJYTk5hbEV6VEVScmVreEVTWGRQUTNkNVRYcFpjMDFVUlRCTVJFVjNUbWwzZVUxNlNYTk5WRVV4VEVSWmMwMTZWWE5OYW1OelRWUkpOVXhFU1RCT2VYZDRUVVJaYzAxVVFYbE1SR2N6VEVSRk0wOURkM2hPZW1kelQwUlZjMDFVV1hkTVJFVTFUbWwzZUUxcVZYTk5WRmwzVEVSSmVFeEVSWHBOUTNkNFRXcEpjMDFVV1hoTVJGazFURVJGTVUxcGQzaE9SRVZ6VFdwSmQweEVTWHBOUTNjMVRYbDNlRTlVVlhOT2FsRnpUVlJOYzAxVVp6Uk1SRWw2VG1sM05VNXBkM2hPZWsxelRXcE5ORXhFUlRST2FYZDVUWHBOYzAxVVRYTk5WRTAxVEVSRk1VMURkM2xPVkUxelRWUnJNa3hFUlhwT2VYZDZUbmwzTlU1NWQzaE5SRWx6VFdwQmMwMTZZM05OVkUxNlRFUkZOVTlUZDNoT1UzY3lUV2wzZVUxRVozTk5WRTAxVEVSRk1VeEVSVFJPYVhkNFRsUlpjMDFEZHpCT1UzZDRUMVJCYzAxVVFUTk1SRWx6VFhsM2VFeEVRWE5OVVQwOUlpd2laVzFoYVd3aU9pSnZjR1Z1YVdSMFpYTjBNVEJBWjIxaGFXd3VZMjl0SW4wLlk0UXlERGs4VFNQVHVGT0NINmdZcld6SHJiTC1YUWFISVhNMWFFXzRIVXN4aXJfbS1pLURIOW9PV0RvSFYwSGp1Mm45cGIwb2lCV2pBc0RlRU5fQzY1cktJb1Z1SkZ1ZnNJVzJmMGkxWUNkUEhpVG5ZeFE0ZTBoYmkxOFBPUUs0bXVXaHJneUZ2Z3JxWU0zVlBTc2h1T0NHRkJpYlBPaHRQOVZSZW5UcWhZajVkcXBxZUtoSWpVWkRWOVhWamptRXNBV1E2cWZ2ZDlBQml0RVVLVmpXeEhycllhOHQ5LTNfT0w0YkR1N1BpSGZRZVJHV0R3cTQyNHAwMHZiYjdFNHBORWxVSVpwYUswaWt4a2xWb2hBekZ1REJ2cWJqMHZGbHBFQk5MNV9mNnl6YzkwRUswdkNGR0hkTzBBYWFJMDdhZVdEdFVnakprSTNzdVRRWmJlZkZYdyIsInRva2VuSURKU09OIjp7ImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE0ODc2MDk5NTEiLCJleHAiOiIxNDg3NjEzNTUxIiwiYXRfaGFzaCI6IkZrbVRfV3FBWVVlMkN5dWhlNk8tWXciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01Ua3hMREV6TXl3eU16WXNPRElzT1RBc01UYzJMREV5TkN3eU5ETXNNalV3TERRM0xERTJOU3czTlN3ek1Dd3hPVFlzTWpRM0xERXhOaXd4T1RBc01UUTBMREUxTERFeE9Dd3lNVEFzTWpNekxEWXdMREl5T0N3eU1qRXNOelFzT0RFc05Td3hNalVzTVRrc05EZ3NOVGtzTVRjMExETTVMREUxTkN3eE1qRXNOekFzTVRJM0xERTBNQ3c1TXl3eU1qZ3NNVFV6TERFNU5Td3hNRGtzTVRrM0xESTBNU3d5TkRrc01qRXNNVGczTERFNE1Dd3lNVGNzTVRjMExESXpNeXd3TERRNExERTBOU3d5TVRVc01qSXdMREkxTWl3eE1UUXNNVGdzTVRVeUxEY3lMREVzTVRnNUxEa3hMRFVzTVRZNUxEVTFMRGM0TERJeU5TdzVOeXd5TVRFc05UZ3NNVFlzTVRBc01USTVMRElzTWpBNExERTVOQ3c1TlN3eE1Ua3NOaklzTWpFc05qY3NNVE1zTWpRc01qRXpMRGcxTERJME15dzNNeXd4T1Rnc01UWXNOVGtzTVRrMUxEYzRMREkxTUN3Mk9Td3lNallzTVRFeExEa3pMRGNzTVRNeExERTRNQ3cwTnl3eE9EUXNOQ3d4TUN3MExERTVNeXd5TWpVc01UY3dMREl5TERJd01pd3hPREFzTVRFMkxERTRPU3d5TkN3NU5pd3lNREVzTkRRc01qTXdMREV6T0N3ME1Dd3hNVEFzTVRneExERTRNeXd5TURNc01UTXpMRFlzTVRjeExESXlNU3d4TnpJc01UazBMREUwTUN3NU1Dd3hOVEFzTlRFc01qa3NOVGtzTlRJc01qTTRMRGcxTERFM01Dd3lOVElzTVRrNUxESXlPU3d4TnpJc01UTXlMREU1Tml3eU1qWXNNVFV4TERBc01UTTNMREUxTUN3d0xERTNMREUzTERNd0xETTBMREV3Tml3ek5Dd3hNekFzTWpVc01qUTBMRGcyTERFM09Dd3hOaXd4TkRnc05EY3NNamtzTWpJeUxESXlOaXd4TXpnc01USTNMRE01TERFNE1TdzJMREV3TXl3eExERXdPQ3d4T1Rnc05Ea3NNVEEwTERJeE1pd3lOVEVzTVRFNUxERTVNU3d4T0RFc01qUTNMRGt6TERJd09Dd3lNellzTVRFMExERXdOaXd5TXpJc01URTFMRFlzTXpVc01qY3NNVEk1TERJME55d3hNRFlzTVRBeUxEZzNMREUzT0N3eE56Z3NPRFVzTVRZd0xERTVOaXd4TWpVc01UWXdMREl4TERFek1Dd3hNaklzTVRZeExEWTVMREUxTWl3eE5ERXNNakl3TERJek1DdzVNeXd4T1RVc05qUXNNVE1zTVRnNExESXpOaXc1Tml3eE56TXNNak00TERFNE5pd3lNek1zTVRNc01UTTVMREUxTUN3eU5UTXNNVGsyTERFek55d3pOeXc1Tnl3eE1ESXNNakFzTXpjc01UTXpMREU1T1N3eE5TdzJNaXd5TURnc01UTTVMREUxTERFNE5pd3hOVFlzTUN3ME5Td3hPVEFzTVRBM0xESXNNeXd4TERBc01RPT0iLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20iLCJhbGciOiJSUzI1NiIsImtpZCI6IjkyNmQ2MGNkMDU1OTExZjc1ZjMyNGFkZGUxNzA4ZDkzMmY5NTk1YWYifX0=","idp":{"domain":"google.com","protocol":"OIDC"},"info":{"accessToken":"ya29.Glv4A2hEt_0MZdBMGVUxEZTyLgdYOmcfTyepHuS4RTMA-QYxSfhnBamaijyvn9GjhsLf5s7mczUNQ0GOM1rrUi3oU4t6R0CHpDxncQQgqrhD22T2CM80KNvuEKi7","idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjkyNmQ2MGNkMDU1OTExZjc1ZjMyNGFkZGUxNzA4ZDkzMmY5NTk1YWYifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0ODc2MDk5NTEsImV4cCI6MTQ4NzYxMzU1MSwiYXRfaGFzaCI6IkZrbVRfV3FBWVVlMkN5dWhlNk8tWXciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGt4TERFek15d3lNellzT0RJc09UQXNNVGMyTERFeU5Dd3lORE1zTWpVd0xEUTNMREUyTlN3M05Td3pNQ3d4T1RZc01qUTNMREV4Tml3eE9UQXNNVFEwTERFMUxERXhPQ3d5TVRBc01qTXpMRFl3TERJeU9Dd3lNakVzTnpRc09ERXNOU3d4TWpVc01Ua3NORGdzTlRrc01UYzBMRE01TERFMU5Dd3hNakVzTnpBc01USTNMREUwTUN3NU15d3lNamdzTVRVekxERTVOU3d4TURrc01UazNMREkwTVN3eU5Ea3NNakVzTVRnM0xERTRNQ3d5TVRjc01UYzBMREl6TXl3d0xEUTRMREUwTlN3eU1UVXNNakl3TERJMU1pd3hNVFFzTVRnc01UVXlMRGN5TERFc01UZzVMRGt4TERVc01UWTVMRFUxTERjNExESXlOU3c1Tnl3eU1URXNOVGdzTVRZc01UQXNNVEk1TERJc01qQTRMREU1TkN3NU5Td3hNVGtzTmpJc01qRXNOamNzTVRNc01qUXNNakV6TERnMUxESTBNeXczTXl3eE9UZ3NNVFlzTlRrc01UazFMRGM0TERJMU1DdzJPU3d5TWpZc01URXhMRGt6TERjc01UTXhMREU0TUN3ME55d3hPRFFzTkN3eE1DdzBMREU1TXl3eU1qVXNNVGN3TERJeUxESXdNaXd4T0RBc01URTJMREU0T1N3eU5DdzVOaXd5TURFc05EUXNNak13TERFek9DdzBNQ3d4TVRBc01UZ3hMREU0TXl3eU1ETXNNVE16TERZc01UY3hMREl5TVN3eE56SXNNVGswTERFME1DdzVNQ3d4TlRBc05URXNNamtzTlRrc05USXNNak00TERnMUxERTNNQ3d5TlRJc01UazVMREl5T1N3eE56SXNNVE15TERFNU5pd3lNallzTVRVeExEQXNNVE0zTERFMU1Dd3dMREUzTERFM0xETXdMRE0wTERFd05pd3pOQ3d4TXpBc01qVXNNalEwTERnMkxERTNPQ3d4Tml3eE5EZ3NORGNzTWprc01qSXlMREl5Tml3eE16Z3NNVEkzTERNNUxERTRNU3cyTERFd015d3hMREV3T0N3eE9UZ3NORGtzTVRBMExESXhNaXd5TlRFc01URTVMREU1TVN3eE9ERXNNalEzTERrekxESXdPQ3d5TXpZc01URTBMREV3Tml3eU16SXNNVEUxTERZc016VXNNamNzTVRJNUxESTBOeXd4TURZc01UQXlMRGczTERFM09Dd3hOemdzT0RVc01UWXdMREU1Tml3eE1qVXNNVFl3TERJeExERXpNQ3d4TWpJc01UWXhMRFk1TERFMU1pd3hOREVzTWpJd0xESXpNQ3c1TXl3eE9UVXNOalFzTVRNc01UZzRMREl6Tml3NU5pd3hOek1zTWpNNExERTROaXd5TXpNc01UTXNNVE01TERFMU1Dd3lOVE1zTVRrMkxERXpOeXd6Tnl3NU55d3hNRElzTWpBc016Y3NNVE16TERFNU9Td3hOU3cyTWl3eU1EZ3NNVE01TERFMUxERTROaXd4TlRZc01DdzBOU3d4T1RBc01UQTNMRElzTXl3eExEQXNNUT09IiwiZW1haWwiOiJvcGVuaWR0ZXN0MTBAZ21haWwuY29tIn0.Y4QyDDk8TSPTuFOCH6gYrWzHrbL-XQaHIXM1aE_4HUsxir_m-i-DH9oOWDoHV0Hju2n9pb0oiBWjAsDeEN_C65rKIoVuJFufsIW2f0i1YCdPHiTnYxQ4e0hbi18POQK4muWhrgyFvgrqYM3VPSshuOCGFBibPOhtP9VRenTqhYj5dqpqeKhIjUZDV9XVjjmEsAWQ6qfvd9ABitEUKVjWxHrrYa8t9-3_OL4bDu7PiHfQeRGWDwq424p00vbb7E4pNElUIZpaK0ikxklVohAzFuDBvqbj0vFlpEBNL5_f6yzc90EK0vCFGHdO0AaaI07aeWDtUgjJkI3suTQZbefFXw","tokenType":"Bearer","infoToken":{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"},"tokenIDJSON":{"iss":"https://accounts.google.com","iat":"1487609951","exp":"1487613551","at_hash":"FkmT_WqAYUe2Cyuhe6O-Yw","aud":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","sub":"111934233632520077743","email_verified":"true","azp":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","nonce":"NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTkxLDEzMywyMzYsODIsOTAsMTc2LDEyNCwyNDMsMjUwLDQ3LDE2NSw3NSwzMCwxOTYsMjQ3LDExNiwxOTAsMTQ0LDE1LDExOCwyMTAsMjMzLDYwLDIyOCwyMjEsNzQsODEsNSwxMjUsMTksNDgsNTksMTc0LDM5LDE1NCwxMjEsNzAsMTI3LDE0MCw5MywyMjgsMTUzLDE5NSwxMDksMTk3LDI0MSwyNDksMjEsMTg3LDE4MCwyMTcsMTc0LDIzMywwLDQ4LDE0NSwyMTUsMjIwLDI1MiwxMTQsMTgsMTUyLDcyLDEsMTg5LDkxLDUsMTY5LDU1LDc4LDIyNSw5NywyMTEsNTgsMTYsMTAsMTI5LDIsMjA4LDE5NCw5NSwxMTksNjIsMjEsNjcsMTMsMjQsMjEzLDg1LDI0Myw3MywxOTgsMTYsNTksMTk1LDc4LDI1MCw2OSwyMjYsMTExLDkzLDcsMTMxLDE4MCw0NywxODQsNCwxMCw0LDE5MywyMjUsMTcwLDIyLDIwMiwxODAsMTE2LDE4OSwyNCw5NiwyMDEsNDQsMjMwLDEzOCw0MCwxMTAsMTgxLDE4MywyMDMsMTMzLDYsMTcxLDIyMSwxNzIsMTk0LDE0MCw5MCwxNTAsNTEsMjksNTksNTIsMjM4LDg1LDE3MCwyNTIsMTk5LDIyOSwxNzIsMTMyLDE5NiwyMjYsMTUxLDAsMTM3LDE1MCwwLDE3LDE3LDMwLDM0LDEwNiwzNCwxMzAsMjUsMjQ0LDg2LDE3OCwxNiwxNDgsNDcsMjksMjIyLDIyNiwxMzgsMTI3LDM5LDE4MSw2LDEwMywxLDEwOCwxOTgsNDksMTA0LDIxMiwyNTEsMTE5LDE5MSwxODEsMjQ3LDkzLDIwOCwyMzYsMTE0LDEwNiwyMzIsMTE1LDYsMzUsMjcsMTI5LDI0NywxMDYsMTAyLDg3LDE3OCwxNzgsODUsMTYwLDE5NiwxMjUsMTYwLDIxLDEzMCwxMjIsMTYxLDY5LDE1MiwxNDEsMjIwLDIzMCw5MywxOTUsNjQsMTMsMTg4LDIzNiw5NiwxNzMsMjM4LDE4NiwyMzMsMTMsMTM5LDE1MCwyNTMsMTk2LDEzNywzNyw5NywxMDIsMjAsMzcsMTMzLDE5OSwxNSw2MiwyMDgsMTM5LDE1LDE4NiwxNTYsMCw0NSwxOTAsMTA3LDIsMywxLDAsMQ==","email":"openidtest10@gmail.com","alg":"RS256","kid":"926d60cd055911f75f324adde1708d932f9595af"},"expires":"1487613551","email":"openidtest10@gmail.com"},"infoToken":{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"}}');
          //return resolve(assertion);
          
          //let assertion = JSON.parse('"eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltWmtZMkZoTmpNeU5EQmxaREk0WldGbE16Z3haREUyTkROa05HTmpPVE0xTm1Sak16azNaV0lpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKcFlYUWlPakUwT0RjMk1UQTNOemdzSW1WNGNDSTZNVFE0TnpZeE5ETTNPQ3dpWVhSZmFHRnphQ0k2SWtzMlQxRTRjMUp0TmpCdU4zUkdXbkZ3YTJkQ1RtY2lMQ0poZFdRaU9pSTRNRGd6TWprMU5qWXdNVEl0ZEhGeU9IRnZhREV4TVRrME1tZGtNbXRuTURBM2REQnpPR1l5TnpkeWIya3VZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0p6ZFdJaU9pSXhNVEU1TXpReU16TTJNekkxTWpBd056YzNORE1pTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lZWHB3SWpvaU9EQTRNekk1TlRZMk1ERXlMWFJ4Y2poeGIyZ3hNVEU1TkRKblpESnJaekF3TjNRd2N6aG1NamMzY205cExtRndjSE11WjI5dloyeGxkWE5sY21OdmJuUmxiblF1WTI5dElpd2libTl1WTJVaU9pSk9SR2R6VFZSTmQweEVSWE5OZWxGelRrUm5jMDFVVFhOT2FYYzFURVJSZVV4RVJYcE9RM2N6VFdsM2VFMTZVWE5OYWxFelRFUkZla3hFUlhOTlUzZDRURVJWYzAxRGQzcE1SRVY2VFVOM2VFeEVSVEZNUkVGelRrUm5jMDFVVFhkTVJFVnpUVlJCYzAxcGQzaE5la0Z6VFZOM2VFeEVRWE5OYWxWNVRFUkpNRXhFUlhwUFEzZDRUVlJGYzAxVVVUVk1SR00xVEVSTk1FeEVTWGxPUTNkNFRsUlJjMDFVVVhkTVJFbHpUV3BKZUV4RVJUVk1SRVUwVFVOM2VFOVVVWE5PZVhkNVRYcEZjMDFVVFRSTVJGRTFURVJGZVU5VGR6Qk5lWGQ0VDFOM2VVMXFSWE5OVkVrelRFUkpNVTFwZDNsUFUzY3lUbE4zTWs1NWQzaFBWRkZ6VFZSQmVFeEVUWGhNUkVWNlRVTjNlVTE2VVhOTlZHdDNURVJKYzAxcVRYbE1SRVV6VDBOM2VFNVVTWE5OYWtFeFRFUnJNRXhFU1hsT1EzZDVUWGwzZVUxNmEzTk5WR2N4VEVSRmVVeEVSWGRPZVhkNFRXbDNlVTFVUVhOT1JFbHpUWHBuYzAxVVl6Uk1SRWw2VFdsM2VVMVVWWE5OVkdkelRXcFZNRXhFU1RCUFUzZDVUWHBOYzAxcVRUSk1SRWt3VFZOM2VFMUVaM05OZWsxelRWUlpla3hFU1RCTlEzY3pUa04zZUU1RVVYTk5WRkZ6VGxSUmMwMVVhelJNUkVVeFRFUlJNRXhFUlRWUFEzYzBUVk4zTkU5VGQzaE9WRmx6VGxSamMwMVVVVEZNUkVrd1RsTjNlRTFFV1hOTlZGVTFURVJGZDA5VGQzaE9VM2Q0VGxSRmMwMVVSVEZNUkdNeVRFUkZkMDFUZDNoTlZHZHpUVlJaTVV4RVJYZFBRM2N5VFhsM2VFOVVXWE5OYWtrelRFUkZNazE1ZDNoUFZFRnpUVlJyZVV4RVJUUk5lWGQ0VFdwUmMwMVVTVEZNUkVVelQwTjNNVTVwZDNwTmFYYzFUbE4zTWs5RGR6Vk5lWGN5VDBOM01VMURkekJPZVhkNVRWUmpjMDE2U1hOTmFtdHpUbFJWYzAxVVFUQk1SRVUxVDBOM05VNURkM2hQVkdkelRWUmpjMDFxVVRCTVJFVjNUbmwzZVUxRVFYTk5WRTB6VEVSTk1FeEVSVFJOUTNkNFQwUnJjMDE1ZDNoUFZHdHpUVU4zZVUxNlFYTk5WRkUwVEVSSmQwMXBkM2hOZW10elRWUk5lRXhFUlRGUFUzZDRUWHBaYzAxVVdUQk1SRkUxVEVSRmVFNVRkM2hOZWtGelQwUkpjMDFxUVRSTVJFVTBUbE4zZVUxNlVYTk5ha1Y0VEVSRmVFNVRkM2xOYWxselRsUkJjMDFVUlhsTVJHZDVURVJKZDA1NWQzbE5WRWx6VG5wQmMwOVVhM05PYWtselRsUnJjMDU2YTNOT1JHdHpUVlJWTUV4RVJURk5lWGQ0VGtSUmMwMXFRWHBNUkVVMFRubDNlVTVFU1hOTlZGVXdURVJKTTB4RWF6Vk1SRVV5VGxOM2VFOVVRWE5OVkUxNlRFUkZNMDVEZDNsTmFrRnpUVlJKTVV4RVdYbE1SRVV4VDBOM2VVNVVSWE5OYWxFMVRFUlJNVXhFUlRGTlUzYzBUV2wzZVUxRWEzTk5WR3MxVEVSWk5VeEVaekpNUkVVMFRtbDNkMHhFUlhkTVJFVjRUbWwzZUUxVVNYTk5WR3Q0VEVSUk1reEVSWGhOUTNkNVRsTjNNRTlUZHpGTmVYY3hUV2wzZVUxRVNYTk5WRWt3VEVSSmVVNURkM2hQVkUxelRWUlpjMDFxVlhoTVJFVTBUbE4zZVUxNlZYTk5hazB5VEVSRk1VOURkM2xOVkd0elRtcFJjMDVVVFhOTlZHZDRURVJGTkU1VGQzaFBSRlZ6VFdwRmVVeEVhekJNUkVWNVRrTjNlRTE2VVhOTmFrMHhURVJGZVUxRGR6Vk9lWGQ0VFVScmMwMVVUWGRNUkVVeFQxTjNlVTVFUlhOTlZGVXhURVJWZVV4RVNYaFBRM2Q1VGtSSmMwMXFSWHBNUkUxelRWUkpkMHhFUlRGT1UzZDVUV3BGYzAxcVNUTk1SRlV6VEVSSk1reEVZek5NUkUxNlRFUm5la3hFU1hkTlUzYzFUWGwzZVUxcVZYTk9WRWx6VDBSVmMwMVVaM2RNUkVWNlRYbDNlRTE2WjNOT2VrbHpUV3BSZVV4RVNYbE5hWGQ1VGtSamMwOVVWWE5OVkdNelRFUkplVTU1ZDNoUFJGRnpUV3BOTlV4RVJYZE9hWGQ0VGtSVmMwMVVXVE5NUkVWNlRYbDNNVTE1ZDNsTVJFMXpUVk4zZDB4RVJUMGlMQ0psYldGcGJDSTZJbTl3Wlc1cFpIUmxjM1F4TUVCbmJXRnBiQzVqYjIwaWZRLlVOclFDeV91ckpFZXI3NS1JcVpucGhUNDhFeGtHMk9qUUxsTFRtY1RGTHlNZTd4X2tuWG5OSWFQTlJiTXFSaVY0ZE1xNjE2bXlXdEpvYlVwSVNiSnFaTC1mM09jb3I1LTc3cjVXRS1WV2U5RDlfNzRWbXRQamV2ZHI3dkpENlZRLTUyWlh4Wm1MeDdTc2dRWkt4UmJxSG44bzdEZ3ZhQ0tvWDlPS3IwWVB0OGRWa1E1VnpjRW50NkRkV1h1UUZrUVJUWUFLSXFvcnBBSm5veXZVR0lJNkFWTmZucmZVVk5oa0pHVzZHZGNKb1BCdkNDbXoxR0d0VWlITERSUDhPcDhnVlNkVkxZSnZxTG9KQjhvX0hxUTJWNlNjd1piQmVDMmpLVWdfWXZfd1d0OVJReXpwQW9lR3UtUlZ0R1B2ckdFYUVBdklFWHk3c1ZMaWNHMHluVXVXdyIsInRva2VuSURKU09OIjp7ImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE0ODc2MTA3NzgiLCJleHAiOiIxNDg3NjE0Mzc4IiwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qVXlMREkwTERFek9Dd3hNVEVzTVRRNUxEYzVMRE0wTERJeU5Dd3hOVFFzTVRRd0xESXNNakl4TERFNUxERTRNQ3d4T1RRc055d3lNekVzTVRNNExEUTVMREV5T1N3ME15d3hPU3d5TWpFc01USTNMREkxTWl3eU9TdzJOU3cyTnl3eE9UUXNNVEF4TERNeExERXpNQ3d5TXpRc01Ua3dMRElzTWpNeUxERTNPQ3d4TlRJc01qQTFMRGswTERJeU5Dd3lNeXd5TXprc01UZzFMREV5TERFd055d3hNaXd5TVRBc05ESXNNemdzTVRjNExESXpNaXd5TVRVc01UZ3NNalUwTERJME9Td3lNek1zTWpNMkxESTBNU3d4TURnc016TXNNVFl6TERJME1DdzNOQ3d4TkRRc01UUXNOVFFzTVRrNExERTFMRFEwTERFNU9DdzRNU3c0T1N3eE5UWXNOVGNzTVRRMUxESTBOU3d4TURZc01UVTVMREV3T1N3eE5Td3hOVEVzTVRFMUxEYzJMREV3TVN3eE1UZ3NNVFkxTERFd09DdzJNeXd4T1RZc01qSTNMREUyTXl3eE9UQXNNVGt5TERFNE15d3hNalFzTVRJMUxERTNPQ3cxTml3ek1pdzVOU3cyT0N3NU15dzJPQ3cxTUN3ME55d3lNVGNzTXpJc01qa3NOVFVzTVRBMExERTVPQ3c1TkN3eE9UZ3NNVGNzTWpRMExERXdOeXd5TURBc01UTTNMRE0wTERFNE1Dd3hPRGtzTXl3eE9Ua3NNQ3d5TXpBc01UUTRMREl3TWl3eE16a3NNVE14TERFMU9Td3hNellzTVRZMExEUTVMREV4TlN3eE16QXNPRElzTWpBNExERTROU3d5TXpRc01qRXhMREV4TlN3eU1qWXNOVEFzTVRFeUxEZ3lMREl3Tnl3eU1USXNOekFzT1Rrc05qSXNOVGtzTnprc05Ea3NNVFUwTERFMU15d3hORFFzTWpBekxERTROeXd5TkRJc01UVTBMREkzTERrNUxERTJOU3d4T1RBc01UTXpMREUzTkN3eU1qQXNNVEkxTERZeUxERTFPQ3d5TlRFc01qUTVMRFExTERFMU1TdzRNaXd5TURrc01UazVMRFk1TERnMkxERTROaXd3TERFd0xERXhOaXd4TVRJc01Ua3hMRFEyTERFeE1Dd3lOU3cwT1N3MU15dzFNaXd5TURJc01USTBMREl5TkN3eE9UTXNNVFlzTWpVeExERTROU3d5TXpVc01qTTJMREUxT0N3eU1Ua3NOalFzTlRNc01UZ3hMREU0TlN3eE9EVXNNakV5TERrMExERXlOQ3d4TXpRc01qTTFMREV5TUN3NU55d3hNRGtzTVRNd0xERTFPU3d5TkRFc01UVTFMRFV5TERJeE9Dd3lORElzTWpFekxETXNNVEl3TERFMU5Td3lNakVzTWpJM0xEVTNMREkyTERjM0xETXpMRGd6TERJd01TdzVNeXd5TWpVc05USXNPRFVzTVRnd0xERXpNeXd4TXpnc056SXNNalF5TERJeU1pd3lORGNzT1RVc01UYzNMREl5Tnl3eE9EUXNNak01TERFd05pd3hORFVzTVRZM0xERXpNeXcxTXl3eUxETXNNU3d3TERFPSIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiZmRjYWE2MzI0MGVkMjhlYWUzODFkMTY0M2Q0Y2M5MzU2ZGMzOTdlYiJ9fQ=="');
          //let idpBundle = JSON.parse('{"domain":"google.com","protocol":"OIDC"}');
          //let identityBundle = JSON.parse('{"accessToken":"ya29.Glv4A1n_HScRBNtT_OEq6o6B_VHbp-1cJqtr-97kTa40ejpqG0fTbAhtrMlajVkYLF33QtcxQATfZwVqaun7LXo-7-4ItL5FCMC3m9VwRJ8SD3SrbMoQ__Kc8V6h","idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0ODc2MTA3NzgsImV4cCI6MTQ4NzYxNDM3OCwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNalV5TERJMExERXpPQ3d4TVRFc01UUTVMRGM1TERNMExESXlOQ3d4TlRRc01UUXdMRElzTWpJeExERTVMREU0TUN3eE9UUXNOeXd5TXpFc01UTTRMRFE1TERFeU9TdzBNeXd4T1N3eU1qRXNNVEkzTERJMU1pd3lPU3cyTlN3Mk55d3hPVFFzTVRBeExETXhMREV6TUN3eU16UXNNVGt3TERJc01qTXlMREUzT0N3eE5USXNNakExTERrMExESXlOQ3d5TXl3eU16a3NNVGcxTERFeUxERXdOeXd4TWl3eU1UQXNORElzTXpnc01UYzRMREl6TWl3eU1UVXNNVGdzTWpVMExESTBPU3d5TXpNc01qTTJMREkwTVN3eE1EZ3NNek1zTVRZekxESTBNQ3czTkN3eE5EUXNNVFFzTlRRc01UazRMREUxTERRMExERTVPQ3c0TVN3NE9Td3hOVFlzTlRjc01UUTFMREkwTlN3eE1EWXNNVFU1TERFd09Td3hOU3d4TlRFc01URTFMRGMyTERFd01Td3hNVGdzTVRZMUxERXdPQ3cyTXl3eE9UWXNNakkzTERFMk15d3hPVEFzTVRreUxERTRNeXd4TWpRc01USTFMREUzT0N3MU5pd3pNaXc1TlN3Mk9DdzVNeXcyT0N3MU1DdzBOeXd5TVRjc016SXNNamtzTlRVc01UQTBMREU1T0N3NU5Dd3hPVGdzTVRjc01qUTBMREV3Tnl3eU1EQXNNVE0zTERNMExERTRNQ3d4T0Rrc015d3hPVGtzTUN3eU16QXNNVFE0TERJd01pd3hNemtzTVRNeExERTFPU3d4TXpZc01UWTBMRFE1TERFeE5Td3hNekFzT0RJc01qQTRMREU0TlN3eU16UXNNakV4TERFeE5Td3lNallzTlRBc01URXlMRGd5TERJd055d3lNVElzTnpBc09Ua3NOaklzTlRrc056a3NORGtzTVRVMExERTFNeXd4TkRRc01qQXpMREU0Tnl3eU5ESXNNVFUwTERJM0xEazVMREUyTlN3eE9UQXNNVE16TERFM05Dd3lNakFzTVRJMUxEWXlMREUxT0N3eU5URXNNalE1TERRMUxERTFNU3c0TWl3eU1Ea3NNVGs1TERZNUxEZzJMREU0Tml3d0xERXdMREV4Tml3eE1USXNNVGt4TERRMkxERXhNQ3d5TlN3ME9TdzFNeXcxTWl3eU1ESXNNVEkwTERJeU5Dd3hPVE1zTVRZc01qVXhMREU0TlN3eU16VXNNak0yTERFMU9Dd3lNVGtzTmpRc05UTXNNVGd4TERFNE5Td3hPRFVzTWpFeUxEazBMREV5TkN3eE16UXNNak0xTERFeU1DdzVOeXd4TURrc01UTXdMREUxT1N3eU5ERXNNVFUxTERVeUxESXhPQ3d5TkRJc01qRXpMRE1zTVRJd0xERTFOU3d5TWpFc01qSTNMRFUzTERJMkxEYzNMRE16TERnekxESXdNU3c1TXl3eU1qVXNOVElzT0RVc01UZ3dMREV6TXl3eE16Z3NOeklzTWpReUxESXlNaXd5TkRjc09UVXNNVGMzTERJeU55d3hPRFFzTWpNNUxERXdOaXd4TkRVc01UWTNMREV6TXl3MU15d3lMRE1zTVN3d0xERT0iLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20ifQ.UNrQCy_urJEer75-IqZnphT48ExkG2OjQLlLTmcTFLyMe7x_knXnNIaPNRbMqRiV4dMq616myWtJobUpISbJqZL-f3Ocor5-77r5WE-VWe9D9_74VmtPjevdr7vJD6VQ-52ZXxZmLx7SsgQZKxRbqHn8o7DgvaCKoX9OKr0YPt8dVkQ5VzcEnt6DdWXuQFkQRTYAKIqorpAJnoyvUGII6AVNfnrfUVNhkJGW6GdcJoPBvCCmz1GGtUiHLDRP8Op8gVSdVLYJvqLoJB8o_HqQ2V6ScwZbBeC2jKUg_Yv_wWt9RQyzpAoeGu-RVtGPvrGEaEAvIEXy7sVLicG0ynUuWw","tokenType":"Bearer","infoToken":{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"},"tokenIDJSON":{"iss":"https://accounts.google.com","iat":"1487610778","exp":"1487614378","at_hash":"K6OQ8sRm60n7tFZqpkgBNg","aud":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","sub":"111934233632520077743","email_verified":"true","azp":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","nonce":"NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMjUyLDI0LDEzOCwxMTEsMTQ5LDc5LDM0LDIyNCwxNTQsMTQwLDIsMjIxLDE5LDE4MCwxOTQsNywyMzEsMTM4LDQ5LDEyOSw0MywxOSwyMjEsMTI3LDI1MiwyOSw2NSw2NywxOTQsMTAxLDMxLDEzMCwyMzQsMTkwLDIsMjMyLDE3OCwxNTIsMjA1LDk0LDIyNCwyMywyMzksMTg1LDEyLDEwNywxMiwyMTAsNDIsMzgsMTc4LDIzMiwyMTUsMTgsMjU0LDI0OSwyMzMsMjM2LDI0MSwxMDgsMzMsMTYzLDI0MCw3NCwxNDQsMTQsNTQsMTk4LDE1LDQ0LDE5OCw4MSw4OSwxNTYsNTcsMTQ1LDI0NSwxMDYsMTU5LDEwOSwxNSwxNTEsMTE1LDc2LDEwMSwxMTgsMTY1LDEwOCw2MywxOTYsMjI3LDE2MywxOTAsMTkyLDE4MywxMjQsMTI1LDE3OCw1NiwzMiw5NSw2OCw5Myw2OCw1MCw0NywyMTcsMzIsMjksNTUsMTA0LDE5OCw5NCwxOTgsMTcsMjQ0LDEwNywyMDAsMTM3LDM0LDE4MCwxODksMywxOTksMCwyMzAsMTQ4LDIwMiwxMzksMTMxLDE1OSwxMzYsMTY0LDQ5LDExNSwxMzAsODIsMjA4LDE4NSwyMzQsMjExLDExNSwyMjYsNTAsMTEyLDgyLDIwNywyMTIsNzAsOTksNjIsNTksNzksNDksMTU0LDE1MywxNDQsMjAzLDE4NywyNDIsMTU0LDI3LDk5LDE2NSwxOTAsMTMzLDE3NCwyMjAsMTI1LDYyLDE1OCwyNTEsMjQ5LDQ1LDE1MSw4MiwyMDksMTk5LDY5LDg2LDE4NiwwLDEwLDExNiwxMTIsMTkxLDQ2LDExMCwyNSw0OSw1Myw1MiwyMDIsMTI0LDIyNCwxOTMsMTYsMjUxLDE4NSwyMzUsMjM2LDE1OCwyMTksNjQsNTMsMTgxLDE4NSwxODUsMjEyLDk0LDEyNCwxMzQsMjM1LDEyMCw5NywxMDksMTMwLDE1OSwyNDEsMTU1LDUyLDIxOCwyNDIsMjEzLDMsMTIwLDE1NSwyMjEsMjI3LDU3LDI2LDc3LDMzLDgzLDIwMSw5MywyMjUsNTIsODUsMTgwLDEzMywxMzgsNzIsMjQyLDIyMiwyNDcsOTUsMTc3LDIyNywxODQsMjM5LDEwNiwxNDUsMTY3LDEzMyw1MywyLDMsMSwwLDE=","email":"openidtest10@gmail.com","alg":"RS256","kid":"fdcaa63240ed28eae381d1643d4cc9356dc397eb"},"expires":"1487614378","email":"openidtest10@gmail.com"}');
          //let infoToken = JSON.parse('{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"}');

          /*_this.storeIdentity(result, keyPair).then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });

          _this.currentIdentity = {assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken};
          _this.identities.push({assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken});
          return resolve({assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken});
          */
         
          /*let url = "https://localhost/#state=state&code=4/14pwctKh8MOdl4vhf1Lo4sZfgZd-18gr5bgSmoXh-LU&access_token=ya29.Glv4A2T2lDWyQNZrMSQOAMWBtIVF2f1yYqVk6_vxXpNyQOpeYPeUm3lYDM5sWTwys-zM0xQlW0i7ItzqyCxCsJ7dcGl_yfaC4lxWMrNggLuKA_27mMA3BByYBNRJ&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDg3NjAxNTEzLCJleHAiOjE0ODc2MDUxMTMsImF0X2hhc2giOiJsWUVEYU9uZldoTWRGQmFCNlUtT3hnIiwiYXVkIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExOTM0MjMzNjMyNTIwMDc3NzQzIiwiY19oYXNoIjoibXpXTWhMZ2xWYkZCbDUzOUcyc1FnZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qSXpMREV3Tnl3eE16a3NNVFUxTERJd055d3hNaklzTWpRd0xESTBOaXd4TWpNc01UUXpMREV4TlN3eU16RXNNVGMwTERFd05TdzVNQ3d4TERFNU9Dd3hNakFzTkRFc01qRXhMREkwTkN3eU5EWXNNakV5TERreExEUXlMRGMyTERFME5Dd3hOaklzTVRZMExERXdNeXd5TVRFc01USTRMRElzTkRnc016SXNNVEkzTERFM09Td3lNallzTWpNekxESXdOaXd5TlRRc09UTXNNVFkxTERJd015dzBPU3cyTml3eE9Ea3NNalF6TERJeU1pdzRPQ3d5TVRVc01qTTBMRFUyTERFek9Dd3hNVFFzTVRVNUxERTNNU3d5TXpBc01UQTJMREU1Tnl3NE5Dd3hORGNzT1Rrc01UTXdMREl6TlN3eU1EZ3NPRFFzTWprc01UTTFMRFk0TERRMUxERTVPU3d6TkN3MU9Dd3lNRGNzT0RNc01qUXhMREl3TkN3eE5qWXNNalEwTERFNU5pd3hNamdzTml3eE1qVXNNVEk1TERJME9DdzRNU3czTERFME1Td3lNVE1zTVRjMUxEazFMRFV4TERrMUxESXpNQ3d4TURBc01UUTFMREUzT1N3eE9UUXNNVFU0TERZekxERTVNeXd4T0RJc01UTXNOU3d6TXl3eE1qSXNPRGdzTVRNd0xESXNNVGt4TERFek9Td3lNRGdzTWpNNUxERXlPU3d4TURFc01UVXlMREV5TERJeE1pd3hPU3czT0N3eE16a3NNak13TERRd0xERXhNaXd4TmpZc016UXNNak16TERRNUxERXhOU3cxT0N3eE1ERXNNalF4TERJd0xETXpMREUwTml3Mk5pdzVNQ3d4TXpjc01Ua3NNVFkzTERFMU1Dd3hOVElzTVRjM0xESTFNQ3d5TXprc01UYzVMRGMyTERVMUxERXlNQ3d4TWprc01UVTFMRE0zTERZNExERTJPQ3cxTVN3eU1qVXNNakE0TERFeE15d3lNU3d4TlN3eU15d3hNRGtzTVRneUxEQXNPREFzTVRVNUxERXlNQ3d4T0Rnc05EQXNOVEVzT0N3eE9URXNOaklzT0Rnc01qQXhMREV5TlN3eE1pdzFPQ3d4TmpVc016Z3NNVEVzT0RRc016QXNPVFFzT1RNc015d3lNRElzT0Rjc01URTVMRFU1TERFM05Dd3hNak1zTVRNc01USXdMREl3T0N3eU1ETXNNVEE1TERjeExESXlOeXc0TUN3eE1Td3hNemdzTVRRNUxERXpOU3d4T0Rjc09EVXNORGdzTVRneExEWTRMREUxTUN3ek9Td3lORFFzT0RRc01UQTRMREFzTVRZNUxERTVPU3d5TkRjc01USTRMREk1TERjeExESXlPU3d4T0N3eE16UXNNakV4TERFNU1pd3hNekVzTVRnMExEa3pMREl5Tnl3eU5ETXNNakl3TERJd05Td3hORGdzTVRJNExESXdPU3czTXl3MU9Dd3hPREVzTVRBd0xERXpMRFExTERZMUxERXlOQ3d6T1N3eE1EWXNNVFExTERJeU55d3hOVGtzT1Rjc01URTVMRGN4TERFNU1pd3hNemNzTkRrc01pd3pMREVzTUN3eCIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSJ9.A1H7kytmjmZc9nIc5C674CL_eDlz_13YLefpDLCrOClefat_G5aCW8ovE-vaSycef7rYA1ZxJt0qP1pvLP9k9mdSywUXUuH4zmsYD0khPAHVMLiSYeclbbZU2uSogeKcG7BjK6p1F3wRtujkYKn0QpKOwF-XSITcsUuIDayALFPc1x5LHjAtYkKU0Y07TiFyZiVjrC-eZB6DLJJBCie3E2q1b6pW8KnwI9VyzXF-MwG5DY83amwJ3SauKZZluu4565Z9stWp-vLJK6IUJKoHWOxGdDXdzNhP9uGRj8wSvgB_RZnPOtboJm9G0oLv_2qt-L3r1MajE8a8K25K2H2Uew&authuser=1&session_state=9ca3ec2bd24fdecb95d683dc6f58ac9f6d9a62f3..4f00&prompt=none";
          _this.crypto.generateRSAKeyPair().then(function(keyPair) {
            let publicKey = btoa(keyPair.public);
            let userkeyPair = keyPair;
            let idp = {type: "idp", value: "google.com", code: 200, auth: false}
            return _this.generateAssertion(publicKey, origin, url, userkeyPair, idp.value);
          }).then((result) => {
            console.log('TIAGO B:', result);
            _this.currentIdentity = result.identityBundle;
            _this.identities.push(result.identityBundle);
            return resolve(result.identityBundle);
          });*/

          /*let randomNumber = Math.floor((Math.random() * 10000) + 1);

          let userProfile = {
            avatar: 'https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg',
            cn: 'test nodejs',
            username: 'nodejs-' + randomNumber + '@nodejs.com',
            userURL: 'user://nodejs.com/nodejs-' + randomNumber
          };

          // TIAGO
          _this.crypto.generateRSAKeyPair().then(function(keys) {

            let publicKey = btoa(keys.public);
            let privateKey = btoa(keys.private);
            let keyPair = {
              private: privateKey,
              public: publicKey
            };

            //console.log('TIAGO: keyPair promise ', keyPair);

            let identityBundle = {
              assertion: 'assertion',
              idp:'nodejs',
              //idp: 'google.com',
              identity: 'user://nodejs.com/nodejs-' + randomNumber,
              messageInfo: {
                assertion: 'assertion',
                idp:'nodejs',
                //idp: 'google.com',
                userProfile: userProfile
              },
              userProfile: userProfile,
              keyPair: keyPair
            };
            _this.currentIdentity = identityBundle;
            _this.identities.push(identityBundle);
            return resolve(identityBundle);

          });*/
        }

      }).catch(error => {
        console.log('Error on identity acquisition ', error);
        reject(error);
      });
    });
  }

  callNodeJsGenerateMethods(idp, origin) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let publicKey;
      let userkeyPair;

      //generates the RSA key pair
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {

        publicKey = btoa(keyPair.public);
        userkeyPair = keyPair;

        _this.fakeNodeIdPProxy(publicKey, origin, '', idp).then((url) => {
          //_this.sendGenerateMessage(publicKey, origin, url, idp).then((result) => {
          _this.fakeNodeIdPProxy(publicKey, origin, url, idp).then((result) => {
            
            if (result) {
              _this.storeIdentity(result, keyPair).then((value) => {
                resolve(value);
              }, (err) => {
                reject(err);
              });

            } else {
              reject('error on obtaining identity information');
            }
          });

        });
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    });
  }

  fakeNodeIdPProxy(contents, origin, usernameHint, idpDomain) {
    let _this = this;

    return new Promise((resolve, reject) => {

      if (!usernameHint) {
        let url = "https://localhost/#state=state&code=4/14pwctKh8MOdl4vhf1Lo4sZfgZd-18gr5bgSmoXh-LU&access_token=ya29.Glv4A2T2lDWyQNZrMSQOAMWBtIVF2f1yYqVk6_vxXpNyQOpeYPeUm3lYDM5sWTwys-zM0xQlW0i7ItzqyCxCsJ7dcGl_yfaC4lxWMrNggLuKA_27mMA3BByYBNRJ&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDg3NjAxNTEzLCJleHAiOjE0ODc2MDUxMTMsImF0X2hhc2giOiJsWUVEYU9uZldoTWRGQmFCNlUtT3hnIiwiYXVkIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExOTM0MjMzNjMyNTIwMDc3NzQzIiwiY19oYXNoIjoibXpXTWhMZ2xWYkZCbDUzOUcyc1FnZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qSXpMREV3Tnl3eE16a3NNVFUxTERJd055d3hNaklzTWpRd0xESTBOaXd4TWpNc01UUXpMREV4TlN3eU16RXNNVGMwTERFd05TdzVNQ3d4TERFNU9Dd3hNakFzTkRFc01qRXhMREkwTkN3eU5EWXNNakV5TERreExEUXlMRGMyTERFME5Dd3hOaklzTVRZMExERXdNeXd5TVRFc01USTRMRElzTkRnc016SXNNVEkzTERFM09Td3lNallzTWpNekxESXdOaXd5TlRRc09UTXNNVFkxTERJd015dzBPU3cyTml3eE9Ea3NNalF6TERJeU1pdzRPQ3d5TVRVc01qTTBMRFUyTERFek9Dd3hNVFFzTVRVNUxERTNNU3d5TXpBc01UQTJMREU1Tnl3NE5Dd3hORGNzT1Rrc01UTXdMREl6TlN3eU1EZ3NPRFFzTWprc01UTTFMRFk0TERRMUxERTVPU3d6TkN3MU9Dd3lNRGNzT0RNc01qUXhMREl3TkN3eE5qWXNNalEwTERFNU5pd3hNamdzTml3eE1qVXNNVEk1TERJME9DdzRNU3czTERFME1Td3lNVE1zTVRjMUxEazFMRFV4TERrMUxESXpNQ3d4TURBc01UUTFMREUzT1N3eE9UUXNNVFU0TERZekxERTVNeXd4T0RJc01UTXNOU3d6TXl3eE1qSXNPRGdzTVRNd0xESXNNVGt4TERFek9Td3lNRGdzTWpNNUxERXlPU3d4TURFc01UVXlMREV5TERJeE1pd3hPU3czT0N3eE16a3NNak13TERRd0xERXhNaXd4TmpZc016UXNNak16TERRNUxERXhOU3cxT0N3eE1ERXNNalF4TERJd0xETXpMREUwTml3Mk5pdzVNQ3d4TXpjc01Ua3NNVFkzTERFMU1Dd3hOVElzTVRjM0xESTFNQ3d5TXprc01UYzVMRGMyTERVMUxERXlNQ3d4TWprc01UVTFMRE0zTERZNExERTJPQ3cxTVN3eU1qVXNNakE0TERFeE15d3lNU3d4TlN3eU15d3hNRGtzTVRneUxEQXNPREFzTVRVNUxERXlNQ3d4T0Rnc05EQXNOVEVzT0N3eE9URXNOaklzT0Rnc01qQXhMREV5TlN3eE1pdzFPQ3d4TmpVc016Z3NNVEVzT0RRc016QXNPVFFzT1RNc015d3lNRElzT0Rjc01URTVMRFU1TERFM05Dd3hNak1zTVRNc01USXdMREl3T0N3eU1ETXNNVEE1TERjeExESXlOeXc0TUN3eE1Td3hNemdzTVRRNUxERXpOU3d4T0Rjc09EVXNORGdzTVRneExEWTRMREUxTUN3ek9Td3lORFFzT0RRc01UQTRMREFzTVRZNUxERTVPU3d5TkRjc01USTRMREk1TERjeExESXlPU3d4T0N3eE16UXNNakV4TERFNU1pd3hNekVzTVRnMExEa3pMREl5Tnl3eU5ETXNNakl3TERJd05Td3hORGdzTVRJNExESXdPU3czTXl3MU9Dd3hPREVzTVRBd0xERXpMRFExTERZMUxERXlOQ3d6T1N3eE1EWXNNVFExTERJeU55d3hOVGtzT1Rjc01URTVMRGN4TERFNU1pd3hNemNzTkRrc01pd3pMREVzTUN3eCIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSJ9.A1H7kytmjmZc9nIc5C674CL_eDlz_13YLefpDLCrOClefat_G5aCW8ovE-vaSycef7rYA1ZxJt0qP1pvLP9k9mdSywUXUuH4zmsYD0khPAHVMLiSYeclbbZU2uSogeKcG7BjK6p1F3wRtujkYKn0QpKOwF-XSITcsUuIDayALFPc1x5LHjAtYkKU0Y07TiFyZiVjrC-eZB6DLJJBCie3E2q1b6pW8KnwI9VyzXF-MwG5DY83amwJ3SauKZZluu4565Z9stWp-vLJK6IUJKoHWOxGdDXdzNhP9uGRj8wSvgB_RZnPOtboJm9G0oLv_2qt-L3r1MajE8a8K25K2H2Uew&authuser=1&session_state=9ca3ec2bd24fdecb95d683dc6f58ac9f6d9a62f3..4f00&prompt=none";
        resolve(url);
      } else {

        let assertion = "eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltWmtZMkZoTmpNeU5EQmxaREk0WldGbE16Z3haREUyTkROa05HTmpPVE0xTm1Sak16azNaV0lpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKcFlYUWlPakUwT0RjMk1UQTNOemdzSW1WNGNDSTZNVFE0TnpZeE5ETTNPQ3dpWVhSZmFHRnphQ0k2SWtzMlQxRTRjMUp0TmpCdU4zUkdXbkZ3YTJkQ1RtY2lMQ0poZFdRaU9pSTRNRGd6TWprMU5qWXdNVEl0ZEhGeU9IRnZhREV4TVRrME1tZGtNbXRuTURBM2REQnpPR1l5TnpkeWIya3VZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0p6ZFdJaU9pSXhNVEU1TXpReU16TTJNekkxTWpBd056YzNORE1pTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lZWHB3SWpvaU9EQTRNekk1TlRZMk1ERXlMWFJ4Y2poeGIyZ3hNVEU1TkRKblpESnJaekF3TjNRd2N6aG1NamMzY205cExtRndjSE11WjI5dloyeGxkWE5sY21OdmJuUmxiblF1WTI5dElpd2libTl1WTJVaU9pSk9SR2R6VFZSTmQweEVSWE5OZWxGelRrUm5jMDFVVFhOT2FYYzFURVJSZVV4RVJYcE9RM2N6VFdsM2VFMTZVWE5OYWxFelRFUkZla3hFUlhOTlUzZDRURVJWYzAxRGQzcE1SRVY2VFVOM2VFeEVSVEZNUkVGelRrUm5jMDFVVFhkTVJFVnpUVlJCYzAxcGQzaE5la0Z6VFZOM2VFeEVRWE5OYWxWNVRFUkpNRXhFUlhwUFEzZDRUVlJGYzAxVVVUVk1SR00xVEVSTk1FeEVTWGxPUTNkNFRsUlJjMDFVVVhkTVJFbHpUV3BKZUV4RVJUVk1SRVUwVFVOM2VFOVVVWE5PZVhkNVRYcEZjMDFVVFRSTVJGRTFURVJGZVU5VGR6Qk5lWGQ0VDFOM2VVMXFSWE5OVkVrelRFUkpNVTFwZDNsUFUzY3lUbE4zTWs1NWQzaFBWRkZ6VFZSQmVFeEVUWGhNUkVWNlRVTjNlVTE2VVhOTlZHdDNURVJKYzAxcVRYbE1SRVV6VDBOM2VFNVVTWE5OYWtFeFRFUnJNRXhFU1hsT1EzZDVUWGwzZVUxNmEzTk5WR2N4VEVSRmVVeEVSWGRPZVhkNFRXbDNlVTFVUVhOT1JFbHpUWHBuYzAxVVl6Uk1SRWw2VFdsM2VVMVVWWE5OVkdkelRXcFZNRXhFU1RCUFUzZDVUWHBOYzAxcVRUSk1SRWt3VFZOM2VFMUVaM05OZWsxelRWUlpla3hFU1RCTlEzY3pUa04zZUU1RVVYTk5WRkZ6VGxSUmMwMVVhelJNUkVVeFRFUlJNRXhFUlRWUFEzYzBUVk4zTkU5VGQzaE9WRmx6VGxSamMwMVVVVEZNUkVrd1RsTjNlRTFFV1hOTlZGVTFURVJGZDA5VGQzaE9VM2Q0VGxSRmMwMVVSVEZNUkdNeVRFUkZkMDFUZDNoTlZHZHpUVlJaTVV4RVJYZFBRM2N5VFhsM2VFOVVXWE5OYWtrelRFUkZNazE1ZDNoUFZFRnpUVlJyZVV4RVJUUk5lWGQ0VFdwUmMwMVVTVEZNUkVVelQwTjNNVTVwZDNwTmFYYzFUbE4zTWs5RGR6Vk5lWGN5VDBOM01VMURkekJPZVhkNVRWUmpjMDE2U1hOTmFtdHpUbFJWYzAxVVFUQk1SRVUxVDBOM05VNURkM2hQVkdkelRWUmpjMDFxVVRCTVJFVjNUbmwzZVUxRVFYTk5WRTB6VEVSTk1FeEVSVFJOUTNkNFQwUnJjMDE1ZDNoUFZHdHpUVU4zZVUxNlFYTk5WRkUwVEVSSmQwMXBkM2hOZW10elRWUk5lRXhFUlRGUFUzZDRUWHBaYzAxVVdUQk1SRkUxVEVSRmVFNVRkM2hOZWtGelQwUkpjMDFxUVRSTVJFVTBUbE4zZVUxNlVYTk5ha1Y0VEVSRmVFNVRkM2xOYWxselRsUkJjMDFVUlhsTVJHZDVURVJKZDA1NWQzbE5WRWx6VG5wQmMwOVVhM05PYWtselRsUnJjMDU2YTNOT1JHdHpUVlJWTUV4RVJURk5lWGQ0VGtSUmMwMXFRWHBNUkVVMFRubDNlVTVFU1hOTlZGVXdURVJKTTB4RWF6Vk1SRVV5VGxOM2VFOVVRWE5OVkUxNlRFUkZNMDVEZDNsTmFrRnpUVlJKTVV4RVdYbE1SRVV4VDBOM2VVNVVSWE5OYWxFMVRFUlJNVXhFUlRGTlUzYzBUV2wzZVUxRWEzTk5WR3MxVEVSWk5VeEVaekpNUkVVMFRtbDNkMHhFUlhkTVJFVjRUbWwzZUUxVVNYTk5WR3Q0VEVSUk1reEVSWGhOUTNkNVRsTjNNRTlUZHpGTmVYY3hUV2wzZVUxRVNYTk5WRWt3VEVSSmVVNURkM2hQVkUxelRWUlpjMDFxVlhoTVJFVTBUbE4zZVUxNlZYTk5hazB5VEVSRk1VOURkM2xOVkd0elRtcFJjMDVVVFhOTlZHZDRURVJGTkU1VGQzaFBSRlZ6VFdwRmVVeEVhekJNUkVWNVRrTjNlRTE2VVhOTmFrMHhURVJGZVUxRGR6Vk9lWGQ0VFVScmMwMVVUWGRNUkVVeFQxTjNlVTVFUlhOTlZGVXhURVJWZVV4RVNYaFBRM2Q1VGtSSmMwMXFSWHBNUkUxelRWUkpkMHhFUlRGT1UzZDVUV3BGYzAxcVNUTk1SRlV6VEVSSk1reEVZek5NUkUxNlRFUm5la3hFU1hkTlUzYzFUWGwzZVUxcVZYTk9WRWx6VDBSVmMwMVVaM2RNUkVWNlRYbDNlRTE2WjNOT2VrbHpUV3BSZVV4RVNYbE5hWGQ1VGtSamMwOVVWWE5OVkdNelRFUkplVTU1ZDNoUFJGRnpUV3BOTlV4RVJYZE9hWGQ0VGtSVmMwMVVXVE5NUkVWNlRYbDNNVTE1ZDNsTVJFMXpUVk4zZDB4RVJUMGlMQ0psYldGcGJDSTZJbTl3Wlc1cFpIUmxjM1F4TUVCbmJXRnBiQzVqYjIwaWZRLlVOclFDeV91ckpFZXI3NS1JcVpucGhUNDhFeGtHMk9qUUxsTFRtY1RGTHlNZTd4X2tuWG5OSWFQTlJiTXFSaVY0ZE1xNjE2bXlXdEpvYlVwSVNiSnFaTC1mM09jb3I1LTc3cjVXRS1WV2U5RDlfNzRWbXRQamV2ZHI3dkpENlZRLTUyWlh4Wm1MeDdTc2dRWkt4UmJxSG44bzdEZ3ZhQ0tvWDlPS3IwWVB0OGRWa1E1VnpjRW50NkRkV1h1UUZrUVJUWUFLSXFvcnBBSm5veXZVR0lJNkFWTmZucmZVVk5oa0pHVzZHZGNKb1BCdkNDbXoxR0d0VWlITERSUDhPcDhnVlNkVkxZSnZxTG9KQjhvX0hxUTJWNlNjd1piQmVDMmpLVWdfWXZfd1d0OVJReXpwQW9lR3UtUlZ0R1B2ckdFYUVBdklFWHk3c1ZMaWNHMHluVXVXdyIsInRva2VuSURKU09OIjp7ImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE0ODc2MTA3NzgiLCJleHAiOiIxNDg3NjE0Mzc4IiwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qVXlMREkwTERFek9Dd3hNVEVzTVRRNUxEYzVMRE0wTERJeU5Dd3hOVFFzTVRRd0xESXNNakl4TERFNUxERTRNQ3d4T1RRc055d3lNekVzTVRNNExEUTVMREV5T1N3ME15d3hPU3d5TWpFc01USTNMREkxTWl3eU9TdzJOU3cyTnl3eE9UUXNNVEF4TERNeExERXpNQ3d5TXpRc01Ua3dMRElzTWpNeUxERTNPQ3d4TlRJc01qQTFMRGswTERJeU5Dd3lNeXd5TXprc01UZzFMREV5TERFd055d3hNaXd5TVRBc05ESXNNemdzTVRjNExESXpNaXd5TVRVc01UZ3NNalUwTERJME9Td3lNek1zTWpNMkxESTBNU3d4TURnc016TXNNVFl6TERJME1DdzNOQ3d4TkRRc01UUXNOVFFzTVRrNExERTFMRFEwTERFNU9DdzRNU3c0T1N3eE5UWXNOVGNzTVRRMUxESTBOU3d4TURZc01UVTVMREV3T1N3eE5Td3hOVEVzTVRFMUxEYzJMREV3TVN3eE1UZ3NNVFkxTERFd09DdzJNeXd4T1RZc01qSTNMREUyTXl3eE9UQXNNVGt5TERFNE15d3hNalFzTVRJMUxERTNPQ3cxTml3ek1pdzVOU3cyT0N3NU15dzJPQ3cxTUN3ME55d3lNVGNzTXpJc01qa3NOVFVzTVRBMExERTVPQ3c1TkN3eE9UZ3NNVGNzTWpRMExERXdOeXd5TURBc01UTTNMRE0wTERFNE1Dd3hPRGtzTXl3eE9Ua3NNQ3d5TXpBc01UUTRMREl3TWl3eE16a3NNVE14TERFMU9Td3hNellzTVRZMExEUTVMREV4TlN3eE16QXNPRElzTWpBNExERTROU3d5TXpRc01qRXhMREV4TlN3eU1qWXNOVEFzTVRFeUxEZ3lMREl3Tnl3eU1USXNOekFzT1Rrc05qSXNOVGtzTnprc05Ea3NNVFUwTERFMU15d3hORFFzTWpBekxERTROeXd5TkRJc01UVTBMREkzTERrNUxERTJOU3d4T1RBc01UTXpMREUzTkN3eU1qQXNNVEkxTERZeUxERTFPQ3d5TlRFc01qUTVMRFExTERFMU1TdzRNaXd5TURrc01UazVMRFk1TERnMkxERTROaXd3TERFd0xERXhOaXd4TVRJc01Ua3hMRFEyTERFeE1Dd3lOU3cwT1N3MU15dzFNaXd5TURJc01USTBMREl5TkN3eE9UTXNNVFlzTWpVeExERTROU3d5TXpVc01qTTJMREUxT0N3eU1Ua3NOalFzTlRNc01UZ3hMREU0TlN3eE9EVXNNakV5TERrMExERXlOQ3d4TXpRc01qTTFMREV5TUN3NU55d3hNRGtzTVRNd0xERTFPU3d5TkRFc01UVTFMRFV5TERJeE9Dd3lORElzTWpFekxETXNNVEl3TERFMU5Td3lNakVzTWpJM0xEVTNMREkyTERjM0xETXpMRGd6TERJd01TdzVNeXd5TWpVc05USXNPRFVzTVRnd0xERXpNeXd4TXpnc056SXNNalF5TERJeU1pd3lORGNzT1RVc01UYzNMREl5Tnl3eE9EUXNNak01TERFd05pd3hORFVzTVRZM0xERXpNeXcxTXl3eUxETXNNU3d3TERFPSIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiZmRjYWE2MzI0MGVkMjhlYWUzODFkMTY0M2Q0Y2M5MzU2ZGMzOTdlYiJ9fQ==";
        //console.log('TIAGO decode assertion');
        //_this.crypto.decode(assertion);
        let idpBundle = {domain:'google.com',protocol:'OIDC'};
        //console.log('TIAGO decode idpBundle');
        //_this.crypto.decode(JSON.stringify(idpBundle));
        let identityBundle = {"accessToken":"ya29.Glv4A1n_HScRBNtT_OEq6o6B_VHbp-1cJqtr-97kTa40ejpqG0fTbAhtrMlajVkYLF33QtcxQATfZwVqaun7LXo-7-4ItL5FCMC3m9VwRJ8SD3SrbMoQ__Kc8V6h","idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0ODc2MTA3NzgsImV4cCI6MTQ4NzYxNDM3OCwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNalV5TERJMExERXpPQ3d4TVRFc01UUTVMRGM1TERNMExESXlOQ3d4TlRRc01UUXdMRElzTWpJeExERTVMREU0TUN3eE9UUXNOeXd5TXpFc01UTTRMRFE1TERFeU9TdzBNeXd4T1N3eU1qRXNNVEkzTERJMU1pd3lPU3cyTlN3Mk55d3hPVFFzTVRBeExETXhMREV6TUN3eU16UXNNVGt3TERJc01qTXlMREUzT0N3eE5USXNNakExTERrMExESXlOQ3d5TXl3eU16a3NNVGcxTERFeUxERXdOeXd4TWl3eU1UQXNORElzTXpnc01UYzRMREl6TWl3eU1UVXNNVGdzTWpVMExESTBPU3d5TXpNc01qTTJMREkwTVN3eE1EZ3NNek1zTVRZekxESTBNQ3czTkN3eE5EUXNNVFFzTlRRc01UazRMREUxTERRMExERTVPQ3c0TVN3NE9Td3hOVFlzTlRjc01UUTFMREkwTlN3eE1EWXNNVFU1TERFd09Td3hOU3d4TlRFc01URTFMRGMyTERFd01Td3hNVGdzTVRZMUxERXdPQ3cyTXl3eE9UWXNNakkzTERFMk15d3hPVEFzTVRreUxERTRNeXd4TWpRc01USTFMREUzT0N3MU5pd3pNaXc1TlN3Mk9DdzVNeXcyT0N3MU1DdzBOeXd5TVRjc016SXNNamtzTlRVc01UQTBMREU1T0N3NU5Dd3hPVGdzTVRjc01qUTBMREV3Tnl3eU1EQXNNVE0zTERNMExERTRNQ3d4T0Rrc015d3hPVGtzTUN3eU16QXNNVFE0TERJd01pd3hNemtzTVRNeExERTFPU3d4TXpZc01UWTBMRFE1TERFeE5Td3hNekFzT0RJc01qQTRMREU0TlN3eU16UXNNakV4TERFeE5Td3lNallzTlRBc01URXlMRGd5TERJd055d3lNVElzTnpBc09Ua3NOaklzTlRrc056a3NORGtzTVRVMExERTFNeXd4TkRRc01qQXpMREU0Tnl3eU5ESXNNVFUwTERJM0xEazVMREUyTlN3eE9UQXNNVE16TERFM05Dd3lNakFzTVRJMUxEWXlMREUxT0N3eU5URXNNalE1TERRMUxERTFNU3c0TWl3eU1Ea3NNVGs1TERZNUxEZzJMREU0Tml3d0xERXdMREV4Tml3eE1USXNNVGt4TERRMkxERXhNQ3d5TlN3ME9TdzFNeXcxTWl3eU1ESXNNVEkwTERJeU5Dd3hPVE1zTVRZc01qVXhMREU0TlN3eU16VXNNak0yTERFMU9Dd3lNVGtzTmpRc05UTXNNVGd4TERFNE5Td3hPRFVzTWpFeUxEazBMREV5TkN3eE16UXNNak0xTERFeU1DdzVOeXd4TURrc01UTXdMREUxT1N3eU5ERXNNVFUxTERVeUxESXhPQ3d5TkRJc01qRXpMRE1zTVRJd0xERTFOU3d5TWpFc01qSTNMRFUzTERJMkxEYzNMRE16TERnekxESXdNU3c1TXl3eU1qVXNOVElzT0RVc01UZ3dMREV6TXl3eE16Z3NOeklzTWpReUxESXlNaXd5TkRjc09UVXNNVGMzTERJeU55d3hPRFFzTWpNNUxERXdOaXd4TkRVc01UWTNMREV6TXl3MU15d3lMRE1zTVN3d0xERT0iLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20ifQ.UNrQCy_urJEer75-IqZnphT48ExkG2OjQLlLTmcTFLyMe7x_knXnNIaPNRbMqRiV4dMq616myWtJobUpISbJqZL-f3Ocor5-77r5WE-VWe9D9_74VmtPjevdr7vJD6VQ-52ZXxZmLx7SsgQZKxRbqHn8o7DgvaCKoX9OKr0YPt8dVkQ5VzcEnt6DdWXuQFkQRTYAKIqorpAJnoyvUGII6AVNfnrfUVNhkJGW6GdcJoPBvCCmz1GGtUiHLDRP8Op8gVSdVLYJvqLoJB8o_HqQ2V6ScwZbBeC2jKUg_Yv_wWt9RQyzpAoeGu-RVtGPvrGEaEAvIEXy7sVLicG0ynUuWw","tokenType":"Bearer","infoToken":{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"},"tokenIDJSON":{"iss":"https://accounts.google.com","iat":"1487610778","exp":"1487614378","at_hash":"K6OQ8sRm60n7tFZqpkgBNg","aud":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","sub":"111934233632520077743","email_verified":"true","azp":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","nonce":"NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMjUyLDI0LDEzOCwxMTEsMTQ5LDc5LDM0LDIyNCwxNTQsMTQwLDIsMjIxLDE5LDE4MCwxOTQsNywyMzEsMTM4LDQ5LDEyOSw0MywxOSwyMjEsMTI3LDI1MiwyOSw2NSw2NywxOTQsMTAxLDMxLDEzMCwyMzQsMTkwLDIsMjMyLDE3OCwxNTIsMjA1LDk0LDIyNCwyMywyMzksMTg1LDEyLDEwNywxMiwyMTAsNDIsMzgsMTc4LDIzMiwyMTUsMTgsMjU0LDI0OSwyMzMsMjM2LDI0MSwxMDgsMzMsMTYzLDI0MCw3NCwxNDQsMTQsNTQsMTk4LDE1LDQ0LDE5OCw4MSw4OSwxNTYsNTcsMTQ1LDI0NSwxMDYsMTU5LDEwOSwxNSwxNTEsMTE1LDc2LDEwMSwxMTgsMTY1LDEwOCw2MywxOTYsMjI3LDE2MywxOTAsMTkyLDE4MywxMjQsMTI1LDE3OCw1NiwzMiw5NSw2OCw5Myw2OCw1MCw0NywyMTcsMzIsMjksNTUsMTA0LDE5OCw5NCwxOTgsMTcsMjQ0LDEwNywyMDAsMTM3LDM0LDE4MCwxODksMywxOTksMCwyMzAsMTQ4LDIwMiwxMzksMTMxLDE1OSwxMzYsMTY0LDQ5LDExNSwxMzAsODIsMjA4LDE4NSwyMzQsMjExLDExNSwyMjYsNTAsMTEyLDgyLDIwNywyMTIsNzAsOTksNjIsNTksNzksNDksMTU0LDE1MywxNDQsMjAzLDE4NywyNDIsMTU0LDI3LDk5LDE2NSwxOTAsMTMzLDE3NCwyMjAsMTI1LDYyLDE1OCwyNTEsMjQ5LDQ1LDE1MSw4MiwyMDksMTk5LDY5LDg2LDE4NiwwLDEwLDExNiwxMTIsMTkxLDQ2LDExMCwyNSw0OSw1Myw1MiwyMDIsMTI0LDIyNCwxOTMsMTYsMjUxLDE4NSwyMzUsMjM2LDE1OCwyMTksNjQsNTMsMTgxLDE4NSwxODUsMjEyLDk0LDEyNCwxMzQsMjM1LDEyMCw5NywxMDksMTMwLDE1OSwyNDEsMTU1LDUyLDIxOCwyNDIsMjEzLDMsMTIwLDE1NSwyMjEsMjI3LDU3LDI2LDc3LDMzLDgzLDIwMSw5MywyMjUsNTIsODUsMTgwLDEzMywxMzgsNzIsMjQyLDIyMiwyNDcsOTUsMTc3LDIyNywxODQsMjM5LDEwNiwxNDUsMTY3LDEzMyw1MywyLDMsMSwwLDE=","email":"openidtest10@gmail.com","alg":"RS256","kid":"fdcaa63240ed28eae381d1643d4cc9356dc397eb"},"expires":"1487614378","email":"openidtest10@gmail.com"};
        //console.log('TIAGO decode identityBundle');
        //_this.crypto.decode(JSON.stringify(identityBundle));
        let infoToken = {"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"};
        //console.log('TIAGO decode infoToken');
        //_this.crypto.decode(JSON.stringify(infoToken));

        resolve({assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken});

      }
    });
  }

  callGenerateMethods(idp, origin) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let publicKey;
      let userkeyPair;

      //generates the RSA key pair
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {

        publicKey = btoa(keyPair.public);
        userkeyPair = keyPair;
        return _this.generateAssertion(publicKey, origin, '', userkeyPair, idp);

      }).then(function(url) {
        return _this.generateAssertion(publicKey, origin, url, userkeyPair, idp);

      }).then(function(value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    });
  }

  sendGenerateMessage(contents, origin, usernameHint, idpDomain) {
    let _this = this;
    let domain = _this._resolveDomain(idpDomain);
    let message;

    return new Promise((resolve, reject) => {
      message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'generateAssertion', params: {contents: contents, origin: origin, usernameHint: usernameHint}}};
      _this._messageBus.postMessage(message, (res) => {
        let result = res.body.value;

        //console.log('TIAGO assertion: ', JSON.stringify(result.assertion));
        //console.log('TIAGO idp: ', JSON.stringify(result.idp));
        //console.log('TIAGO info: ', JSON.stringify(result.info));
        //console.log('TIAGO infoToken: ', JSON.stringify(result.infoToken));
        resolve(result);

      });
    });
  }

  storeIdentity(result, keyPair) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let splitedAssertion = result.assertion.split('.');
      let assertionParsed;

      //verify if the token contains the 3 components, or just the assertion
      if (splitedAssertion[1]) {
        assertionParsed = JSON.parse(atob(splitedAssertion[1]));
      } else {

        assertionParsed = JSON.parse(atob(result.assertion));
      }
      let idToken;

      //TODO remove the verification and remove the tokenIDJSON from the google idpProxy;
      if (assertionParsed.tokenIDJSON) {
        idToken = assertionParsed.tokenIDJSON;
      } else {
        idToken = assertionParsed;
      }

      idToken.idp = result.idp;

      let email = idToken.email || idToken.sub;

      // let identifier = getUserURLFromEmail(email);

      let identifier = 'user://' + idToken.idp.domain + '/' + email;

      result.identity = identifier;

      _this.identity.addIdentity(result);

      // check if exists any infoToken in the result received
      let infoToken = (result.infoToken) ? result.infoToken : {};

      let commonName = idToken.name || email.substring(0, email.indexOf('@'));
      let userProfileBundle = {username: email, cn: commonName, avatar: infoToken.picture, locale: infoToken.locale, userURL: identifier};

      //creation of a new JSON with the identity to send via messages
      let newIdentity = {userProfile: userProfileBundle, idp: result.idp.domain, assertion: result.assertion};
      result.messageInfo = newIdentity;
      result.keyPair = keyPair;

      _this.currentIdentity = newIdentity;

      //verify if the id already exists. If already exists then do not add to the identities list;
      let idAlreadyExists = false;
      let oldId;
      for (let identity in _this.identities) {
        if (_this.identities[identity].identity === result.identity) {
          idAlreadyExists = true;
          oldId = _this.identities[identity].messageInfo;
        }
      }

      if (idAlreadyExists) {
        resolve(oldId);
        let exists = false;

        //check if the identity exists in emailList, if not add it
        //This is useful if an identity was previously registered but was later unregistered
        for (let i in _this.emailsList) {
          if (_this.emailsList[i] === email) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          _this.emailsList.push(email);
        }

      } else {
        _this.emailsList.push(email);
        _this.identities.push(result);
        _this.storageManager.set('idModule:identities', 0, _this.identities).then(() => {

          resolve(newIdentity);
        });
      }

    });
  }

  /**
  * Requests the IdpProxy from a given Domain for an identityAssertion
  *
  * @param  {DOMString} contents     contents
  * @param  {DOMString} origin       origin
  * @param  {DOMString} usernameHint usernameHint
  * @param  {JSON}      keyPair       user keyPair
  * @return {IdAssertion}              IdAssertion
  */
  generateAssertion(contents, origin, usernameHint, keyPair, idpDomain) {
    let _this = this;

    console.log('generateAssertion');

    return new Promise(function(resolve, reject) {

      _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((result) => {

        if (result.loginUrl) {

          _this.openPopup(result.loginUrl).then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });
        } else if (result) {

          _this.storeIdentity(result, keyPair).then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });

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

    let message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'validateAssertion',
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

  encryptMessage(message) {
    let _this = this;

    console.log('encrypt message ');

    return new Promise(function(resolve, reject) {
      let isHandShakeType = message.type === 'handshake';

      //if is not to apply encryption, then returns resolve
      if (!_this.isToUseEncryption && !isHandShakeType) {
        console.log('encryption disabled');
        return resolve(message);
      }

      //TODO remove this logic and move it to a util function
      let splitedToURL = message.to.split('/');
      let dataObjectURL = splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3];
      if (splitedToURL.length > 6) {
        dataObjectURL = splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3] + '/' + splitedToURL[4];
      }

      let isToDataObject = isDataObjectURL(dataObjectURL);
      let isToLegacyIdentity = isLegacy(message.to);
      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';

      if (message.type === 'update') {
        return resolve(message);
      }

      if (isToLegacyIdentity) {
        resolve(message);
      } else if (isFromHyperty && isToHyperty) {
        let userURL = _this._registry.getHypertyOwner(message.from);
        if (userURL) {

          // check if exists any keys between two users
          let chatKeys = _this.chatKeys[message.from + '<->' + message.to];
          if (!chatKeys) {
            chatKeys = _this._newChatCrypto(message, userURL);
            console.log('createChatKey encrypt', message.from + message.to);
            _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
            message.body.handshakePhase = 'startHandShake';
          }

          if (chatKeys.authenticated && !isHandShakeType) {

            let iv = _this.crypto.generateIV();
            _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, message.body.value, iv).then(encryptedValue => {

              let filteredMessage = _this._filterMessageToHash(message, message.body.value + iv, chatKeys.hypertyFrom.messageInfo);

              _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, JSON.stringify(filteredMessage)).then(hash => {
                //console.log('result of hash ', hash);
                let value = {iv: _this.crypto.encode(iv), value: _this.crypto.encode(encryptedValue), hash: _this.crypto.encode(hash)};
                message.body.value = JSON.stringify(value);

                resolve(message);
              });
            });

            // if is a handshake message, just resolve it
          } else if (isHandShakeType) {
            resolve(message);

            // else, starts a new handshake protocol
          } else {
            _this._doHandShakePhase(message, chatKeys).then(function(value) {
              _this.chatKeys[message.from + '<->' + message.to] = value.chatKeys;

              _this._messageBus.postMessage(value.message);
              reject('encrypt handshake protocol phase ');
            });
          }
        }

      //if from hyperty to a dataObjectURL
      } else if (isFromHyperty && isToDataObject) {

        console.log('dataObject value to encrypt: ', message.body.value);
        console.log('IdentityModule - encrypt from hyperty to dataobject ', message);

        // TIAGO - persistence issue #147
        _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
          let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

          //if no key exists, create a new one if is the reporter of dataObject
          if (!dataObjectKey) {
            let isHypertyReporter = _this.registry.getReporterURLSynchonous(dataObjectURL);

            // if the hyperty is the reporter of the dataObject then generates a session key
            if (isHypertyReporter && isHypertyReporter === message.from) {

              let sessionKey = _this.crypto.generateRandom();
              _this.dataObjectSessionKeys[dataObjectURL] = {sessionKey: sessionKey, isToEncrypt: true};

              // TIAGO - persistence issue #147
              _this.storageManager.set('dataObjectSessionKeys', 0, _this.dataObjectSessionKeys);

              dataObjectKey = _this.dataObjectSessionKeys[dataObjectURL];
            }
          }

          //check if there is already a session key for the chat room
          if (dataObjectKey) {

            // and if is to apply encryption, encrypt the messages
            if (dataObjectKey.isToEncrypt) {
              let iv = _this.crypto.generateIV();

              _this.crypto.encryptAES(dataObjectKey.sessionKey, _this.crypto.encode(JSON.stringify(message.body.value)), iv).then(encryptedValue => {

                let filteredMessage = _this._filterMessageToHash(message, message.body.value + iv, dataObjectKey.sessionKey);

              _this.crypto.hashHMAC(dataObjectKey.sessionKey, JSON.stringify(filteredMessage)).then(hash => {
                //console.log('hash ', hash);

                  let newValue = {value: _this.crypto.encode(encryptedValue), iv: _this.crypto.encode(iv), hash: _this.crypto.encode(hash)};

                  message.body.value = JSON.stringify(newValue);
                  console.log('TIAGO outgoing:', message);
                  resolve(message);
                });
              });

            // if not, just send the message
            } else {
              resolve(message);
            }

            // start the generation of a new session Key
          } else {
            reject('failed to decrypt message');
          }

        });
      }
    });
  }

  decryptMessage(message) {
    let _this = this;

    console.log('decrypt message ');

    return new Promise(function(resolve, reject) {
      let isHandShakeType = message.type === 'handshake';

      //if is not to apply encryption, then returns resolve
      if (!_this.isToUseEncryption && !isHandShakeType) {
        console.log('decryption disabled');
        return resolve(message);
      }

      //TODO remove this logic and move it to a util function

      let splitedToURL = message.to.split('/');
      let dataObjectURL = splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3];
      if (splitedToURL.length > 6) {
        dataObjectURL = splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3] + '/' + splitedToURL[4];
      }

      let isToDataObject = isDataObjectURL(dataObjectURL);
      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';

      if (message.type === 'update') {
        return resolve(message);
      }

      //is is hyperty to hyperty communication
      if (isFromHyperty && isToHyperty) {
        //console.log('decrypt hyperty to hyperty');
        let userURL = _this._registry.getHypertyOwner(message.to);
        if (userURL) {

          let chatKeys = _this.chatKeys[message.to + '<->' + message.from];
          if (!chatKeys) {
            chatKeys = _this._newChatCrypto(message, userURL, 'decrypt');
            _this.chatKeys[message.to + '<->' + message.from] = chatKeys;
          }

          if (chatKeys.authenticated && !isHandShakeType) {
            let value = JSON.parse(message.body.value);
            let iv = _this.crypto.decode(value.iv);
            let data = _this.crypto.decode(value.value);
            let hash = _this.crypto.decode(value.hash);
            _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
              console.log('decrypted value ', decryptedData);
              message.body.value = decryptedData;

              let filteredMessage = _this._filterMessageToHash(message, decryptedData + iv);

              _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, JSON.stringify(filteredMessage), hash).then(result => {
                //console.log('result of hash verification! ', result);
                message.body.assertedIdentity = true;
                resolve(message);
              });
            });

          } else if (isHandShakeType) {
            _this._doHandShakePhase(message, chatKeys).then(function(value) {

              //if it was started by doMutualAuthentication then ends the protocol
              if (value === 'handShakeEnd') {
                reject('decrypt handshake protocol phase ');

              // if was started by a message, then resend that message
              } else {
                _this.chatKeys[message.to + '<->' + message.from] = value.chatKeys;
                _this._messageBus.postMessage(value.message);
                reject('decrypt handshake protocol phase ');
              }
            });
          } else {
            reject('wrong message do decrypt');
          }
        } else {
          reject('error on decrypt message');
        }

        //if from hyperty to a dataObjectURL
      } else if (isFromHyperty && isToDataObject) {
        console.log('dataObject value to decrypt: ', message.body);

        // TIAGO - persistence issue #147
        _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
          let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

          if (dataObjectKey) {

            //check if is to apply encryption
            if (dataObjectKey.isToEncrypt) {
              let parsedValue = JSON.parse(message.body.value);
              let iv = _this.crypto.decode(parsedValue.iv);
              let encryptedValue = _this.crypto.decode(parsedValue.value);
              let hash = _this.crypto.decode(parsedValue.hash);

              _this.crypto.decryptAES(dataObjectKey.sessionKey, encryptedValue, iv).then(decryptedValue => {
                let parsedValue = JSON.parse(atob(decryptedValue));
                console.log('decrypted Value,', parsedValue);
                message.body.value = parsedValue;

                let filteredMessage = _this._filterMessageToHash(message, parsedValue + iv);

              _this.crypto.verifyHMAC(dataObjectKey.sessionKey, JSON.stringify(filteredMessage), hash).then(result => {
                //console.log('result of hash verification! ', result);

                  message.body.assertedIdentity = true;
                  console.log('TIAGO incoming:', message);
                  resolve(message);
                });
              });

            //if not, just return the message
            } else {
              message.body.assertedIdentity = true;
              resolve(message);
            }

          } else {
            message.body.assertedIdentity = true;
            resolve(message);

            //reject('no sessionKey for chat room found');
          }
        });

      } else {
        reject('wrong message to decrypt');
      }

    });
  }

  doMutualAuthentication(sender, receiver) {
    console.log('doMutualAuthentication: ', sender, receiver);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dataObjectURL;

      // check if the sender is a dataObject and if so stores that value
      let reporterURL = _this.registry.getReporterURLSynchonous(sender);
      if (reporterURL) {
        dataObjectURL = sender;
        sender = reporterURL;
      }

      let msg = {
        to: receiver,
        from: sender,
        callback: undefined,
        body: {handshakePhase: 'startHandShake', ignore: 'ignoreMessage'}
      };

      if (!sender || !receiver) {
        return reject('sender or receiver missing on doMutualAuthentication');
      }

      let chatKeys = _this.chatKeys[sender + '<->' + receiver];
      let userURL = _this._registry.getHypertyOwner(sender);

      if (userURL) {

        if (!chatKeys) {
          // callback to resolve when finish the mutual authentication
          let resolved = function(value) {
            console.log('callback value:', value);
            resolve(value);
          };
          msg.callback = resolved;
          msg.dataObjectURL = dataObjectURL;

          chatKeys = _this._newChatCrypto(msg, userURL);
          _this.chatKeys[sender + '<->' + receiver] = chatKeys;
        }

        if (chatKeys.authenticated) {

          let startSessionKeyExchange = {
            to: sender,
            from: receiver
          };
          chatKeys.dataObjectURL = dataObjectURL;
          _this._sendReporterSessionKey(startSessionKeyExchange, chatKeys).then(value => {

            _this._messageBus.postMessage(value.message);
            resolve('exchange of chat sessionKey initiated');
          });
        } else {

          _this._doHandShakePhase(msg, chatKeys);
        }
      } else {
        reject('error on doMutualAuthentication');
      }
    });

  }

  _doHandShakePhase(message, chatKeys) {
    let _this = this;

    //console.log('handshakeType');

    return new Promise(function(resolve, reject) {

      let handshakeType = message.body.handshakePhase;
      let iv;
      let hash;
      let value = {};
      let filteredMessage;
      switch (handshakeType) {

        case 'startHandShake':
          chatKeys.keys.fromRandom = _this.crypto.generateRandom();

          let startHandShakeMsg = {
            type: 'handshake',
            to: message.to,
            from: message.from,
            body: {
              handshakePhase: 'senderHello',
              value: _this.crypto.encode(chatKeys.keys.fromRandom)
            }
          };
          chatKeys.handshakeHistory.senderHello = _this._filterMessageToHash(startHandShakeMsg, undefined, chatKeys.hypertyFrom.messageInfo);

          // check if was the encrypt function or the mutual authentication that request the
          // start of the handShakePhase.
          if (chatKeys.initialMessage) {
            resolve({message: startHandShakeMsg, chatKeys: chatKeys});
          } else {
            _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
            _this._messageBus.postMessage(startHandShakeMsg);
          }

          break;
        case 'senderHello':

          console.log('senderHello');
          chatKeys.handshakeHistory.senderHello = _this._filterMessageToHash(message);
          chatKeys.keys.fromRandom = _this.crypto.decode(message.body.value);
          chatKeys.keys.toRandom = _this.crypto.generateRandom();

          let senderHelloMsg = {
            type: 'handshake',
            to: message.from,
            from: message.to,
            body: {
              handshakePhase: 'receiverHello',
              value: _this.crypto.encode(JSON.stringify(chatKeys.keys.toRandom))
            }
          };
          chatKeys.handshakeHistory.receiverHello = _this._filterMessageToHash(senderHelloMsg, undefined, chatKeys.hypertyFrom.messageInfo);
          resolve({message: senderHelloMsg, chatKeys: chatKeys});

          break;
        case 'receiverHello':

          console.log('receiverHello');
          chatKeys.handshakeHistory.receiverHello = _this._filterMessageToHash(message);

          _this.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp).then((value) => {

            //TODO remove later this verification as soon as all the IdP proxy are updated in the example
            let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

            let receiverPublicKey = _this.crypto.decode(encodedpublicKey);
            let premasterSecret = _this.crypto.generatePMS();
            let toRandom = message.body.value;
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = receiverPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;
            console.log('TIAGO receiver hello before decode', message);
            chatKeys.keys.toRandom  = _this.crypto.decode(toRandom);
            console.log('TIAGO receiver hello after decode');
            chatKeys.keys.premasterKey = premasterSecret;

            let concatKey = _this.crypto.concatPMSwithRandoms(premasterSecret, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

            return _this.crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            //generate the master key
          }).then((masterKey) => {
            chatKeys.keys.masterKey = masterKey;

            return _this.crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            //generate the symmetric and hash keys
          }).then((keys) => {

            chatKeys.keys.hypertyToSessionKey = new Uint8Array(keys[0]);
            chatKeys.keys.hypertyFromSessionKey = new Uint8Array(keys[1]);
            chatKeys.keys.hypertyToHashKey = new Uint8Array(keys[2]);
            chatKeys.keys.hypertyFromHashKey = new Uint8Array(keys[3]);
            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            let messageStructure = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate'
              }
            };

            // hash the value and the iv
            filteredMessage = _this._filterMessageToHash(messageStructure, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);
            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, JSON.stringify(filteredMessage));
          }).then((hash) => {
            value.hash = _this.crypto.encode(hash);

            //encrypt the data
            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok', iv);
          }).then((encryptedData) => {
            value.symetricEncryption = _this.crypto.encode(encryptedData);

            return _this.crypto.encryptRSA(chatKeys.hypertyTo.publicKey, chatKeys.keys.premasterKey);

          }).then((encryptedValue) => {

            value.assymetricEncryption = _this.crypto.encode(encryptedValue);

            let messageStructure = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate'
              }
            };

            let messageToHash = _this._filterMessageToHash(messageStructure, chatKeys.keys.premasterKey, chatKeys.hypertyFrom.messageInfo);

            return _this.crypto.signRSA(chatKeys.hypertyFrom.privateKey, JSON.stringify(chatKeys.handshakeHistory) + JSON.stringify(messageToHash));

          }).then(signature => {

            value.signature = _this.crypto.encode(signature);

            let receiverHelloMsg = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate',
                value: btoa(JSON.stringify(value))
              }
            };
            chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(receiverHelloMsg, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);

            resolve({message: receiverHelloMsg, chatKeys: chatKeys});

          }, error => reject(error));

          break;
        case 'senderCertificate':

          console.log('senderCertificate');
          let receivedValue = JSON.parse(atob(message.body.value));

          console.log('TIAGO identity', message.body);
          _this.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp).then((value) => {
            let encryptedPMS = _this.crypto.decode(receivedValue.assymetricEncryption);

            //TODO remove later this verification as soon as all the IdP proxy are updated in the example
            let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

            let senderPublicKey = _this.crypto.decode(encodedpublicKey);
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = senderPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;

            return _this.crypto.decryptRSA(chatKeys.hypertyFrom.privateKey, encryptedPMS);

          }, (error) => {
            console.log(error);
            reject('Error during authentication of identity');

            //obtain the PremasterKey using the private key
          }).then(pms => {

            chatKeys.keys.premasterKey = new Uint8Array(pms);

            let signature = _this.crypto.decode(receivedValue.signature);

            let receivedmsgToHash = _this._filterMessageToHash(message, chatKeys.keys.premasterKey);

            return _this.crypto.verifyRSA(chatKeys.hypertyTo.publicKey, JSON.stringify(chatKeys.handshakeHistory) + JSON.stringify(receivedmsgToHash), signature);

            // validates the signature received
          }).then(signValidationResult => {

            console.log('signature validation result ', signValidationResult);
            let concatKey = _this.crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

            return _this.crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            // generates the master keys from the Premaster key and the randoms
          }).then(masterKey => {
            chatKeys.keys.masterKey = masterKey;

            return _this.crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            // generates the symmetric keys to be used in the symmetric encryption
          }).then(keys => {
            chatKeys.keys.hypertyFromSessionKey = new Uint8Array(keys[0]);
            chatKeys.keys.hypertyToSessionKey = new Uint8Array(keys[1]);
            chatKeys.keys.hypertyFromHashKey = new Uint8Array(keys[2]);
            chatKeys.keys.hypertyToHashKey = new Uint8Array(keys[3]);
            iv = _this.crypto.decode(receivedValue.iv);
            let data = _this.crypto.decode(receivedValue.symetricEncryption);

            return _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv);

          }).then(decryptedData => {
            //console.log('decryptedData', decryptedData);

            chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(message, decryptedData + iv);

            let hashReceived = _this.crypto.decode(receivedValue.hash);

            filteredMessage = _this._filterMessageToHash(message, decryptedData + iv);

            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, JSON.stringify(filteredMessage), hashReceived);

          }).then(verifiedHash  => {

            //console.log('result of hash verification ', verifiedHash);
            let receiverFinishedMessage = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverFinishedMessage'
              }
            };
            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            filteredMessage = _this._filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);

            //console.log('TIAGO: doHandShakePhase verifiedHash');
            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, JSON.stringify(receiverFinishedMessage));
          }).then(hash => {

            value.hash = _this.crypto.encode(hash);
            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!', iv);

          }).then(encryptedValue => {
            value.value = _this.crypto.encode(encryptedValue);
            let receiverFinishedMessage = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverFinishedMessage',
                value: btoa(JSON.stringify(value))
              }
            };

            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);
            chatKeys.authenticated = true;
            resolve({message: receiverFinishedMessage, chatKeys: chatKeys});
          });

          break;
        case 'receiverFinishedMessage':

          console.log('receiverFinishedMessage');
          chatKeys.authenticated = true;

          value = JSON.parse(atob(message.body.value));

          iv = _this.crypto.decode(value.iv);
          let data = _this.crypto.decode(value.value);
          hash = _this.crypto.decode(value.hash);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
            console.log('decryptedData', decryptedData);
            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(message, decryptedData + iv);

            let filteredMessage = _this._filterMessageToHash(message, data + iv);
            _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, JSON.stringify(filteredMessage), hash).then(result => {
              console.log('hash result', result);

              // check if there was an initial message that was blocked and send it
              if (chatKeys.initialMessage) {
                let initialMessage = {
                  type: 'create',
                  to: message.from,
                  from: message.to,
                  body: {
                    value: chatKeys.initialMessage.body.value
                  }
                };

                resolve({message: initialMessage, chatKeys: chatKeys});

                //sends the sessionKey to the subscriber hyperty
              } else {
                _this._sendReporterSessionKey(message, chatKeys).then(value => {
                  resolve(value);
                });
              }
            });
          });

          break;
        case 'reporterSessionKey':

          console.log('reporterSessionKey');

          let valueIVandHash = JSON.parse(atob(message.body.value));
          hash = _this.crypto.decode(valueIVandHash.hash);
          iv = _this.crypto.decode(valueIVandHash.iv);
          let encryptedValue = _this.crypto.decode(valueIVandHash.value);
          let parsedValue;
          let sessionKey;
          let dataObjectURL;
          let receiverAcknowledgeMsg;

          console.log('[IdentityModule reporterSessionKey] - decryptAES: ', chatKeys.keys.hypertyToSessionKey, encryptedValue, iv);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, encryptedValue, iv).then(decryptedValue => {

            parsedValue = JSON.parse(decryptedValue);
            sessionKey = _this.crypto.decode(parsedValue.value);
            dataObjectURL = parsedValue.dataObjectURL;

            let messageToHash = _this._filterMessageToHash(message, decryptedValue + iv);

            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, JSON.stringify(messageToHash), hash);

          }).then(hashResult => {

            //console.log('hash successfully validated ', hashResult);

            _this.dataObjectSessionKeys[dataObjectURL] =  {sessionKey: sessionKey, isToEncrypt: true};

            // TIAGO - persistence issue #147
            _this.storageManager.set('dataObjectSessionKeys', 0, _this.dataObjectSessionKeys);

            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!!', iv);
          }).then(encryptedValue => {

            receiverAcknowledgeMsg = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverAcknowledge'
              }
            };

            value.value = _this.crypto.encode(encryptedValue);
            let messageToHash = _this._filterMessageToHash(receiverAcknowledgeMsg, 'ok!!' + iv, chatKeys.hypertyFrom.messageInfo);

            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, JSON.stringify(messageToHash));
          }).then(hashedMessage => {
            let finalValue = btoa(JSON.stringify({value: value.value, hash: _this.crypto.encode(hashedMessage), iv: value.iv}));

            receiverAcknowledgeMsg.body.value = finalValue;
            resolve({message: receiverAcknowledgeMsg, chatKeys: chatKeys});
          });

          break;
        case 'receiverAcknowledge':

          console.log('receiverAcknowledge');

          let receivedvalueIVandHash = JSON.parse(atob(message.body.value));
          let receivedHash = _this.crypto.decode(receivedvalueIVandHash.hash);
          iv = _this.crypto.decode(receivedvalueIVandHash.iv);
          let receivedEncryptedValue = _this.crypto.decode(receivedvalueIVandHash.value);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, receivedEncryptedValue, iv).then(decryptedValue => {

            let filteredMessage = _this._filterMessageToHash(message, decryptedValue + iv);
            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, JSON.stringify(filteredMessage), receivedHash);
          }).then(hashResult => {
            //console.log('hashResult ', hashResult);

            let callback = chatKeys.callback;

            if (callback) {
              callback('handShakeEnd');
            }
            resolve('handShakeEnd');
          });

          break;
        default:
          reject(message);
      }
    });
  }

  _sendReporterSessionKey(message, chatKeys) {
    let _this = this;
    let sessionKeyBundle = _this.dataObjectSessionKeys[chatKeys.dataObjectURL];
    let reporterSessionKeyMsg;
    let valueToEncrypt;
    let sessionKey;
    let iv;
    let value = {};

    return new Promise(function(resolve, reject) {

      //if there is not yet a session Key, generates a new one
      if (!sessionKeyBundle) {
        sessionKey = _this.crypto.generateRandom();
        _this.dataObjectSessionKeys[chatKeys.dataObjectURL] = {sessionKey: sessionKey, isToEncrypt: true};

        // TIAGO - persistence issue #147
        _this.storageManager.set('dataObjectSessionKeys', 0, _this.dataObjectSessionKeys);
      } else {
        sessionKey = sessionKeyBundle.sessionKey;
      }

      valueToEncrypt = JSON.stringify({value: _this.crypto.encode(sessionKey), dataObjectURL: chatKeys.dataObjectURL});

      iv = _this.crypto.generateIV();
      value.iv = _this.crypto.encode(iv);
      _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, valueToEncrypt, iv).then(encryptedValue => {

        reporterSessionKeyMsg = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'reporterSessionKey',
            value: _this.crypto.encode(encryptedValue)
          }
        };

        let filteredMessage = _this._filterMessageToHash(reporterSessionKeyMsg, valueToEncrypt + iv, chatKeys.hypertyFrom.messageInfo);

        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, JSON.stringify(filteredMessage));
      }).then(hashedMessage => {

        let valueWithHash = btoa(JSON.stringify({value: reporterSessionKeyMsg.body.value, hash: _this.crypto.encode(hashedMessage), iv: value.iv}));

        reporterSessionKeyMsg.body.value = valueWithHash;
        resolve({message: reporterSessionKeyMsg, chatKeys: chatKeys});
      });
    });
  }

  /**
  * returns the reporter associated to the dataObject URL
  * @param   {String}   dataObjectURL         dataObject url
  * @return   {String}  reporter              dataObject url reporter
  */
  _getHypertyFromDataObject(dataObjectURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //TODO remove this logic and move it to a util function

      let splitedURL = dataObjectURL.split('/');
      let finalURL = splitedURL[0] + '//' + splitedURL[2] + '/' + splitedURL[3];
      if (splitedURL.length > 6) {
        finalURL = splitedURL[0] + '//' + splitedURL[2] + '/' + splitedURL[3] + '/' + splitedURL[4];
      }

      // check if is the creator of the hyperty
      let reporterURL = _this.registry.getReporterURLSynchonous(finalURL);

      if (reporterURL) {
        resolve(reporterURL);
      } else {
        // check if there is already an association from an hypertyURL to the dataObject
        let storedReporterURL = _this.dataObjectsIdentity[finalURL];

        if (storedReporterURL) {
          resolve(storedReporterURL);
        } else {
          // check if there is any hyperty that subscribed the dataObjectURL
          let subscriberHyperty = _this.registry.getDataObjectSubscriberHyperty(dataObjectURL);

          if (subscriberHyperty) {
            resolve(subscriberHyperty);
          } else {

            // search in domain registry for the hyperty associated to the dataObject
            // search in case is a subscriber who wants to know the reporter
            _this.registry.discoverDataObjectPerURL(finalURL, splitedURL[2]).then(dataObject => {
              _this.dataObjectsIdentity[finalURL] = dataObject.reporter;
              resolve(dataObject.reporter);
            }, err => {
              reject(err);
            });
          }
        }
      }
    });
  }

  /**
  * filter the messages to hash, by removing some fields not generated by the runtime core
  * @param {Message}  message                     message
  * @param {String}  decryptedValue (Optional)    value from body.value in case it originally comes encrypted
  * @param {JSON}  identity(Optional)    add the hyperty identity associated in case is not added to the initial message
  * @return {Message}  new message filtered
  */
  _filterMessageToHash(message, decryptedValue, identity) {

    return {
      type: message.type,
      from: message.from,
      to: message.to,
      body: {
        identity: identity || message.body.identity,
        value: decryptedValue || message.body.value,
        handshakePhase: message.body.handshakePhase
      }
    };
  }

  /**
  * generates the initial structure for the keys between two users
  * @param {JSON}    message              initial message that triggers the mutual authentication
  * @param {String}  userURL              userURL
  * @param {boolean} receiver(Optional)  indicates if is the sender or the receiver that creates a new chat crypto
  * @return {JSON} newChatCrypto  new JSON structure for the chat crypto
  */
  _newChatCrypto(message, userURL, receiver) {
    let _this = this;

    //check whether is the sender or the receiver to create a new chatCrypto
    //to mantain consistency on the keys if the receiver create a new chatCrypto,
    //then invert the fields
    let from = (receiver) ? message.to : message.from;
    let to = (receiver) ? message.from : message.to;

    let userInfo = _this.getIdentity(userURL);

    //console.log('TIAGO: UserInfo: ', userInfo);
    //console.log('TIAGO: UserInfo.keyPair: ', userInfo.keyPair);

    let newChatCrypto =
      {
        hypertyFrom:
        {
          hyperty: from,
          userID: userInfo.messageInfo.userProfile.username,
          privateKey: userInfo.keyPair.private,
          publicKey: userInfo.keyPair.public,
          assertion: userInfo.assertion,
          messageInfo: userInfo.messageInfo
        },
        hypertyTo:
        {
          hyperty: to,
          userID: undefined,
          publicKey: undefined,
          assertion: undefined
        },
        keys:
        {
          hypertyToSessionKey: undefined,
          hypertyFromSessionKey: undefined,
          hypertyToHashKey: undefined,
          hypertyFromHashKey: undefined,
          toRandom: undefined,
          fromRandom: undefined,
          premasterKey: undefined,
          masterKey: undefined
        },
        handshakeHistory: {
          senderHello: undefined,
          receiverHello: undefined,
          senderCertificate: undefined,
          receiverFinishedMessage: undefined
        },
        initialMessage: (message.body.ignore) ? undefined : message,
        callback: message.callback,
        authenticated: false,
        dataObjectURL: message.dataObjectURL
      };

    return newChatCrypto;
  }
}

export default IdentityModule;
