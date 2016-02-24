import {divideURL} from '../utils/utils';
import {CatalogueFactory} from 'service-framework';
import {HypertyDescriptor, ProtocolStubDescriptor, SourcePackage} from 'service-framework';

class RuntimeCatalogue {

    constructor(nodeHttp, nodeHttps) {
        // console.log('runtime catalogue');
        let _this = this;
        _this._nodeHttp = nodeHttp;
        _this._nodeHttps = nodeHttps;
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
    _makeExternalRequest(url, nodeHttp, nodeHttps) {
        // console.log("_makeExternalRequest", url);

        // TODO: make this request compatible with nodejs
        // at this moment, XMLHttpRequest only is compatible with browser implementation
        // nodejs doesn't support;
        return new Promise(function (resolve, reject) {
            let protocolmap = {
                "hyperty-catalogue://": "https://",
                "https://": "https://",
                "http://": "http://"
            };

            let usedProtocol;

            let foundProtocol = false;
            for (var protocol in protocolmap) {
                if (url.slice(0, protocol.length) == protocol) {
                    // console.log("exchanging " + protocol + " with " + protocolmap[protocol]);
                    url = protocolmap[protocol] + url.slice(protocol.length, url.length);
                    usedProtocol = protocolmap[protocol];
                    foundProtocol = true;
                    break;
                }
            }

            if (!foundProtocol) {
                reject("Invalid protocol of url: " + url);
                return;
            }

            // nodejs specific http implementations for http & https
            let nodeRequest;
            if (nodeHttp && usedProtocol === "http://") {
                nodeRequest = nodeHttp;
            } else if (nodeHttps && usedProtocol === "https://") {
                nodeRequest = nodeHttps;
            }

            if (nodeRequest) {
                // request should be the same for http & https

                // get url without protocol
                let hostAndPath = url.slice(usedProtocol.length, url.length);

                // get host (+ port)
                let host = hostAndPath.slice(0, hostAndPath.indexOf("/"));

                // get path
                let path = hostAndPath.slice(host.length, hostAndPath.length);

                // if host has port, extract port and remove it from host
                let port;
                if (host.indexOf(":") !== -1) {
                    port = host.slice(host.indexOf(":") + 1, host.length);
                    host = host.slice(0, host.indexOf(":"));
                }

                // FIXME: remove rejectUnauthorized when catalogue is using valid certificates
                // FIXME: add error handling
                nodeRequest.get({
                    host: host,
                    port: port,
                    path: path,
                    rejectUnauthorized: false
                }, function (response) {
                    var body = "";
                    response.on("data", function (d) {
                        body += d;
                    });
                    response.on("end", function () {
                        resolve(body);
                    });
                });
            } else if (typeof XMLHttpRequest !== 'undefined') {
                // generic request
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
            } else {
                reject("no suitable implementation to send request for protocol '" + usedProtocol + "'.");
            }
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
            _this._makeExternalRequest(hypertyURL, _this._nodeHttp, _this._nodeHttps).then(function (result) {
                result = JSON.parse(result);


                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    // console.log("creating hyperty descriptor based on: ", result);

                    // create the descriptor
                    let hyperty = _this._factory.createHypertyDescriptorObject(
                        result["cguid"],
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["type"] || result["hypertyType"],
                        result["dataObjects"]
                    );

                    // optional fields
                    hyperty.configuration = result["configuration"];
                    hyperty.constraints = result["constraints"];
                    hyperty.messageSchema = result["messageSchema"];
                    hyperty.policies = result["policies"];
                    hyperty.signature = result["signature"];

                    // parse and attach sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        // console.log("hyperty has sourcePackage:", sourcePackage);
                        hyperty.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                    }

                    // console.log("created hyperty descriptor object:", hyperty);
                    resolve(hyperty);
                }
            });
        });
    }

    /**
     * Get RuntimeDescriptor
     * @param runtimeURL - e.g. mydomain.com/.well-known/runtime/MyRuntime
     * @returns {Promise}
     */
    getRuntimeDescriptor(runtimeURL) {
        let _this = this;
        // console.log("getRuntimeDescriptor", runtimeURL);

        return new Promise(function (resolve, reject) {

            // request the json
            _this._makeExternalRequest(runtimeURL, _this._nodeHttp, _this._nodeHttps).then(function (result) {
                result = JSON.parse(result);


                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {

                    // parse capabilities first
                    try {
                        result["hypertyCapabilities"] = JSON.parse(result["hypertyCapabilities"]);
                        result["protocolCapabilities"] = JSON.parse(result["protocolCapabilities"]);
                    } catch (e) {
                        // already json object
                    }
                    console.log("creating runtime descriptor based on: ", result);


                    // create the descriptor
                    let runtime = _this._factory.createHypertyRuntimeDescriptorObject(
                        result["cguid"],
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["type"] || result["runtimeType"],
                        result["hypertyCapabilities"],
                        result["protocolCapabilities"]
                    );

                    // optional fields
                    runtime.signature = result["signature"];

                    // parse and attach sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        // console.log("runtime has sourcePackage:", sourcePackage);
                        runtime.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                    }

                    // console.log("created runtime descriptor object:", runtime);
                    resolve(runtime);
                }
            });
        });
    }

    /**
     * Get DataSchemaDescriptor
     * @param dataSchemaURL - e.g. mydomain.com/.well-known/dataschema/MyDataSchema
     * @returns {Promise}
     */
    getDataSchemaDescriptor(dataSchemaURL) {
        let _this = this;
        // console.log("getDataSchemaDescriptor", dataSchemaURL);

        return new Promise(function (resolve, reject) {

            // request the json
            _this._makeExternalRequest(dataSchemaURL, _this._nodeHttp, _this._nodeHttps).then(function (result) {
                result = JSON.parse(result);


                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    console.log("creating dataSchema based on: ", result);

                    // FIXME: accessControlPolicy field not needed?
                    // create the descriptor
                    let dataSchema = _this._factory.createDataObjectSchema(
                        result["cguid"],
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"]
                    );

                    // optional fields
                    dataSchema.signature = result["signature"];

                    // parse and attach sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        // console.log("dataSchema has sourcePackage:", sourcePackage);
                        dataSchema.sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                    }

                    console.log("created dataSchema descriptor object:", dataSchema);
                    resolve(dataSchema);
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

        //console.log("getting sourcePackage from:", sourcePackageURL);

        return new Promise(function (resolve, reject) {
            _this._makeExternalRequest(sourcePackageURL, _this._nodeHttp, _this._nodeHttps).then(function (result) {
                //console.log("got raw sourcePackage:", result);
                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    result = JSON.parse(result);
                    let sourcePackage = _this._createSourcePackage(_this._factory, result);
                    resolve(sourcePackage);
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

            _this._makeExternalRequest(url, _this._nodeHttp, _this._nodeHttps).then(function (result) {
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
                        result["cguid"],
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["messageSchemas"],
                        result["configuration"],
                        result["constraints"]
                    );

                    // optional fields
                    stub.signature = result["signature"];

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

    /**
     * Get IDPProxyDescriptor
     * @param idpProxyURL - e.g. mydomain.com/.well-known/idp-proxy/MyProxy
     * @returns {Promise}
     */
    getIdpProxyDescriptor(idpProxyURL) {
        let _this = this;

        console.log("getting idpproxy descriptor from: " + idpProxyURL);
        return new Promise(function (resolve, reject) {

            let dividedURL = divideURL(idpProxyURL);
            let domain = dividedURL.domain;
            let idpproxy = dividedURL.identity;

            if (!domain) {
                domain = idpProxyURL;
            }

            if (!idpproxy) {
                idpproxy = 'default';
            } else {
                idpproxy = idpproxy.substring(idpproxy.lastIndexOf('/') + 1);
            }

            let url = 'hyperty-catalogue://' + domain + '/.well-known/idp-proxy/' + idpproxy;

            _this._makeExternalRequest(url, _this._nodeHttp, _this._nodeHttps).then(function (result) {
                // console.log("makeExternalRequest returned: ", result);

                result = JSON.parse(result);
                // console.log("parsed result: ", result);

                if (result["ERROR"]) {
                    // TODO handle error properly
                    reject(result);
                } else {
                    // console.log("creating idpproxy descriptor based on: ", result);

                    // create the descriptor
                    let idpproxy = _this._factory.createProtoStubDescriptorObject(
                        result["cguid"],
                        result["objectName"],
                        result["description"],
                        result["language"],
                        result["sourcePackageURL"],
                        result["messageSchemas"],
                        result["configuration"],
                        result["constraints"]
                    );

                    // optional fields
                    idpproxy.signature = result["signature"];

                    // parse and attach the sourcePackage
                    let sourcePackage = result["sourcePackage"];
                    if (sourcePackage) {
                        sourcePackage = _this._createSourcePackage(_this._factory, sourcePackage);
                        idpproxy.sourcePackage = sourcePackage;
                    }
                    resolve(idpproxy);
                }
            });
        });
    }

    /**
     * Returns the sourceCode of a given descriptor
     * @param descriptor - Catalogue Object that was retrieved using e.g. getHypertyDescriptor()
     * @returns {Promise}
     */
    getSourceCodeFromDescriptor(descriptor) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            if (descriptor.sourcePackage) {
                //console.log("descriptor has sourcePackage");
                //console.log("returning sourceCode:", descriptor.sourcePackage.sourceCode);
                resolve(descriptor.sourcePackage.sourceCode);
            } else {
                //console.log("descriptor has no sourcePackage, getting it...");
                let sourcePackage = _this.getSourcePackageFromURL(descriptor.sourcePackageURL).then(function (sourcePackage) {
                    //console.log("got sourcePackage:", sourcePackage);
                    //console.log("returning sourceCode:", sourcePackage.sourceCode);
                    resolve(sourcePackage.sourceCode);
                });
            }
        });
    }

    _createSourcePackage(factory, sp) {
        //console.log("creating sourcePackage. factory:", factory, ", raw package:", sp);
        try {
            sp = JSON.parse(sp);
        } catch (e) {
            console.log("parsing sourcePackage failed. already parsed? -> ", sp);
        }

        // check encoding
        if (sp["encoding"] === "base64") {
            sp["sourceCode"] = atob(sp["sourceCode"]);
        }

        let sourcePackage = factory.createSourcePackage(sp["sourceCodeClassname"], sp["sourceCode"]);
        if (sp["encoding"])
            sourcePackage.encoding = sp["encoding"];

        if (sp["signature"])
            sourcePackage.signature = sp["signature"];

        return sourcePackage;
    }

}

export default RuntimeCatalogue;
