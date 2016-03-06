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
        resolve('generate ' + contents + hint);
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
      if (origin !== undefined) {
        resolve('resolve validate ' + assertion + origin);
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
    return new Promise(function(resolve, reject) {
      try {
        if (window) {
          resolve('url');
        }
      } catch (error) {
        reject('url');
      }

    });
  }
};

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
      IdpProxy.validateAssertion('asdf', 'fdsa', 'hint').then(function(resolve) {
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
