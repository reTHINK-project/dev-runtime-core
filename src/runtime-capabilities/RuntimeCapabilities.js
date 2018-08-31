class RuntimeCapabilities {

  constructor() {

  }

  /**
   * Returns as a promise RuntimeCapabilities json object with all available capabilities of the runtime.
   * If it was not yet persisted in the Storage Manager it collects all required info from the platform and saves in the storage manager.
   * @returns {Promise<object>}
   */
  getRuntimeCapabilities() {

  }

  /**
   * returns as a promise a boolean according to available capabilities.
   * @returns {Promise<boolean>}
   */
  isAvailable(capability) {

  }

  /**
   * it refreshes previously collected capabilities and updates the storage manager
   */
  update() {

  }

}

export default RuntimeCapabilities;
