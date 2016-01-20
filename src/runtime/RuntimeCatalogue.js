import {divideURL} from '../utils/utils';
import {CatalogueFactory} from 'service-framework';
import {HypertyDescriptor, ProtocolStubDescriptor, SourcePackage} from 'service-framework';

class RuntimeCatalogue {

    constructor() {
        // console.log('runtime catalogue');
        let _this = this;
        _this._factory = new CatalogueFactory(false, undefined);
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

    /**
     * make a http request to a given URL.
     * @param url
     * @returns {Promise}
     * @private
     */
    _makeExternalRequest(url) {
        // console.log("_makeExternalRequest", url);

        // TODO: make this request compatible with nodejs
        // at this moment, XMLHttpRequest only is compatible with browser implementation
        // nodejs doesn't support;
        return new Promise(function (resolve, reject) {
            let protocolmap = {
                "hyperty-catalogue://": "http://"
            };

            let foundProtocol = false;
            for (var protocol in protocolmap) {
                if (url.slice(0, protocol.length) == protocol) {
                    // console.log("exchanging " + protocol + " with " + protocolmap[protocol]);
                    url = protocolmap[protocol] + url.slice(protocol.length, url.length);
                    foundProtocol = true;
                    break;
                }
            }

            if (!foundProtocol) {
                reject("Invalid protocol of url: " + url);
                return;
            }

            let xhr = new XMLHttpRequest();

            // console.log(url);

            xhr.open('GET', url, true);

            xhr.onreadystatechange = function (event) {
                let xhr = event.currentTarget;
                if (xhr.readyState === 4) {
                    // console.log("got response:", xhr);
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        // console.log("rejecting promise because of response code: 200 != ", xhr.status);
                        reject(xhr.responseText);
                    }
                }
            };


            xhr.send();

        });

    }

    /**
     * Get HypertyDescriptor
     * @param hypertyURL - e.g. mydomain.com/.well-known/hyperty/MyHyperty
     * @returns {Promise}
     */
    getHypertyDescriptor(hypertyURL) {
        let _this = this;
        // console.log("getHypertyDescriptor", hypertyURL);

        return new Promise(function (resolve, reject) {

            // request the json
            _this._makeExternalRequest(hypertyURL).then(function (result) {
                result = JSON.parse(result);


                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    // console.log("creating hyperty descriptor based on: ", result);

                    // create the descriptor
                    let hyperty = _this._factory.createHypertyDescriptorObject(
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["type"],
                        result["dataObjects"]
                    );

                    // console.log("created hyperty descriptor object:", hyperty);

                    // parse and attach sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        // console.log("hyperty has sourcePackage:", sourcePackage);
                        hyperty.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                    }

                    resolve(hyperty);
                }
            });
        });
    }

    /**
     * Get source Package from a URL
     * @param sourcePackageURL - e.g. mydomain.com/.well-known/hyperty/MyHyperty/sourcePackage
     * @returns {Promise}
     */
    getSourcePackageFromURL(sourcePackageURL) {
        let _this = this;

        // console.log("getting sourcePackage from:", sourcePackageURL);

        return new Promise(function (resolve, reject) {

            if (sourcePackageURL == "/sourcePackage") {
                reject("sourcePackage is already contained in descriptor, please use it directly");
                return;
            }

            _this._makeExternalRequest(sourcePackageURL).then(function (result) {
                // console.log("got raw sourcePackage:", result);
                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    result = JSON.parse(result);

                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {

                        sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                        resolve(sourcePackage);
                    } else {
                        reject("no source package");
                    }


                }
            }).catch(function (reason) {
                reject(reason);
            });

        });

    }

    /**
     * Get StubDescriptor
     * @param stubURL - e.g. mydomain.com/.well-known/protostub/MyProtostub
     * @returns {Promise}
     */
    getStubDescriptor(stubURL) {
        let _this = this;

        // console.log("getting stub descriptor from: " + stubURL);
        return new Promise(function (resolve, reject) {

          let dividedURL = divideURL(stubURL);
          let domain = dividedURL.domain;
          let protoStub = dividedURL.identity;

          if (!domain) {
            domain = stubURL;
          }

          if (!protoStub) {
            protoStub = 'default';
          } else {
            protoStub = protoStub.substring(protoStub.lastIndexOf('/') + 1);
          }

            let url = 'hyperty-catalogue://' + domain + '/.well-known/protocolstub/' + protoStub;

            _this._makeExternalRequest(url).then(function (result) {
                // console.log("makeExternalRequest returned: ", result);

                result = JSON.parse(result);
                // console.log("parsed result: ", result);

                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    // console.log("creating stub descriptor based on: ", result);

                    // create the descriptor
                    let stub = _this._factory.createProtoStubDescriptorObject(
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["messageSchemas"],
                        result["configuration"],
                        result["constraints"]
                    );

                    // parse and attach the sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                        stub.sourcePackage = sourcePackage;
                    }
                    resolve(stub);
                }
            });
        });

    }

    _createSourcePackage(factory, sp) {
        // console.log("creating sourcePackage. factory:", factory, ", raw package:", sp);
        try {
            sp = JSON.parse(sp);
        } catch (e) {
            // console.log("parsing sourcePackage failed. already parsed? -> ", sp);
        }

        let sourcePackage = factory.createSourcePackage(sp["sourceCode"], sp["sourceCodeClassname"]);

        // console.log("created sourcePackage:", sourcePackage);

        if (sp["encoding"])
            sourcePackage.encoding = sp["encoding"];

        if (sp["signature"])
            sourcePackage.signature = sp["signature"];

        return sourcePackage;
    }

}

export default RuntimeCatalogue;
