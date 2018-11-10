

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

    bus ? _this._bus = bus : throwMandatoryParmMissingError('bus');
    dataObject ? _this._dataObject = dataObject : throwMandatoryParmMissingError('dataObject');
    heartBeatRate ? _this._heartBeatRate = heartBeatRate : throwMandatoryParmMissingError('heartBeatRate');
    runtimeUrl ? _this._runtimeUrl = runtimeUrl : throwMandatoryParmMissingError('runtimeUrl');
    hypertyUrl ? _this._hypertyUrl = hypertyUrl : throwMandatoryParmMissingError('hypertyUrl');
    this.heartbeat = 0;

    _this._stop = {
      heartBeat: false,
      sync: function (bus) {
        let stopSyncMsg = {
          from: hypertyUrl,
          to: runtimeUrl + '/sm',
          type: 'execute',
          body: {
            method: 'stopSync',
            params: [dataObject.url]
          }
        };

        console.log('[Heartbeat.stop.sync()] sending msg:', stopSyncMsg);

        bus.postMessage(stopSyncMsg);

      }

    };

  }

  start(resume) {

    console.log('[HeartBeat] starting ... ');

    if (resume) {
      this._getLastHearBeat().then(() => {
        let isHeartBeatActive = this._isHeartBeatActive(this.heartBeat, this._heartBeatRate * 2);

        if (!isHeartBeatActive) {
          console.log('[HeartBeat] heart beats are disabled for ', this._dataObject);

          // Is disabled: lets start observer heart beat and start synching with remote storage server
          this._stop.heartBeat = this._startHeartBeat(this._heartBeatRate);
          console.log('[HeartBeat]  ', this._hypertyUrl, ' started synching with remote storage server');
          this._startSync();
        } else {
          //  heart beat is active, 
          // it means the data object is already being synchronised with remote storage server
          // we only need to watch the heart beat and try to replace it in case it fails.
          this._watchHeartBeat(this._heartBeatRate, true, this._onHertbeatStopped);

        }

      });
    } else this._startSync();

  }

  _getLastHearBeat() {

    return new Promise((resolve) => {
  
      setTimeout(function () {
        console.log('[HeartBeat._getLastHearBeat] stop waiting ');
        resolve();

      }, this._heartBeatRate * 2);
  
    });

  }

  stop() {
    if (this._stop.heartBeat)
      this._stop.heartBeat();

    this._stop.sync(this._bus);
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
    let lastHeartPeriodInterval = secondsSinceEpoch() - lastHeartbeat;
    console.log('[HeartBeat._isHeartBeatActive] now - lastHeartBeat', lastHeartPeriodInterval);

    console.log('[HeartBeat._isHeartBeatActive] ', !(lastHeartPeriodInterval > maxHeartBeatInterval * 2));
    return (!(lastHeartPeriodInterval > maxHeartBeatInterval * 2));
  }


  _startHeartBeat(rate) {
    let _this = this;

    let msg = {
      from: _this._hypertyUrl,
      to: _this._dataObject.url + '/children/',
      type: 'create',
      body: {
        resource: 'heartbeat',
        mutual: false,
        value: secondsSinceEpoch(),
      }
    }
    console.log('[HeartBeat._startHeartBeat] starting ... ', msg.body.value);

    this._bus.postMessage(msg);

    this.heartbeat = secondsSinceEpoch();

    let id = setInterval(function () {

      let msg = {
        from: _this._hypertyUrl,
        to: _this._dataObject.url + '/children/',
        type: 'create',
        body: {
          resource: 'heartbeat',
          mutual: false,
          value: secondsSinceEpoch(),
        }
      }
      console.log('[HeartBeat] ', msg);
      _this._bus.postMessage(msg);
      this.heartbeat = secondsSinceEpoch();

    }, rate * 1000);

    // returns function to stop the heart beat

    return function () {
      clearInterval(id);
    }
  }

  _startSync() {

    console.log('[HeartBeat._startSync] starting observer sync ', this._dataObject.data);
    let backupRevision = this._dataObject.data.backupRevision;
    console.log('[HeartBeat._startSync] backupRevision ', backupRevision);
    let msg = {
      from: this._hypertyUrl,
      to: this._runtimeUrl + '/sm',
      type: 'execute',
      body: {
        method: 'sync',
        params: [this._dataObject.url, backupRevision]
      }
    }

    console.log('[HeartBeat._startSync] sending msg ', msg);

    this._bus.postMessage(msg);

  }

  _watchHeartBeat(rate, onWatchingIsEnabled, callback) {
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

    _this._startHeartBeat(_this._heartBeatRate);
    _this._startSync();
  }



}

export default HeartBeat;
