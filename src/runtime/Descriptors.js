import {divideURL, getConfigurationResources, buildURL} from '../utils/utils';
import { runtimeUtils } from './runtimeUtils';

import * as logger from 'loglevel';
let log = logger.getLogger('Descriptors');

class Descriptors {

  constructor(runtimeURL, runtimeConfiguration) {
    if (!runtimeURL) throw Error('The descriptor need to know the runtime url to be used');
    if (!runtimeConfiguration) throw Error('The descriptor needs the runtime configuration');

    this.log = log;

    this.runtimeConfiguration = runtimeConfiguration;
    this.runtimeURL = runtimeURL;

    this.constraints = runtimeUtils.runtimeCapabilities;
  }

  getDescriptor(url) {

  return  fetch(url).then(result => result.json() );
    }

  getHypertyDescriptor(hypertyURL) {
    return this.catalogue.getHypertyDescriptor(hypertyURL, true, this.constraints);
  }

  getStubDescriptor(stubURL) {

    return new Promise((resolve, reject) => {

      let domain;
      let protostub;
      let protoStubURL;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;

      if (stubURL.includes('://')) {
        let dividedURL = divideURL(stubURL);
        domain = dividedURL.domain;
        let path = dividedURL.identity;

        if (path) {
          protostub = path.substring(path.lastIndexOf('/') + 1);
        } else {
          protostub = 'default';
        }

      } else {
        protostub = 'default';
        domain = stubURL;
      }

      protoStubURL = buildURL(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub', protostub);
      if (domain !== this.runtimeConfiguration.domain) {
        if (!stubURL.indexOf('https') || !stubURL.indexOf('hyperty-catalogue')) {
          protoStubURL = stubURL;
        } else {

          // TODO: check how to load form different configuration domain
          let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub');
          protoStubURL = resource.prefix + domain + resource.suffix + protostub;
        }
      }

      log.log('Load ProtocolStub for domain, ' + domain + ' : ', protoStubURL);
      return this.catalogue.getStubDescriptor(protoStubURL, true, this.constraints).then((result) => {

        resolve(result);

      }).catch((error) => {

        // log.log('Error: ', error);

        protostub = domain;
        domain = originDomain;

        let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub');
        protoStubURL = resource.prefix + domain + resource.suffix + protostub;

        // log.log('Fallback -> Load Protocolstub for domain, ' + domain + ' : ', protostub);
        return this.catalogue.getStubDescriptor(protoStubURL, true, this.constraints);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }

  getIdpProxyDescriptor(idpProxyURL) {
    return new Promise((resolve, reject) => {

      let domain;
      let idpproxy;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;
      let constraints = this.constraints;

      constraints.constraints.onlyAccessToken = true;
      constraints.constraints.onlyIdAssertionValidation = true;
      console.log('LOG HERE', constraints);
      if (idpProxyURL.includes('://')) {
        let dividedURL = divideURL(idpProxyURL);
        domain = dividedURL.domain;
        let path = dividedURL.identity;
        if (path) {
          idpproxy = path.substring(path.lastIndexOf('/') + 1);
        } else {
          idpproxy = 'default';
        }

      } else {
        idpproxy = 'default';
        domain = idpProxyURL;
      }


      let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'idpProxy');

      idpProxyURL = resource.prefix + domain + resource.suffix + idpproxy;
      // log.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
      return this.catalogue.getIdpProxyDescriptor(idpProxyURL, true, constraints).then((result) => {

        resolve(result);

      }).catch(() => {

        idpproxy = domain;
        domain = originDomain;

        idpProxyURL = buildURL(this.runtimeConfiguration, 'catalogueURLs', 'idpProxy', idpproxy);

        // log.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
        return this.catalogue.getIdpProxyDescriptor(idpProxyURL, true, constraints);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }
}

export default Descriptors;
