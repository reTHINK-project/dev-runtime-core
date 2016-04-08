import OpenIdLib from './OpenIdLib';
import {getUserURLFromEmail} from '../utils/utils.js';

import IdpProxyStub from '../protostub/IdpProxyStub';

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
  constructor() {
    let _this = this;

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
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
  * @return {Array<Identities>}         Array         Identities
  */
  getIdentities() {
    let _this = this;
    return _this.identities;
  }

  /**
  * Function to request an ID Token from a user. If no token exists, the Identity Module
  * will try to obtain one from an Identity Provider, and the user will be asked to authenticate
  *  towards the Identity Provider.
  * The function returns a promise with a token containing the user information.
  *
  * @param  {Identifier}      identifier      identifier
  * @param  {Scope}           scope           scope
  * @return {Promise}         Promise         IDToken containing the user information
  */
  loginWithRP(identifier, scope) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this.getIdentityAssertion().then(function(value) {
        console.log('loginWithRP');
        resolve(value);
      }, function(err) {
        console.log('loginWithRP err');
        reject(err);
      });
    });
    /*
      When calling this function, if everything is fine, a small pop-up will open requesting a login with a google account. After the login is made, the pop-up will close and the function will return the ID token.
      This function was tested with the URL: http://127.0.0.1:8080/ and with the same redirect URI

    	In case the redirect URI is not accepted or is required to add others redirect URIs, a little information is provided to fix the problem:

    	So that an application can use Google's OAuth 2.0 authentication system for user login,
    	first is required to set up a project in the Google Developers Console to obtain OAuth 2.0 credentials and set a redirect URI.
    	A test account was created to set the project in the Google Developers Console to obtain OAuth 2.0 credentials,	with the following credentials:
	        	username: openidtest10@gmail.com
	          password: testOpenID10

    	To add more URI's, follow the steps:
    	1º choose the project ( can be the My OpenID Project)	 from  https://console.developers.google.com/projectselector/apis/credentials using the credentials provided above.
    	2º Open The Client Web 1 listed in OAuth 2.0 Client ID's
    	3º Add the URI  in the authorized redirect URI section.
      4º change the REDIRECT parameter bellow with the pretended URI

      identityModule._hello.init({google: "808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com"});
      identityModule._hello("google").login();

    */
    /*let infoToken;

    return new Promise(function(resolve, reject) {

      if (_this.infoToken !== undefined) {
        //TODO verify whether the token is still valid or not.
        return resolve(_this.infoToken);
      } else {
        let googleOpenID = new OpenIdLib('google', '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com');

        googleOpenID.openPopup().then(function(token) {
          googleOpenID.validateToken(token).then(function(token) {
            googleOpenID.getInfoToken(token.token, token.tokenID).then(function(identityBundle) {
              _this.identities.push(identityBundle);
              infoToken = identityBundle.infoToken;
              _this.infoToken = infoToken;
              resolve(infoToken);
            }, function(error) {
              reject(error);
            });
          }, function(error) {
            reject(error);
          });
        }, function(error) {
          reject(error);
        });
      }

    });*/
  }

  /**
  *
  * FUNCTION TO OBTAIN IDENTITY
  *
  */
  obtainIdentity(identityProvider) {
    let _this = this;

    let identities = _this.identities;

    if(!identities) {
      getIdentityAssertion().then(function(value) {

      });
    } else {

    }
  }

  /**
  * Obtain an Identity Assertion
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identifier, scope) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      if (_this.infoToken !== undefined) {
        //TODO verify whether the token is still valid or not.
        return resolve(_this.infoToken);
      } else {

        let message = {type:'EXECUTE', to: 'domain://google.com', from: 'domain://localhost/id-module', body: {resource: 'identity', method: 'login'}};
        _this._messageBus.postMessage(message, (result) => {

          //Open a window with the URL received by the proxy
          //TODO later swap any existing redirectURI in the url, for a specific one in the idModule
          let win = window.open(result.body.value, 'openIDrequest', 'width=800, height=600');
          let pollTimer = setInterval(function() {
            try {

              if (win.closed) {
                reject('Some error occured.');
                clearInterval(pollTimer);
              }
              if (win.document.URL.indexOf('REDIRECT') !== -1 || win.document.URL.indexOf(location.origin) !== -1) {
                window.clearInterval(pollTimer);
                let url =   win.document.URL;

                win.close();

                message = {type:'EXECUTE', to: 'domain://google.com', from: 'domain://localhost/id-module', body: {resource: 'identity', method: 'login',
                       params: url}};

                _this._messageBus.postMessage(message, (res) => {
                  let result = res.body.value;
                  result.identity = getUserURLFromEmail(result.idTokenJSON.email);
                  result.idp = 'google';
                  _this.identities.push(result);

                  //TODO improve later
                  _this.infoToken = result.infoToken;
                  resolve(result.infoToken);
                });

                //
                //resolve(url);
              }
            } catch (e) {
              //console.log(e);
            }
          }, 500);
        });
      }
    });
  }

  /**
  * Generates an Identity Assertion
  *
  * @param  {DOMString} contents     contents
  * @param  {DOMString} origin       origin
  * @param  {DOMString} usernameHint usernameHint
  * @return {IdAssertion}              IdAssertion
  */
  generateAssertion(contents, origin, usernameHint) {
    let _this = this;

    let message = {type:'EXECUTE', to: 'domain://google.com', from: 'domain://localhost/id-module', body: {resource: 'identity', method: 'generateAssertion',
           params: {contents: contents, origin: origin, usernameHint: usernameHint}}};

    return new Promise(function(resolve,reject) {
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
  * OTHER USER'S IDENTITY
  */

  /**
  * Function to validate an identity assertion generated previously.
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @param  {DOMString} origin       origin
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion, origin) {
    let _this = this;

    let message = {type:'EXECUTE', to: 'domain://google.com', from: 'domain://localhost/id-module', body: {resource: 'identity', method: 'validateAssertion',
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

}

export default IdentityModule;
