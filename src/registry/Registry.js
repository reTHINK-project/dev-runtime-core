/**
* Runtime Registry Interface
*/
class Registry {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {HypertyRuntimeURL} runtimeURL     runtimeURL
  * @param  {DomainURL} remoteRegistry remoteRegistry
  */
  init(runtimeURL, remoteRegistry) {
    // body...
  }

  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Message.Message} postMessage         postMessage
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL    descriptor
  * @return {HypertyURL}                     HypertyURL
  */
  registerHyperty(postMessage, descriptor) {
    // body...
  }

  /**
  * To unregister a previously registered Hyperty
  * @param  {HypertyURL} HypertyURL url           url
  */
  unregisterHyperty(url ) {
    // body...
  }

  /**
  * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
  * @param  {Message.Message} postMessage postMessage
  * @param  {DomainURL} DomainURL   domainURL
  * @return {HypertyRuntimeURL}             HypertyRuntimeURL
  */
  registerStub( postMessage, domainURL ) {
    // body...
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL} HypertyRuntimeURL hypertyRuntimeURL
  */
  unregisterStub( hypertyRuntimeURL ) {
    // body...
  }

  /**
  * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
  * @param  {Message.Message} postMessage postMessage
  * @param  {HypertyURL} HypertyURL  hyperty
  * @return {HypertyRuntimeURL}             HypertyRuntimeURL
  */
  registerPEP( postMessage, hyperty ) {
    // body...
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL} HypertyRuntimeURL HypertyRuntimeURL
  */
  unregisterPEP( HypertyRuntimeURL ) {
    // body...
  }

  /**
  * To receive status events from components registered in the Registry.
  * @param  {Message.Message} Message.Message event
  */
  onEvent( event ) {
    // body...
  }

  /**
  * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeURL}           RuntimeURL
  */
  discoverProtostub( url) {
    // body...
  }

  /**
  * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeSandbox}           RuntimeSandbox
  */
  getSandbox( url ) {
    // body...
  }

  /**
  * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint ).
  * @param  {URL.URL}  url       url
  * @return {Promise<URL.URL>}                 Promise <URL.URL>
  */
  resolve( url ) {
    // body...
  }

}
