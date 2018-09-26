

import { secondsSinceEpoch } from '../utils/utils.js';

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
  constructor(bus, hypertyUrl, runtimeUrl, dataObject, heartBeatRate = 60) {
    let _this = this;

    function throwMandatoryParmMissingError(par) {
      throw '[HeartBeat] ' + par + ' mandatory parameter is missing';
    }

    bus ?  _this._bus = bus : throwMandatoryParmMissingError('bus');
    dataObject ?  _this._dataObject = dataObject : throwMandatoryParmMissingError('dataObject');
    heartBeatRate ?  _this._heartBeatRate = heartBeatRate : throwMandatoryParmMissingError('heartBeatRate');
    runtimeUrl ?  _this._syncManagerUrl = runtimeUrl + '/sm' : throwMandatoryParmMissingError('runtimeUrl');
    hypertyUrl ?  _this._hypertyUrl = hypertyUrl : throwMandatoryParmMissingError('hypertyUrl');

    console.log('[HeartBeat] starting ... ');

    _this._type = dataObject instanceof DataObjectReporter ? 'reporter' : 'observer';

    //  if reporter start Reporter heart beat 
    if (dataObject instanceof DataObjectReporter) this._startHeartBeat(_this._type, heartBeatRate);
     else {
      let isObserverHeartBeatActive = isHeartBeatActive(dataObject.data._observerHeartBeat, heartBeatRate);
      let isReporterHeartBeatActive = isHeartBeatActive(dataObject.data._reporterHeartBeat, heartBeatRate);

      if (!isObserverHeartBeatActive && !isReporterHeartBeatActive) {
        console.log('[HeartBeat] heart beats are disabled for ', dataObject);

        // both observer and reporter are disabled: lets start observer heart beat and start synching with remote storage server
      this._startHeartBeat('observer', heartBeatRate);
      this._startSync().then((stopSync)=>{
        console.log('[HeartBeat] observer ', hypertyUrl , ' started synching with remote storage server');
        this._watchHeartBeat('reporter', heartBeatRate, true, stopSync );
      });

      } else if (isReporterHeartBeatActive && !isObserverHeartBeatActive) {
      // only observer HeartBeat is disabled: lets start observer heart beat and watch reporter heart beat
      // _startHeartBeat(observer) e chama _watchHeartBeat(reporter, _startSync)
      this._startHeartBeat('observer', heartBeatRate);
        console.log('[HeartBeat] observer ', hypertyUrl , ' started synching with remote storage server');
        this._watchHeartBeat('reporter', this._startSync());

      } else {
      // both reporter and observer heart beat are active or only the observer is active, 
      // it means the data object is already being synchronised with remote storage server
      // we only need to watch the observer heart beat and try to replace it in case it fails.
        this._watchHeartBeat('reporter', this._onObserverHertbeat());

      }
    }
  }


_isHeartBeatActive(value, expiresTime) {
  return (secondsSinceEpoch() - value > expiresTime);
}


_startHeartBeat(type, rate) {
    //timer to keep the registration alive
    // the time is defined by a little less than half of the expires time defined
    let id = setInterval(function () {

      _this._dataObject.data[type+'HeartBeat'] = secondsSinceEpoch();

    }, rate);

  // returns function to stop the heart beat

    return function () {
      clearInterval(id);
    }
}

 _startObserverSync() {

    let msg = {
      from: this._hypertyUrl,
      to: this._syncManagerUrl,
      type: 'execute',
      body: {
        method: 'sync',
        params: [_this._dataObject.url]
      }
    }
    console.log('[HeartBeat._startObserverSync] starting observer sync ');

    this._bus.postMessage(msg);

    // return function to stop sync

    return function () {
      msg.body.method = 'stopSync'
      this._bus.postMessage(msg);
    }
 }

 _watchHeartBeat( type, rate, onWatchingIsEnabled, callback) {
//  qdo o heartBeat terminar chama callback 
// usa heartBeat Rating para iniciar timer no respectivo 
// campo do DO chamando isHeartBeatActive()

let heartBeat = type + 'HeartBeat';

let watcher = setInterval(function () {

  if (onWatchingIsEnabled && this._isHeartBeatActive(this._dataObject.data[heartBeat])) {
    console.log('[HeartBeat._watchHeartBeat] has changed to enabled ', this._dataObject.data);

    clearInterval(watcher);
    callback;
  } else if (!onWatchingIsEnabled && !this._isHeartBeatActive(this._dataObject.data[heartBeat])) {
    console.log('[HeartBeat._watchHeartBeat] has changed to disabled ', this._dataObject.data);

    clearInterval(watcher);
    callback;
  }


}, rate);

 }

 _onObserverHeartbeat() {
/*
 : chama _startHeartBeat(observe) e faz DO.onChanges(  ) 
 caso receba uma alteração ao observerHeartBeat de outro observer 
 com um timestamp inferior stop ao heartBeat iniciado. 

*/

this._startHeartBeat('observer', this._heartBeatRate);

 }



}

export default HeartBeat;
