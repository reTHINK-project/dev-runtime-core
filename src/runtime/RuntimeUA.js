// utils
import sandboxManager from '../utils/sandboxManager';

// Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';

/**
* Runtime User Agent Interface
*/
class RuntimeUA {

  constructor() {

    let _this = this;

    _this.registry = new Registry();
    _this.identityModule = new IdentityModule();
    _this.policyEngine = new PolicyEngine();
    _this.messageBus = new MessageBus();

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/protostub/123

    let hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';

    _this.registry.init(hypertyRuntimeURL);

  }

  /**
  * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
  * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
  */
  discoverHiperty(descriptor) {
    // Body...
  }

  /**
  * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
  * @param  {Object} Object                   hypertyInstance
  * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
  */
  registerHyperty(hypertyInstance, descriptor) {
    // Body...
  }

  /**
  * Deploy Hyperty from Catalogue URL
  * @param  {URL.URL}    hyperty hypertyInstance url;
  */
  loadHyperty(hyperty) {
    // Body
  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadStub(domain) {
    let _this = this;
    let protoStubDescriptor;

    // Discover Protocol Stub
    // Step 2
    protoStubDescriptor = _this.registry.discoverProtostub(domain);

    if (!protoStubDescriptor) {

      // Step 3 and 4
      // TODO get protostub | <sp-domain>/.well-known/protostub
      // for the request you can use the module request in utils;

      // Step 5 to 8
      protoStubDescriptor = _this.registry.registerStub(domain);

    }

    // Step 9 to 13
    let protoStubURL = 'hyperty-runtime://sp1/protostub/123';
    let configuration = {};
    let prototStub = sandboxManager.new(protoStubURL, _this.messageBus.postMessage, configuration);

    // Step 14
    _this.messageBus.addListener(prototStub, protoStubURL);

    // prototStub.addEventListener('message', function(event) {
    //   console.log('testing response - send from inside worker', event.data);
    // });

  }

  /**
  * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
  * @param  {CatalogueURL}       url url
  */
  checkForUpdate(url) {
    // Body...
  }

}

export default RuntimeUA;
