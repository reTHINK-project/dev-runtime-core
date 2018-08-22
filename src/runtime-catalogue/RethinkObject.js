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
import tv4 from "tv4";

export class RethinkObject {

    /**
     * Validates this RethinkObject against the provided schema.
     *
     * LIMITATIONS: The provided schema cannot contain references to other schemas, since they can't be resolved.
     * @param schema - schema to validate against
     * @returns {boolean} true if valid, false otherwise
     */
    validate(schema) {
        // add schema itself so local references work
        tv4.addSchema(schema.id, schema);

        // JSON stringify -> parse needed to have proper validation
        let result = tv4.validateMultiple(JSON.parse(JSON.stringify(this)), schema);

        // delete error stacks to improve logging
        result.errors.forEach((error) => {
            delete error.stack;
        });

        // print more details about validation if it fails or schema contains $refs
        if (!result.valid || (result.missing.length > 0)) {
            console.warn("Object validation " + (result.valid ? "succeeded, but schema contained references:" : "failed:"), JSON.stringify(result, null, 2));
            console.log("Object:", JSON.stringify(this, null, 2));
        }
        return result.valid;
    }
}


export default RethinkObject;

