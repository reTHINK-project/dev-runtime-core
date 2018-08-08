/**
* The Notitification Handler is used to handle notifications not processed by the syncher when running in a sandbox.
*/

import { divideURL } from '../utils/utils';

class NotificationHandler {

  constructor(bus) {

    if (!bus) throw Error('[NotificationHandler Constructor] bus input is mandatory');
    this._bus = bus;
    this._onNotificationHandler = {};
  }

  onNotification(scheme, callback) {
    this._onNotificationHandler[scheme] = callback;
  }

  onCreate(msg) {

    let _this = this;
  //  let resource = msg.from.slice(0, -13); //remove "/subscription" from the URL

    let resource = msg.body.hasOwnProperty('resource') ? msg.body.resource : msg.from.slice(0, -13);
    let dividedURL = divideURL(resource);
    let domain = dividedURL.domain;
    let scheme = resource.split('://')[0];

    let error = (reason) => {
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 400, desc: 'Bad Request: ' + reason }
      });
    };

    if (!msg.body.hasOwnProperty('source')) { error('Missing source'); }
    if (!msg.body.hasOwnProperty('schema')) { error('Missing schema'); }
    if (!msg.body.hasOwnProperty('value')) { error('Missing value'); }
    if (!msg.body.hasOwnProperty('identity')) { error('Missing identity'); }

    let event = {
      type: msg.type,
      from: msg.body.source,
      url: resource,
      domain: domain,
      schema: msg.body.schema,
      value: msg.body.value,
      identity: msg.body.identity,
      to: msg.to,
      via: msg.body.via,

      ack: (type) => {
        let lType = 200;
        if (type) {
          lType = type;
        }

       //send ack response message
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: lType }
        });
      },
      error: (reason) => {
        error(reason);
      }
    };
    if (_this._onNotificationHandler[scheme]) {
      console.info('[NotificationHandler] NOTIFICATION-EVENT: ', event);
      _this._onNotificationHandler[scheme](event);
    }
  }

  onDelete(msg) {
    let _this = this;

   //remove "/subscription" from the URL
    let resource = msg.body.resource;

    let object = _this._observers[resource];

    let unsubscribe = {
      from: _this.owner,
      to: _this._subURL,
      id: msg.id,
      type: 'unsubscribe',
      body: { resource: msg.body.resource }
    };

    _this._bus.postMessage(unsubscribe);

    delete _this._observers[resource];

    if (object) {
      let event = {
        type: msg.type,
        url: resource,
        identity: msg.body.identity,

        ack: (type) => {
          let lType = 200;
          if (type) {
            lType = type;
          }

         //TODO: any other different options for the release process, like accept but nor release local?
          if (lType === 200) {
            object.delete();
          }

          //send ack response message
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: lType, source: _this._owner }
          });
        }
      };

      if (_this._onNotificationHandler) {
        log.log('NOTIFICATION-EVENT: ', event);
        _this._onNotificationHandler(event);
      }
    } else {
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 404, source: _this._owner }
      });
    }
  }
}

export default NotificationHandler;
