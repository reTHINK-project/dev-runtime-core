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

import CatalogueDataObject, {CatalogueObjectType, DataObjectSourceLanguage} from "./CatalogueDataObject";
import SourcePackage from "./SourcePackage";
import HypertyDescriptor from "./HypertyDescriptor";
import ProtocolStubDescriptor from "./ProtocolStubDescriptor";
import HypertyRuntimeDescriptor, {RuntimeType} from "./HypertyRuntimeDescriptor";
import HypertyInterceptorDescriptor from "./HypertyInterceptorDescriptor";
import {
    DataObjectSchema,
    DataUrlScheme,
    CommunicationDataObjectSchema,
    ConnectionDataObjectSchema,
    ContextDataObjectSchema,
    IdentityDataObjectSchema
} from "./DataObjectSchema";

class CatalogueDataObjectFactory {

    /**
     * Create CatalogueDataObject
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {CatalogueObjectType} type - Indicates the type of Catalogue Data Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @returns {CatalogueDataObject}
     */
    createCatalogueDataObject(guid, type, version, objectName, description, language, sourcePackageURL) {
        if (
            typeof guid === "undefined"
            || typeof type === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new CatalogueDataObject(guid, type, version, objectName, description, language, sourcePackageURL);
    }

    /**
     * Create HypertyDescriptor
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object
     * can be downloaded.
     * @param {HypertyResourceType[]} hypertyType - An array of HypertyResourceType that identifies what type of hyperty
     * resources are handled by the object.
     * @param {URL.URLList} dataObjects - Defines the Data Object Schemas supported by the Hyperty through a list of Catalogue URLs from where these schemas can be reached.
     * @returns {HypertyDescriptor}
     */
    createHypertyDescriptorObject(guid, version, objectName, description, language, sourcePackageURL, hypertyType,
                                  dataObjects) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof hypertyType === "undefined"
            || typeof dataObjects === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new HypertyDescriptor(guid, CatalogueObjectType.HYPERTY, version, objectName, description,
            language, sourcePackageURL, hypertyType, dataObjects);
    }

    /**
     * Create ProtocolStubDescriptor
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @param {URL.URL} messageSchemas - Defines the Schema describing the Message Data Model used by the Hyperty through the Catalogue URL from where the Message schema can be reached. If not defined, by default it is assumed the standard Message Model is used.
     * @param configuration - Data required to configure the ProtocolStub
     * @param constraints - Describes capabilities required from the Hyperty Runtime in order to be able to execute the ProtocolStub
     * @param hypertyType
     * @param dataObjects
     * @param interworking
     * @param idpProxy
     * @param mutualAuthentication
     * @returns {ProtocolStubDescriptor}
     */
    createProtoStubDescriptorObject(guid, version, objectName, description, language, sourcePackageURL, messageSchemas,
                                    configuration, constraints, hypertyType, dataObjects, interworking, idpProxy, mutualAuthentication) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof messageSchemas === "undefined"
            || typeof configuration === "undefined"
            || typeof constraints === "undefined"
        )
            throw new Error("Invalid parameters!");
        return new ProtocolStubDescriptor(guid, CatalogueObjectType.PROTOSTUB, version, objectName, description,
            language, sourcePackageURL, messageSchemas, configuration, constraints, hypertyType, dataObjects, interworking, idpProxy, mutualAuthentication);
    }

    /**
     * Create HypertyRuntimeDescriptor
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @param {RuntimeType}runtimeType
     * @param {RuntimeHypertyCapabilities} hypertyCapabilities - Supported capabilities to execute Hyperties
     * @param {RuntimeProtocolCapabilities} protocolCapabilities - Supported capabilities to execute Protocol Stubs
     * @param p2pHandlerStub
     * @param p2pRequesterStub
     * @returns {HypertyRuntimeDescriptor} the data object of the Hyperty Runtime Descriptor
     */
    createHypertyRuntimeDescriptorObject(guid, version, objectName, description, language, sourcePackageURL,
                                         runtimeType, hypertyCapabilities, protocolCapabilities, p2pHandlerStub, p2pRequesterStub) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof runtimeType === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new HypertyRuntimeDescriptor(guid, CatalogueObjectType.HYPERTY_RUNTIME, version, objectName,
            description, language, sourcePackageURL, runtimeType, hypertyCapabilities, protocolCapabilities, p2pHandlerStub, p2pRequesterStub);
    }

    /**
     * Create Hyperty Interceptor Descriptor
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @param configuration
     * @param policies
     * @returns {PolicyEnforcerDescriptor}
     */
    createHypertyInterceptorDescriptorObject(guid, version, objectName, description, language, sourcePackageURL, configuration,
                                             policies) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new HypertyInterceptorDescriptor(guid, CatalogueObjectType.HYPERTY_INTERCEPTOR, version, objectName,
            description, language, sourcePackageURL, configuration, policies);
    }

    /**
     * Create DataObjectSchema which in effect is the MessageDataObjectSchema
     * @deprecated Use either createMessageDataObjectSchema or createHypertyDataObjectSchema instead
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @returns {DataObjectSchema}
     */
    createDataObjectSchema(guid, version, objectName, description, language, sourcePackageURL) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new DataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description, language,
            sourcePackageURL);
    }

    /**
     * Create DataObjectSchema which in effect is the MessageDataObjectSchema
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @returns {DataObjectSchema}
     */
    createMessageDataObjectSchema(guid, version, objectName, description, language, sourcePackageURL) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new DataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description, language,
            sourcePackageURL);
    }

    /**
     * Create HypertyDataObjectSchema
     * @param {string} guid - Catalogue Global Unique identifier of the Catalogue Object
     * @param {string} version - Indicates the version of Catalogue Data
     * @param {string} objectName - Human-understandable name of the catalogue object
     * @param {string} description
     * @param {DataObjectSourceLanguage} language - Programming language used in the SourcePackage
     * @param {string} sourcePackageURL - URL from where the source code package of the corresponding catalogue object can be downloaded.
     * @param {string} accessControlPolicy - policy rule to access object (see Reporter-Observer Comm pattern)
     * @param {DataUrlScheme} scheme - identifies the data scheme (COMM, CONNECTION, CTXT or IDENTITY)
     * @returns {DataObjectSchema}
     */
    createHypertyDataObjectSchema(guid, version, objectName, description, language, sourcePackageURL,
                                  accessControlPolicy, scheme) {
        if (
            typeof guid === "undefined"
            || typeof version === "undefined"
            || typeof objectName === "undefined"
            || typeof description === "undefined"
            || typeof language === "undefined"
            || typeof sourcePackageURL === "undefined"
            || typeof scheme === "undefined"
            || typeof accessControlPolicy === "undefined"
        )
            throw new Error("Invalid parameters!");

        if (scheme === DataUrlScheme.COMM)
            return new CommunicationDataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description,
                language, sourcePackageURL, scheme, accessControlPolicy);
        else if (scheme === DataUrlScheme.CONNECTION)
            return new ConnectionDataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description,
                language, sourcePackageURL, scheme, accessControlPolicy);
        else if (scheme === DataUrlScheme.CTXT)
            return new ContextDataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description,
                language, sourcePackageURL, scheme, accessControlPolicy);
        else if (scheme === DataUrlScheme.IDENTITY)
            return new IdentityDataObjectSchema(guid, CatalogueObjectType.HYPERTY_DATA_OBJECT, version, objectName, description,
                language, sourcePackageURL, scheme, accessControlPolicy);
    }

    /**
     * Create SourcePackage
     * @param sourceCodeClassname - The Class-name of the SourceCode
     * @param sourceCode - The source code of the catalogue object
     * @returns {SourcePackage}
     */
    createSourcePackage(sourceCodeClassname, sourceCode) {
        if (
            typeof sourceCode === "undefined"
            || typeof sourceCodeClassname === "undefined"
        )
            throw new Error("Invalid parameters!");

        return new SourcePackage(sourceCodeClassname, sourceCode);

    }
}
export default CatalogueDataObjectFactory;
