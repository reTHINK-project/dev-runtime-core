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

/**
*   To process address resolution for p2p connections
*/
class P2PConnectionResolve  {

  constructor(registry) {
    let _this = this;
    _this._registry = registry;
    _this._remoteP2PEntities = {}; // All remote entities and associated runtime url that are reachable with existing p2p connections

  }


  /**
  * Verifies if remote Entity can be reached with a P2P Connection.
  * @param  {URL.URL}        info           object URL
  * @return {HypertyDataObjectInstance}  addressURL     return the Data Object instance registered URL, return undefined otherwise
  */

  checkP2P(msg) {

    if (!msg.hasOwnProperty('to')) {
      // throw Error('The p2p verification was failed');
      return Promise.reject('The p2p verification was failed');
    }

    let scheme = msg.to.split('://')[0];

    let comp = msg.to.split('://')[1].split('/')[2];

    let url;

    if (comp) url = msg.to.substring(0, msg.to.indexOf('/' + comp))
    else url = msg.to;

    let p2p = {};

    if (msg.body.p2p) p2p.p2p = msg.body.p2p;

    if (msg.body.p2pHandler && msg.body.p2pRequester) {
      p2p.p2pHandler = msg.body.p2pHandler;
      p2p.p2pRequester = msg.body.p2pRequester;
      p2p.runtime = msg.body.p2pHandler.split('/p2phandler/')[0];
    }

    switch (scheme) {
      case 'runtime':
        return this.checkP2PRuntime(url, p2p);
        break;
      default:
        return this.checkP2PEntity(url, p2p);
        break;

    }
  }

  /**
  * Verifies if remote Entity (Hyperty or Data Object) can be reached with a P2P Connection.
  * @param  {string}        url           Remote Entity URL to be checked
  * @param  {object}        p2p           p2p information to be used including ´runtime´ with remote Runtime URL, 'p2pHandler' remote P2P Handler Stub URL and p2pRequester with Catalogue URL of P2P Requester to be used
  * @return {promise} registeredEntity     if p2p connection is possible it returns p2p information to be used in the connection, otherwise the promise is rejected
  */

  checkP2PEntity(url, p2p) {
    let _this = this;

    return new Promise((resolve, reject) => {
      let remoteEntity = _this._remoteP2PEntities[url];

      if (remoteEntity) resolve(remoteEntity);
      else if (p2p.runtime) resolve(p2p); // use provided p2p if available in the message body
      else if (p2p.p2p) { // otherwise look on Domain Registry

        console.log('[Registry - checkP2PEntity] - search in Domain Registry: ', url);

        let message = {
          type: 'read',
          from: _this._registry.registryURL,
          to: 'domain://registry.' + _this._registry._domain,
          body: {
            resource: url
          }
        };

        _this._registry._messageBus.postMessage(message, (reply) => {
          console.log('[Registry - checkP2PEntity] Domain Registry reply', reply);
          if ('value' in reply.body) {

            //todo: store retrieved entity
            let resolvedEntity = reply.body.value;

            if (resolvedEntity.hasOwnProperty('p2pHandler')) {
              resolve(resolvedEntity);
            } else {
              reject('[Registry checkP2PEntity] Hyperty found does not support P2P', reply.body.value);
            }

          } else {
            reject('[Registry checkP2PEntity] Hyperty with P2PHandler not found', reply.body.code);
          }
        });
      } else reject('[Registry checkP2PEntity] No P2P Connection available for ', url);
    });
  }

  /**
  * Verifies if remote Runtime can be reached with a P2P Connection.
  * @param  {URL.URL}        runtimeURL           Runtime URL
  * @return {Object}  p2pConnection    return the P2PConnection instance registered URL, return undefined otherwise
  */

  checkP2PRuntime(runtimeURL, p2p) {
    let _this = this;

    let registeredRuntime = {};

    // look on locally stored p2p connections
    return new Promise((resolve, reject) => {
      if (_this._registry.p2pConnectionList[runtimeURL]) {
        resolve({runtime: runtimeURL});
      } else if ( p2p.runtime) {
        registeredRuntime = p2p;
        resolve(registeredRuntime);
      } else reject('[Registry.P2PConnectionResolve.checkP2PRuntime] No P2P Connection found to ', runtimeURL);

    });

  }

  /**
  * Verifies if remote Hyperty can be reached with a P2P Connection.
  * @param  {JSON}        info           object or entity charateristics info
  * @return {addressURL}  addressURL     return the URL if there is any previousy registered URL, return undefined otherwise
  */

  checkP2PHyperty(hypertyURL, p2p) {
    let _this = this;

    return new Promise((resolve, reject) => {
      let hyperty;


      // look on locally stored hyperties

      for (let i in _this._registry.remoteHypertyList) {
        hyperty = _this._registry.remoteHypertyList[i];

        console.log('[Registry - checkP2PHyperty] - for each Hyperty: ', hyperty);

        // todo: change to "hyperty.url" to be aligned with hyperty instance data model spec

        if (hyperty.hypertyID === hypertyURL) {

          if (hyperty.hasOwnProperty('p2pHandler')) {
            resolve(hyperty);
          } else {
            reject('[Registry checkP2PHyperty] Hyperty found does not support P2P', hyperty);
          }
          return;
        }
      }

      if (!hyperty && p2p.runtime) resolve(p2p); // use provided p2p if available in the message body
      else if (!hyperty && p2p.p2p) { // otherwise look on Domain Registry

        console.log('[Registry - checkP2PHyperty] - search in Domain Registry: ', hyperty);

        let message = {
          type: 'read',
          from: _this._registry.registryURL,
          to: 'domain://registry.' + _this._registry._domain,
          body: {
            resource: hypertyURL
          }
        };

        _this._registry._messageBus.postMessage(message, (reply) => {
          console.log('[Registry - checkP2PHyperty] Domain Registry reply', reply);
          if ('value' in reply.body) {

            //todo: store retrieved hyperty
            let resolvedHyperty = reply.body.value;

            _this._registry.remoteHypertyList.push(resolvedHyperty);

            if (resolvedHyperty.hasOwnProperty('p2pHandler')) {
              resolve(resolvedHyperty);
            } else {
              reject('[Registry checkP2PHyperty] Hyperty found does not support P2P', reply.body.value);
            }

          } else {
            reject('[Registry checkP2PHyperty] Hyperty with P2PHandler not found', reply.body.code);
          }
        });
      } else reject('[Registry checkP2PHyperty] No P2P Connection available for ', hypertyURL);
    });
  }

  /**
  * Verifies if remote Data Object can be reached with a P2P Connection.
  * @param  {URL.URL}        DataObjectURL           object URL
  * @return {HypertyDataObjectInstance}  addressURL     return the Data Object instance registered URL, return undefined otherwise
  */

  checkP2PDataObject(url, p2p) {
    let _this = this;

    return new Promise((resolve, reject) => {

      // look on locally stored Remote Data Objects

      let dataobject = _this._registry.remoteDataObjectList.filter((i) => {
        return (_this._registry.remoteDataObjectList[i].url === url);
      });

      if (dataobject.length !== 0 && dataobject[0].p2pRequester) {
        resolve(dataobject[0]);
      } else if (dataobject.length !== 0) {
        reject('[Registry checkP2PDataObject] Data Object found does not support P2P', dataobject[0]);
      } else if (dataobject.length === 0 && p2p.runtime) resolve(p2p); // use provided p2p info if available in the message body
      else if (dataobject.length && p2p.p2p) { // otherwise look on Domain Registry

      // look on Domain Registry

        let message = {
          type: 'read',
          from: _this._registry.registryURL,
          to: 'domain://registry.' + _this._registry._domain,
          body: {
            resource: url
          }
        };

        _this._registry._messageBus.postMessage(message, (reply) => {
          console.log('discover data object per url reply', reply);
          if ('value' in reply.body) {

            //todo: store retrieved hyperty
            let resolvedDataObject = reply.body.value;

            _this._registry.remoteDataObjectList.push(resolvedDataObject);

            if (resolvedDataObject.p2pRequester) {
              resolve(resolvedDataObject);
            } else {
              reject('[Registry checkP2PDataObject] Data Object found does not support P2P', reply.body.value);
            }

          } else {
            reject('[Registry checkP2PDataObject] not found', reply.body.code);
          }
        });
      } else reject('[Registry checkP2PDataObject] no P2P Connection found');
    });
  }

  addRemoteP2PEntity(url, runtime) {
    this._remoteP2PEntities[url] = runtime;
  }

  removeRemoteP2PEntity(url) {
    delete this._remoteP2PEntities[url];
  }

  reconnectP2PRequester(p2pRequester) {
    let _this = this;

    console.log('[P2PConenctionResolve.reconnectP2PRequester] lets try to reconnect P2P Requester Stub: ', p2pRequester);

    return new Promise((resolve, reject) => {

      let remoteRuntime = p2pRequester.runtime;

      let message = {
        type: 'execute',
        from: _this._registry.registryURL,
        to: p2pRequester.url,
        body: {
          method: 'connect',
          params: [p2pRequester.p2pHandler]
        }
      };

      // lets prepare the p2pRequesterSTub reconnect by setting an observer to its status changes

      _this._registry.watchingYou.observe('p2pRequesterStub', (change) => {

        console.log('[P2PConenctionResolve.reconnectP2PRequester] p2pRequesterStubs changed ' + _this._registry.p2pRequesterStub);

        if (change.keypath.split('.')[0] === remoteRuntime && change.name === 'status') {
          switch (change.newValue) {
            case 'live':
              console.log('[P2PConenctionResolve.reconnectP2PRequester] p2pRequester is live ' + _this._registry.p2pRequesterStub[remoteRuntime]);
              resolve(_this._registry.p2pRequesterStub[remoteRuntime].url);
              break;
            case 'failed':
              console.log('[P2PConenctionResolve.reconnectP2PRequester] p2pRequester reconnect failed ' + _this._registry.p2pRequesterStub[remoteRuntime]);
              reject('P2P Requester reconnect failed');
              break;
            default:
          }
        }
      });

      //  stub load
      _this._registry._messageBus.postMessage(message, (reply) => {
        console.log('[P2PConenctionResolve.reconnectP2PRequester] reconnect request reply', reply);
      });
    });
  }

}

export default P2PConnectionResolve;
