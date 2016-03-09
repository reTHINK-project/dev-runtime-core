import { divideURL } from '../utils/utils';
import Subscription from './Subscription';

class ObserverObject {

  constructor(parent, url, childrens) {
    let _this = this;

    _this._parent = parent;
    _this._url = url;
    _this._childrens = childrens;

    _this._bus = parent._bus;
    _this._subscriptions = {};
  }

  addSubscription(hyperty) {
    let _this = this;

    _this._subscriptions[hyperty] = new Subscription(_this._bus, hyperty, _this._url, _this._childrens);
  }

  removeSubscription(hyperty) {
    let _this = this;

    let domain = divideURL(hyperty).domain;
    let objURLSubscription = _this._url + '/subscription';

    let subscription = _this._subscriptions[hyperty];
    if (subscription) {
      //unsubscribe msg to the Reporter SM
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: objURLSubscription,
        body: { resource: _this._url }
      });

      //TODO: should I wait for response before unsubscribe on msg-node
      //unsubscribe msg to the domain node
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: 'domain://msg-node.' + domain + '/object-address-allocation',
        body: { resource: _this._url, childrenResources: _this._childrens }
      });

      subscription._releaseListeners();
      delete _this._subscriptions[hyperty];
    }
  }

}

export default ObserverObject;
