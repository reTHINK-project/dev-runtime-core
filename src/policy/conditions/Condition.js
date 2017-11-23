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

import Operators from '../Operators';

/**
* @author Ana Caldeira <ana.caldeira@tecnico.ulisboa.pt>
* @classdesc Class to represent a condition and evaluate its applicability.
*/
class Condition {

  /**
  * Creates a new Condition.
  * @class
  * @param  {string}  attribute
  * @param  {string}  operator
  * @param  {*}       params
  */
  constructor(attribute, operator, params) {
    this.attribute = attribute;
    this.operator = operator;
    this.params = params;
    this.operators = new Operators();
  }

  /**
  * Verifies if the condition is applicable to the message. First, the system value that corresponds to the attribute is retrieved; then, that value is compared with the parameter specified in the condition by executing the operator implementation. If the operator is 'in' and the name of a group is given, then the array holding the members of the group is retrieved before the comparison.
  * @param  {Object}    context   environment where the Policy Engine is being used
  * @param  {Object}    message
  */
  isApplicable(context, message) {
    context[this.attribute] = { message: message };
    let value = context[this.attribute];
    let tempParam;

    if (this.operator === 'in') {
      if (!(Array.isArray(this.params))) {
        tempParam = context.getGroup(this.params, message.to);
        return this.operators[this.operator]([tempParam, value]);
      }
    }

    return this.operators[this.operator]([this.params, value]);
  }

}

export default Condition;
