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

import {divideURL, convertToUserURL} from '../utils/utils';
import GraphConnector from '../graphconnector/GraphConnector';


/**
* Core Discovery interface
* Class to allow applications to search for hyperties and DataObjects using the message bus
*/
class CoreDiscovery {

  /**
  * To initialise the Discovery, which will provide the support for hyperties to
  * query users registered in outside the internal core.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {RuntimeURL}          runtimeURL            runtimeURL
  * @param  {graphConnector}    graphConnector
  */
  constructor(runtimeURL, msgBus, graphConnector, runtimeFactory, registry) {
    if (!runtimeFactory) throw Error('The catalogue needs the runtimeFactory');

    let _this = this;
    this._messageBus = msgBus;
    _this.graphConnector = graphConnector;
    _this.httpRequest = runtimeFactory.createHttpRequest();
    _this.domain = divideURL(runtimeURL).domain;
    _this.discoveryURL = runtimeURL + '/discovery/';
    _this.registry = registry;

    _this.messageBus.addListener(_this.discoveryURL, (msg) => {

        _this.discoveryManager(msg).then(result =>{

          //FLOW-OUT: message response
          _this.messageBus.postMessage({
            id: msg.id,
            type: 'response',
            from: msg.to,
            to: msg.from,
            body: {
              code: 200,
              value: result
            }
          });
        })
        .catch(function(err) {

          //FLOW-OUT: error message response
          _this.messageBus.postMessage({
            id: msg.id,
            type: 'response',
            from: msg.to,
            to: msg.from,
            body: {
              code: 404,
              description: "Not Found"
            }
          });
        });
    });
  }

  /**
   * Returns the MessageBus.
   */
  get messageBus() {
    return this._messageBus;
  }

  /**
   * Sets the MessageBus.
   * @param {MessageBus}           messageBus    The Message Bus.
   */
  set messageBus(messageBus) {
    this._messageBus = messageBus;
  }

  /* function to decide what discovery method to call and later return the response msg  */
  discoveryManager(msg){
    let _this = this;
    let domain = divideURL(msg.from).domain;
    let atributes = msg.body.resource.split('/').filter(Boolean);
    let resources = [];
    let dataSchemes = [];

    console.log('[CoreDiscovery.discoveryManager] received: ', msg);

    if(msg.body.criteria){
      if(msg.body.criteria.resources)
        resources = msg.body.criteria.resources;
      if(msg.body.criteria.dataSchemes)
        dataSchemes = msg.body.criteria.dataSchemes;
    }

    switch (atributes[1]) {
      case 'user':
        if(atributes[0] == 'hyperty')
          return _this.discoverHyperties(msg.body.resource.split('user/')[1], dataSchemes, resources, msg.body.criteria.domain);
        else
          return _this.discoverDataObjects(msg.body.resource.split('user/')[1], dataSchemes, resources, msg.body.criteria.domain);
        break;
      case 'url':
        if(atributes[0] == 'hyperty')
          return _this.discoverHypertyPerURL(msg.body.resource.split('url/')[1], msg.body.criteria.domain);
        else
          return _this.discoverDataObjectPerURL(msg.body.resource.split('url/')[1], msg.body.criteria.domain);
        break;
      case 'name':
        return _this.discoverDataObjectsPerName(msg.body.resource.split('name/')[1], dataSchemes, resources, msg.body.criteria.domain);
        break;
      case 'reporter':
        return _this.discoverDataObjectsPerReporter(msg.body.resource.split('reporter/')[1], dataSchemes, resources, msg.body.criteria.domain);
        break;
      case 'guid':
        if(atributes[0] == 'hyperty')
          return _this.discoverHypertiesPerGUID(msg.body.resource.split('user-guid://')[1], dataSchemes, resources);
        else
          return _this.discoverDataObjectsPerGUID(msg.body.resource.split('user-guid://')[1], dataSchemes, resources);
        break;
      case 'userprofile':
        if(atributes[0] == 'hyperty')
          return _this.discoverHypertiesPerUserProfileData(msg.body.resource.split('userprofile/')[1], dataSchemes, resources);
        else
          return _this.discoverDataObjectsPerUserProfileData(msg.body.resource.split('userprofile/')[1], dataSchemes, resources);
        break;
    }
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some user identifier (eg email, name ...)
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    dataSchemes (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerUserProfileData(userIdentifier, dataSchemes, resources) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //translate user identifier (e.g. email, name...) into the associated GUIDs
       _this.discoverGUIDPerUserIdentifier(userIdentifier)
       .then(function(guids){

         let hypertiesPromises = guids.map(function(guid) {

         return new Promise(function(resolve, reject) {
             _this.discoverHypertiesPerGUID(guid, dataSchemes, resources)
             .then(function(hyperties){
               resolve(hyperties);
             })
             .catch(function(err){
               resolve([]);
             });
          });
        });

        Promise.all(hypertiesPromises)
        .then(function(hypertiesResult) {

          let hyperties = [].concat.apply([], hypertiesResult);

          if(hyperties.length === 0) {
            return reject('No hyperties were found');
          }

          resolve(hyperties);
        });
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  }

  /**
  * Advanced Search for DataObjects registered in domain registry associated with some user identifier (eg email, name ...)
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    dataSchemes (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverDataObjectsPerUserProfileData(userIdentifier, dataSchemes, resources) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //translate user identifier (e.g. email, name...) into the associated GUIDs
       _this.discoverGUIDPerUserIdentifier(userIdentifier)
       .then(function(guids){

         let dataObjectsPromises = guids.map(function(guid) {

         return new Promise(function(resolve, reject) {
             _this.discoverDataObjectsPerGUID(guid, dataSchemes, resources)
             .then(function(dataObjects){
               resolve(dataObjects);
             })
             .catch(function(err){
               resolve([]);
             });
          });
        });

        Promise.all(dataObjectsPromises)
        .then(function(dataObjectsResult) {

          let dataObjects = [].concat.apply([], dataObjectsResult);

          if(dataObjects.length === 0) {
            return reject('No dataObjects were found');
          }

          resolve(dataObjects);
        });
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some GUID
  * @param  {String}             guid
  * @param  {Array<string>}    dataSchemes (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerGUID(guid, dataSchemes, resources) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //translate GUID into the user IDs to query the domain registry
      _this.discoverUserIdsPerGUID(guid)
      .then(function(uids){

        //translate user IDs into the associated hyperties registered in some domain
        let hypertiesPromises = uids.map(function(uid) {
          return new Promise(function(resolve, reject) {
            _this.discoverHyperties(uid.uID, dataSchemes, resources, uid.domain)
            .then(function(hyperties){
              resolve(hyperties);
            })
            .catch(function(err){
              resolve([]);
            });
          });
        });

        Promise.all(hypertiesPromises)
        .then(function(hypertiesResult) {

          let hyperties = [].concat.apply([], hypertiesResult);

          if(hyperties.length === 0) {
            return reject('No hyperties were found');
          }

          console.log('Hyperties : ', hyperties);
          resolve(hyperties);
        });

      })
      .catch(function(err){
        return reject(err);
      });
    });
  }

  /**
  * Advanced Search for DataObjects registered in domain registry associated with some GUID
  * @param  {String}             guid
  * @param  {Array<string>}    dataSchemes (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverDataObjectsPerGUID(guid, dataSchemes, resources) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //translate GUID into the user IDs to query the domain registry
      _this.discoverUserIdsPerGUID(guid)
      .then(function(uids){

        //translate user IDs into the associated dataObjects registered in some domain
        let dataObjectPromises = uids.map(function(uid) {
          return new Promise(function(resolve, reject) {
            _this.discoverDataObjects(uid.uID, dataSchemes, resources, uid.domain)
            .then(function(dataObjects){
              resolve(dataObjects);
            })
            .catch(function(err){
              resolve([]);
            });
          });
        });

        Promise.all(dataObjectPromises)
        .then(function(dataObjectsResult) {

         let dataObjects = [].concat.apply([], dataObjectsResult);

          if(dataObjects.length === 0) {
            return reject('No dataObjects were found');
          }

          console.log('DataObjects : ', dataObjects);
          resolve(dataObjects);
        });

      })
      .catch(function(err){
        return reject(err);
      });
    });
  }

  /** Advanced Search for Hyperties registered in domain registry and associated with some user ID
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    dataSchemes (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverHyperties(user, dataSchemes, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: 'domain://registry.' + activeDomain + '/',
      body: {

      }
    };

    if(user.indexOf("user://") > -1)
      msg.body.resource = user;
    else
      msg.body.resource = '/hyperty/idp-identifier/' + user;

    if(dataSchemes.length > 0){
      if(!msg.body.criteria)
        msg.body.criteria = {};
      msg.body.criteria.dataSchemes = dataSchemes;
    }

    if(resources.length > 0){
      if(!msg.body.criteria)
        msg.body.criteria = {};
      msg.body.criteria.resources = resources;
    }

    return new Promise(function(resolve, reject) {
      console.log("[CoreDiscovery.discoverHyperties] sending msg ", msg);

        _this.messageBus.postMessage(msg, (reply) => {

          console.log("[CoreDiscovery.discoverHyperties] rcved reply ", reply);

          if (reply.body.code === 200) {
            let hyperties = reply.body.value;

            let finalHyperties = [];
            for (var key in hyperties) finalHyperties.push(hyperties[key]);

            if (finalHyperties.length > 0) {
              console.log("[CoreDiscovery.discoverHyperties] Hyperties Found: ", finalHyperties);
              resolve(finalHyperties);
            } else return reject('No Hyperty was found');
          } else return reject('No Hyperty was found');

          /*_this.registry.isLegacy(user).then((legacy) => {
              if (legacy) resolve([{hypertyID: user }])
              else return reject('No Hyperty was found');
          });*/
      });
    });
  }

  /** Advanced Search for DataObjects registered in domain registry and associated with some user ID
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    dataSchemes (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjects(user, dataSchemes, resources, domain){
    let _this = this;
    let activeDomain;
    let dataObjectsArray = [];

    activeDomain = (!domain) ? _this.domain : domain;

    return new Promise(function(resolve, reject) {

      //translate user identifier (e.g. email, name...) into the associated hyperties
      _this.discoverHyperties(user, [], [], activeDomain)
      .then(function(hyperties){

        let finalHyperties = [];
        for (var key in hyperties) finalHyperties.push(hyperties[key]);

        //translate hyperties URLs into the associated dataObjects registered in some domain
        let dataObjectsPromises = finalHyperties.map(function(hyperty) {
          return new Promise(function(resolve, reject) {
            _this.discoverDataObjectsPerReporter(hyperty.hypertyID, dataSchemes, resources, activeDomain)
            .then(function(dataObject){
              resolve(dataObject);
            })
            .catch(function(err){
              resolve([]);
            });
          });
        });

        Promise.all(dataObjectsPromises)
        .then(function(dataObjectsResult) {

          let dataObjects = [].concat.apply([], dataObjectsResult);

          dataObjects.forEach(function(dataObject) {
            dataObjectsArray.push(dataObject);
          });

          let finalDataObjects = [];
          for (var key in dataObjectsArray) finalDataObjects.push(dataObjectsArray[key]);

          if(finalDataObjects.length === 0) {
            return reject('No dataObjects were found');
          }

          console.log('DataObjects Found: ', finalDataObjects);
          resolve(finalDataObjects);
        });

      })
      .catch(function(err){
        return reject(err);
      });
    });
  }

  /**
  * function to request about hyperties registered in domain registry, and
  * return the hyperty information, if found.
  * @param  {String}              url  dataObject URL
  * @param  {String}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverHypertyPerURL(url, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: 'domain://registry.' + activeDomain + '/',
      body: {
        resource: url
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code !== 200)
          return reject('No Hyperty was found');

        let hyperty = reply.body.value;

        if (hyperty) {
          console.log('Hyperty found: ', hyperty);
          resolve(hyperty);
        } else {
          return reject('No Hyperty was found');
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * return the dataObject information, if found.
  * @param  {String}              url  dataObject URL
  * @param  {String}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverDataObjectPerURL(url, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: 'domain://registry.' + activeDomain + '/',
      body: {
        resource: url
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let dataObject = reply.body.value;

        if (dataObject) {
          console.log('DataObject found: ', dataObject);
          resolve(dataObject);
        } else {
          return reject('DataObject not found');
        }
      });
    });
  }

  /** Advanced Search for dataObjects registered in domain registry
  * @param  {String}           name                  name of the dataObject
  * @param  {Array<string>}    dataSchemes (Optional)     types of dataObject schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObject resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjectsPerName(name, dataSchemes, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: 'domain://registry.' + activeDomain + '/',
      body: {
        resource: name,
      }
    };

    if(dataSchemes.length > 0){
      if(!msg.body.criteria)
        msg.body.criteria = {};
      msg.body.criteria.dataSchemes = dataSchemes;
    }

    if(resources.length > 0){
      if(!msg.body.criteria)
        msg.body.criteria = {};
      msg.body.criteria.resources = resources;
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let dataObjects = reply.body.value;

        let finalDataObjects = [];
        for (var key in dataObjects) finalDataObjects.push(dataObjects[key]);

        if (finalDataObjects.length > 0) {
          console.log("DataObjects Found: ", finalDataObjects);
          resolve(finalDataObjects);
        } else {
          return reject('No DataObject was found');
        }
      });
    });
  }

  /**
  * function to request about specific reporter dataObject registered in domain registry, and
  * return the dataObjects from that reporter.
  * @param  {String}           reporter                         dataObject reporter
  * @param  {Array<string>}    scdataSchemeshema                (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources                        (Optional)  types of dataObjects resources
  * @param  {String}           domain                           (Optional)
  */
  discoverDataObjectsPerReporter(reporter, dataSchemes, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: 'domain://registry.' + activeDomain + '/',
      body: {
        resource: "/comm",
        criteria: {
          reporter: reporter
        }
      }
    };

    if(dataSchemes.length > 0)
      msg.body.criteria.dataSchemes = dataSchemes;

    if(resources.length > 0)
      msg.body.criteria.resources = resources;

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let dataObjects = reply.body.value;

        let finalDataObjects = [];
        for (var key in dataObjects) finalDataObjects.push(dataObjects[key]);

        if (finalDataObjects.length > 0) {
          console.log("DataObjects Found: ", finalDataObjects);
          resolve(finalDataObjects);
        } else {
          return reject('No DataObject was found');
        }
      });
    });
  }

  /**
  * function to request global registry about the user IDs associated with some GUID
  * @param  {String}              guid
  * @return {Promise}          Promise
  */
  discoverUserIdsPerGUID(guid) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      console.log("GO graphConnector:", guid);

      _this.graphConnector.queryGlobalRegistry(guid)
      .then(function(graphConnectorContactData){

        console.log('Information returned from Global Registry: ', graphConnectorContactData);

        if (typeof graphConnectorContactData === 'string' || !graphConnectorContactData){
          return reject('Unsuccessful discover userIDs by GUID');
        }
        else{

          let userids = graphConnectorContactData.userIDs;

          if(userids.length === 0)
            return reject('UserIDs not available');

          resolve(userids);
        }

      })
      .catch(function(err){
        return reject(err);
      });

    });
  }

  /**
  * function to request discovery service about the GUID associated with some user identifier (eg email, name ...)
  * @param  {String}            userIdentifier
  * @return {Promise}           Promise
  */
  discoverGUIDPerUserIdentifier(userIdentifier) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let lookupURLDiscoveryService = "https://rethink.tlabscloud.com/discovery/rest/discover/lookup?searchquery=";
      _this.httpRequest.get(lookupURLDiscoveryService + userIdentifier)
      .then(function(json) {
        console.log('discover GUID by user identifier', json);

        let response = JSON.parse(json);
        let filteredGuid = response.results.filter(function(x) {
               return x["rethinkID"] != undefined
        });

        if (filteredGuid.length === 0)
          return reject('Unsuccessful discover GUID by user identifier');

        let guids = filteredGuid.map(function(x){ return x["rethinkID"]; });

        return resolve(guids);

      })
      .catch(function(err) {
        console.log("HTTP Request error: ", err);
        return reject(err);
      });
    });
  }
}

export default CoreDiscovery;
