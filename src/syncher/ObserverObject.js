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

    _this._subscriptions[hyperty] = new Subscription(_this._bus, hyperty, _this._url, _this._childrens, false);
  }

  removeSubscription(hyperty) {
    let _this = this;

    let domain = divideURL(hyperty).domain;
    let objURLSubscription = _this._url + '/subscription';

    let subscription = _this._subscriptions[hyperty];
    if (subscription) {
      //FLOW-OUT: message sent to remote ReporterObject -> _onRemoteUnSubscribe
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: objURLSubscription,
        body: { resource: _this._url }
      });

      //TODO: should I wait for response before unsubscribe on msg-node
      //FLOW-OUT: message sent to msg-node SubscriptionManager component
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { resource: _this._url, childrenResources: _this._childrens }
      });

      subscription._releaseListeners();
      delete _this._subscriptions[hyperty];
    }
  }

}

export default ObserverObject;
