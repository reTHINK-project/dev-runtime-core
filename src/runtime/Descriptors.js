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

  getHypertyDescriptor (hypertyURL) {
    return this.catalogue.getHypertyDescriptor(hypertyURL);
  }

  getStubDescriptor (stubURL) {
    let dividedURL = divideURL(stubURL);
    let protostub = dividedURL.identity;

    if (!protostub) {
      protostub = 'default';
    } else {
      protostub = protostub.substring(protostub.lastIndexOf('/') + 1);
    }

    stubURL = buildURL(this.runtimeConfiguration, 'catalogueURLs', 'protocolstub', protostub);
    return this.catalogue.getStubDescriptor(stubURL);
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
