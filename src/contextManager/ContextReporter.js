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

// Service Framework
//import Syncher from '../syncher/Syncher';

// Utils
import EventEmitter from '../utils/EventEmitter.js';
//import {divideURL} from '../utils/utils.js';

// import availability from './availability.js';

/**
* Context Reporter;
* @author Paulo Chainho [paulo-g-chainho@alticelabs.com]
*/
class ContextReporter extends EventEmitter {

  constructor(hypertyURL, bus, configuration, factory, syncher) {
    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    super(hypertyURL, bus, configuration);

    let _this = this;

    console.info('[ContextReporter] started with url: ', hypertyURL);

    this.syncher = syncher ? syncher : factory.createSyncher(hypertyURL, bus, configuration);


    //    this.discovery = new Discovery(hypertyURL, bus);
    this.domain = factory.divideURL(configuration.runtimeURL).domain;
    this.contexts = {};

    this.contextDescURL = 'hyperty-catalogue://catalogue.' + this.domain + '/.well-known/dataschema/Context';


    //    this.heartbeat = [];

    this.syncher.onNotification((event) => {
      let _this = this;
      _this.onNotification(event);
    });

    //TODO: uncomment when used with service framework develop branch

    this.syncher.onClose((event) => {

      console.log('[ContextReporter.onClose]');
      let _this = this;
      _this.setStatus(event.id, 'unavailable');
      event.ack();
    });

  }

  //TODO: move to User availability Reporter or to abstract HypertyContextReporter

  start() {
    let _this = this;

    return new Promise((resolve, reject) => {

      this.syncher.resumeReporters({store: true}).then((reporters) => {

        let reportersList = Object.keys(reporters);

        if (reportersList.length  > 0) {

          console.log('[ContextReporter.start] resuming ', reporters[reportersList[0]]);

          // set availability to available

          _this.contexts = reporters;

          //TODO:
          reportersList.forEach((context) => {
            _this._onSubscription(_this.contexts[context]);
          });

          resolve(_this.contexts);
        } else {
          console.log('[ContextReporter.start] nothing to resume ', reporters);
          resolve(false);
        }

      }).catch((reason) => {
        console.error('[ContextReporter] Resume failed | ', reason);
      });
    }).catch((reason) => {
      reject('[ContextReporter] Start failed | ', reason);
    });
  }


  processNotification(event) {
    let _this = this;
    console.log('[ContextReporter.processNotification: ', event);

    event.ack();

  }

  /**
   * This function is used to create a new status object syncher
   * @param  {URL.UserURL} contacts List of Users
   * @return {Promise}
   */
  create(id, init, resources, name = 'myContext', reporter = null, reuseURL = null) {
    //debugger;
    let _this = this;
    let input;
    return new Promise((resolve, reject) => {
      if (!reporter && !reuseURL) {
        input = {resources: resources, expires: 30};
      } else if (reporter && !reuseURL) {
        input = {resources: resources, expires: 30, reporter: reporter};
      } else if (!reporter && reuseURL) {
        input = {resources: resources, expires: 30, reuseURL: reuseURL};
      } else {
        input = {resources: resources, expires: 30, reuseURL: reuseURL, reporter: reporter};
      }

      console.info('[ContextReporter.create] lets create a new User availability Context Object ', input);
      _this.syncher.create(_this.contextDescURL, [], init, true, false, name, null, input)
        .then((context) => {
          _this.contexts[id] = context;

          _this._onSubscription(context);
          resolve(context);

        }).catch(function(reason) {
          reject(reason);
        });

    });

  }

  _onSubscription(context) {
    context.onSubscription((event) => {
      console.info('[ContextReporter._onSubscription] accepting: ', event);
      event.accept();
    });
  }

  setContext(id, newContext) {
    let _this = this;
    console.log('THIS [ContextReporter.setContext] before change :', _this.contexts[id]);
    console.log('[ContextReporter.setContext] before change :', _this.contexts[id].data);

    //    _this.contexts[id].data.values[0].value = newContext;

    _this.contexts[id].data.values = newContext;
    console.debug('[ContextReporter.setContext] after change :', _this.contexts[id].data);
    _this.trigger(id + '-context-update', newContext);

  }


}

export default ContextReporter;
