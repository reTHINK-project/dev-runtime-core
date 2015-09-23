/**
 * Runtime User Agent Interface
 */
class RuntimeUA {

  /**
   * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
   * @param  {Object} Object                   hypertyInstance
   * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
   */
  registerHyperty( hypertyInstance, descriptor ) {
    // Body...
  }

  /**
   * Deploy Stub from Catalogue URL or domain url
   * @param  {URL.URL}     stub          stub
   */
  loadStub( stub) {
    // Body...
  }

  /**
   * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
   * @param  {CatalogueURL}    url           url
   */
  checkForUpdate(url) {
    // Body...
  }

  /**
   * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
   * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
   */
  discoverHiperty(descriptor) {
    // Body...
  }

}
