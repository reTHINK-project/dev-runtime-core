import { divideURL } from '../utils/utils';
import ObjectAllocation from './ObjectAllocation';

/**
 * @author micaelpedrosa@gmail.com
 * Core Syncronization system.
 */
class SyncherManager {
  /* private
  _url: URL
  _bus: MiniBus
  _registry: Registry
  _allocator: ObjectAllocation

  _subscriptions: { ObjectURL: { owner: HypertyURL, schema: Schema, sl: MsgListener, cl: [MsgListener], subs: [HypertyURL] } }
  */

  constructor(runtimeURL, bus, registry, catalog, allocator) {
    let _this = this;

    _this._bus = bus;
    _this._registry = registry;
    _this._catalog = catalog;

    //TODO: these should be saved in persistence engine?
    _this._url = runtimeURL + '/sm';
    _this._objectURL = runtimeURL + '/object-allocation';
    _this._subscriptions = {};

    //TODO: this should not be hardcoded!
    _this._domain = divideURL(runtimeURL).domain;

    if (allocator) {
      _this._allocator = allocator;
    } else {
      _this._allocator = new ObjectAllocation(_this._objectURL, bus);
    }

    bus.addListener(_this._url, (msg) => {
      console.log('SyncherManager-RCV: ', msg);
      switch (msg.type) {
        case 'create': _this._onCreate(msg); break;
        case 'delete': _this._onDelete(msg); break;
        case 'subscribe': _this._onLocalSubscribe(msg); break;
        case 'unsubscribe': _this._onLocalUnSubscribe(msg); break;
      }
    });
  }

  get url() { return this._url; }

  _onCreate(msg) {
    let _this = this;
    let owner = msg.from;
    let domain = divideURL(msg.from).domain;

    //TODO: 5-7 authorizeObjectCreation(owner, obj ???? )
    //TODO: other optional steps

    //get schema from catalogue and parse -> (scheme, children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {
      let properties = descriptor.sourcePackage.sourceCode.properties;
      let scheme = properties.scheme ? properties.scheme.constant : 'resource';
      let children = properties.children ? properties.children.constant : [];

      _this._allocator.create(domain, scheme, children, 1).then((allocated) => {
        //TODO: get address from address allocator ?
        let objURL = allocated[0];
        let objSubscriptorURL = objURL + '/subscription';

        //15. add subscription listener
        let subscriptorListener = _this._bus.addListener(objSubscriptorURL, (msg) => {
          console.log(objSubscriptorURL + '-RCV: ', msg);
          switch (msg.type) {
            case 'subscribe': _this._onRemoteSubscribe(objURL, msg); break;
            case 'unsubscribe': _this._onRemoteUnSubscribe(objURL, msg); break;
            case 'response': _this._onRemoteResponse(objURL, msg); break;
          }
        });

        let objSubscription = { owner: owner, children: children, sl: subscriptorListener, cl: [], subs: [] };
        _this._subscriptions[objURL] = objSubscription;

        //add forward of <ObjectURL> messages to the owner
        _this._bus.addForward(objURL, owner);

        //add children listeners...
        let childBaseURL = objURL + '/children/';
        children.forEach((child) => {
          let childURL = childBaseURL + child;
          let childListener = _this._bus.addListener(childURL, (msg) => {

            //TODO: what todo here? Process child creations?
            console.log('SyncherManager-' + childURL + '-RCV: ', msg);
          });

          objSubscription.cl.push(childListener);
        });

        //all ok, send response
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: owner,
          body: { code: 200, resource: objURL, childrenResources: children }
        });

        //19. send create to all observers, responses will be deliver to the Hyperty owner?
        setTimeout(() => {
          //schedule for next cycle needed, because the Reporter should be available.
          msg.body.authorise.forEach((hypertyURL) => {
            _this._bus.postMessage({
              type: 'create', from: objSubscriptorURL, to: hypertyURL,
              body: { source: msg.from, value: msg.body.value, schema: msg.body.schema }
            });
          });
        });
      });
    }).catch((reason) => {
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: owner,
        body: { code: 500, desc: reason }
      });
    });
  }

  _onDelete(msg) {
    let _this = this;

    //TODO: where to get objectURL ?
    let objURL = '<objURL>';

    //destroy all objURL listeners
    delete _this._subscriptions[objURL];
    _this._bus.removeAllListenersOf(objURL);
    _this._bus.removeAllListenersOf(objURL + '/subscription');

    //TODO: destroy object in the registry?
  }

  _onRemoteSubscribe(objURL, msg) {
    let _this = this;
    let hypertyUrl = msg.body.subscriber;

    let subscription = _this._subscriptions[objURL];
    let childBaseURL = objURL + '/children/';

    //27. validate if subscription already exists?
    if (subscription.subs.indexOf(hypertyUrl) !== -1) {
      let errorMsg = {
        id: msg.id, type: 'response', from: msg.to, to: hypertyUrl,
        body: {code: 500, desc: 'Subscription for (' + objURL + ' : ' +  hypertyUrl + ') already exists!'}
      };

      _this._bus.postMessage(errorMsg);
      return;
    }

    //31. ask to subscribe to Syncher? (depends on the operation mode)
    //TODO: get mode from object!
    let mode = 'sub/pub';

    if (mode === 'sub/pub') {
      //forward to Hyperty owner
      let forwardMsg = {
        type: 'forward', from: _this._url, to: subscription.owner,
        body: { type: msg.type, from: hypertyUrl, to: objURL }
      };

      _this._bus.postMessage(forwardMsg, (reply) => {
        console.log('forward-reply: ', reply);
        if (reply.body.code === 200) {
          //subscription accepted (add forward and subscription)
          _this._bus.addForward(objURL + '/changes', hypertyUrl);

          //add forward for children
          subscription.children.forEach((child) => {
            _this._bus.addForward(childBaseURL + child, hypertyUrl);
          });

          subscription.subs.push(hypertyUrl);
        }

        //send subscribe-response
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: reply.body
        });
      });
    }

  }

  _onRemoteUnSubscribe(objURL, msg) {
    let _this = this;
    let hypertyUrl = msg.from;

    let subs = _this._subscriptions[objURL].subs;
    let index = subs.indexOf(hypertyUrl);
    subs.splice(index, 1);

    //TODO: send un-subscribe message to Syncher? (depends on the operation mode)
  }

  _onRemoteResponse(objURL, msg) {
    let _this = this;

    _this._bus.postMessage({
      id: msg.id, type: 'response', from: msg.to, to: objURL,
      body: { code: msg.body.code, source: msg.from }
    });
  }

  _onLocalSubscribe(msg) {
    let _this = this;

    let domain = divideURL(msg.from).domain;
    let objURL = msg.body.resource;
    let objURLSubscription = objURL + '/subscription';

    //get schema from catalogue and parse -> (children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {
      let properties = descriptor.sourcePackage.sourceCode.properties;
      let children = properties.children ? properties.children.constant : [];
      let childBaseURL = objURL + '/children/';

      //1. subscribe msg for the domain node
      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { resource: msg.body.resource, childrenResources: children, schema: msg.body.schema }
      };

      //2. subscribe in msg-node
      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        console.log('node-subscribe-response: ', reply);
        if (reply.body.code === 200) {
          //listener accepted (add forward and subscribe to reporter)
          _this._bus.addForward(objURL + '/changes', msg.from);

          //add forward for children
          children.forEach((child) => {
            _this._bus.addForward(childBaseURL + child, msg.from);
          });

          //send provisional response
          this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: 100, childrenResources: children }
          });

          let objSubscribeMsg = {
            type: 'subscribe', from: _this._url, to: objURLSubscription,
            body: { subscriber: msg.from }
          };

          //subscribe to reporter SM
          _this._bus.postMessage(objSubscribeMsg, (reply) => {
            //forward to hyperty:
            reply.id = msg.id;
            reply.from = _this._url;
            reply.to = msg.from;
            this._bus.postMessage(reply);
          });
        } else {
          //listener rejected
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: reply.body
          });
        }
      });
    });
  }

  _onLocalUnSubscribe(msg) {

  }

}

export default SyncherManager;
