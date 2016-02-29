/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
import hello from 'hellojs';

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
  * Register a new Identity with an Identity Provider
  */
  registerIdentity() {
    // Body...
  }

  /**
  * In relation with a classical Relying Party: Registration
  */
  registerWithRP() {
    // Body...
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

    let VALIDURL   =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    let USERINFURL =   'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
    let acToken;
    let tokenType;
    let expiresIn;
    let user;
    let tokenID;
    let infoToken;
    let loggedIn = false;

    return new Promise(function(resolve, reject) {

      if (_this.infoToken !== undefined) {
        //TODO verify whether the token is still valid or not.
        return resolve(_this.infoToken);
      }

      //function to validate the access token received during the authentication
      function validateToken(token) {
        let req = new XMLHttpRequest();
        req.open('GET', VALIDURL + token, true);

        req.onreadystatechange = function(e) {
          if (req.readyState == 4) {
            if (req.status == 200) {
              getInfoToken(token);
            } else if (req.status == 400) {
              reject('There was an error processing the token');
            } else {
              reject('something else other than 200 was returned');
            }
          }
        };
        req.send();

      }

      //function to exchange the access token with an ID Token containing the information
      function getInfoToken(token) {
        let req = new XMLHttpRequest();
        req.open('GET', USERINFURL + token, true);

        req.onreadystatechange = function(e) {
          if (req.readyState === 4) {
            if (req.status === 200) {
              infoToken = JSON.parse(req.responseText);
              _this.infoToken = infoToken;
              let email = infoToken.email;

              //contruct the identityURL to be defined as in specification
              // model: user://<idpdomain>/<user-identifier>
              let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

              //TODO remove later the 'token' field key
              let identityBundle = {identity: identityURL, token: infoToken, accessToken: token, idToken: {}, infoToken: infoToken};

              getIDToken(token, identityBundle);
            } else if (req.status === 400) {
              reject('There was an error processing the token');
            } else {
              reject('something else other than 200 was returned');
            }
          }
        };
        req.send();
      }

      function getIDToken(token, identityBundle) {
        let req = new XMLHttpRequest();
        req.open('GET', VALIDURL + token, true);

        req.onreadystatechange = function(e) {
          if (req.readyState === 4) {
            if (req.status === 200) {
              tokenID = JSON.parse(req.responseText);

              identityBundle.idToken = tokenID;
              _this.identities.push(identityBundle);
              resolve(identityBundle.token);

            } else if (req.status === 400) {
              reject('There was an error processing the token');
            } else {
              reject('something else other than 200 was returned');
            }
          }
        };
        req.send();
      }

      hello.init({google: '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com'});
      hello('google').login({scope: 'email'}).then(function(token) {

        validateToken(token.authResponse.access_token);
      }, function(error) {
        console.log('errorValidating ', error);
        reject(error);
      });

    });
  }

  /**
  * In relation with a Hyperty Instance: Associate identity
  */
  setHypertyIdentity() {
    // Body...
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
    // Body...
  }

  /**
  * OTHER USER'S IDENTITY
  */

  /**
  * Function to validate an identity assertion generated previously.
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion) {
    // Body...
  }

  /**
  * Trust level evaluation of a received IdAssertion
  * @param  {DOMString} assertion assertion
  */
  getAssertionTrustLevel(assertion) {
    // Body...
  }

}

export default IdentityModule;
