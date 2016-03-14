function DB() {
  this.store = {};
}
DB.prototype = {
  put: function(key, value) {
    this.store[key] = value;
    return 'success';
  },
  get: function(key) {
    let value = this.store[key];
    return value;
  }
};

//initialise the db
let db = new DB('idpkeystore', 'keys');

//generate a RSA-OAEP key pair
crypto.subtle.generateKey(
  {
    name: 'ECDSA',
    namedCurve: 'P-256' //can be "P-256", "P-384", or "P-521"
  },
  false, //whether the key is extractable (i.e. can be used in exportKey)
  ['sign', 'verify'] //can be any combination of "sign" and "verify"
)
.then(function(key) {
  //returns a keypair object
  console.log(key);
  db.put('keypair', key);
})
.catch(function(err) {
  console.error(err);
});

let utf8 = s => new TextEncoder('utf-8').encode(s);

/**
* Identity Provider Proxy
*/
let IdpProxy = {

  /**
  * Function to generate an identity Assertion
  * TODO add details of the implementation
  *
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (contents, origin, hint) => {
    return new Promise(function(resolve,reject) {
      if (origin !== undefined) {
        let key = db.get('keypair');
        crypto.subtle.sign(
          {
            name: 'ECDSA',
            hash: {name: 'SHA-256'} //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          key.privateKey, //from generateKey or importKey above
          utf8(contents) //ArrayBuffer of data you want to encrypt
        ).then(function(encrypted) {
          //returns an ArrayBuffer containing the encrypted data
          console.log(new Uint8Array(encrypted));

          resolve([encrypted,contents]);
        }).catch(function(err) {
          console.log('err', err);
          reject(err);
        });
      } else {
        reject('err');
      }
    });
  },

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation
  *
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */
  validateAssertion: (assertion, origin) => {
    return new Promise(function(resolve,reject) {
      let key = db.get('keypair');
      if (origin !== undefined) {

        crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: {name: 'SHA-256'} //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        key.publicKey, //from generateKey or importKey above
        assertion[0], //ArrayBuffer of the signature
        utf8(assertion[1]) //ArrayBuffer of the data
    )
    .then(function(isvalid) {
      //returns a boolean on whether the signature is true or not
      console.log(isvalid);
      resolve(isvalid);
    }).catch(function(err) {
      console.error(err);
      reject(err);
    });
      } else {
        reject('err');
      }
    });
  },

  /**
  * Function to obtain an user identity
  * TODO add details of the implementation
  * @return {Promise} returns a promise an URL so the Identity Module can use to obtain an identity
  *
  * @param  {scope}     Scope
  */
  getIdentityAssertion: (scope) => {
    let _this = this;
    return new Promise(function(resolve, reject) {
      try {
        if (window) {
          resolve('url');
        }
      } catch (error) {

        //construction of the URL to be received by the identity module
        _this.OAUTHURL   =   'https://accounts.google.com/o/oauth2/auth?';
        _this.SCOPE      =   'openid%20email%20profile';
        _this.CLIENTID   =   '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com';
        _this.REDIRECT   =    'http://localhost:8080/example/index.html';//document.URL;
        _this.TYPE       =   'id_token token';
        _this.VALIDURL   =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
        _this.USERINFURL =   'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';

        _this.URL        =   _this.OAUTHURL + 'scope=' + _this.SCOPE + '&client_id=' + _this.CLIENTID + '&redirect_uri=' + _this.REDIRECT + '&response_type=' + _this.TYPE;
        reject(URL);
      }

    });
  }
};

let string = 'hello world';

let encodedString = btoa(string);
console.log('encode ', encodedString);

let decodedString = atob(encodedString);

console.log('decode ', decodedString);

/**
* function required so that the web worker can communicate
*
*/
onmessage = function(e) {
  console.log('Message received from main script');
  switch (e.data[0]) {
    case 'generate':
      IdpProxy.generateAssertion('asdf', 'fdsa', 'hint').then(function(resolve) {
        postMessage(resolve);
      }, function(reject) {
        postMessage(reject);
      });
      console.log('Posting generateAssertion message back to main script');
      break;
    case 'validate':
      let data = e.data[1];
      IdpProxy.validateAssertion(data.assertion, data.origin).then(function(resolve) {
        postMessage(resolve);
      }, function(reject) {
        postMessage(reject);
      });
      console.log('Posting validateAssertion message back to main script');
      break;
    case 'obtain':
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
