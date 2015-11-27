import SyncObject from './SyncObject';
import {deepClone} from '../utils/utils.js';

class DataObjectReporter /* implements SyncStatus */ {
  /* private
  _version: number

  _url: ObjectURL
  _schema: Schema
  _bus: MiniBus
  _status: on | paused

  _syncObj: SyncData
  _subscriptions: <hypertyUrl: { status: string } }>

  ----event handlers----
  _onSubscriptionHandler: (event) => void
  */

  constructor(owner, url, schema, bus, initialStatus, initialData) {
    let _this = this;

    _this._version = 0;
    _this._owner = owner;
    _this._url = url;
    _this._schema = schema;
    _this._bus = bus;

    _this._subscriptions = {};

    _this._status = initialStatus;
    _this._syncObj = new SyncObject(initialData);
    _this._syncObj.observe((event) => {
      _this._onChange(event);
    });
  }

  get version() { return this._version; }

  get url() { return this._url; }

  get schema() { return this._schema; }

  get status() { return this._status; }

  get data() { return this._syncObj.data; }

  get subscriptions() { return this._subscriptions; }

  pause() {
    //TODO: pause change reports?
  }

  resume() {
    //TODO: resume change reports?
  }

  stop() {
    //TODO: destroy reporter?
  }

  onSubscription(callback) {
    this._onSubscriptionHandler = callback;
  }

  _onForward(msg) {
    let _this = this;

    console.log('DataObjectReporter-RCV: ', msg);
    switch (msg.body.type) {
      case 'subscribe': _this._onSubscribe(msg); break;
      case 'unsubscribe': _this._onUnSubscribe(msg); break;
    }
  }

  _onSubscribe(msg) {
    let _this = this;
    let hypertyUrl = msg.body.from;

    let event = {
      type: msg.body.type,
      url: hypertyUrl,

      accept: () => {
        //create new subscription
        _this._subscriptions[hypertyUrl] = { status: 'on' };

        //send ok response message
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 200, schema: _this._schema, version: _this._version, value: deepClone(_this.data) }
        });
      },

      reject: (reason) => {
        //send reject response message
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: 403, desc: reason }
        });
      }
    };

    if (_this._onSubscriptionHandler) {
      _this._onSubscriptionHandler(event);
    }
  }

  _onUnSubscribe(msg) {
    let _this = this;
    let hypertyUrl = msg.body.from;

    let sub = _this._subscriptions[hypertyUrl];
    delete _this._subscriptions[hypertyUrl];

    let event = {
      type: msg.body.type,
      url: hypertyUrl,
      object: sub
    };

    if (_this._onSubscriptionHandler) {
      _this._onSubscriptionHandler(event);
    }
  }

  //send delta messages to subscriptions
  _onChange(event) {
    let _this = this;

    _this._version++;

    if (_this._status === 'on') {
      _this._bus.postMessage({
        type: event.cType, from: _this._owner, to: _this._url + '/changes',
        body: {version: _this._version, oType: event.oType, attrib: event.field, value: event.data}
      });
    }
  }
}

export default DataObjectReporter;
