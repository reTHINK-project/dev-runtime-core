//import IdentityManager from '../identityManager/IdentityManager';
//import Syncher from '../syncher/Syncher.js';
//import Discovery from '../discovery/Discovery.js';
//import {divideURL} from '../utils/utils';

//import Search from '../utils/Search';
import EventEmitter from '../utils/EventEmitter';

/**
* Context Observer;
* @author Paulo Chainho [paulo-g-chainho@alticelabs.com]
*/

class ContextObserver extends EventEmitter {

  constructor(hypertyURL, bus, configuration, contextResourceTypes, factory, syncher) {
    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter ');
    if (!factory) throw new Error('The factory is a needed parameter ');

    super();

    let _this = this;

    _this._contextResourceTypes = contextResourceTypes;
    _this._url = hypertyURL;
    _this._discoverUsersPromises = {}; // object with promises executed at discoverUsers function
    _this._observePromises = {}; // object with promises executed at observe function


    //let identityManager = new IdentityManager(hypertyURL, configuration.runtimeURL, bus);
    console.log('[ContextObserver] started with hypertyURL->', hypertyURL);
    _this._domain = factory.divideURL(configuration.runtimeURL).domain;
    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Context';

    _this._users2observe = [];
    _this._observers = {};

    this._syncher = syncher ? syncher : factory.createSyncher(hypertyURL, bus, configuration);

    let discovery = factory.createDiscovery(hypertyURL, configuration.runtimeURL, bus);
    _this._discovery = discovery;

    _this._discoveries = {}; //list of discovered objects
    //_this.identityManager = identityManager;
    //_this.search = new Search(discovery, identityManager);
    window.discovery = _this._discovery;
  }


  start(resumedContext, disconnectedCallBack) {
    let _this = this;
    console.log('[ContextObserver.start] ');

    return new Promise((resolve, reject) => {
      _this._syncher.resumeObservers({store: true}).then((observers) => {

        let observersList = Object.keys(observers);

        if (observersList.length  > 0) {

          console.log('[ContextObserver.start] resuming: ', observers);

          /*observersList.forEach((i)=>{
          _this._users2observe.push(new UserAvailabilityController(observers[i]));
        });*/
          _this._observers = observers;

          resolve(observers);

          observersList.forEach((observer) =>{
            let Context = observers[observer];

            // By default resumed context is set with resumedContext.
            if (resumedContext) context.data.values = resumedContext;

            // Context will will be updated with value synchronized with reporter if connected
            Context.sync();

            //Add listener to be notified when reporter is abruptly disconnected
            if (disconnectedCallBack) Context.onDisconnected(disconnectedCallBack);
          });


        } else {
          resolve(false);
        }

      }).catch((reason) => {
        console.info('[ContextObserver] Resume Observer failed | ', reason);
        resolve(false);
      });
    }).catch((reason) => {
      reject('[ContextObserver] Start failed | ', reason);
    });
  }

  resumeDiscoveries() {
    let _this = this;

    return new Promise((resolve, reject) => {
      _this._discovery.resumeDiscoveries().then((discoveries) => {

        console.log('[ContextObserver._resumeDiscoveries] found: ', discoveries);

        discoveries.forEach((discovery) =>{

          if (discovery.data.resources && discovery.data.resources[0] === _this._contextResourceTypes[0]) {
            console.log('[ContextObserver._resumeDiscoveries] resuming: ', discovery);

            if (discovery.data.status === 'live') { // previously discovered object is now live
              resolve([discovery.data]);
              discovery.unsubscribeLive(_this._url);
            } else { // previously discovered object is still disconnected
              discovery.onLive(_this._url, ()=>{
                console.log('[ContextObserver._resumeDiscoveries] disconnected Hyperty is back to live', discovery);
                resolve([discovery.data]);
                discovery.unsubscribeLive(_this._url);
              });
            }
          }
        });
      });
    }).catch((reason) => {
      reject('[ContextObserver] resumeDiscoveries failed | ', reason);
    });
  }

  onResumeObserver(callback) {
    let _this = this;
    _this._onResumeObserver = callback;
  }


  discoverUsers(email, domain) {
    let _this = this;


    let user = email + '@' + domain;

    if (!_this._discoverUsersPromises[user]) {
      _this._discoverUsersPromises[user] = new Promise(function(resolve, reject) {

        _this._discovery.discoverHypertiesDO(email, ['context'], _this._contextResourceTypes, domain).then(hyperties =>{
          //_this.search.users([email], [domain], ['context'], ['Context_context']).then(function(a) {
          console.log('[ContextObserver.discoverUsers] discovery result->', hyperties);
          let discovered = [];
          let disconnected = [];
          hyperties.forEach(hyperty =>{
            _this._discoveries[hyperty.data.hypertyID] = hyperty;
            if (hyperty.data.status === 'live') {
              discovered.push(hyperty.data);
            } else {
              disconnected.push(hyperty);
            }
          });


          if (discovered.length > 0) {
            console.log('[ContextObserver.discoverUsers] returning discovered hyperties data->', discovered);
            resolve(discovered);
          } else if (disconnected.length > 0) {
            console.log('[ContextObserver.discoverUsers] disconnected Hyperties ', disconnected);

            //resolve([]);

            disconnected[0].onLive(_this._url, ()=>{
              console.log('[ContextObserver.discoverUsers] disconnected Hyperty is back to live', disconnected[0]);

              discovered.push(disconnected[0].data);
              resolve(discovered);
              disconnected[0].unsubscribeLive(_this._url);
            });
          }
        });
      });
    }
    return _this._discoverUsersPromises[user];
  }

  /**
   * This function is used to start the user Context observation for a certain user Context reporter
   * @param  {DiscoveredObject} hyperty       Hyperty to be observed.
   * @return {<Promise> DataObjectObserver}      It returns as a Promise the UserAvailability Data Object Observer.
   */

  observe(hyperty) {
    let _this = this;
    if (!_this._observePromises[hyperty.hypertyID]) {
      _this._observePromises[hyperty.hypertyID] = new Promise(function(resolve, reject) {
      //check if we are already observing it
        _this._users2observe.forEach((Context) => {
          if (Context._reporter === hyperty.hypertyID) return resolve(Context);
        });

        _this._discovery.discoverDataObjectsPerReporter(hyperty.hypertyID, ['context'], _this._contextResourceTypes,  _this._domain).then(function(dataObjects) {
          console.log('[ContextObserver.discoverAvailability] discovered context objects ', dataObjects);
          let last = 0;
          let url;

          dataObjects.forEach((dataObject) => {
            if (dataObject.hasOwnProperty('lastModified') && dataObject.hasOwnProperty('url') && Date.parse(dataObject.lastModified) > last) {
              last = dataObject.lastModified;
              url = dataObject.url;

            //console.log('URL DATA Object', url);
            }
          });
          if (last != 0 && url) {
            resolve(_this._subscribeContext(hyperty, url));
          } else {
            reject('[ContextObserver.observe] discovered DataObjecs are invalid', dataObjects);
          }
        });
      });
    }
    return _this._observePromises[hyperty.hypertyID];
  }

  _subscribeContext(hyperty, url) {
    let _this = this;

    // avoid duplicated subscriptions

    return new Promise(function(resolve, reject) {
      _this._users2observe.forEach((Context) => {
        if (Context.url === url) return resolve(Context);
      });

      _this._syncher.subscribe(_this._objectDescURL, url, null, null, null, false).then((Context) => {
        console.log('[ContextObserver._subscribeContext] observer object', Context);

        //let newUserAvailability = new UserAvailabilityController(Context, userID);

        _this._users2observe.push(Context);

        // When Object is disconnected set user Context status as unavailable
        Context.onDisconnected(()=>{
          console.log('[ContextObserver.onDisconnected]: ', Context);

          Context.data.values[0].value = 'unavailable';
          Context.sync();
        });

        resolve(Context);
      });
    });
  }

  _discoverAndSubscribeLegacyUsers(name) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      _this._discovery.discoverDataObjectsPerName(name).then(function(result) {
        console.log('[ContextObserver._discoverAndSubscribeLegacyUsers] All DataObjects Result', result);
        result.forEach(function(obj) {
          if (obj.status === 'live') {
            console.log('Live obj', obj);
            if (!obj.hypertyID) {
              obj.hypertyID = obj.reporter;
            }
            _this._subscribeContext(obj.schema, obj.url).then(function(resultSubscribe) {
              console.log('[ContextObserver._discoverAndSubscribeLegacyUsers] _subscribeContext', resultSubscribe);
              return resolve(resultSubscribe);
            });
          }
        });
      }).catch(function(err) {
        console.log('error ', err);
      });
    });
  }

  /**
 * This function is used to stop the user Context observation for a certain user
 * @param  {string} Context       the UserAvailability Data Object Observer URL to be unobserved.
 */

  unobserve(Context) {
    let _this = this;

    _this._users2observe.forEach((user, index) => {
      if (user.url === Context) {
        user.unsubscribe();
        _this._users2observe.splice(index, 1);
      }

    });
  }

}

export default ContextObserver;
