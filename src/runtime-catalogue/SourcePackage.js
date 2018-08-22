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
class SourcePackage {
    constructor(sourceCodeClassname, sourceCode) {
        this._sourceCode = sourceCode;
        this._sourceCodeClassname = sourceCodeClassname;

        this._encoding = null;
        this._signature = null;
    }

    get sourceCode() {
        return this._sourceCode;
    }

    get sourceCodeClassname() {
        return this._sourceCodeClassname;
    }

    get encoding() {
        return this._encoding;
    }

    get signature() {
        return this._signature;
    }

    set encoding(encoding) {
        if (encoding)
            this._encoding = encoding;
    }

    set signature(sign) {
        if (sign)
            this._signature = sign;
    }

    set sourceCode(sourceCode) {
        if (sourceCode)
            this._sourceCode = sourceCode;
    }

    set sourceCodeClassname(sourceCodeClassname) {
        if (sourceCodeClassname)
            this._sourceCodeClassname = sourceCodeClassname;
    }
}

export default SourcePackage;
