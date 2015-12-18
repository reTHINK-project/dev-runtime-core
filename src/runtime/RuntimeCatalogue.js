class RuntimeCatalogue {

  constructor() {
    console.log('runtime catalogue');

    let _this = this;
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

    let _this = this;

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

      //hyperty-catalogue://sp1/HelloHyperty
      let hypertyName = hypertyURL.substr(hypertyURL.lastIndexOf('/') + 1);

      let hypertyDescriptor = {
        guid: 'guid',
        id: 'idHyperty',
        classname: hypertyName,
        description: 'description of ' + hypertyName,
        kind: 'hyperty',
        catalogueURL: '....',
        sourcePackageURL: '../resources/' + hypertyName + '-sourcePackageURL.json',
        dataObject: '',
        type: '',
        messageSchema: '',
        policies: '',
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: ''
      };

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

      let stubDescriptor = {
        guid: 'guid',
        id: 'idProtoStub',
        classname: 'VertxProtoStub',
        description: 'description of ProtoStub',
        kind: 'hyperty',
        catalogueURL: '....',
        sourcePackageURL: '../resources/Vertx-sourcePackageURL.json',
        dataObject: '',
        type: '',
        messageSchema: '',
        configuration: {
          url: 'wss://msg-node.ua.pt:9090/ws'
        },
        policies: '',
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: ''
      };

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
