

import { secondsSinceEpoch } from '../utils/utils.js';
//import DataObjectReporter from './DataObjectReporter';
//import DataObjectChild from './DataObjectChild.js';

/**
 * Class to handle Children Data Object Heart beats 
 * required to manage synchronisation with remote storage servers.
 */
class HeartBeat {
  /* private

  */

  /**
   * @ignore
   * Should not be used directly by Hyperties. It's called by the DataObject constructor
   */
  constructor(bus, hypertyUrl, runtimeUrl, dataObject, heartBeatRate = 60, lastHeartbeat = 0) {
    let _this = this;

    function throwMandatoryParmMissingError(par) {
      throw '[HeartBeat] ' + par + ' mandatory parameter is missing';
    }

    bus ?  _this._bus = bus : throwMandatoryParmMissingError('bus');
    dataObject ?  _this._dataObject = dataObject : throwMandatoryParmMissingError('dataObject');
    heartBeatRate ?  _this._heartBeatRate = heartBeatRate : throwMandatoryParmMissingError('heartBeatRate');
    runtimeUrl ?  _this._runtimeUrl = runtimeUrl : throwMandatoryParmMissingError('runtimeUrl');
    hypertyUrl ?  _this._hypertyUrl = hypertyUrl : throwMandatoryParmMissingError('hypertyUrl');
    this.heartbeat = lastHeartbeat;

/*    let input = {}

    input.parent = dataObject.url;
    input.url = "heartbeat";
    input.created = (new Date).toISOString();
    input.reporter = hypertyUrl;
    input.runtime = runtimeUrl;
    input.schema = 'heartbeat';
    input.parentObject = dataObject;
    input.children = 'resources';

    this._heartBeat = new DataObjectChild(input);*/

    console.log('[HeartBeat] starting ... ');

/*    _this._type = dataObject instanceof DataObjectReporter ? 'reporter' : 'observer';

    //  if reporter start Reporter heart beat 
    if (dataObject instanceof DataObjectReporter) this._startHeartBeat(_this._type, heartBeatRate);
     else {*/
//      let isObserverHeartBeatActive = _this._isHeartBeatActive(dataObject.data._observerHeartBeat, heartBeatRate);

      let isHeartBeatActive = _this._isHeartBeatActive(this.heartBeat, heartBeatRate);

//      if (!isObserverHeartBeatActive && !isReporterHeartBeatActive) {
      if (!isHeartBeatActive) {
          console.log('[HeartBeat] heart beats are disabled for ', dataObject);

        // both observer and reporter are disabled: lets start observer heart beat and start synching with remote storage server
        this._startHeartBeat( heartBeatRate);
        console.log('[HeartBeat]  ', hypertyUrl , ' started synching with remote storage server');
        let stopSync = this._startSync();
//        this._watchHeartBeat( heartBeatRate, true, stopSync );

/*      } else if (isReporterHeartBeatActive && !isObserverHeartBeatActive) {
      // only observer HeartBeat is disabled: lets start observer heart beat and watch reporter heart beat
      // _startHeartBeat(observer) e chama _watchHeartBeat(reporter, _startSync)
      this._startHeartBeat('observer', heartBeatRate);
        console.log('[HeartBeat] observer ', hypertyUrl , ' started synching with remote storage server');
        this._watchHeartBeat('reporter', this._startObserverSync());
*/
      } else {
      // both reporter and observer heart beat are active or only the observer is active, 
      // it means the data object is already being synchronised with remote storage server
      // we only need to watch the observer heart beat and try to replace it in case it fails.
        this._watchHeartBeat(heartBeatRate,true, this._onHertbeatStopped);

      }
  }

get heartBeat() {
  if (this.heartbeat) 
     return this.heartbeat;
  else return 0;
}

onNewHeartbeat(heartbeat) {
  this.heartbeat = heartbeat;
}

_isHeartBeatActive(lastHeartbeat, maxHeartBeatInterval) {
  console.log('[HeartBeat._isHeartBeatActive] now - lastHeartBeat', secondsSinceEpoch() - lastHeartbeat);

  console.log('[HeartBeat._isHeartBeatActive] ', !(secondsSinceEpoch() - lastHeartbeat > maxHeartBeatInterval));
  return (!(secondsSinceEpoch() - lastHeartbeat > maxHeartBeatInterval));
}


_startHeartBeat(rate) {
  let _this = this;

  let msg = {
    from: this._hypertyUrl,
    to: _this._dataObject.url + '/children/resources',
    type: 'create',
    body: {
      resource: 'heartbeat',
      mutual: false,
      value: secondsSinceEpoch(),
    }
  }
  console.log('[HeartBeat._startObserverSync] starting observer sync ');

  this._bus.postMessage(msg);

  this.heartbeat = secondsSinceEpoch();

  let id = setInterval(function () {

    msg.body.value = secondsSinceEpoch();
    _this._bus.postMessage(msg);
    this.heartbeat = secondsSinceEpoch();
  
    }, rate * 1000);

  // returns function to stop the heart beat

    return function () {
      clearInterval(id);
    }
}

 _startSync() {

    let msg = {
      from: this._hypertyUrl,
      to: this._runtimeUrl+'/sm',
      type: 'execute',
      body: {
        method: 'sync',
        params: [this._dataObject.url]
      }
    }
    console.log('[HeartBeat._startSync] starting observer sync ');

    this._bus.postMessage(msg);

    // return function to stop sync

    return function () {
      msg.body.method = 'stopSync'
      this._bus.postMessage(msg);
    }
 }

 _watchHeartBeat( rate, onWatchingIsEnabled, callback) {
//  qdo o heartBeat terminar chama callback 
// usa heartBeat Rating para iniciar timer no respectivo 
// campo do DO chamando isHeartBeatActive()
let _this = this;

let syncFun = callback;
console.log('[HeartBeat._watchHeartBeat] started watching ', _this.heartBeat);

//let heartBeat = type + 'HeartBeat';

let watcher = setInterval(function () {

  if (onWatchingIsEnabled && !_this._isHeartBeatActive(_this.heartBeat, _this._heartBeatRate)) {
    console.log('[HeartBeat._watchHeartBeat] has stopped ', _this._dataObject.data);

    clearInterval(watcher);
    syncFun(_this);
  } else if (!onWatchingIsEnabled && this._isHeartBeatActive(_this.heartBeat, _this._heartBeatRate)) {
    console.log('[HeartBeat._watchHeartBeat] has changed to disabled ', _this._dataObject.data);

    clearInterval(watcher);
    syncFun();
  }

}, rate * 1000 * 2);

 }

 _onHertbeatStopped(_this) {

  _this._startHeartBeat( _this._heartBeatRate);
  _this._startSync();
 }



}

export default HeartBeat;
