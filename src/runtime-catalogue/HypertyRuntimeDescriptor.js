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

class HypertyRuntimeDescriptor extends CatalogueDataObject {

    constructor(guid, catalogueType, version, objectName, description, language, sourcePackageURL, runtimeType,
                hypertyCapabilities, protocolCapabilities, p2pHandlerStub, p2pRequesterStub) {
        super(guid, catalogueType, version, objectName, description, language, sourcePackageURL);

        this._runtimeType = runtimeType;

        if (hypertyCapabilities)
            this._hypertyCapabilities = hypertyCapabilities;
        else
            this._hypertyCapabilities = new RuntimeHypertyCapability(true, false, false, false, false);
        if (protocolCapabilities)
            this._protocolCapabilities = protocolCapabilities;
        else
            this._protocolCapabilities = new RuntimeProtocolCapability(true, false, true, false, false, false);

        this._p2pHandlerStub = p2pHandlerStub;
        this._p2pRequesterStub = p2pRequesterStub;
    }

    get runtimeType() {
        return this._runtimeType;
    }

    get hypertyCapabilities() {
        return this._hypertyCapabilities;
    }

    get protocolCapabilities() {
        return this._hypertyCapabilities;
    }

    set runtimeType(runtimeType) {
        if (runtimeType)
            this._runtimeType = runtimeType;
    }

    set hypertyCapabilities(hypertyCapabilities) {
        if (hypertyCapabilities)
            this._hypertyCapabilities = hypertyCapabilities;
    }

    set protocolCapabilities(protocolCapabilities) {
        if (protocolCapabilities)
            this._protocolCapabilities = protocolCapabilities;
    }

    get p2pHandlerStub() {
        return this._p2pHandlerStub;
    }

    set p2pHandlerStub(value) {
        this._p2pHandlerStub = value;
    }

    get p2pRequesterStub() {
        return this._p2pRequesterStub;
    }

    set p2pRequesterStub(value) {
        this._p2pRequesterStub = value;
    }
}

/**
 * A class representation of the capability set of the Runtime Hyperty
 */
export class RuntimeHypertyCapability {
    /**
     * Creates an object of the Runtime Hyperty capability set
     * @param {boolean} isWebRTCSupported
     * @param {boolean} isMicSupported
     * @param {boolean} isCameraSupported
     * @param {boolean} isSensorSupported
     * @param {boolean} isORTCSupported
     */
    constructor(isWebRTCSupported, isMicSupported, isCameraSupported, isSensorSupported, isORTCSupported) {
        this._isWebRTC = isWebRTCSupported;
        this._isMic = isMicSupported;
        this._isCamera = isCameraSupported;
        this._isSensor = isSensorSupported;
        this._isORTC = isORTCSupported;
    }

    get isMic() {
        return this._isMic;
    }

    get isCamera() {
        return this._isCamera;
    }

    get isSensor() {
        return this._isSensor;
    }

    get isWebRTC() {
        return this._isWebRTC;
    }

    get isORTCS() {
        return this._isORTC;
    }

    getCapabilitySet() {
        return JSON.stringify(this);
    }
}


/**
 * A class representation of the protocol capability set of the Runtime Hyperty
 */
export class RuntimeProtocolCapability {

    /**
     * Creates an object of the runtime protocol capability
     * @param {boolean} isHttp
     * @param {boolean} isHttps
     * @param {boolean} isWS
     * @param {boolean} isWSS
     * @param {boolean} isCoap
     * @param {boolean} isDataChannel
     */
    constructor(isHttp, isHttps, isWS, isWSS, isCoap, isDataChannel) {
        this._isHttp = isHttp;
        this._isHttps = isHttps;
        this._isWS = isWS;
        this._isWSS = isWSS;
        this._isCoap = isCoap;
        this._isDataChannel = isDataChannel;
    }

    isHttp() {
        return this._isHttp;
    }

    isHttps() {
        return this._isHttps;
    }

    isWS() {
        return this._isWS;
    }

    isSensorSupported() {
        return this._isSensor;
    }

    isWSS() {
        return this._isWSS;
    }

    isCoap() {
        return this._isCoap;
    }

    isDataChannel() {
        return this._isDataChannel;
    }


    getCapabilitySet() {
        return JSON.stringify(this);
    }
}

export const RuntimeType = {BROWSER: 'browser', STANDALONE: 'standalone', SERVER: 'server', GATEWAY: 'gateway'};

export default HypertyRuntimeDescriptor;
