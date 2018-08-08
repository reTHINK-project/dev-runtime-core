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
import CatalogueDataObject from './CatalogueDataObject';

class HypertyDescriptor extends CatalogueDataObject {

    /**
     *
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object enabling the same object to be
     * stored and discovered in different Catalogues. Guid corresponds to <resource-type-id> per BNF of Resource Path.
     * @param {CatalogueObjectType} catalogueType - 	Indicates the type of Catalogue Data Object
     * @param {string} version
     * @param {string} objectName
     * @param {string} description
     * @param {string} language
     * @param {string} sourcePackageURL
     * @param {HypertyResourceType[]} hypertyType A tag that identifies what type of hyperty is described in the object.
     * @param {URL.HypertyCatalogueURLList} dataObjectUrls - It defines the Data Object Schemas supported by the Hyperty
     * through a list of Catalogue URLs from where these schemas can be reached
     */
    constructor(guid, catalogueType, version, objectName, description, language, sourcePackageURL, hypertyType, dataObjectUrls) {
        super(guid, catalogueType, version, objectName, description, language, sourcePackageURL);

        this._configuration = {};
        this._constraints = {};
        this._policies = {};
        this._messageSchema = null;

        this._hypertyType = hypertyType;
        this._dataObjects = dataObjectUrls;
    }

    get hypertyType() {
        return this._hypertyType;
    }

    get dataObjects() {
        return this._dataObjects;
    }

    get configuration() {
        return this._configuration;
    }

    get constraints() {
        return this._constraints;
    }

    get messageSchema() {
        return this._messageSchema;
    }

    get policies() {
        return this._policies;
    }

    set hypertyType(hType) {
        if (hType)
            this._hypertyType = hType;
    }

    set dataObjects(dataObjects) {
        if (dataObjects)
            this._dataObjects = dataObjects;
    }

    set configuration(configuration) {
        if (configuration)
            this._configuration = configuration;
    }

    set constraints(constraints) {
        if (constraints)
            this._constraints = constraints;
    }

    set messageSchema(messageSchema) {
        if (messageSchema)
            this._messageSchema = messageSchema;
    }

    set policies(policies) {
        if (policies)
            this._policies = policies;
    }

}


export const RuntimeHypertyCapabilityType = {};
export const HypertyType = {COMMUNICATOR: 'communicator', IDENTITY: 'identity', CONTEXT: 'context'};
export const HypertyResourceType = {chat: 'CHAT', audio: 'Audio', video: 'Video', av: 'AV', screen:'SCREEN',
    file: 'FILe', midi:'MIDI'};
export default HypertyDescriptor;