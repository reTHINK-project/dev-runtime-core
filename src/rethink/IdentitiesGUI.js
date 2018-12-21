// jshint browser:true, jquery: true
import { deepClone } from '../utils/utils';

class IdentitiesGUI {

  constructor(guiURL, idmURL, messageBus) {
    //if (!identityModule) throw Error('Identity Module not set!');
    if (!messageBus) throw Error('Message Bus not set!');
    let _this = this;
    _this._guiURL = guiURL;
    _this._idmURL = idmURL;
    _this._messageBus = messageBus;


    _this._messageBus.addListener(guiURL, msg => {
      let funcName = msg.body.method;
      console.log('[IdentitiesGUI.listener] received msg: ' + msg);

      if (funcName === 'openPopup') {
        let urlreceived = msg.body.params.urlreceived;

        _this._openPopup(urlreceived).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          _this._messageBus.postMessage(replyMsg);
        });
        return;
      }
    });
  }

  callIdentityModuleFunc(methodName, parameters) {
    let _this = this;

    return new Promise((resolve, reject) => {
      const message = {
        type: 'execute', to: _this._idmURL, from: _this._guiURL,
        body: { resource: 'identity', method: methodName, params: parameters }
      };

      this._messageBus.postMessage(message, (res) => {

        if (res.body.code < 299) {
          let result = res.body.value;
          resolve(result);
        } else {
          resolve(res.body);
        }
      });

    });
  }

  _openPopup(urlreceived) {

    return new Promise((resolve, reject) => {
      console.log('[IdentitiesGUI._openPopup] url: ' + urlreceived);
      function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
          end = new Date().getTime();
        }
      }

      let win;
      if (!urlreceived) {
        win = window.open('', 'openIDrequest', 'location=1,status=1');
        this.win = win;
        resolve();
      } else {
        if (!win) {
          win = window.open('', 'openIDrequest', 'location=1,status=1');
          this.win = win;
        }

        wait(1000);
        win = this.win;
        win.location.href = urlreceived;
      }

//      let win = window.open(urlreceived, 'openIDrequest', 'width=800, height=600');
      if (window.cordova) {
        win.addEventListener('loadstart', function (e) {
          let url = e.url;
          let code = /\&code=(.+)$/.exec(url);
          let error = /\&error=(.+)$/.exec(url);

          if (code || error) {
            win.close();
            return resolve(url);
          } else {
            return reject('openPopup error 1 - should not happen');
          }
        });
      } else {
        let pollTimer = setInterval(function () {
          try {
            if (win.closed) {
//              return reject('Some error occured when trying to get identity.');
              clearInterval(pollTimer);
            }

//            if (win.document.URL.indexOf('id_token') !== -1 || win.document.URL.indexOf(location.origin) !== -1) {
            if ( win.document.URL.indexOf(location.origin) !== -1) {
                window.clearInterval(pollTimer);
              let url = win.document.URL;

//              win.close();
//              return resolve(url);

              resolve(url);
              return win.close();
            }
          } catch (e) {
            //return reject('openPopup error 2 - should not happen');
            //console.log(e);
          }
        }, 500);
      }
    });
  }

  authorise(idp, resource) {


    return this._openPopup()
      .then((res) => {
        const data = { scope: resource, idpDomain: idp };
        return this.callIdentityModuleFunc('getAccessTokenAuthorisationEndpoint', data);
      })
      .then((value) => {
        console.log('[IdentitiesGUI.authorise] receivedURL from idp Proxy: ' + value);

        return this._openPopup(value);
      }).then((result) => {

        console.log('[IdentitiesGUI.authorise.openPopup.result]', result);

        // resource as array


        const data = { resources: [resource], idpDomain: idp, login: result };
        return this.callIdentityModuleFunc('getAccessToken', data);
      }).then((result) => {

        if (result.hasOwnProperty('code') && result.code > 299) {
          console.error('[IdentitiesGUI.authorise.getAccessToken] error', result);
          return (result);

        } else {
          console.log('[IdentitiesGUI.authorise.getAccessToken.result]', result);
          return this.callIdentityModuleFunc('addAccessToken', result);
        }

      }).then((value) => {
//        this._drawer.open = false;
        return value;
      });

  }

  unauthorise(idp, resource) {

    const data = { resources: [resource], domain: idp };

    return this.callIdentityModuleFunc('unauthorise', deepClone(data))
      .then((result) => {
        console.log('[IdentitiesGUI.unauthorise] result: ' + result);

        return result;
      });

  }

  reauthorise(url, idp, resource) {


    return this._openPopup(url).then((result) => {

        console.log('[IdentitiesGUI.reauthorise.openPopup.result]', result);

        // resource as array


        const data = { resources: [resource], idpDomain: idp, login: result };
        return this.callIdentityModuleFunc('getAccessToken', data);
      }).then((result) => {

        if (result.hasOwnProperty('code') && result.code > 299) {
          console.error('[IdentitiesGUI.authorise.getAccessToken] error', result);
          return (result);

        } else {
          console.log('[IdentitiesGUI.authorise.getAccessToken.result]', result);
          return this.callIdentityModuleFunc('addAccessToken', result);
        }

      }).then((value) => {
//        this._drawer.open = false;
        return value;
      });

  }

  loginWithIDP(idp) {

    let _publicKey;

    return this._openPopup()
      .then((result) => {
        return this.callIdentityModuleFunc('getMyPublicKey', {});
      }).then((publicKey) => {
        _publicKey = publicKey;
        const data = { contents: publicKey, origin: 'origin', usernameHint: undefined, idpDomain: idp };
        return this.callIdentityModuleFunc('sendGenerateMessage', data);
      })
      .then((value) => {

        console.log('[IdentitiesGUI.loginWithIDP] received reply to request for Login URL from idp Proxy: ' + value + '...');

        if (value.hasOwnProperty('description') && value.description.hasOwnProperty('loginUrl')) {
          let url = value.description.loginUrl;
          let finalURL;

          //check if the receivedURL contains the redirect field and replace it
          if (url.indexOf('redirect_uri') !== -1) {
            let firstPart = url.substring(0, url.indexOf('redirect_uri'));
            let secondAuxPart = url.substring(url.indexOf('redirect_uri'), url.length);

            let secondPart = secondAuxPart.substring(secondAuxPart.indexOf('&'), url.length);

            //check if the reddirect field is the last field of the URL
            if (secondPart.indexOf('&') !== -1) {
              finalURL = firstPart + 'redirect_uri=' + location.origin + secondPart;
            } else {
              finalURL = firstPart + 'redirect_uri=' + location.origin;
            }
          }

          this.resultURL = finalURL || url;

          console.log('[IdentitiesGUI.openPopup]', this.resultURL);
          return this._openPopup(this.resultURL);
        }


      }).then((identity) => {

        console.log('[IdentitiesGUI.loginWithIDP] identity', identity);

        const data = { contents: _publicKey, origin: 'origin', usernameHint: identity, idpDomain: idp };
        return this.callIdentityModuleFunc('sendGenerateMessage', data);
      }).then((result) => {

        console.log('[IdentitiesGUI.loginWithIDP] sendGenerateMessage.result', result);
        return this.callIdentityModuleFunc('addAssertion', result);
      }).then((value) => {

//        this._drawer.open = false;
        const userURL = { type: 'identity', value: value.userProfile.userURL };
        // const userIdentity = {type: 'identity', value: value.userProfile};

        console.log('[IdentitiesGUI.loginWithIDP] final identity ', value);
        //      this._alreadyLogin = true;
        return userURL;
        // return userIdentity;
      });

  }
  logOut() {
    let _this = this;
    console.log('[IdentitiesGUI.logOut]');
    return new Promise((resolve, reject) => {
      //      this._alreadyLogin = false;

      resolve(true);
    });
  }
}

export default IdentitiesGUI;
