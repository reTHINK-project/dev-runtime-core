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
import RethinkObject from "./RethinkObject";

/**
 * @author alice.cheambe[at]fokus.fraunhofer.de
 * The CatalogueDataObject class is the representation of the reTHINK Catalogue Data Model
 */
class CatalogueDataObject extends RethinkObject {
    /**
     * Creates the Catalogue Data Object
     * @param guid - Global Unique identifier of the Catalogue Object (e.g. Hyperty descriptor, ProtocolStub descriptor,
     * etc) enabling the same object to be stored and discovered in different Catalogues. That means, guid corresponds to
     * [resource-type-id] per BNF of Resource Path. Couldn't we have problems with too long URL paths?
     * @param type - indicates the type of Catalogue Data Object e.g. Hyperty, ProtocolStub, etc
     * @param {string} version - Indicates the version of Catalogue Data
     * @param objectName - human-understandable name of the catalogue object e.g. "My Awesome Hyperty"
     * @param description - description of the source package
     * @param language - the programming language used in the SourcePackage.SourceCode
     * @param sourcePackageURL - A string containing the URL from where the source code package of the corresponding
     * catalogue object, e.g. deployable packages containing executable code for Hyperties or ProtoStubs, can be downloaded
     */
    constructor(guid, type, version, objectName, description, language, sourcePackageURL) {
        super();
        this._guid = guid;
        this._type = type;
        this._version = version;
        this._objectName = objectName;
        this._description = description;
        this._language = language;
        this._sourcePackageURL = sourcePackageURL;

        this._signature = null;
        this._sourcePackage = null;
    }

    // Getters
    get guid() {
        return this._guid;
    }

    get type() {
        return this._type;
    }

    get version() {
        return this._version;
    }

    get objectName() {
        return this._objectName;
    }

    get description() {
        return this._description;
    }

    get language() {
        return this._language;
    }

    get signature() {
        return this._signature;
    }

    get sourcePackage() {
        return this._sourcePackage;
    }

    get sourcePackageURL() {
        return this._sourcePackageURL;
    }


    // Setters
    /**
     * Set the signature to enables integrity and authenticity verification
     * @param signature
     */
    set signature(signature) {
        if (signature)
            this._signature = signature;
    }

    set sourcePackage(sourcePackage) {
        if (sourcePackage)
            this._sourcePackage = sourcePackage;
    }

    set guid(guid) {
        if (guid)
            this._guid = guid;
    }

    set type(type) {
        if (type)
            this._type = type;
    }

    set version(version) {
        if (version) {
            this._version = version;
        }
    }

    set objectName(objectName) {
        if (objectName)
            this._objectName = objectName;
    }

    set description(description) {
        if (description)
            this._description = description;
    }

    set language(language) {
        if (language)
            this._language = language;
    }

    set sourcePackageURL(sourcePackageURL) {
        if (sourcePackageURL)
            this._sourcePackageURL = sourcePackageURL;
    }
}
//Alice: removed POLICY_ENFORCER: 'policy_enforcer', DATA_SCHEMA: 'data_schema' from the list
//wrt: https://github.com/reTHINK-project/dev-service-framework/blob/develop/docs/datamodel/core/hyperty-catalogue/readme.md#data-object-schema
export const CatalogueObjectType = {
    HYPERTY: 'hyperty', PROTOSTUB: 'protostub', HYPERTY_RUNTIME: 'hyperty_runtime',
    HYPERTY_INTERCEPTOR: 'hyperty_inspector', HYPERTY_DATA_OBJECT: 'hyperty_data_object'
};
export const DataObjectSourceLanguage = {
    JAVASCRIPT_ECMA6: 'javascript_ecma6', JAVASCRIPT_ECMA5: 'javascript_ecma5',
    JSON_SCHEMA_V4: 'json_schema_v4', PYTHON: 'python', TYPESCRIPT: 'typescript'
};
export default CatalogueDataObject;