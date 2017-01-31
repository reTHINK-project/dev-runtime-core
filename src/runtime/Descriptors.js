import {divideURL, getConfigurationResources, buildURL} from '../utils/utils';

class Descriptors {

  constructor(runtimeURL, catalogue, runtimeConfiguration) {
    if (!runtimeURL) throw Error('The descriptor need to know the runtime url to be used');
    if (!catalogue) throw Error('The descriptor needs the catalogue instance');
    if (!runtimeConfiguration) throw Error('The descriptor needs the runtime configuration');

    this.runtimeConfiguration = runtimeConfiguration;
    this.runtimeURL = runtimeURL;
    this.catalogue = catalogue;
  }

  getHypertyDescriptor(hypertyURL) {
    return this.catalogue.getHypertyDescriptor(hypertyURL);
  }

  getStubDescriptor(stubURL) {

    return new Promise((resolve, reject) => {

      let dividedURL = divideURL(stubURL);
      let domain = dividedURL.domain;
      let protostub = dividedURL.identity;
      let protoStubURL;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;

      if (!domain) {
        domain = idpProxyURL;
      }

      if (!protostub) {
        protostub = 'default';
      } else {
        protostub = protostub.substring(protostub.lastIndexOf('/') + 1);
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

      console.log('Load ProtocolStub for domain, ' + domain + ' : ', protoStubURL);
      return this.catalogue.getStubDescriptor(protoStubURL).then((result) => {

        resolve(result);

      }).catch((error) => {

        console.log('Error: ', error);

        protostub = domain;
        domain = originDomain;

        let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub');
        protoStubURL = resource.prefix + domain + resource.suffix + protostub;

        console.log('Fallback -> Load Protocolstub for domain, ' + domain + ' : ', protostub);
        return this.catalogue.getStubDescriptor(protoStubURL);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }

  getIdpProxyDescriptor(idpProxyURL) {
    return new Promise((resolve, reject) => {

      let dividedURL = divideURL(idpProxyURL);
      let domain = dividedURL.domain;
      let idpproxy = dividedURL.identity;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;

      if (!domain) {
        domain = idpProxyURL;
      }

      if (domain === originDomain || !idpproxy) {
        idpproxy = 'default';
      } else {
        idpproxy = idpproxy.substring(idpproxy.lastIndexOf('/') + 1);
      }

      let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', 'idpProxy');

      idpProxyURL = resource.prefix + domain + resource.suffix + idpproxy;
      console.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
      return this.catalogue.getIdpProxyDescriptor(idpProxyURL).then((result) => {

        resolve(result);

      }).catch(() => {

        idpproxy = domain;
        domain = originDomain;

        idpProxyURL = buildURL(this.runtimeConfiguration, 'catalogueURLs', 'idpProxy', idpproxy);

        console.log('Load Idp Proxy for domain, ' + domain + ' : ', idpProxyURL);
        return this.catalogue.getIdpProxyDescriptor(idpProxyURL);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }
}

export default Descriptors;
