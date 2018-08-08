/**
 * Copyright 2016 PT Inovação e Sistemas SA
 * Copyright 2016 INESC-ID
 * Copyright 2016 QUOBIS NETWORKS SL
 * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
 * Copyright 2016 ORANGE SA
 * Copyright 2016 Deutsche Telekom AG
 * Copyright 2016 Apizee
 * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

/**
 * Created by amo on 14/11/2015.
 */

import CatalogueDataObject from "./CatalogueDataObject";

class ProtocolStubDescriptor extends CatalogueDataObject {
    constructor(guid, type, version, objectName, description, language, sourcePackageURL, messageSchemas, configuration,
                constraints, hypertyType, dataObjects, interworking, idpProxy, mutualAuthentication) {
        super(guid, type, version, objectName, description, language, sourcePackageURL);

        this._messageSchemas = messageSchemas;

        if (configuration)
            this._configuration = configuration;
        else
            this._configuration = {};

        if (constraints)
            this._constraints = constraints;
        else
            this._constraints = {};

        this._hypertyType = hypertyType;

        if (dataObjects)
            this._dataObjects = dataObjects;
        else
            this._dataObjects = [];
        
        this._interworking = interworking;
        this._idpProxy = idpProxy;
        this._mutualAuthentication = mutualAuthentication;

    }

    get messageSchemas() {
        return this._messageSchemas;
    }

    get constraints() {
        return this._constraints;
    }

    get configuration() {
        return this._configuration;
    }

    set messageSchemas(messageSchemas) {
        if (messageSchemas)
            this._messageSchemas = messageSchemas;
    }

    set constraints(constraints) {
        if (constraints)
            this._constraints = constraints;
    }

    set configuration(configuration) {
        if (configuration)
            this._configuration = configuration;
    }

    get hypertyType() {
        return this._hypertyType;
    }

    set hypertyType(value) {
        this._hypertyType = value;
    }

    get dataObjects() {
        return this._dataObjects;
    }

    set dataObjects(value) {
        this._dataObjects = value;
    }

    get interworking() {
        return this._interworking;
    }

    set interworking(value) {
        this._interworking = value;
    }

    get idpProxy() {
        return this._idpProxy;
    }

    set idpProxy(value) {
        this._idpProxy = value;
    }

    get mutualAuthentication() {
        return this._mutualAuthentication;
    }

    set mutualAuthentication(value) {
        this._mutualAuthentication = value;
    }
}

export default ProtocolStubDescriptor;