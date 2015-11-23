/**
* IdentityModule
*
* Initial specification: D4.1
*
* The IdentityModule is a component managing user Identity. It downloads, instantiates
* and manage Identity Provider Proxy (IdP) for its own user identity or for external
* user identity verification.
*
*/
class IdentityModule {

  /**
  * USER'S OWN IDENTITY
  */
  constructor() {

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
  * In relation with a classical Relying Party: Login
  * @return {Promise}          Promise          IDToken
  */
  loginWithRP() {

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

    */
    let VALIDURL   =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    let USERINFURL =   'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
    let OAUTHURL   =   'https://accounts.google.com/o/oauth2/auth?';
    let SCOPE      =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    let CLIENTID   =   '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com';
    let REDIRECT   =    'http://127.0.0.1:8080/';

    //let REDIRECT   =   document.URL.substring(0, document.URL.length - 1); //remove the '#' character
    let LOGOUT     =   'http://accounts.google.com/Logout';
    let TYPE       =   'token';
    let _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
    let acToken;
    let tokenType;
    let expiresIn;
    let user;
    let tokenID;
    let loggedIn = false;

    //function to parse the query string in the given URL to obatin certain values
    function gup(url, name) {
      name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      let regexS = '[\\#&]' + name + '=([^&#]*)';
      let regex = new RegExp(regexS);
      let results = regex.exec(url);
      if (results === null)
      return '';
      else
      return results[1];
    }

    return new Promise(function(resolve, reject) {

      //function to exchange the access token with an ID Token containing the information
      function getIDToken(token) {
        let req = new XMLHttpRequest();
        req.open('GET', USERINFURL + token, true);

        req.onreadystatechange = function(e) {
          if (req.readyState == 4) {
            if (req.status == 200) {
              //console.log('getUserInfo ', JSON.parse(req.responseText));
              tokenID = JSON.parse(req.responseText);
              resolve(tokenID);
            } else if (req.status == 400) {
              reject('There was an error processing the token');
            } else {
              reject('something else other than 200 was returned');
            }
          }
        };
        req.send();
      }

      // Body...
      //this will open a window with the URL which will open a page sent by google for the user to insert the credentials
      // when the google validates the credentials then send a access token
      let win = window.open(_url, 'openIDrequest', 'width=800, height=600');
      let pollTimer   =   window.setInterval(function() {
        try {
          //console.log(win.document.URL);
          if (win.document.URL.indexOf(REDIRECT) != -1) {
            window.clearInterval(pollTimer);
            let url =   win.document.URL;
            acToken =   gup(url, 'access_token');
            tokenType = gup(url, 'token_type');
            expiresIn = gup(url, 'expires_in');
            win.close();

            //after receiving the access token, and before exchange the access token for a ID token, google requires
            // to validate first the token.
            getIDToken(acToken);

          }
        } catch (e) {
          //console.log(e);
        }
      }, 500);
    });
  }

  /**
  * In relation with a Hyperty Instance: Associate identity
  */
  setHypertyIdentity() {
    // Body...
  }

  /**
  * Generates an Identity Assertion for a call session
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
  * Verification of a received IdAssertion validity
  * @param  {DOMString} assertion assertion
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
