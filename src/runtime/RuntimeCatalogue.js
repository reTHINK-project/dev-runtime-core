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
        sourceCode: '../resources/' + hypertyName + '.ES5.js',
        dataObject: '',
        type: '',
        messageSchema: '',
        configuration: '',
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
  getHypertySourceCode(hypertySourceCodeURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(hypertySourceCodeURL).then(function(result) {
        resolve(result);
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
        sourceCode: '../resources/VertxProtoStub.js',
        dataObject: '',
        type: '',
        messageSchema: '',
        configuration: {
          url: 'ws://185.17.229.116:80/ws',
          runtimeURL: _this._runtimeURL
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
  getStubSourceCode(stubSourceCodeURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._makeExternalRequest(stubSourceCodeURL).then(function(result) {
        resolve(result);
      }).catch(function(reason) {
        reject(reason);
      });

    });

  }

}

export default new RuntimeCatalogue();
