let openIDConfiguration;

let googleInfo = {
  clientSecret:          'Xx4rKucb5ZYTaXlcZX9HLfZW',
  clientID:              '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
  redirectURI:           location.origin,
  issuer:                'https://accounts.google.com',
  tokenEndpoint:         'https://www.googleapis.com/oauth2/v4/token?',
  jwksUri:               'https://www.googleapis.com/oauth2/v3/certs?',
  authorisationEndpoint: 'https://accounts.google.com/o/oauth2/auth?',
  userinfo:              'https://www.googleapis.com/oauth2/v3/userinfo?access_token=',
  tokenInfo:             'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
  accessType:            'offline',
  type:                  'code token id_token',
  scope:                 'openid%20email%20profile',
  state:                 'state'
};

//function to parse the query string in the given URL to obatin certain values
function urlParser(url, name) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  let regexS = '[\\#&?]' + name + '=([^&#]*)';
  let regex = new RegExp(regexS);
  let results = regex.exec(url);
  if (results === null)
  return '';
  else
  return results[1];
}

function sendHTTPRequest(method, url) {
  let xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return new Promise(function(resolve,reject) {
    if (xhr) {
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let info = JSON.parse(xhr.responseText);
            resolve(info);
          } else if (xhr.status === 400) {
            reject('There was an error processing the token');
          } else {
            reject('something else other than 200 was returned');
          }
        }
      };
      xhr.send();
    } else {
      reject('CORS not supported');
    }
  });
}

/**
* Function to exchange the code received to the id Token, access token and a refresh token
*
*/
let exchangeCode = (function(code) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'code=' + code + '&client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&redirect_uri=' + i.redirectURI + '&grant_type=authorization_code';

  //let URL = = i.tokenEndpoint + 'client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&refresh_token=' + code + '&grant_type=refresh_token';

  return new Promise(function(resolve, reject) {
    sendHTTPRequest('POST', URL).then(function(info) {
      resolve(info);
    }, function(error) {
      reject(error);
    });

  });
});

/**
* Identity Provider Proxy
*/
let IdpProxy = {

  /**
  * Function to generate an identity Assertion
  * TODO add details of the implementation, and improve implementation
  *
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (contents, origin, hint) => {
    let i = googleInfo;
    let tokenID = contents;
    return new Promise(function(resolve,reject) {
      if (origin !== undefined) {
        sendHTTPRequest('GET', i.tokenInfo + tokenID).then(function(value) {
          let tokenIDJSON = value;
          let encodedContent = btoa(JSON.stringify({tokenID: tokenID, tokenIDJSON: tokenIDJSON}));
          resolve(encodedContent);
        }, function(error) {
          reject(error);
        });

      } else {
        reject('err');
      }
    });
  },

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation, and improve the implementation
  *
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */
  validateAssertion: (assertion, origin) => {
    return new Promise(function(resolve,reject) {
      let i = googleInfo;

      let decodedContent = atob(assertion);
      let content = JSON.parse(decodedContent);
      sendHTTPRequest('GET', i.tokenInfo + content.tokenID).then(function(result) {

        if (JSON.stringify(result) === JSON.stringify(content.tokenIDJSON)) {
          resolve('valid');
        } else {
          reject('invalid');
        }
      }, function(err) {
        reject(err);
      });
    });
  },

  /**
  * Function to obtain an user identity
  * TODO add details of the implementation
  * @return {Promise} returns a promise an URL so the Identity Module can use to obtain an identity
  *
  * @param  {scope}     Scope
  */
  getIdentityAssertion: (contents) => {
    let i = googleInfo;

    //start the login phase
    //TODO later should be defined a better approach
    return new Promise(function(resolve, reject) {
      if (!contents) {
        try {
          if (window) {
            resolve('url');
          }
        } catch (error) {

          let requestUrl = i.authorisationEndpoint + 'scope=' + i.scope + '&client_id=' + i.clientID + '&redirect_uri=' + i.redirectURI + '&response_type=' + i.type + '&state=' + i.state + '&access_type=' + i.accessType;

          reject(requestUrl);
        }

      } else {
        // the request have already been made, so idpPRoxy will exchange the tokens along to the idp, to obtain the information necessary
        let accessToken = urlParser(contents, 'access_token');
        let idToken = urlParser(contents, 'id_token');
        let code = urlParser(contents, 'code');

        exchangeCode(code).then(function(value) {
          let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: value.refresh_token, tokenType: value.token_type};

          //obtain information about the user
          let infoTokenURL = i.userinfo + value.access_token;
          sendHTTPRequest('GET', infoTokenURL).then(function(infoToken) {

            //TODO delete later, and delete the need in the example
            identityBundle.token = infoToken;
            identityBundle.infoToken = infoToken;
            let idTokenURL = i.tokenInfo + value.id_token;

            //obtain information about the user idToken
            sendHTTPRequest('GET', idTokenURL).then(function(idToken) {
              identityBundle.idTokenJSON = idToken;
              resolve(identityBundle);
            }, function(e) {
              reject(e);
            });
          }, function(error) {
            reject(error);
          });
        }, function(err) {
          reject(err);
        });

      }
    });
  }
};

//console.log('hello world from proxy');

//let encodedString = btoa(string);
//console.log('encode ', encodedString);
//let decodedString = atob(encodedString);
//console.log('decode ', decodedString);

/**
* function required so that the web worker can communicate
*
*/
onmessage = function(e) {
  console.log('Message received from main script');
  let data = e.data[1];
  switch (e.data[0]) {
    case 'generate':
      IdpProxy.generateAssertion(data.contents, data.origin, data.usernameHint).then(function(resolve) {
        postMessage(resolve);
      }, function(reject) {
        postMessage(reject);
      });
      console.log('Posting generateAssertion message back to main script');
      break;
    case 'validate':
      IdpProxy.validateAssertion(data.assertion, data.origin).then(function(resolve) {
        postMessage(resolve);
      }, function(reject) {
        postMessage(reject);
      });
      console.log('Posting validateAssertion message back to main script');
      break;
    case 'login':
      IdpProxy.getIdentityAssertion(e.data[1]).then(function(resolve) {
        postMessage(resolve);
      }, function(reject) {
        postMessage(reject);
      });
      console.log('Posting getIdentityAssertion message back to main script');
      break;
    default:
      break;
  }
};
