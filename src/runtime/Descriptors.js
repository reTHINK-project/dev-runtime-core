import {divideURL, getConfigurationResources, buildURL} from '../utils/utils';
import { runtimeUtils } from './runtimeUtils';

class Descriptors {

  constructor(runtimeURL, catalogue, runtimeConfiguration) {
    if (!runtimeURL) throw Error('The descriptor need to know the runtime url to be used');
    if (!catalogue) throw Error('The descriptor needs the catalogue instance');
    if (!runtimeConfiguration) throw Error('The descriptor needs the runtime configuration');

    this.runtimeConfiguration = runtimeConfiguration;
    this.runtimeURL = runtimeURL;
    this.catalogue = catalogue;

    this.constraints = runtimeUtils.runtimeCapabilities;
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

  /*    if (!domain) {
        domain = stubURL;
      }

      if (!protostub) {
        protostub = 'default';
      } else {
        protostub = protostub.substring(protostub.lastIndexOf('/') + 1);
      }*/

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

      console.log('Load ProtocolStub for domain, ' + domain + ' : ', protoStubURL);
      return this.catalogue.getStubDescriptor(protoStubURL, true, this.constraints).then((result) => {

        resolve(result);

      }).catch((error) => {

        console.log('Error: ', error);

        protostub = domain;
        domain = originDomain;

        let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub');
        protoStubURL = resource.prefix + domain + resource.suffix + protostub;

        console.log('Fallback -> Load Protocolstub for domain, ' + domain + ' : ', protostub);
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
      console.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
      return this.catalogue.getIdpProxyDescriptor(idpProxyURL, true, this.constraints).then((result) => {

        resolve(result);

      }).catch(() => {

        idpproxy = domain;
        domain = originDomain;

        idpProxyURL = buildURL(this.runtimeConfiguration, 'catalogueURLs', 'idpProxy', idpproxy);

        console.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
        return this.catalogue.getIdpProxyDescriptor(idpProxyURL, true, this.constraints);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }
}

export default Descriptors;
