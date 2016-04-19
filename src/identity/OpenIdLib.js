//import hello from 'hellojs';

/**
*  class to facilitate the operations with the openID connect, through several Identity Providers
*
*/
class OpenIdLib {

  constructor(identityProvider, clientID) {
    let _this = this;
    _this.clientID = clientID;
    _this.identityProvider = identityProvider;

    switch (identityProvider) {
      case 'google':
        let googleInfo = new GoogleInfo();
        _this.info = googleInfo;
        break;
      case 'facebook':
        let facebookInfo = new FacebookInfo();
        _this.info = facebookInfo;
        break;
      case 'windows':
        let microsoftInfo = new MicrosoftInfo();
        _this.info = microsoftInfo;
        break;
      default:
        break;
    }
  }

  openPopup() {
    let _this = this;

    let REDIRECT   =   _this.info.REDIRECT;
    let URL        =   _this.info.URL;

    let acToken;
    let tokenType;
    let expiresIn;

    return new Promise(function(resolve,reject) {

      //function to parse the query string in the given URL to obatin certain values
      function gup(url, name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        let regexS = '[\\#&?]' + name + '=([^&#]*)';
        let regex = new RegExp(regexS);
        let results = regex.exec(url);
        if (results === null)
        return '';
        else
        return results[1];
      }

      /*hello.init({google: '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
                 facebook: '655302667942219',
                 windows: 'asdf197f6ad6-808f-4ddc-b725-3d8fe2660349'});
      hello(_this.identityProvider).login({scope: 'email'}).then(function(token) {
        console.log(token);
        resolve(token.authResponse.access_token);
      }, function(error) {
        console.log('errorValidating ', error);
        reject(error);
      });*/

      let win = window.open(URL, 'openIDrequest', 'width=800, height=600');
      let pollTimer = window.setInterval(function() {
        try {
          //console.log(win.document.URL);

          if (win.closed) {
            reject('Some error occured.');
            clearInterval(pollTimer);
          }

          let redirectURL = document.URL;//window.location.origin;
          if (win.document.URL.indexOf('REDIRECT') !== -1 || win.document.URL.indexOf(redirectURL) !== -1) {
            window.clearInterval(pollTimer);
            let url =   win.document.URL;

            //not working yet. Some problems with the 'POST' method
            if (_this.identityProvider === 'windows') {
              let code = gup(url, 'code');
              let sessionState = gup(url, 'session_state');

              let reqAccessURL = _this.info.TOKENEND + 'redirect_uri=' + _this.info.REDIRECT + '&grant_type=authorization_code' + '&client_id=' + _this.info.CLIENTID + '&code=' + code;

              win.close();

              let req = new XMLHttpRequest();
              req.open('POST',  _this.info.TOKENEND, true);
              req.setRequestHeader('Access-Control-Allow-Origin', '*');

              let data = new FormData();
              data.append('redirect_uri', _this.info.REDIRECT);
              data.append('grant_type', 'authorization_code');
              data.append('client_id', _this.info.CLIENTID);
              data.append('code', code);

              req.onreadystatechange = function(e) {
                if (req.readyState === 4) {
                  if (req.status === 200) {

                    resolve('null');
                  } else if (req.status === 400) {
                    reject('There was an error processing the token');
                  } else {
                    reject('something else other than 200 was returned');
                  }
                }
              };
              req.send(data);

            } else {

              acToken =   gup(url, 'access_token');
              tokenType = gup(url, 'token_type'); //FACEBOOK does not return tokenType in the field
              expiresIn = gup(url, 'expires_in');

              win.close();

              if (_this.identityProvider === 'facebook') {
                _this.info.VALIDURL = 'https://graph.facebook.com/debug_token?input_token=' + acToken + '&access_token=';
              }

              //after receiving the access token, google requires to validate first the token to prevent confused deputy problem.
              resolve(acToken);
            }
          }
        } catch (e) {
          //console.log(e);
        }
      }, 1000);
    });
  }

  validateToken(token) {
    let _this = this;
    let tokenID;
    let VALIDURL = _this.info.VALIDURL;
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open('GET', VALIDURL + token, true);

      req.onreadystatechange = function(e) {
        if (req.readyState === 4) {
          if (req.status === 200) {
            tokenID = JSON.parse(req.responseText);

            resolve({token:token, tokenID: tokenID});
          } else if (req.status === 400) {
            reject('There was an error processing the token');
          } else {
            reject('something else other than 200 was returned');
          }
        }
      };
      req.send();

    });
  }

  //function to exchange the access token with an ID Token containing the information
  getInfoToken(token, tokenID) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      let USERINFURL =   _this.info.USERINFURL;

      let req = new XMLHttpRequest();
      req.open('GET', USERINFURL + token, true);

      req.onreadystatechange = function(e) {
        if (req.readyState === 4) {
          if (req.status === 200) {
            let infoToken = JSON.parse(req.responseText);
            let email = infoToken.email;

            //contruct the identityURL to be defined as in specification
            // model: user://<idpdomain>/<user-identifier>
            let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

            //TODO remove later the 'token' field key
            let identityBundle = {identity: identityURL, token: infoToken, accessToken: token, idToken: tokenID, infoToken: infoToken, idp: 'google'};

            resolve(identityBundle);
          } else if (req.status === 400) {
            reject('There was an error processing the token');
          } else {
            reject('something else other than 200 was returned');
          }
        }
      };
      req.send();
    });
  }
}

//Google works fine with OpenID connect
class GoogleInfo {
  constructor() {
    let _this = this;
    _this.OAUTHURL   =   'https://accounts.google.com/o/oauth2/auth?';
    _this.SCOPE      =   'email%20profile';
    _this.CLIENTID   =   '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com';
    _this.REDIRECT   =    document.URL;
    _this.TYPE       =   'token';
    _this.VALIDURL   =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    _this.USERINFURL =   'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';

    _this.URL        =   _this.OAUTHURL + 'scope=' + _this.SCOPE + '&client_id=' + _this.CLIENTID + '&redirect_uri=' + _this.REDIRECT + '&response_type=' + _this.TYPE;
  }
}

//Facebook only provides the support for Oauth2 Tokens, and do not directly provide support for OpenID connect. So, no 'oficial' ID token can be requested, just information about the user.
class FacebookInfo {
  constructor() {
    let _this = this;
    _this.OAUTHURL   =    'https://www.facebook.com/dialog/oauth?';
    _this.CLIENTID   =    655302667942219;
    _this.REDIRECT   =    document.URL; // 'http://localhost:8080/example/index.html';
    _this.TYPE       =    'token';
    _this.VALIDURL   =    'https://graph.facebook.com/debug_token?input_token='; //must be updated later
    _this.USERINFURL = 'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture&access_token=';
    _this.URL        =    _this.OAUTHURL + 'client_id=' + _this.CLIENTID + '&redirect_uri=' + _this.REDIRECT + '&response_type=' + _this.TYPE;
  }
}


//Microsoft is not yet implemented to obtain the Access token / ID token. Some troubles to request the Access token, since it is required to make a http Post request with the authorization code.
class MicrosoftInfo {
  constructor() {
    let _this = this;
    _this.OAUTHURL   =    'https://login.microsoftonline.com/common/oauth2/authorize?';
    _this.CLIENTID   =    '7e2f3589-4b38-4b1c-a321-c9251de00ef2';
    _this.REDIRECT   =    document.URL;//'http%3A%2F%2Flocalhost%3A8080%2Fexample%2Findex%2Ehtml'
    _this.TYPE       =    'code';

    _this.TOKENEND   =    'https://login.microsoftonline.com/3fa4042c-7c4d-4382-aba8-fc8ec61103a4/oauth2/token';
    _this.AUTHEND    =    'https://login.microsoftonline.com/3fa4042c-7c4d-4382-aba8-fc8ec61103a4/oauth2/authorize?';

    _this.URL        =    _this.AUTHEND + 'response_type=' + _this.TYPE + '&client_id=' +
    _this.CLIENTID ;//+ '&redirect_uri=' + _this.REDIRECT;
  }

}

export default OpenIdLib;
