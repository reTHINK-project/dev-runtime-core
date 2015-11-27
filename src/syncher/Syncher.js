import DataObjectReporter from './DataObjectReporter';
import DataObjectObserver from './DataObjectObserver';

/**
 * @author micaelpedrosa@gmail.com
 * Client API Syncronization system.
 */
class SyncherManager {
  /* private
  _owner: URL
  _bus: MiniBus

  _subURL: URL

  _reporters: <url: DataObjectReporter>
  _observers: <url: DataObjectObserver>

  ----event handlers----
  _onResponseHandler: (event) => void
  _onNotificationHandler: (event) => void
  */

 constructor(owner, bus, config) {
   let _this = this;

   _this._owner = owner;
   _this._bus = bus;

   _this._subURL = config.runtimeURL + '/sm';

   _this._reporters = {};
   _this._observers = {};

   bus.addListener(owner, (msg) => {
     console.log('Syncher-RCV: ', msg);
     switch (msg.type) {
       case 'response': _this._onResponse(msg); break;
       case 'forward': _this._onForward(msg); break;
       case 'create': _this._onCreate(msg); break;
     }
   });
 }

 get owner() { return this._owner; }

 get reporters() { return this._reporters; }

 get observers() { return this._observers; }

 /**
  * Request a DataObjectReporter creation. The URL will be be requested by the allocation mechanism.
  * @param  {Schema} schema Schema of the object
  * @param  {HypertyURL[]} List of hyperties to send the create
  * @param  {JSON} initialData Object initial data
  * @return {Promise<DataObjectReporter>} Return Promise to a new Reporter. The reporter can be accepted or rejected by the PEP
  */
 create(schema, observers, initialData) {
   let _this = this;

   //TODO: what to do with schema?

   let requestMsg = {
     type: 'create', from: _this._owner, to: _this._subURL,
     body: {schema: schema, value: initialData, authorise: observers}
   };

   return new Promise((resolve, reject) => {
     //request create to the Allocation system? Can be rejected by the PolicyEngine.
     _this._bus.postMessage(requestMsg, (reply) => {
       console.log('create-response: ', reply);
       if (reply.body.code === 200) {
         let objUrl = reply.body.resource;

         //reporter creation accepted
         let newObj = new DataObjectReporter(_this._owner, objUrl, schema, _this._bus, 'on', initialData);
         _this._reporters[objUrl] = newObj;
         resolve(newObj);
       } else {
         //reporter creation rejected
         reject(reply.body.desc);
       }
     });
   });
 }

 /**
  * Request a subscription to an existent object.
  * @param  {ObjectURL} objURL Address of the existent object.
  * @return {Promise<DataObjectObserver>} Return Promise to a new Observer.
  */
 subscribe(objURL) {
   let _this = this;
   let objSubscriptorURL = objURL + '/subscription';

   //TODO: validate if subscription already exists ?
   let subscribeMsg = {
     type: 'subscribe', from: _this._owner, to: objSubscriptorURL
   };

   return new Promise((resolve, reject) => {
     //request subscription
     _this._bus.postMessage(subscribeMsg, (reply) => {
       console.log('subscribe-response: ', reply);
       if (reply.body.code === 200) {
         //subscription accepted
         let newObj = _this._addObserver(objURL, reply.body.schema, reply.body.value);
         resolve(newObj);
       } else {
         //subscription rejected
         reject(reply.body.desc);
       }
     });
   });
 }

 onResponse(callback) {
   this._onResponseHandler = callback;
 }

 onNotification(callback) {
   this._onNotificationHandler = callback;
 }

 _onResponse(msg) {
   let _this = this;

   //TODO: process notification reponses!
 }

 _onNotification(msg) {
   let _this = this;

   //TODO: process (create, delete) notifications!
 }

 _onForward(msg) {
   let _this = this;

   let reporter = _this._reporters[msg.body.to];
   reporter._onForward(msg);
 }

 _onCreate(msg) {
   let _this = this;

   //TODO: fire notification event (only create observer if accepted ? )
   _this._addObserver(msg.body.resource, msg.body.schema, msg.body.value);
 }

 _addObserver(objURL, schemaURL, initialData) {
   let _this = this;

   let newObj = new DataObjectObserver(_this._owner, objURL, schemaURL, 'on', initialData);
   _this._observers[objURL] = newObj;

   //add changes listener
   _this._bus.addListener(objURL + '/changes', (msg) => {
     console.log(objURL + '/changes-RCV: ', msg);
     newObj._changeObject(msg);
   });

   return newObj;
 }

}

export default SyncherManager;
