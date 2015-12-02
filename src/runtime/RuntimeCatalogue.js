class RuntimeCatalogue {

  constructor() {
    console.log('runtime catalogue');
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
    console.log("_makeExternalRequest", url);

    return new Promise(function(resolve, reject) {

      // TODO: implementation
      // Simulate getting hypertySourcePackage through the XMLHttpRequest
      // but in node this should be overrided to other method to make a
      // ajax request;
      // i think we can use a factory like we used in for the sandboxes,
      // an sandboxFactory;
      let xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function(event) {
        let xhr = event.currentTarget;
        if (xhr.readyState === 4) {
          console.log("got response:", xhr);
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
   * @param hypertyURL - e.g. http://localhost:8080/.well-known/hyperty/MyHyperty
   * @returns {Promise}
   */
  getHypertyDescriptor(hypertyURL) {
    let _this = this;
    console.log("getHypertyDescriptor", hypertyURL);
    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(hypertyURL).then(function(result) {
        result = JSON.parse(result);

        if (result["ERROR"]) {
          // TODO handle error properly
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Get hypertySourcePackage
   * @param hypertySourcePackageURL - e.g. http://localhost:8080/.well-known/hyperty/MyHyperty/sourcePackage
   * @returns {Promise}
   */
  getHypertySourcePackage(hypertySourcePackageURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(hypertySourcePackageURL).then(function(result) {

        if (result["ERROR"]) {
          // TODO handle error properly
          reject(result);
        } else {
          // assuming source package as object is wanted
          result = JSON.parse(result);
          // raw form: {"sourcePackage":"{...}"} so we have to parse again
          sourcePackage = JSON.parse(result["sourcePackage"]);
          resolve(sourcePackage);
        }
      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

  /**
   * Get StubDescriptor
   * @param stubURL - e.g. http://localhost:8080/.well-known/protostub/MyProtostub
   * @returns {Promise}
   */
  getStubDescriptor(stubURL) {
    return new Promise(function (resolve, reject) {

      _makeExternalRequest(stubURL).then(function (result) {
        result = JSON.parse(result);

        if (result["ERROR"]) {
          // TODO handle error properly
          reject(result);
        } else {
          resolve(result);
        }
      });
    });

  }

  /**
   * Get protostubSourcePackage
   * @param stubSourcePackageURL - e.g. http://localhost:8080/.well-known/protostub/MyProtostub/sourcePackage
   * @returns {Promise}
   */
  getStubSourcePackage(stubSourcePackageURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(stubSourcePackageURL).then(function(result) {
        resolve(result);
      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

}

export default RuntimeCatalogue;
