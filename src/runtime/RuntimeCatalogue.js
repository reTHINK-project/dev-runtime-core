class RuntimeCatalogue {

  constructor() {
    let _this = this;

    _this.mockupHypertyDescriptor();
    _this.mockupStubDescriptor();
  }

  mockupHypertyDescriptor() {
    let _this = this;

    // TODO: Remove the code is only for development fase without the Server backend catalogue;
    // Mockup load the base of descriptors
    _this._makeExternalRequest('../resources/descriptors/Hyperties.json').then(function(result) {
      _this.Hyperties = JSON.parse(result);
    });
  }

  mockupStubDescriptor() {
    let _this = this;

    // TODO: Remove the code is only for development fase without the Server backend catalogue;
    // Mockup load the base of descriptors
    _this._makeExternalRequest('../resources/descriptors/ProtoStubs.json').then(function(result) {
      _this.ProtoStubs = JSON.parse(result);
    });
  }

  set runtimeURL(runtimeURL) {
    let _this = this;
    _this._runtimeURL = runtimeURL;
  }

  get runtimeURL() {
    let _this = this;
    return _this._runtimeURL;
  }

  /**
  * Get hypertyRuntimeURL
  */
  getHypertyRuntimeURL() {
    // TODO: check if this is real needed;
    return _hypertyRuntimeURL;
  }

  _makeExternalRequest(url) {

    return new Promise(function(resolve, reject) {

      // TODO: implementation
      // Simulate getting hypertySourceCode through the XMLHttpRequest
      // but in node this should be overrided to other method to make a
      // ajax request;
      // i think we can use a factory like we used in for the sandboxes,
      // an sandboxFactory;
      let xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function(event) {
        let xhr = event.currentTarget;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.responseText);
          }
        }
      };

      xhr.open('GET', url, true);
      xhr.send();

    });

  }

  /**
  * Get HypertyDescriptor
  */
  getHypertyDescriptor(hypertyURL) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let hypertyName = hypertyURL.substr(hypertyURL.lastIndexOf('/') + 1);
      let hypertyDescriptor = _this.Hyperties[hypertyName];
      resolve(hypertyDescriptor);

    });

  }

  /**
  * Get hypertySourceCode
  */
  getHypertySourcePackage(hypertyPackage) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(hypertyPackage).then(function(result) {

        try {

          let sourcePackage = JSON.parse(result);
          let sourceCode = window.atob(sourcePackage.sourceCode);
          sourcePackage.sourceCode = sourceCode;

          resolve(sourcePackage);
        } catch (e) {
          reject(e);
        }

      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

  /**
  * Get StubDescriptor
  */
  getStubDescriptor(domainURL) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let stubDescriptor = _this.ProtoStubs[domainURL];
      resolve(stubDescriptor);

    });

  }

  /**
  * Get protostubSourceCode
  */
  getStubSourcePackage(sourcePackageURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(sourcePackageURL).then(function(result) {

        try {
          let sourcePackage = JSON.parse(result);
          let sourceCode = window.atob(sourcePackage.sourceCode);
          sourcePackage.sourceCode = sourceCode;

          resolve(sourcePackage);
        } catch (e) {
          reject(e);
        }
      }).catch(function(reason) {
        console.error(reason);
        reject(reason);
      });

    });

  }

}

export default RuntimeCatalogue;
